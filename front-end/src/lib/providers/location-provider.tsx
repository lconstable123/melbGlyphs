import { createContext, useContext, useEffect, useRef, useState } from "react";
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
import { UseFontsLoaded } from "../hooks";
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
  setFilterArtist: React.Dispatch<React.SetStateAction<string | null>>;
  mapLoading: boolean;
  setMapLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fontsLoaded: boolean;
  forceSelectedUpdate: boolean;
  mapPitch: number;
  mapBearing: number;
  handleMapPitch: () => void;
  handleMapBearing: () => void;
};

const LocationContext = createContext<TLocationContext | undefined>(undefined);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mapPitch, setMapPitch] = useState<number>(60);
  const [mapBearing, setMapBearing] = useState<number>(-30);
  const [serverImages, setServerImages] = useState<TImages>([]);
  const [filterArtist, setFilterArtist] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<TuploadImages>([]);
  const allImages = [
    ...serverImages,
    ...uploadedImages.map(({ converted, ...rest }) => rest),
  ].filter((img) => (filterArtist ? img.artist === filterArtist : true));
  const [mode, setMode] = useState<Tmode>("upload");
  const [uploading, setUploading] = useState<boolean>(false);
  const [inspectingImage, setInspectingImage] = useState<TImage | null>(null);
  const [artistList, setArtistList] = useState<string[]>([]);
  const [hardMapReset, setHardMapReset] = useState<boolean>(false);
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const fontsLoaded = UseFontsLoaded();
  const [forceSelectedUpdate, setForceSelectedUpdate] =
    useState<boolean>(false);
  const handleRefreshServerImages = async () => {
    try {
      // toast.success("Refreshing server images...");
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
  const handleForceSelectedUpdate = () => {
    setForceSelectedUpdate((prev) => !prev);
  };
  const handleMapPitch = () => {
    setMapPitch((prev) => (prev + 20) % 90);
  };
  const handleMapBearing = () => {
    setMapBearing((prev) => (prev + 45) % 360);
  };

  const refreshArtistList = async () => {
    const artists = await GetArtists();
    setArtistList(artists || []);
  };

  const handleDeleteImage = async (key: string) => {
    // await DeleteImage(key);
    // toast.success("Deleting image...");
    const result = await DeleteImage(key);
    if (!result?.success) {
      // toast.error("Failed to delete image");
      return;
    }
    // toast.success("Image deleted successfully");
    setInspectingImage(null);
    setMode("explore");
    // handleForceSelectedUpdate();
    handleRefreshServerImages();
    handleHardMapReset();
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
      // toast.error("Failed to update image");
      return;
    }
    // toast.success("Image updated successfully");
    handleRefreshServerImages();
    // handleHardMapReset();
    handleForceSelectedUpdate();
  };

  useEffect(() => {
    handleRefreshServerImages();
  }, []);

  useEffect(() => {
    if (mode === "upload") {
      setInspectingImage(null);
    } else {
      handleMapBearing();
    }
  }, [mode]);

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
        setFilterArtist,
        mapLoading,
        setMapLoading,
        fontsLoaded,
        forceSelectedUpdate,
        handleMapPitch,
        mapPitch,
        handleMapBearing,
        mapBearing,
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
