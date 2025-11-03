import { z } from "zod";

export const imageSchema = z.object({
  imageData: z.string().min(1, "imageData is required"),
});

export const locationSchema = z.object({
  latitude: z.coerce.number({ message: "latitude is required" }),
  longitude: z.coerce.number({ message: "longitude is required" }),
});

export const imageObjectSchema = z.object({
  id: z.uuid().optional(),
  artist: z.string().nullable(),
  locationData: locationSchema,
  suburb: z.string().optional(),
  uploadedAt: z.string({ message: "uploadedAt is required" }),
  capped: z.string({ message: "capped is required" }).nullable(),
  path: z.string({ message: "path is required" }).min(1, "path is required"),
  isOnServer: z.boolean({ message: "isOnServer is required" }),
});

export const imageObjectsSchema = z.array(imageObjectSchema);

// export type TlocationSchema = z.infer<typeof locationSchema>;
// export type TimageSchema = z.infer<typeof imageObjectSchema>;
// export type TimagesSchema = z.infer<typeof imageObjectsSchema>;
