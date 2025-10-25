import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post("/convert", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File not found" });

    const jpegBuffer = await sharp(req.file.buffer)
      .jpeg({ quality: 100 })
      .toBuffer();

    const base64Image = jpegBuffer.toString("base64");

    res.status(200).json({
      message: "Image converted successfully",
      image: { mimeType: "image/jpeg", data: base64Image },
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;

export const config = {
  api: {
    bodyParser: false,
  },
};
