import gql from "graphql-tag";
import { GraphQLUpload } from "graphql-upload-minimal";
// import { GraphQLJSON } from "graphql-type-json";
import { findImageById } from "../server-utils.js";
import fs from "fs";
import path from "path";
import {
  imageObjectsSchema,
  imageSchema,
  imageObjectSchema,
} from "../utils/schemas.js";
const uploadDir = path.join(process.cwd(), "uploads");
const apiUrl = "http://localhost:5000";
import { StoredImages } from "../fake-data.js";
const resolvers = {
  Query: {
    images: () => {
      // console.log("images query called");
      // console.log(
      //   "Returning images:",
      //   StoredImages.map((img) => img.fileName)
      // );
      return StoredImages;
    },
    reverseGeocode: async (parent, { latitude, longitude }) => {
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
    addImages: async (parent, { images }) => {
      console.log("addImages called");
      try {
        const imagesMapped = images.map((img) => {
          console.log("Processing image:", img.path);
          return {
            id: img.id,
            artist: img.artist || null,
            suburb: img.suburb || "",
            locationData: img.locationData,
            uploadedAt: img.uploadedAt || new Date().toISOString(),
            capped: img.capped || null,
            path: `/uploads/${img.path}`,
            isOnServer: true,
          };
        });
        console.log("Mapped images:", imagesMapped);
        const parsed = imageObjectsSchema.safeParse(imagesMapped);
        if (!parsed.success) {
          console.error("Validation errors in zod:", parsed.error.errors);
          return {
            success: false,
            message: "Validation errors",
          };
        }
        StoredImages.push(...parsed.data);
      } catch (err) {
        console.error("Error processing images:", err);

        return {
          success: false,
          message: "Error processing images",
        };
      }
      console.log(
        "Images successfully added. Total images:",
        StoredImages.length
      );
      return {
        success: true,
        message: "Images added successfully",
      };
      // Implementation for adding images
    },

    deleteImage: async (parent, { id }) => {
      console.log("deleteImage called with ID:", id);
      const { FoundImage, index } = findImageById(StoredImages, id);
      console.log("Found image to delete:", FoundImage.path);
      StoredImages.splice(index, 1);

      try {
        // const filePath = FoundImage.path;
        const filePath = path.join(process.cwd(), FoundImage.path);
        if (!fs.existsSync(filePath)) {
          console.warn("File to delete does not exist:", filePath);
          return {
            success: false,
            message: "File does not exist",
          };
        } else {
          console.log("Deleting file at path:", filePath);
        }
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.error("Error deleting file:", err);
        return {
          success: false,
          message: "Error deleting file",
        };
      }

      return {
        success: true,
        message: `Image with ID ${id} deleted successfully`,
      };
      // Implementation for deleting an image
    },
    updateImage: (parent, { id, updatedData }) => {
      console.log("updateImage called with ID:", id);
      const { FoundImage, index } = findImageById(StoredImages, id);
      const parsed = imageObjectSchema.safeParse(FoundImage);
      if (!parsed.success) {
        console.error("Validation errors:", parsed.error.errors);
        return {
          success: false,
          message: "Validation errors",
        };
      }
      StoredImages[index] = { ...FoundImage, ...updatedData };
      console.log("Updated image:", StoredImages[index]);

      return {
        success: true,
        message: `Image with ID ${id} updated successfully`,
      };
    },
  },
};

export default resolvers;
