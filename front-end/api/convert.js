import multer from "multer";
import sharp from "sharp";

// Configure multer for in-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false, // Important for file uploads
  },
};

export default async function handler(req, res) {
  // GET: simple health check
  if (req.method === "GET") {
    res.status(200).send("Image Converter API is running");
    return;
  }

  // POST: handle image conversion
  if (req.method === "POST") {
    try {
      // Use multer to handle single file upload
      upload.single("image")(req, res, async (err) => {
        if (err) {
          console.error("Multer error:", err);
          return res.status(500).json({ error: "File upload error" });
        }

        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        try {
          // Convert image to JPEG using Sharp
          const jpegBuffer = await sharp(req.file.buffer)
            .jpeg({ quality: 100 })
            .toBuffer();

          const base64Image = jpegBuffer.toString("base64");

          res.status(200).json({
            message: "Image converted successfully",
            image: { mimeType: "image/jpeg", data: base64Image },
          });
        } catch (conversionError) {
          console.error("Sharp conversion error:", conversionError);
          res.status(500).json({ error: "Image conversion failed" });
        }
      });
    } catch (error) {
      console.error("POST handler error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    return;
  }

  // If method is not GET or POST
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
