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
import {
  DeleteImage,
  getImagesFromServer,
  transformServerImageData,
  UpdateImage,
} from "../server-utils";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client/react";
// import { useMutation } from '@apollo/client';
import {
  GET_IMAGES,
  ADD_IMAGES,
  // DELETE_IMAGE,
  UPDATE_IMAGE,
  DELETE_IMAGE,
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

  const { data, loading, error, refetch } = useQuery<TGQLGetImages>(GET_IMAGES);
  const [addImages, { loading: addLoading, error: addError, data: addData }] =
    useMutation(ADD_IMAGES);
  const [
    deleteImage,
    { loading: deleteLoading, error: deleteError, data: deleteData },
  ] = useMutation<TGQLDeleteImage, TGQLDeleteImageVars>(DELETE_IMAGE);
  const [
    updateImage,
    { loading: updateLoading, error: updateError, data: updateData },
  ] = useMutation<TGQLUpdateImage, TGQLUpdateImageVars>(UPDATE_IMAGE);

  const handleRefreshServerImages = async () => {
    try {
      // const images = await getImagesFromServer();
      // const images = images;
      const { data: images } = await refetch();
      toast.success("Server images refreshed");
      console.log("Fetched images from server:", images);
      // const transformedImages = transformServerImageData(images || []);
      // console.log("Transformed images:", transformedImages);
      setServerImages(images?.images || []);
    } catch (error) {
      toast.error("Failed to refresh server images");
    }
  };

  const handleDeleteImage = async (key: string) => {
    // await DeleteImage(key);
    toast.success("Deleting image...");
    const result = await deleteImage({ variables: { id: key } });
    if (!result.data?.deleteImage?.success) {
      toast.error("Failed to delete image");
      return;
    }
    toast.success("Image deleted successfully");
    setInspectingImage(null);
    handleRefreshServerImages();
  };

  const handleUpdateImage = async (
    updatedImage: TPartialImage,
    key: string
  ) => {
    //  await UpdateImage(updatedImage, key);'
    toast.success("Updating image... key:" + key + "Data:");
    console.log("Updating image with ID:", key, "Data:", updatedImage);
    const result = await updateImage({
      variables: { id: key, updatedData: updatedImage },
    });

    if (!result.data?.updateImage?.success) {
      toast.error("Failed to update image");
      return;
    }
    toast.success("Image updated successfully");
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
