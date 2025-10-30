import { useLocationContext } from "../src/lib/providers/location-provider";
import { ArtistModal } from "./artist-modal";
import { ImageCloser } from "./image-closer";
import { LocationModal } from "./location-modal";
import { CappingModal } from "./capping-modal";
import { Button } from "@/components/ui/button";
import type { TlocationData, TuploadImage } from "@/lib/types";
import { toast } from "react-hot-toast";
import { useState } from "react";
import type { p } from "node_modules/framer-motion/dist/types.d-BJcRxCew";
import { useFetchLocation } from "@/lib/hooks/useFetchLocation";
export const ImageInspector = () => {
  const {
    inspectingImage,
    setInspectingImage,
    handleDeleteImage,
    handleUpdateImage,
  } = useLocationContext();

  const handleUpdateLocation = (pos: TlocationData) => {
    toast.success("Location updated to " + JSON.stringify(pos));
    setInspectingImage((prev) => {
      if (!prev) return prev;
      return { ...prev, locationData: pos };
    });

    handleUpdateImage({ locationData: pos }, inspectingImage!.key);
    // setTempLocation(pos);
  };
  useFetchLocation(
    inspectingImage!.key,
    inspectingImage ? inspectingImage.locationData : null,
    "server"
  );
  const handleUpdateArtist = (artist: string | null) => {
    toast.success("Artist updated to " + artist);
    handleUpdateImage({ artist: artist }, inspectingImage!.key);
    setInspectingImage((prev) => {
      if (!prev) return prev;
      return { ...prev, artist: artist };
    });
  };

  const handleUpdateCapping = (iscapped: string | null) => {
    toast.success("Capping status updated to " + iscapped);
    handleUpdateImage({ capped: iscapped }, inspectingImage!.key);
    setInspectingImage((prev) => {
      if (!prev) return prev;
      return { ...prev, capped: iscapped };
    });
  };

  return (
    <div className=" border-0 sm:border border-fuchsia-500 w-full sm:w-100 h-full sm:h-auto pb-2 pointer-events-auto  absolute top-0 sm:top-30 z-600 right-0 sm:right-10  bg-black text-white   overflow-auto">
      {inspectingImage ? (
        <div>
          <ImageCloser
            type="inspector"
            handleClick={() => {
              setInspectingImage(null);
            }}
            ImageKey={inspectingImage.key}
          />
          <img
            src={inspectingImage.preview}
            alt="Image"
            className="w-full h-full "
          />

          <div className="relative flex justify-center gap-4 mx-5   items-center mt-5 sm:mt-2">
            <div className="w-50">
              <ArtistModal
                style="window"
                artist={inspectingImage.artist || null}
                handleSetArtist={handleUpdateArtist}
              />
            </div>
            <div className="w-50 ">
              <LocationModal
                style="window"
                imagekey={inspectingImage.key}
                location={inspectingImage.locationData}
                setGlobalLocation={handleUpdateLocation}
              />
            </div>
            <div className="w-50">
              <CappingModal
                style="window"
                iscapped={inspectingImage.capped || null}
                imagekey={inspectingImage.key!}
                handleSetCapping={handleUpdateCapping}
              />
            </div>
            <Button
              type="button"
              onClick={() => handleDeleteImage(inspectingImage.key)}
            >
              Delete Image
            </Button>
          </div>
        </div>
      ) : (
        <p>No image selected</p>
      )}
    </div>
  );
};
