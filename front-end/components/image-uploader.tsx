import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { ImgSkeleton } from "./loading-card";

import type { TuploadImage, TuploadImages } from "../src/lib/types";
import { ImageConverter } from "../src/lib/api-utils";
import { motion, useAnimation } from "framer-motion";
import { useLocationContext } from "../src/lib/providers/location-provider";
import { uploadImages } from "../src/lib/server-utils";
// import { useLocationContext } from "@/lib/providers/location-provider";

export const ImageUploader = () => {
  //from context
  const { uploadedImages, setUploadedImages, setMode } = useLocationContext();

  const HandleImageConverter = async (image: TuploadImage) => {
    const convertedImage = await ImageConverter(image);
    if (!convertedImage) return;
    setUploadedImages((prevImages) =>
      prevImages.map((img) => (img.id === image.id ? convertedImage : img))
    );

    // return data;
  };

  const handleImageChange = (e: any) => {
    setMode("explore");
    const files: File[] = Array.from(e.target.files);
    const imagePreviews = files.map((file, index) => {
      const alreadyExists = uploadedImages.some(
        (existingImg) =>
          existingImg.file?.name === file.name &&
          existingImg.file?.size === file.size &&
          existingImg.file?.lastModified === file.lastModified
      );
      if (alreadyExists) {
        toast.error(`Image is already in the upload list`);
        return null;
      }

      if (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/tif"
      ) {
        const id = crypto.randomUUID();
        return {
          id,
          converted: true,
          file,
          // preview: URL.createObjectURL(file),
          locationData: null,
          uploadedAt: new Date().toISOString(),
          capped: false,
          path: URL.createObjectURL(file),
          isOnServer: false,
        };
      } else {
        //file is not jpg, call endpoint and convert
        const id = crypto.randomUUID();
        const convertingImage: TuploadImage = {
          id,
          converted: false,
          file,
          // preview: index.toString(),
          locationData: null,
          path: file.name,
          isOnServer: false,
        };
        HandleImageConverter(convertingImage);

        // return loading placeholder
        return convertingImage;
      }
    });
    setUploadedImages((prevImages) => [
      ...prevImages,
      ...(imagePreviews.filter(Boolean) as TuploadImages),
    ]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadImage = () => {
    fileInputRef.current?.click();
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
      <div className="h-full  ">
        <div className="flex">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            name="file-upload"
            ref={fileInputRef}
            onChange={handleImageChange}
            multiple
            className="hidden"
          />
        </div>
        <motion.div animate={controls} className=" w-45 h-45     ">
          <ImgSkeleton handleUploadImage={handleUploadImage} />
        </motion.div>
      </div>
    </>
  );
};
