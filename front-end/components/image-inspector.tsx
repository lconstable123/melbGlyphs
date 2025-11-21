import { useLocationContext } from "../src/lib/providers/location-provider";
import { ArtistModal } from "./artist-modal";
import { ImageCloser } from "./image-closer";
import { LocationModal } from "./location-modal";
import { CappingModal } from "./capping-modal";
import { Button } from "../src/components/ui/button";
import type { TlocationData, TuploadImage } from "../src/lib/types";
import { toast } from "react-hot-toast";
import { useState } from "react";
// import type { p } from "node_modules/framer-motion/dist/types.d-BJcRxCew";
import { useFetchLocation } from "../src/lib/hooks/useFetchLocation";
import { motion } from "framer-motion";
export const ImageInspector = () => {
  const {
    inspectingImage,
    setInspectingImage,
    handleDeleteImage,
    handleUpdateImage,
  } = useLocationContext();

  const handleUpdateLocation = (pos: TlocationData) => {
    setInspectingImage((prev) => {
      if (!prev) return prev;
      return { ...prev, locationData: pos };
    });

    handleUpdateImage({ locationData: pos }, inspectingImage!.id);
  };
  useFetchLocation(
    inspectingImage!.id,
    inspectingImage ? inspectingImage.locationData : null,
    "server"
  );
  const handleUpdateArtist = (artist: string | null) => {
    handleUpdateImage({ artist: artist }, inspectingImage!.id);
    setInspectingImage((prev) => {
      if (!prev) return prev;
      return { ...prev, artist: artist };
    });
  };

  const handleUpdateCapping = (iscapped: string | null) => {
    // toast.success("Capping status updated to " + iscapped);
    handleUpdateImage({ capped: iscapped }, inspectingImage!.id);
    setInspectingImage((prev) => {
      if (!prev) return prev;
      return { ...prev, capped: iscapped };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="  border border-white/50 w-full sm:w-150  h-full    pointer-events-auto  ml-auto  z-600  bg-black text-white  "
    >
      {inspectingImage ? (
        <div className="flex flex-col   relative w-full h-full   items-center justify-start gap-2 p-2 ">
          <ImageCloser
            type="inspector"
            handleClick={() => {
              setInspectingImage(null);
            }}
            ImageKey={inspectingImage.id}
          />
          <div className="relative w-full overflow-hidden  bg-black h-full">
            <img
              src={inspectingImage.path}
              alt="Image"
              className="absolute w-full object-cover p-0 h-full "
            />
          </div>
          <div className=" ">
            {/* <div>
              <p className="text-sm text-white/40 font-semibold mt-0">
                Edit Details
              </p>
            </div> */}

            <div className="  border-fuchsia-500 rounded-xl relative flex flex-wrap justify-center gap-2 p-0 mx-10   items-center mt-1">
              <div className="w-auto">
                <ArtistModal
                  style="window"
                  artist={inspectingImage.artist || null}
                  handleSetArtist={handleUpdateArtist}
                />
              </div>
              <div className="w-auto ">
                <LocationModal
                  style="window"
                  imagekey={inspectingImage.id}
                  location={inspectingImage.locationData}
                  setGlobalLocation={handleUpdateLocation}
                  suburb={inspectingImage.suburb || null}
                />
              </div>
              <div className="w-auto">
                <CappingModal
                  style="window"
                  iscapped={inspectingImage.capped || null}
                  imagekey={inspectingImage.id!}
                  handleSetCapping={handleUpdateCapping}
                />
              </div>
              <div className="w-auto">
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => handleDeleteImage(inspectingImage.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No image selected</p>
      )}
    </motion.div>
  );
};
