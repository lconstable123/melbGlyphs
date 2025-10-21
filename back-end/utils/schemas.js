import { z } from "zod";

export const imageSchema = z.object({
  imageData: z.string().min(1, "imageData is required"),
});
