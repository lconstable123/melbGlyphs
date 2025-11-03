import { gql } from "@apollo/client";
import { print } from "graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import type { TPartialImage } from "./types";
import { toast } from "react-hot-toast";
export const ADD_IMAGES = gql`
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

export const UPDATE_IMAGE = gql`
  mutation UpdateImage($id: ID!, $updatedData: partialImageInput!) {
    updateImage(id: $id, updatedData: $updatedData) {
      success
      message
    }
  }
`;

export const DELETE_IMAGE = gql`
  mutation DeleteImage($id: ID!) {
    deleteImage(id: $id) {
      success
      message
    }
  }
`;

export const REVERSE_GEOCODE = gql`
  query reverseGeocode($latitude: Float!, $longitude: Float!) {
    reverseGeocode(latitude: $latitude, longitude: $longitude)
  }
`;

export const GET_ARTISTS = gql`
  query getArtists {
    artists
  }
`;

export const AddImages = async (
  images: any[]
): Promise<{ success: boolean; message?: string }> => {
  const endpoint = import.meta.env.VITE_SERVER_URL!;
  toast.success(`Adding images to server...${endpoint}`);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: print(ADD_IMAGES),
      variables: { images: images },
    }),
  });

  const data = await res.json();

  if (!data?.data?.addImages?.success) {
    toast.error(data?.data?.addImages?.message || "Error uploading images");
    return { success: false, message: data?.data?.addImages?.message };
  } else {
    toast.success("Images added successfully!");
    return { success: true, message: "sucess" };
  }
};

export const GetImages = async () => {
  const endpoint = import.meta.env.VITE_SERVER_URL!;
  toast.success(`Fetching images from server...${endpoint}`);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_IMAGES,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("GraphQL error:", error);
    return { success: false, message: "Network error" };
  }
  const result = await res.json();
  return result.data.images;
};

export const UpdateImage = async (id: string, updatedData: TPartialImage) => {
  const endpoint = import.meta.env.VITE_SERVER_URL!;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: print(UPDATE_IMAGE),
      variables: { id, updatedData },
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("GraphQL error:", error);
    return { success: false, message: "Network error" };
  }
  const result = await res.json();
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
      query: print(DELETE_IMAGE),
      variables: { id },
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("GraphQL error:", error);
    return { success: false, message: "Network error" };
  }
  const result = await res.json();
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
      query: print(REVERSE_GEOCODE),
      variables: { latitude, longitude },
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("GraphQL error:", error);
    return { success: false, message: "Network error" };
  }
  const result = await res.json();
  return result.data.reverseGeocode;
};
export const GetArtists = async () => {
  const endpoint = import.meta.env.VITE_SERVER_URL!;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: print(GET_ARTISTS),
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
