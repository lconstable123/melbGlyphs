import { IoMdCloseCircle } from "react-icons/io";
import { fetchSuburbFromCoords } from "../src/lib/api-utils";
import type { TlocationData, TuploadImage } from "../src/lib/types";
import { useEffect } from "react";
import { LocationModal } from "./location-modal";
import { ArtistModal } from "./artist-modal";
import { motion, useAnimation } from "framer-motion";
import { useLocationContext } from "@/lib/providers/location-provider";
import { toast } from "react-hot-toast";
import { ImageCloser } from "./image-closer";
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

  const handleSetUploadedSuburb = (suburb: string) => {
    setUploadedImages((previmages) =>
      previmages.map((img) =>
        img.key === image.key ? { ...img, suburb: suburb } : img
      )
    );
  };
  const handleSetUploadedArtist = (artist: string | null) => {
    setUploadedImages((previmages) =>
      previmages.map((img) =>
        img.key === image.key ? { ...img, artist: artist } : img
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

  useEffect(() => {
    // toast.success("suburb finding...");
    const fetchSuburb = async () => {
      if (location) {
        const suburb = await fetchSuburbFromCoords(
          location.latitude,
          location.longitude
        );
        if (suburb) {
          handleSetUploadedSuburb(suburb);
        }
      }
    };
    fetchSuburb();
  }, [location]);

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
      className="flex flex-col gap-2 justify-start   "
    >
      <div
        id="image-container"
        className="group relative  rounded-sm overflow-hidden  "
      >
        <div
          id="whitefader"
          className="transition-opacity absolute inset-0 bg-white group-hover:opacity-10 opacity-0"
        />

        <ImageCloser
          handleClick={() => handleDeleteUpload(image.key)}
          ImageKey={image.key}
        />

        <img
          src={image.preview as string}
          alt={image.preview}
          className=" w-50 h-50 rounded-md object-cover "
        />
        <LocationModal
          setGlobalLocation={setGlobalLocation}
          Imagekey={image.key}
          location={location}
        />
      </div>
      <div
        id="location-info"
        className="select-none  text-sm   h-full text-white bg-opacity-75 pb-0 pt-1"
      >
        <div id="location-details" className="flex flex-col   items-center">
          <ArtistModal
            Imagekey={image.key}
            artist={artist}
            handleSetArtist={handleSetUploadedArtist}
          />
          <div id="location-suburb" className="font-medium pt-2">
            {suburb}
          </div>
          <div
            id="location-coordinates"
            className="flex text-white/80 text-[9pt] gap-1 "
          >
            {location !== null ? (
              <>
                <p>({location.latitude.toFixed(6)},</p>
                <p>{location.longitude.toFixed(6)})</p>
              </>
            ) : (
              <div className="text-sm flex flex-col items-center">
                <p>No location data available</p>

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
