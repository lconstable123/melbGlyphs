import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { UploadCard } from "./upload-card";
import { ImgSkeleton, LoadingCard } from "./loading-card";
import { Button } from "@/components/ui/button";
import type { TlocationData, TselectedImages } from "@/lib/types";
import { ImageConverter } from "@/lib/api-utils";
import { motion, useAnimation } from "framer-motion";

export const ImageForm = () => {
  const controls = useAnimation();
  const [displayError, setDisplayError] = useState(false);
  const handleAnimateError = () => {
    setDisplayError(true);
    controls.start({
      x: [0, -10, 10, -2, 0],
      transition: { duration: 0.4 },
    });
  };

  const [images, setSelectedImages] = useState<TselectedImages[]>([]);

  const handleUpdateLocation = (pos: TlocationData, key: string) => {
    setDisplayError(false);
    setSelectedImages((prevImages) =>
      prevImages.map((img) =>
        img.key === key ? { ...img, locationData: pos } : img
      )
    );
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleAnimateError();
  };
  const handleDeleteUpload = (key: string) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((img) => img.key !== key)
    );
  };
  const HandleImageConverter = async (image: TselectedImages) => {
    const convertedImage = await ImageConverter(image);
    if (!convertedImage) return;
    setSelectedImages((prevImages) =>
      prevImages.map((img) => (img.key === image.key ? convertedImage : img))
    );

    // return data;
  };

  const handleImageChange = (e: any) => {
    const files: File[] = Array.from(e.target.files);
    const imagePreviews = files.map((file, index) => {
      const alreadyExists = images.some(
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

        const convertingImage: TselectedImages = {
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
    setSelectedImages((prevImages) => [
      ...prevImages,
      ...(imagePreviews.filter(Boolean) as TselectedImages[]),
    ]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col justify-start gap-1"
      >
        {/* <p className="flex justify-center items-center h-3 text-sm text-fuchsia-600">
          upload at least one image
        </p> */}

        <div className="h-full">
          {images.length > 0 && <Button type="submit">Upload</Button>}
        </div>
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
        <motion.div
          animate={controls}
          className="flex flex-row-reverse justify-center  flex-wrap gap-2  "
        >
          <ImgSkeleton handleUploadImage={handleUploadImage} />

          {images?.map((image) => (
            <div key={image.key} className="">
              {image.converted ? (
                <UploadCard
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
