import gql from "graphql-tag";

import { StoredImages } from "../fake-data.js";
const resolvers = {
  Query: {
    images: () => {
      return StoredImages;
    },
  },
  Mutation: {
    addImages: (parent, { images, files }) => {
      return {
        success: true,
        message: "Images added successfully",
      };
      // Implementation for adding images
    },
    deleteImage: (parent, { id }) => {
      return {
        success: true,
        message: `Image with ID ${id} deleted successfully`,
      };
      // Implementation for deleting an image
    },
    updateImage: (parent, { id, updatedData }) => {
      // Implementation for updating an image
      return {
        success: true,
        message: `Image with ID ${id} updated successfully`,
      };
    },
  },
};

export default resolvers;
