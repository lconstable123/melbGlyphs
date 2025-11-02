import fs from "fs";
import path from "path";

export const saveImageLocally = async (buffer, filename) => {
  const uploadDir = path.join(process.cwd(), "backend/local_uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filePath, buffer);
  return filePath;
};
