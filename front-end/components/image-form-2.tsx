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
// import { useLocationContext } from "@/lib/providers/location-provider";

export const ImageForm2 = () => {
  //from context
  const { uploadedImages, setUploadedImages, setMode } = useLocationContext();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    toast.success("Images uploaded successfully!");
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

  const HandleImageConverter = async (image: TuploadImage) => {
    const convertedImage = await ImageConverter(image);
    if (!convertedImage) return;
    setUploadedImages((prevImages) =>
      prevImages.map((img) => (img.key === image.key ? convertedImage : img))
    );

    // return data;
  };

  const handleImageChange = (e: any) => {
    setMode("explore");
    const files: File[] = Array.from(e.target.files);
    const imagePreviews = files.map((file, index) => {
      const alreadyExists = uploadedImages.some(
        (existingImg) =>
          existingImg.file.name === file.name &&
          existingImg.file.size === file.size &&
          existingImg.file.lastModified === file.lastModified
      );
      if (alreadyExists) {
        toast.error(`Image is already in the upload list`);
        return null;
      }

      if (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg"
      ) {
        return {
          key: file.name + crypto.randomUUID(),
          converted: true,
          file,
          preview: URL.createObjectURL(file),
          locationData: null,
        };
      } else {
        //file is not jpg, call endpoint and convert

        const convertingImage: TuploadImage = {
          key: file.name + crypto.randomUUID(),
          converted: false,
          file,
          preview: index.toString(),
          locationData: null,
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
      <form onSubmit={handleSubmit} className="h-full  ">
        {/* <div className="h-full ">
          {uploadedImages.length > 0 && <Button type="submit">Upload</Button>}
        </div> */}
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
      </form>
    </>
  );
};
