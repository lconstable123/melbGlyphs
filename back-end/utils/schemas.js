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
  // preview: z.string().min(1),
  artist: z.string().nullable(),
  locationData: locationSchema,
  suburb: z.string().optional(),
  uploadedAt: z.string({ message: "uploadedAt is required" }),
  capped: z.string({ message: "capped is required" }).nullable(),
  // file: z.string().nullable(),
  filePath: z.string().min(1, "filePath is required"),
  //   file: z
  //     .any()
  //     .refine((file) => file && Buffer.isBuffer(file.buffer), {
  //       message: "File must have a valid buffer",
  //     })
  //     .refine(
  //       (file) =>
  //         file?.mimetype === "image/png" ||
  //         file?.mimetype === "image/jpeg" ||
  //         file?.mimetype === "image/jpg" ||
  //         file?.mimetype === "image/pjpeg",
  //       { message: "File must be a PNG or JPG image" }
  //     ),
  // });
});

export const imageObjectsSchema = z.array(imageObjectSchema);

// export type TlocationSchema = z.infer<typeof locationSchema>;
// export type TimageSchema = z.infer<typeof imageObjectSchema>;
// export type TimagesSchema = z.infer<typeof imageObjectsSchema>;
