import multer from "multer";
import sharp from "sharp";
import heicConvert from "heic-convert";
import { fileTypeFromBuffer } from "file-type";

// Configure multer for in-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export default async function handler(req, res) {
  // GET: simple health check
  if (req.method === "GET") {
    res.status(200).send("Image Converter API is running");
    return;
  }

  // POST: image conversion
  if (req.method === "POST") {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(500).json({ error: "File upload error" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        let buffer = req.file.buffer;

        // Detect file type
        const type = await fileTypeFromBuffer(buffer);

        // Handle HEIC/HEIF
        if (type?.mime === "image/heic" || type?.mime === "image/heif") {
          buffer = await heicConvert({
            buffer,
            format: "JPEG",
            quality: 1,
          });
        }

        // Convert everything to JPEG
        const jpegBuffer = await sharp(buffer)
          .jpeg({ quality: 100 })
          .toBuffer();

        const base64Image = jpegBuffer.toString("base64");

        res.status(200).json({
          message: "Image converted successfully",
          image: { mimeType: "image/jpeg", data: base64Image },
        });
      } catch (conversionError) {
        console.error("Conversion error:", conversionError);
        res.status(500).json({ error: "Image conversion failed" });
      }
    });

    return;
  }

  // If method is not GET or POST
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
