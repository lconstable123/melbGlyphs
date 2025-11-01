import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import bodyParser from "body-parser";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import typeDefs from "./schema/type-defs.js";
import resolvers from "./schema/resolvers.js";
import path from "path";
import fs from "fs";
import multer from "multer";

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

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
