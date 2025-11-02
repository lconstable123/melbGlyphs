// import { fetchSuburbFromCoords } from "../src/lib/api-utils";
import type { TlocationData, TuploadImage } from "../src/lib/types";
import { useEffect } from "react";
import { LocationModal } from "./location-modal";
import { ArtistModal } from "./artist-modal";
import { motion, useAnimation } from "framer-motion";
import { useLocationContext } from "@/lib/providers/location-provider";

import { ImageCloser } from "./image-closer";
import { cn } from "@/lib/utils";
import { useFetchLocation } from "@/lib/hooks/useFetchLocation";
export const UploadCard = ({
  image,
  setGlobalLocation,
  handleDeleteUpload,
  displayError,
  artist,
  suburb,
}: {
  image: TuploadImage;
  setGlobalLocation: (pos: TlocationData, id: string) => void;
  handleDeleteUpload: (key: string) => void;
  displayError: boolean;
  artist: string | null;
  suburb: string | null;
}) => {
  const { setUploadedImages } = useLocationContext();
  const location = image.locationData;

  const errorControls = useAnimation();
  useFetchLocation(image.id, location, "upload");

  const handleSetUploadedArtist = (artist: string | null) => {
    setUploadedImages((previmages) =>
      previmages.map((img) =>
        img.id === image.id ? { ...img, artist: artist } : img
      )
    );
  };

  const handleAnimateError = () => {
    errorControls.start({
      opacity: [0, 1],
      transition: { duration: 0.2 },
    });

    setTimeout(async () => {
      await errorControls.start({
        opacity: [1, 0],
        transition: { duration: 0.2 },
      });
    }, 2000);
  };
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL!;
  const absoluteUrl = image.isOnServer
    ? `${VITE_SERVER_URL}${image.path}`
    : image.path;

  useEffect(() => {
    if (displayError) {
      handleAnimateError();
    }
  }, [displayError]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-2 w-50 justify-start   "
    >
      <div
        id="image-container"
        className="group relative border border-fuchsia-500 h-50  rounded-sm overflow-hidden  "
      >
        <div
          id="whitefader"
          className="transition-opacity absolute inset-0 bg-white group-hover:opacity-10 opacity-0"
        />

        <ImageCloser
          handleClick={() => handleDeleteUpload(image.id)}
          ImageKey={image.id}
        />

        <img
          src={absoluteUrl}
          alt={image.path}
          className="select-none w-50 h-50 rounded-md object-cover "
        />
        <div
          className={cn(
            "absolute inset-0 transition-all duration-400   ",
            image.locationData === null
              ? "opacity-100 "
              : "opacity-0 group-hover:opacity-100"
          )}
        >
          <div className="absolute bottom-2 left-1/2  -translate-x-1/2">
            <LocationModal
              style="outside"
              setGlobalLocation={setGlobalLocation}
              imagekey={image.id}
              location={location}
              suburb={suburb}
            />
          </div>
        </div>
      </div>
      <div
        id="location-info"
        className="select-none  text-sm   h-full text-white bg-opacity-75 pb-0 pt-0"
      >
        <div id="location-details" className="flex flex-col   items-center">
          <ArtistModal
            style="outside"
            artist={artist}
            handleSetArtist={handleSetUploadedArtist}
          />
          {/* <p id="location-suburb" className="font-medium pt-2">
            {suburb}
          </p> */}
          <div
            id="location-coordinates"
            className="flex text-white/80 text-[7pt] gap-0 pt-2 "
          >
            {location !== null ? (
              <>
                <p>({location.latitude.toFixed(6)},</p>
                <p>{location.longitude.toFixed(6)})</p>
              </>
            ) : (
              <div className="text-sm flex flex-col items-center">
                <p className="text-[7pt] ">No location data available</p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={errorControls}
                  className=" text-fuchsia-600"
                >
                  Please select a location
                </motion.p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
