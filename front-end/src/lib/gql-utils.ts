import { gql } from "@apollo/client";
import { print } from "graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import heic2any from "heic2any";
import type { TPartialImage, TuploadImage } from "./types";
import { toast } from "react-hot-toast";
import { extractLocationData } from "./server-utils";
export const ADD_IMAGES = `
  mutation AddImages($images: [ImageMetaInput!]!) {
    addImages(images: $images) {
      success
      message
    }
  }
`;

export const GET_IMAGES = `
  query getImages {
    images {
      id
      artist
      locationData {
        longitude
        latitude
      }
      suburb
      uploadedAt
      capped
      path
      isOnServer
    }
  }
`;

export const UPDATE_IMAGE = `
  mutation UpdateImage($id: ID!, $updatedData: partialImageInput!) {
    updateImage(id: $id, updatedData: $updatedData) {
      success
      message
    }
  }
`;

export const DELETE_IMAGE = `
  mutation DeleteImage($id: ID!) {
    deleteImage(id: $id) {
      success
      message
    }
  }
`;

export const REVERSE_GEOCODE = `
  query reverseGeocode($latitude: Float!, $longitude: Float!) {
    reverseGeocode(latitude: $latitude, longitude: $longitude)
  }
`;

export const GET_ARTISTS = `
  query getArtists {
    artists
  }
`;

export const CONVERT_IMAGE = `
mutation Convert($base64: String!, $filename: String!) {
  convertImage(base64: $base64, filename: $filename) {
    key
    filename
    mimeType
    data
  }
}
`;

export const AddImages = async (
  images: any[]
): Promise<{ success: boolean; message?: string }> => {
  const endpoint =
    "https://h7ucg7tgah.execute-api.ap-southeast-2.amazonaws.com/graphql";
  // toast.success(`Adding images to server...${endpoint}`);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: ADD_IMAGES,
      variables: { images: images },
    }),
  });

  const data = await res.json();

  if (!data?.data?.addImages?.success) {
    toast.error(data?.data?.addImages?.message || "Error uploading images");
    return { success: false, message: data?.data?.addImages?.message };
  } else {
    // toast.success("Images added successfully!");
    return { success: true, message: "sucess" };
  }
};

export const GetImages = async () => {
  // const endpoint = import.meta.env.VITE_SERVER_URL!;
  const endpoint =
    "https://h7ucg7tgah.execute-api.ap-southeast-2.amazonaws.com/graphql";
  // toast.success(`Fetching images from server...${endpoint}`);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GET_IMAGES }),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("GraphQL error:", error);
    return { success: false, message: "Network error" };
  }
  const result = await res.json();
  // console.log("Fetched images:", result.data.images);
  return result.data.images;
};

export const UpdateImage = async (id: string, updatedData: TPartialImage) => {
  // toast.success(`Updating image ${id} on server...`);
  const endpoint =
    "https://h7ucg7tgah.execute-api.ap-southeast-2.amazonaws.com/graphql";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_IMAGE,
      variables: { id, updatedData },
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("GraphQL error:", error);
    return { success: false, message: "Network error" };
  }
  const result = await res.json();
  // toast.success("UpdateImage result:", result.message);
  return result.data.updateImage;
};

export const DeleteImage = async (id: string) => {
  const endpoint = import.meta.env.VITE_SERVER_URL!;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: DELETE_IMAGE,
      variables: { id },
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("GraphQL error:", error);
    return { success: false, message: "Network error" };
  }
  const result = await res.json();
  console.log("DeleteImage result:", res);
  return result.data.deleteImage;
};
export const ReverseGeocode = async (latitude: number, longitude: number) => {
  const endpoint = import.meta.env.VITE_SERVER_URL!;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: REVERSE_GEOCODE,
      variables: { latitude, longitude },
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    toast.error("GraphQL error:", error);
    return null;
  }
  const result = await res.json();
  console.log("ReverseGeocode result:", result.data);
  return result.data;
};

export const GetArtists = async () => {
  const endpoint = import.meta.env.VITE_SERVER_URL!;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_ARTISTS,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("GraphQL error:", error);
    return { success: false, message: "Network error" };
  }
  const result = await res.json();
  return result.data.artists;
};

export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ImageConverter = async (image: TuploadImage) => {
  if (!image.file) return;

  try {
    let convertedBlob = await heic2any({
      blob: image.file,
      toType: "image/jpeg",
    });

    if (Array.isArray(convertedBlob)) {
      convertedBlob = convertedBlob[0];
    }
    const convertedFile = new File(
      [convertedBlob],
      image.file.name.replace(/\.heic$/i, ".jpg"),
      { type: "image/jpeg" }
    );

    const convertedImage: TuploadImage = {
      id: image.id,
      converted: true,
      file: convertedFile,
      locationData: await extractLocationData(image.file), // or convertedFile if needed
      path: URL.createObjectURL(convertedFile),
      isOnServer: false,
    };

    return convertedImage;
  } catch (err) {
    console.error("Image conversion failed:", err);
    return null;
  }
};
