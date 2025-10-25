import { createContext, useContext, useState } from "react";
import type { TImage, TImages, Tmode, TuploadImages } from "../types";

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
};

const LocationContext = createContext<TLocationContext | undefined>(undefined);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [serverImages, setServerImages] = useState<TImages>([]);
  const [uploadedImages, setUploadedImages] = useState<TuploadImages>([]);
  const [mode, setMode] = useState<Tmode>("initial");
  const [uploading, setUploading] = useState<boolean>(false);
  const [inspectingImage, setInspectingImage] = useState<TImage | null>(null);

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
