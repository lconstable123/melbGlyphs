import { toast } from "react-hot-toast";
import type { TImage, TImages } from "./types";

export const uploadImages = async (data: FormData): Promise<boolean> => {
  // const apiUrl = import.meta.env.VITE_API_URL!;
  const apiUrl = "http://localhost:5000";
  try {
    const response = await fetch(`${apiUrl}/images`, {
      method: "POST",
      body: data,
    });
    if (!response.ok) {
      return false;
      throw new Error("Failed to upload images");
    }
    const result = await response.json();
    return true;
  } catch (err) {
    console.error("Error uploading images:", err);
    return false;
  }
};

export const getImagesFromServer = async () => {
  // const apiUrl = import.meta.env.VITE_API_URL!;
  const apiUrl = "http://localhost:5000";
  try {
    const response = await fetch(`${apiUrl}/images`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch images");
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error fetching images:", err);
    return [];
  }
};

export const transformServerImageData = (serverImages: any[]): TImages => {
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL!;
  return serverImages.map((img) => {
    const absoluteFilePath = `${VITE_SERVER_URL}${img.filePath}`;

    return {
      artist: img.artist || null,
      key: img.id,
      converted: true,
      preview: absoluteFilePath,
      locationData: img.locationData || null,
      suburb: img.suburb || null,
      uploadedAt: img.uploadedAt,
      capped: img.capped || false,
      fileName: img.filePath,
    } as TImage;
  });
};

export const DeleteImage = async (key: string) => {
  toast.success("Deleting image...");
  const apiUrl = "http://localhost:5000";
  try {
    const response = await fetch(`${apiUrl}/image/${key}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete image");
    }
    const result = await response.json();
    toast.success("Image deleted successfully");
  } catch (err) {
    console.error("Error deleting image:", err);
    toast.error("Failed to delete image");
  }
};

export const UpdateImage = async (
  updatedImage: Partial<TImage>,
  key: string
) => {
  toast.success("Updating image...");
  const apiUrl = "http://localhost:5000";
  try {
    const response = await fetch(`${apiUrl}/images/${key}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedImage),
    });
    if (!response.ok) {
      throw new Error("Failed to update image");
    }
    const result = await response.json();
    toast.success("Image updated successfully");
  } catch (err) {
    console.error("Error updating image:", err);
    toast.error("Failed to update image");
  }
};
