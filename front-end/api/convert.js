import serverless from "serverless-http";
import express from "express";
import multer from "multer";
import sharp from "sharp";
import heicConvert from "heic-convert";
import { fileTypeFromBuffer } from "file-type";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

app.post("/convert", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File not found" });

    let buffer = req.file.buffer;
    const fileType = await fileTypeFromBuffer(buffer);

    if (fileType?.mime === "image/heic" || fileType?.mime === "image/heif") {
      buffer = await heicConvert({ buffer, format: "JPEG", quality: 1 });
    }

    const jpegBuffer = await sharp(buffer).jpeg().toBuffer();
    const base64Image = jpegBuffer.toString("base64");

    res.status(200).json({
      message: "Image converted successfully",
      image: { mimeType: "image/jpeg", data: base64Image },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Wrap the Express app in a serverless handler
export default serverless(app);
