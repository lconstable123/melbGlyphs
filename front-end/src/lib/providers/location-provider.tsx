import { createContext, useContext, useEffect, useState } from "react";
import type {
  TImage,
  TImages,
  Tmode,
  TPartialImage,
  TuploadImages,
  TGQLGetImages,
  TGQLUpdateImageVars,
  TGQLUpdateImage,
  TGQLDeleteImageVars,
  TGQLDeleteImage,
} from "../types";

import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client/react";
// import { useMutation } from '@apollo/client';
import {
  GET_IMAGES,
  ADD_IMAGES,
  // DELETE_IMAGE,
  UPDATE_IMAGE,
  DELETE_IMAGE,
  GetImages,
  DeleteImage,
  UpdateImage,
  GetArtists,
} from "../gql-utils";
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
  artistList: string[];
  refreshArtistList: () => Promise<void>;
  hardMapReset: boolean;
  handleHardMapReset: () => void;
};

const LocationContext = createContext<TLocationContext | undefined>(undefined);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [serverImages, setServerImages] = useState<TImages>([]);
  const [uploadedImages, setUploadedImages] = useState<TuploadImages>([]);
  const allImages = [
    ...serverImages,
    ...uploadedImages.map(({ converted, ...rest }) => rest),
  ];
  const [mode, setMode] = useState<Tmode>("initial");
  const [uploading, setUploading] = useState<boolean>(false);
  const [inspectingImage, setInspectingImage] = useState<TImage | null>(null);
  const [artistList, setArtistList] = useState<string[]>([]);
  const [hardMapReset, setHardMapReset] = useState<boolean>(false);

  const handleRefreshServerImages = async () => {
    try {
      toast.success("Refreshing server images...");
      const images = await GetImages();

      // toast.success("Server images refreshed");
      // console.log("Fetched images from server:", images);
      setServerImages(images || []);
    } catch (error) {
      toast.error("Failed to refresh server images");
    }
  };
  const handleHardMapReset = () => {
    setHardMapReset((prev) => !prev);
  };
  const refreshArtistList = async () => {
    const artists = await GetArtists();
    setArtistList(artists || []);
  };

  const handleDeleteImage = async (key: string) => {
    // await DeleteImage(key);
    toast.success("Deleting image...");
    const result = await DeleteImage(key);
    if (!result.data?.deleteImage?.success) {
      toast.error("Failed to delete image");
      return;
    }
    // toast.success("Image deleted successfully");
    setInspectingImage(null);
    handleRefreshServerImages();
  };

  const handleUpdateImage = async (
    updatedImage: TPartialImage,
    key: string
  ) => {
    //  await UpdateImage(updatedImage, key);'
    // toast.success("Updating image... key:" + key + "Data:");
    // console.log("Updating image with ID:", key, "Data:", updatedImage);
    const result = await UpdateImage(key, updatedImage);
    if (!result.success) {
      toast.error("Failed to update image");
      return;
    }
    // toast.success("Image updated successfully");
    handleRefreshServerImages();
    handleHardMapReset();
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
        artistList,
        refreshArtistList,
        hardMapReset,
        handleHardMapReset,
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
