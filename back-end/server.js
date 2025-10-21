import express from "express";
import cors from "cors";

import { imageSchema } from "./utils/schemas.js";
import multer from "multer";
import sharp from "sharp";
import heicConvert from "heic-convert";
import { fileTypeFromBuffer } from "file-type";
const app = express();
const PORT = process.env.PORT || 5000;

const StoredImages = [];
const convertedImages = [];
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors(), express.json());

app.post("/images", (req, res) => {
  console.log("Received a POST request to /images");
  const parsedBody = imageSchema.safeParse(req.body);
  if (!parsedBody.success) {
    console.error("validation error", parsedBody.error.errors);
    return res.status(400).json({ errors: parsedBody.error.errors });
  }
  const { imageData } = parsedBody.data;
  console.log("Image data received:", imageData);
  res.status(201).json({ message: "Image received" });
});

app.get("/images", (req, res) => {
  console.log("Received a GET request to /images");
  res.json(StoredImages);
});
app.patch("/images/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Received a PATCH request to /images/${id}`);
});
app.delete("/images/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Received a DELETE request to /images/${id}`);
});
//-----------------------------------------------------------------convert images endpoint
app.post("/convert", upload.single("image"), async (req, res) => {
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

    convertedImages.push(imageObject);

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
