import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import bodyParser from "body-parser";

import typeDefs from "./schema/type-defs.js";
import resolvers from "./schema/resolvers.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import heicConvert from "heic-convert";
async function startServer() {
  const PORT = 5000;
  const app = express();
  const uploadDir = path.join(process.cwd(), "uploads");
  app.use(cors());
  app.use(bodyParser.json());
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  });

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const upload = multer({ storage });
  const tempUpload = multer({ storage: multer.memoryStorage() });
  app.use("/graphql", expressMiddleware(server));
  // const PORT = process.env.PORT || 5000;

  app.use("/uploads", express.static(uploadDir));

  app.post("/upload", upload.array("files"), (req, res) => {
    if (!req.files || req.files.length === 0) {
      console.log("No files uploaded.");
      return res.status(400).send("No files uploaded.");
    }

    console.log("uploaded successfully");
    res
      .status(200)
      .json({ success: true, message: "Files uploaded successfully" });
  });

  app.post("/convert", tempUpload.single("image"), async (req, res) => {
    console.log("Received a POST request to /convert");

    try {
      if (!req.file) {
        return res.status(404).json({ error: "File not found" });
      }

      let buffer = req.file.buffer;

      const fileType = await fileTypeFromBuffer(buffer);
      console.log("Detected MIME type from content:", fileType?.mime);

      if (fileType?.mime === "image/heic" || fileType?.mime === "image/heif") {
        console.log("Converting HEIC/HEIF to JPEG...");
        buffer = await heicConvert({
          buffer,
          format: "JPEG",
          quality: 1,
        });
      }

      const jpegBuffer = await sharp(buffer).jpeg().toBuffer();

      const base64Image = jpegBuffer.toString("base64");

      const imageObject = {
        key: Date.now().toString(),
        filename: req.file.originalname,
        mimeType: "image/jpeg",
        data: base64Image,
      };

      res.status(200).json({
        message: "Image converted successfully",
        image: imageObject,
      });
    } catch (error) {
      console.error("Error processing conversion:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
