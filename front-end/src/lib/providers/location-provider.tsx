import { createContext, useContext, useEffect, useState } from "react";
import type {
  TImage,
  TImages,
  Tmode,
  TPartialImage,
  TuploadImages,
} from "../types";
import {
  DeleteImage,
  getImagesFromServer,
  transformServerImageData,
  UpdateImage,
} from "../server-utils";
import { toast } from "react-hot-toast";

type TLocationContext = {
  serverImages: TImages;
  uploadedImages: TuploadImages;
  setUploadedImages: React.Dispatch<React.SetStateAction<TuploadImages>>;
  mode: Tmode;
  setMode: React.Dispatch<React.SetStateAction<Tmode>>;
  inspectingImage: TImage | null;
  setInspectingImage: React.Dispatch<React.SetStateAction<TImage | null>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  allImages: TImages;
  handleRefreshServerImages: () => Promise<void>;
  handleDeleteImage: (key: string) => void;
  handleUpdateImage: (
    updatedImage: TPartialImage,
    key: string
  ) => Promise<void>;
};

const LocationContext = createContext<TLocationContext | undefined>(undefined);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [serverImages, setServerImages] = useState<TImages>([]);
  const [uploadedImages, setUploadedImages] = useState<TuploadImages>([]);
  const allImages = [...serverImages, ...uploadedImages];
  const [mode, setMode] = useState<Tmode>("initial");
  const [uploading, setUploading] = useState<boolean>(false);
  const [inspectingImage, setInspectingImage] = useState<TImage | null>(null);

  const handleRefreshServerImages = async () => {
    try {
      const images = await getImagesFromServer();
      toast.success("Server images refreshed");
      const transformedImages = transformServerImageData(images);
      setServerImages(transformedImages);
    } catch (error) {
      toast.error("Failed to refresh server images");
    }
  };

  const handleDeleteImage = async (key: string) => {
    await DeleteImage(key);
    setInspectingImage(null);
    handleRefreshServerImages();
  };

  const handleUpdateImage = async (
    updatedImage: TPartialImage,
    key: string
  ) => {
    await UpdateImage(updatedImage, key);
    handleRefreshServerImages();
  };

  useEffect(() => {
    handleRefreshServerImages();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        serverImages,
        uploadedImages,
        setUploadedImages,
        mode,
        setMode,
        uploading,
        setUploading,
        inspectingImage,
        setInspectingImage,
        allImages,
        handleRefreshServerImages,
        handleDeleteImage,
        handleUpdateImage,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider"
    );
  }
  return context;
};
