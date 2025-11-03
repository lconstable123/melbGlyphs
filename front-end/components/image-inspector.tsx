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
    // toast.success("Artist updated to " + artist);
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
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL!;
  const absoluteUrl = inspectingImage!.isOnServer
    ? `${VITE_SERVER_URL}${inspectingImage!.path}`
    : inspectingImage!.path;

  return (
    <div className=" border-0 sm:border-3 border-fuchsia-500 w-full sm:w-150  h-full    pointer-events-auto  ml-auto  z-600  bg-black text-white  ">
      {inspectingImage ? (
        <div className="flex flex-col   relative w-full h-full   items-center justify-between gap-4 p-4 ">
          <ImageCloser
            type="inspector"
            handleClick={() => {
              setInspectingImage(null);
            }}
            ImageKey={inspectingImage.id}
          />
          <div className="relative w-full overflow-hidden  bg-black h-full">
            <img
              src={absoluteUrl}
              alt="Image"
              className="absolute w-full object-cover p-10 h-full "
            />
          </div>
          <div>
            <div>
              <h2 className="text-2xl font-semibold mt-2">Edit Details</h2>
            </div>

            <div className=" border border-fuchsia-500 rounded-xl relative flex flex-wrap justify-center gap-4 p-2 mx-10   items-center mt-10 sm:mt-2">
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
    </div>
  );
};
