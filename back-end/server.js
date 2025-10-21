import express from "express";
import cors from "cors";
import path from "path";
import { imageSchema } from "./utils/schemas.js";
const app = express();
const PORT = process.env.PORT || 5000;

const StoredImages = [];

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

app.post("/convert", (req, res) => {

    try {
        const inputPath = req.file.path;
        const outPutFileName = `${req.file.filename}.jpg`
        const outputPath  path.join("converted",outPutFileName);
    } catch (error) {
        console.error("Error processing conversion:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }


});

















app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
