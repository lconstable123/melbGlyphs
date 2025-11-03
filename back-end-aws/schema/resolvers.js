// import gql from "graphql-tag";
// import { GraphQLUpload } from "graphql-upload-minimal";
// import { GraphQLJSON } from "graphql-type-json";
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
import { imageObjectsSchema } from "../utils/schemas.js";

const resolvers = {
  Query: {
    images: async () => {
      console.log("images query called");
      const images = await fetchImages();
      return images;
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
    addImages: async ({ images }) => {
      console.log("addImages called");
      try {
        const imagesMapped = images.map((img) => {
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

        await addToServer(parsed.data);
      } catch (err) {
        console.error("Error processing images:", err);

        return {
          success: false,
          message: "Error processing images",
        };
      }

      return {
        success: true,
        message: "Images added successfully",
      };
    },

    deleteImage: async (id) => {
      console.log("deleteImage called with ID:", id);

      const localURL = await deleteImageFromServer(id);
      if (!localURL) {
        return {
          success: false,
          message: "Error deleting image metadata",
        };
      }
      // console.log("metadata deleted, moving to file delete");
      // try {
      //   const filePath = path.join(process.cwd(), localURL);
      //   if (!fs.existsSync(filePath)) {
      //     console.warn("File to delete does not exist:", filePath);
      //     return {
      //       success: false,
      //       message: "File does not exist",
      //     };
      //   } else {
      //     console.log("Deleting file at path:", filePath);
      //   }

      //   await fs.promises.unlink(filePath);
      // } catch (err) {
      //   console.error("Error deleting file:", err);
      //   return {
      //     success: false,
      //     message: "Error deleting file",
      //   };
      // }

      return {
        success: true,
        message: `Image with ID ${id} deleted successfully`,
      };
    },

    updateImage: async ({ id, updatedData }) => {
      console.log("updateImage called with ID:", id);
      return await updateImageOnServer(id, updatedData);
    },
  },
};

export default resolvers;
