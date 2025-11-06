// import gql from "graphql-tag";
// import { GraphQLUpload } from "graphql-upload-minimal";
// import { GraphQLJSON } from "graphql-type-json";

const BUCKET_NAME = process.env.BUCKET_NAME || "melbglyphs";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
const s3 = new S3Client({ region: "ap-southeast-2" });
import {
  addToServer,
  deleteImageFromServer,
  fetchArtists,
  fetchImages,
  findImageById,
  updateImageOnServer,
} from "../server-utils-lambda.js";

// import fs from "fs";
// import path from "path";
import { imageObjectsSchema, imageObjectSchema } from "../utils/schemas.js";

const resolvers = {
  Query: {
    images: async () => {
      console.log("images query called");
      const images = await fetchImages();
      const validResults = images
        .map((image) => imageObjectSchema.safeParse(image))
        .filter((result) => result.success)
        .map((result) => result.data);
      return validResults;
    },
    artists: async () => {
      console.log("artists query called");
      const artists = await fetchArtists();
      return artists;
    },
    hello: async () => {
      console.log("hello query called");
      return "Hello world";
    },

    reverseGeocode: async ({ latitude, longitude }) => {
      console.log("reverseGeocode called with:", latitude, longitude);
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "MelbGlyphs/1.0", // You must include a valid user-agent
          "Accept-Language": "en",
        },
      });
      if (!response.ok) throw new Error("Nominatim request failed");
      const data = await response.json();

      const suburb =
        data?.address?.suburb ||
        data?.address?.neighbourhood ||
        data?.address?.city_district ||
        data?.address?.town ||
        data?.address?.village ||
        data?.address?.city ||
        null;
      console.log("reverseGeocode result:", suburb);
      return suburb;
    },
  },

  Mutation: {
    getPresignedUrl: async ({ filename, contentType }) => {
      const key = `uploads/${filename}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      });
      const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      return { url, key };
    },

    addImages: async ({ images }) => {
      console.log("addImages called");

      try {
        const uploadedImages = await Promise.all(
          images.map(async (img) => {
            return {
              id: img.id || crypto.randomUUID(),
              artist: img.artist || null,
              suburb: img.suburb || "",
              locationData: {
                latitude: img.locationData.latitude,
                longitude: img.locationData.longitude,
              },
              uploadedAt: img.uploadedAt || new Date().toISOString(),
              capped: img.capped || null,
              path: img.path,
              isOnServer: true,
            };
          })
        );

        const validImages = uploadedImages.filter(Boolean);
        if (validImages.length === 0) {
          return { success: false, message: "No images could be processed" };
        }
        const parsed = imageObjectsSchema.safeParse(validImages);
        if (!parsed.success) {
          console.error("Validation errors:", parsed.error.errors);
          return {
            success: false,
            message: "Validation errors",
          };
        }

        await addToServer(parsed.data);

        return { success: true, message: "Images uploaded successfully!" };
      } catch (err) {
        console.error("Error processing images:", err);
        return { success: false, message: "Error processing images" };
      }
    },

    deleteImage: async ({ id }) => {
      console.log("deleteImage called with ID:", id);

      const localURL = await deleteImageFromServer(id);
      if (!localURL) {
        return {
          success: false,
          message: "Error deleting image metadata",
        };
      }

      const key = localURL.substring(localURL.indexOf("uploads/"));
      console.log(
        `Image metadata deleted from server, deleting ${key} from S3 now.`
      );
      const params = {
        Bucket: process.env.S3_BUCKET_NAME || "melbglyphs",
        Key: key,
      };

      //probe existence
      try {
        await s3.send(new HeadObjectCommand(params));
        console.log(`File ${id} exists in S3 bucket, proceeding to delete.`);
      } catch (err) {
        if (err.name === "NotFound") {
          console.log(`File ${id} not found in S3 bucket.`);
          return {
            success: false,
            message: "File not found",
          };
        } else {
          console.log("Error deleting file from S3:", err);
          return {
            success: false,
            message: "Error deleting file from S3",
          };
        }
      }
      console.log(`Proceeding to delete file ${id} from S3.`);
      try {
        await s3.send(new DeleteObjectCommand(params));
      } catch (err) {
        console.error("DeleteObjectCommand error:", err);
      }

      console.log(`File ${id} deleted successfully from S3.`);

      try {
        await s3.send(new HeadObjectCommand(params));
        return { success: false, message: "Failed to delete object" };
      } catch (err) {
        if (err.name === "NotFound") {
          console.warn(`file not found, this is good!`);
          return {
            success: true,
            message: "file deleted successfully",
          };
        } else {
          console.error("Error deleting file from S3:", err);
          return {
            success: true,
            message: "file not found",
          };
        }
      }
    },

    updateImage: async ({ id, updatedData }) => {
      const res = await updateImageOnServer(id, updatedData);
      return res;
    },
  },
};

export default resolvers;
