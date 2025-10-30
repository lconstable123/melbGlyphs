import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { UploadCard } from "./upload-card";
import { ImgSkeleton, LoadingCard } from "./loading-card";
import { Button } from "../src/components/ui/button";
import type {
  TlocationData,
  TuploadImage,
  TuploadImages,
} from "../src/lib/types";
import { ImageConverter } from "../src/lib/api-utils";
import { motion, useAnimation } from "framer-motion";
import { useLocationContext } from "../src/lib/providers/location-provider";
import { uploadImages } from "../src/lib/server-utils";
// import { useLocationContext } from "@/lib/providers/location-provider";

export const ImageUploads = () => {
  //from context
  const { uploadedImages, setUploadedImages, handleRefreshServerImages } =
    useLocationContext();

  const handleSubmit = async (e: any) => {
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

      const uniqueName = `${image.key}.${extension}`;
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

  const handleUpdateLocation = (pos: TlocationData, key: string) => {
    setDisplayError(false);
    setUploadedImages((prevImages) =>
      prevImages.map((img) =>
        img.key === key ? { ...img, locationData: pos } : img
      )
    );
  };
  const handleDeleteUpload = (key: string) => {
    setUploadedImages((prevImages) =>
      prevImages.filter((img) => img.key !== key)
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
            <div key={image.key} className="">
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
