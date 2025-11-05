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
import { getPresignedUrl, uploadImages } from "../src/lib/server-utils";
import { ADD_IMAGES, AddImages, toBase64 } from "../src/lib/gql-utils";
import { useMutation, useQuery } from "@apollo/client/react";

// import { useLocationContext } from "@/lib/providers/location-provider";

export const ImageUploads = () => {
  //from context
  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME!;
  const region = import.meta.env.VITE_AWS_REGION!;
  const { uploadedImages, setUploadedImages, handleRefreshServerImages } =
    useLocationContext();
  // const [addImages, { loading: addLoading, error: addError, data: addData }] =
  //   useMutation<TGQLAddImages, TGQLAddImagesVars>(ADD_IMAGES);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Ensure all images have location data
    const missingData = uploadedImages.some((img) => !img.locationData);
    if (missingData) {
      toast.error("Please set location data for all images before uploading.");
      handleAnimateError();
      return;
    }

    try {
      // Filter out images without files
      const imagesWithFiles = uploadedImages.filter((img) => img.file);
      if (imagesWithFiles.length === 0) {
        toast.error("No valid files to upload.");
        handleAnimateError();
        return;
      }

      // Prepare images for S3 upload
      const preppedImages = imagesWithFiles.map((img) => {
        const ext =
          img.file!.type.split("/")[1] === "jpeg"
            ? "jpg"
            : img.file!.type.split("/")[1];
        const uniqueName = `${img.id}.${ext}`;
        return {
          ...img,
          file: img.file!,
          extension: ext,
          uniqueName,
          path: `uploads/${uniqueName}`, // path in S3
        };
      });

      // toast.success("Images prepared for upload");
      console.log("Prepped images:", preppedImages);

      // Get presigned URLs
      const presignedImages = await Promise.all(
        preppedImages.map(async (img) => {
          console.log(
            "Requesting presigned URL for:",
            img.uniqueName,
            img.file.type
          );

          const { url, key } = await getPresignedUrl(
            img.uniqueName,
            img.file.type
          );
          console.log("Received presigned URL:", url, "and key:", key);
          return { ...img, presignedUrl: url, s3Key: key };
        })
      );

      // Upload to S3 using the presigned URLs
      await Promise.all(
        presignedImages.map(async (img) => {
          if (!(img.file instanceof File)) {
            toast.error("Invalid file type for upload.");
            console.error("img.file is not a File:", img.file);
            return;
          }

          console.log(`Uploading ${img.uniqueName} to S3...`);
          await fetch(img.presignedUrl, {
            method: "PUT",
            headers: { "Content-Type": img.file.type },
            body: img.file, // make sure this is the raw File object
          });
        })
      );

      // Prepare metadata for GraphQL mutation
      const imageMetas = preppedImages.map((img) => ({
        id: img.id,
        artist: img.artist || null,
        suburb: img.suburb || "",
        uploadedAt: img.uploadedAt || new Date().toISOString(),
        capped: img.capped || null,
        locationData: img.locationData!,
        isOnServer: true,
        path: `https://${bucketName}.s3.${region}.amazonaws.com/${img.path}`,
      }));

      console.log("Sending image metadata to server:", imageMetas);
      const response = await AddImages(imageMetas);

      if (!response.success) {
        toast.error(response.message || "Unknown error uploading images.");
        handleAnimateError();
        return;
      }

      setUploadedImages([]);
      handleRefreshServerImages();
      toast.success("Images uploaded successfully!");
    } catch (err) {
      handleAnimateError();
      console.error("Error uploading images:", err);
      toast.error("Failed to upload images.");
    }
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
