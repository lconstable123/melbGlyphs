import { ApolloServer } from "@apollo/server";
// import { GraphQLUpload } from "graphql-upload";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import bodyParser from "body-parser";

import multer from "multer";
import sharp from "sharp";
import heicConvert from "heic-convert";
import { fileTypeFromBuffer } from "file-type";
import {
  imageObjectsSchema,
  imageSchema,
  imageObjectSchema,
} from "./utils/schemas.js";
import { findImageById } from "./server-utils.js";
import path from "path";
import fs from "fs";
import typeDefs from "./schema/type-defs.js";
import resolvers from "./schema/resolvers.js";
const StoredImages = [];
const convertedImages = [];
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

async function startServer() {
  const PORT = 5000;
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));
  // const PORT = process.env.PORT || 5000;
  app.use(cors());
  app.use(express.json()); // parse JSON for metadata
  app.use("/uploads", express.static(uploadDir));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

//----------------------------------------------------------------------upload Images
// app.post("/images", upload.array("files"), (req, res) => {
//   console.log("Received a POST request to /images");
//   console.log("req.body keys:", Object.keys(req.body));
//   console.log(
//     "req.files:",
//     req.files.map((f) => f.originalname)
//   );

//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: "No files uploaded" });
//     }

//     if (!req.body.images) {
//       return res.status(400).json({ error: "No images metadata found" });
//     }

//     const imagesData = JSON.parse(req.body.images);
//     if (!Array.isArray(imagesData)) {
//       return res
//         .status(400)
//         .json({ error: "Images metadata must be an array" });
//     }

//     const images = imagesData.map((img) => {
//       const file = req.files.find((f) => f.originalname.startsWith(img.key)); // match by filename
//       return {
//         id: img.key,
//         artist: img.artist || null,
//         suburb: img.suburb || "",
//         locationData: img.locationData || {},
//         uploadedAt: img.uploadedAt || new Date().toISOString(),
//         capped: img.capped || null,
//         // file: file ? `/uploads/${file.filename}` : null,
//         filePath: file ? `/uploads/${file.filename}` : null,
//       };
//     });
//     // console.log(images[0]);
//     const parsed = imageObjectsSchema.safeParse(images);
//     if (!parsed.success) {
//       console.error("Validation errors:", parsed.error.errors);
//       return res.status(400).json({ errors: parsed.error.errors });
//     }
//     //emulate server
//     StoredImages.push(...parsed.data);

//     res.status(201).json({ message: "Images received", images: parsed.data });
//   } catch (err) {
//     console.error("Error processing images:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// //----------------------------------------------------------------------get Images

// app.get("/images", (req, res) => {
//   console.log("Received a GET request to /images");
//   // console.log({ StoredImages });
//   res.json(StoredImages);
// });

// app.patch("/images/:id", (req, res) => {
//   const { id } = req.params;
//   console.log(`Received a PATCH request to /images/${id}`);
//   const updatedData = req.body;
//   const { FoundImage, index } = findImageById(StoredImages, id);
//   const parsed = imageObjectSchema.safeParse(FoundImage);
//   if (!parsed.success) {
//     console.error("Validation errors:", parsed.error.errors);
//     return res.status(400).json({ errors: parsed.error.errors });
//   }
//   StoredImages[index] = { ...FoundImage, ...updatedData };
//   console.log("Updated image:", StoredImages[index]);

//   return res
//     .status(200)
//     .json({ message: "Image updated", image: StoredImages[index] });
// });

// app.delete("/image/:id", async (req, res) => {
//   const { id } = req.params;
//   const { FoundImage, index } = findImageById(StoredImages, id);
//   StoredImages.splice(index, 1);
//   console.log("stored images are now" + StoredImages.length);

//   try {
//     const uploadDir = path.join(process.cwd(), FoundImage.filePath);

//     if (!fs.existsSync(uploadDir)) {
//       console.log("File does not exist:", uploadDir);
//       return res.status(404).json({ error: "File not found" });
//     } else {
//       console.log("File exists:", uploadDir);
//     }

//     // Delete it
//     await fs.promises.unlink(uploadDir);
//   } catch (err) {
//     console.error("Error deleting file:", err);
//     res.status(500).json({ error: "Error deleting file" });
//   }
//   console.log("Deleted file from filesystem:");
//   res.status(200).json({ message: "Image deleted successfully" });
// });

// //-----------------------------------------------------------------convert images endpoint
// app.post("/convert", upload.single("image"), async (req, res) => {
//   console.log("Received a POST request to /convert");

//   try {
//     if (!req.file) {
//       return res.status(404).json({ error: "File not found" });
//     }

//     let buffer = req.file.buffer;

//     const fileType = await fileTypeFromBuffer(buffer);
//     console.log("Detected MIME type from content:", fileType?.mime);

//     if (fileType?.mime === "image/heic" || fileType?.mime === "image/heif") {
//       console.log("Converting HEIC/HEIF to JPEG...");
//       buffer = await heicConvert({
//         buffer,
//         format: "JPEG",
//         quality: 1,
//       });
//     }

//     const jpegBuffer = await sharp(buffer).jpeg().toBuffer();

//     const base64Image = jpegBuffer.toString("base64");

//     const imageObject = {
//       key: Date.now().toString(),
//       filename: req.file.originalname,
//       mimeType: "image/jpeg",
//       data: base64Image,
//     };

//     convertedImages.push(imageObject);

//     res.status(200).json({
//       message: "Image converted successfully",
//       image: imageObject,
//     });
//   } catch (error) {
//     console.error("Error processing conversion:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

startServer();
