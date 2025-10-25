import type { TuploadImage } from "./types";
import * as exifr from "exifr";
export const queryLocation = async (query: string) => {
  if (!query) return;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&addressdetails=1&limit=5`;
  try {
    const response = await fetch(url, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "Melb-Glyphs/1.0",
      },
    });

    const data = await response.json();
    if (data.length > 0) {
      return data;
    }
  } catch (error) {
    return "Error fetching location data";
  }
};

export const fetchSuburbFromCoords = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MelbGlyphs/1.0", // You must include a valid user-agent
        "Accept-Language": "en",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();

    const suburb =
      data?.address?.suburb ||
      data?.address?.neighbourhood ||
      data?.address?.city_district ||
      data?.address?.town ||
      data?.address?.village ||
      data?.address?.city ||
      null;

    return suburb;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};

export const ImageConverter = async (image: TuploadImage) => {
  const formData = new FormData();
  formData.append("image", image.file);
  const res = await fetch("http://localhost:5000/convert", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    console.error("Image conversion failed");
    return;
  }

  const data = await res.json();
  // toast.success("Image Converted!");
  const convertedImage: TuploadImage = {
    key: image.key,
    converted: true,
    file: image.file,
    preview: `data:${data.image.mimeType};base64,${data.image.data}`,
    locationData: await extractLocationData(image.file),
  };
  return convertedImage;
};

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
