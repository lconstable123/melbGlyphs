import { toast } from "react-hot-toast";
import type { TGQLGetImages, TImage, TImages, TuploadImage } from "./types";
import * as exifr from "exifr";
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

export const transformServerImageData = (
  serverImages: TGQLGetImages
): TImages => {
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL!;
  return serverImages.images.map((img) => {
    const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL!;
    const absoluteUrl = img.isOnServer
      ? `${VITE_SERVER_URL}${img.path}`
      : img.path;

    return {
      artist: img.artist || null,
      id: img.id,
      converted: true,
      locationData: img.locationData || null,
      suburb: img.suburb || null,
      uploadedAt: img.uploadedAt,
      capped: img.capped || false,

      isOnServer: true,
      path: absoluteUrl,
    } as TImage;
  });
};

export const DeleteImage = async (key: string) => {
  // toast.success("Deleting image...");
  const apiUrl = "http://localhost:5000";
  try {
    const response = await fetch(`${apiUrl}/image/${key}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete image");
    }
    const result = await response.json();
    // toast.success("Image deleted successfully");
  } catch (err) {
    console.error("Error deleting image:", err);
    // toast.error("Failed to delete image");
  }
};

export const UpdateImage = async (
  updatedImage: Partial<TImage>,
  key: string
) => {
  // toast.success("Updating image...");
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
    // toast.success("Image updated successfully");
  } catch (err) {
    console.error("Error updating image:", err);
    // toast.error("Failed to update image");
  }
};

// export const ImageConverter = async (image: TuploadImage) => {
//   // toast.success("Converting image hankde...");
//   const formData = new FormData();
//   if (!image.file) return;
//   formData.append("image", image.file);
//   const apiUrl = import.meta.env.VITE_SERVER_URL!;

//   const res = await fetch(`${apiUrl}/convert`, {
//     method: "POST",
//     body: formData,
//   });
//   if (!res.ok) {
//     console.error("Image conversion failed");
//     return;
//   }

//   const data = await res.json();
//   // toast.success("Image Converted!");
//   const convertedImage: TuploadImage = {
//     id: image.id,
//     converted: true,
//     file: image.file,
//     locationData: await extractLocationData(image.file),
//     path: `data:${data.image.mimeType};base64,${data.image.data}`,
//     isOnServer: false,
//   };
//   return convertedImage;
// };

export const extractLocationData = async (file: File) => {
  let locationData: { latitude: number; longitude: number } | null = null;
  try {
    const gpsData = await exifr.gps(file);
    if (gpsData && gpsData.latitude && gpsData.longitude) {
      locationData = {
        latitude: gpsData.latitude,
        longitude: gpsData.longitude,
      };
    }
  } catch (error) {
    console.error("Error extracting location data:", error);
  }

  return locationData;
};

export const getPresignedUrl = async (
  filename: string,
  contentType: string
) => {
  const endpoint = import.meta.env.VITE_SERVER_URL!;
  console.log("key is still:", filename);
  const presignedResponse = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation GetPresignedUrl($filename: String!, $contentType: String!) {
          getPresignedUrl(filename: $filename, contentType: $contentType) {
            url
            key
          }
        }
      `,
      variables: {
        filename: filename,
        contentType: contentType,
      },
    }),
  });

  if (!presignedResponse.ok) {
    toast.error("Failed to get presigned URL");
    throw new Error("Failed to get presigned URL");
  }
  // toast.success("Successfully retrieved presigned URL");
  const { data } = await presignedResponse.json();
  console.log("data from urlfetch:", data);
  return data.getPresignedUrl;
};
