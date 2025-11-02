import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { UploadCard } from "./upload-card";
import { ImgSkeleton, LoadingCard } from "./loading-card";
import { Button } from "../src/components/ui/button";
import type {
  TGQLAddImages,
  TGQLAddImagesVars,
  TlocationData,
  TuploadImage,
  TuploadImages,
} from "../src/lib/types";
import { ImageConverter } from "../src/lib/api-utils";
import { motion, useAnimation } from "framer-motion";
import { useLocationContext } from "../src/lib/providers/location-provider";
import { uploadImages } from "../src/lib/server-utils";
import { ADD_IMAGES } from "../src/lib/gql-utils";
import { useMutation, useQuery } from "@apollo/client/react";

// import { useLocationContext } from "@/lib/providers/location-provider";

export const ImageUploads = () => {
  //from context

  const { uploadedImages, setUploadedImages, handleRefreshServerImages } =
    useLocationContext();
  const [addImages, { loading: addLoading, error: addError, data: addData }] =
    useMutation<TGQLAddImages, TGQLAddImagesVars>(ADD_IMAGES);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const missingData = uploadedImages.some((img) => !img.locationData);
    if (missingData) {
      toast.error("Please set location data for all images before uploading.");
      handleAnimateError();
      return;
    }
    // toast.success("Uploading images...");
    try {
      const Keyedfiles = uploadedImages
        .filter((img) => !!img.file)
        .map((img) => {
          const ext = img?.file?.type.split("/")[1];
          const extension = ext === "jpeg" ? "jpg" : ext;
          return {
            key: `${img.id}.${extension}`,
            file: img.file!,
          };
        });
      console.log("Files to be uploaded:", Keyedfiles);
      if (Keyedfiles.length === 0) {
        toast.error("No valid files to upload.");
        handleAnimateError();
        return;
      }
      const formData = new FormData();
      Keyedfiles.forEach((file, index) => {
        formData.append("files", file.file, file.key);
      });

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        toast.error("Failed to upload files to server.");
        handleAnimateError();
        return;
      }

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { message: "Files uploaded, no response message." };
      }
      // toast.success("Files uploaded to server. with message : " + data.message);

      const preppedImages = uploadedImages.map((img) => {
        const ext = img.file?.type.split("/")[1];
        const extension = ext === "jpeg" ? "jpg" : ext;
        const uniqueName = `${img.id}.${extension}`;

        return {
          id: img.id,
          artist: img.artist || null,
          locationData: img.locationData!,
          suburb: img.suburb || null,
          uploadedAt: img.uploadedAt || new Date().toISOString(),
          capped: img.capped || null,
          path: uniqueName,
          isOnServer: true,
        };
      });

      console.log("Prepped images for upload:", preppedImages);
      const response = await addImages({
        variables: {
          images: preppedImages,
        },
      });

      if (!response.data?.addImages?.success) {
        toast.error(response.data?.addImages?.message || "unknown message.");
        handleAnimateError();
      } else {
        setUploadedImages([]);
        handleRefreshServerImages();
        toast.success("Images uploaded successfully!");
      }
    } catch (err) {
      handleAnimateError();
      console.error("Error uploading images:", err);
      toast.error("Failedd to upload images.");
      return;
    }
  };

  const handleSubmit_rest = async (e: any) => {
    e.preventDefault();
    const missingData = uploadedImages.some((img) => !img.locationData);
    if (missingData) {
      toast.error("Please set location data for all images before uploading.");
      handleAnimateError();
      return;
    }
    const formData = new FormData();
    formData.append("images", JSON.stringify(uploadedImages));
    uploadedImages.forEach((image, index) => {
      if (!image.file) return;
      if (!image.locationData?.latitude || !image.locationData?.longitude) {
        toast.error("Location data missing for one or more images.");
        return;
      }
      const ext = image.file.type.split("/")[1];
      const extension = ext === "jpeg" ? "jpg" : ext;

      const uniqueName = `${image.id}.${extension}`;
      formData.append("files", image.file, uniqueName); // use key as filename
    });

    const success = await uploadImages(formData);

    if (success) {
      setUploadedImages([]);
      handleRefreshServerImages();
      toast.success("Images uploaded successfully!");
    } else {
      toast.error("Failed to upload images.");
    }
    handleAnimateError();
  };

  const handleUpdateLocation = (pos: TlocationData, id: string) => {
    setDisplayError(false);
    // toast.success("Location updated!");
    setUploadedImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id ? { ...img, locationData: pos } : img
      )
    );
  };
  const handleDeleteUpload = (id: string) => {
    setUploadedImages((prevImages) =>
      prevImages.filter((img) => img.id !== id)
    );
  };

  //-------------------------------------Animation and Error Handling-------------------------------------
  const controls = useAnimation();
  const [displayError, setDisplayError] = useState(false);
  const handleAnimateError = () => {
    setDisplayError(true);
    controls.start({
      x: [0, -10, 10, -2, 0],
      transition: { duration: 0.4 },
    });
    setTimeout(() => {
      setDisplayError(false);
    }, 1000);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col justify-start gap-1 "
      >
        <div className="h-full ">
          {uploadedImages.length > 0 && <Button type="submit">Upload</Button>}
        </div>

        <motion.div
          animate={controls}
          className="flex flex-row   justify-center  flex-wrap gap-4  "
        >
          {uploadedImages?.map((image) => (
            <div key={image.id} className="">
              {image.converted ? (
                <UploadCard
                  artist={image.artist || null}
                  suburb={image.suburb || ""}
                  image={image}
                  setGlobalLocation={handleUpdateLocation}
                  handleDeleteUpload={handleDeleteUpload}
                  displayError={displayError}
                />
              ) : (
                <LoadingCard />
              )}
            </div>
          ))}
        </motion.div>
      </form>
    </>
  );
};
