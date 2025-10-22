import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../src/components/ui/dialog";
import { Input } from "../src/components/ui/input";
import { IoMdCloseCircle } from "react-icons/io";
import { Map } from "../components/map";
import { useDebounce } from "../src//lib/hooks";
import { Button } from "../src/components/ui/button";
import { fetchSuburbFromCoords } from "../src/lib/api-utils";
import type { TlocationData, TselectedImages } from "../src/lib/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export const UploadCard = ({
  image,
  setGlobalLocation,
  handleDeleteUpload,
  displayError,
}: {
  image: TselectedImages;
  setGlobalLocation: (pos: TlocationData, id: string) => void;
  handleDeleteUpload: (key: string) => void;
  displayError: boolean;
}) => {
  const location = image.locationData;
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const debouncedSearchText = useDebounce(searchText, 200);
  const [allowSearch, setAllowSearch] = useState<boolean>(true);
  const [localLocation, setLocalLocation] = useState<TlocationData | null>(
    location
  );
  const [suburb, setSuburb] = useState<string>("");

  const handleSetGlobalLocation = (pos: TlocationData) => {
    setGlobalLocation(pos, image.key);
  };

  const handleSetModalLocation = (pos: TlocationData) => {
    if (localLocation === pos) {
      toast.error("Please select a different location");
    }

    setLocalLocation(pos);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAllowSearch(true);
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchSuburb = async () => {
      if (localLocation) {
        const suburb = await fetchSuburbFromCoords(
          localLocation.latitude,
          localLocation.longitude
        );
        if (suburb) {
          setSuburb(suburb);
        }
      }
    };
    fetchSuburb();
  }, [localLocation]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-2  justify-start   "
    >
      <div
        id="image-container"
        className="group relative  rounded-sm overflow-hidden  "
      >
        <div
          id="whitefader"
          className="transition-opacity absolute inset-0 bg-white group-hover:opacity-10 opacity-0"
        />
        <i
          id="close-button"
          className=" absolute top-0 right-0  p-1 rounded-bl-lg z-100  bg-black/90 cursor-pointer"
        >
          <IoMdCloseCircle
            onClick={() => {
              handleDeleteUpload(image.key);
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleDeleteUpload(image.key);
              }
            }}
            role="button"
            className="focus:ring-1 focus:ring-offset-0  hover:scale-110 scale-100 w-5 h-5 drop-shadow shadow-lg "
          />
        </i>

        <img
          src={image.preview as string}
          alt={image.preview}
          className=" w-50 h-50 rounded-md object-cover "
        />
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open && localLocation) {
              handleSetGlobalLocation(localLocation);
              setAllowSearch(false);
            }
            setIsOpen(open);
          }}
        >
          <DialogTrigger className=" cursor-pointer group h-full w-full absolute inset-0  ">
            <div
              className={`${
                location === null
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              } transition-all duration-400 absolute bottom-2 left-1/2  -translate-x-1/2 `}
            >
              <Button size="sm" variant="onImage">
                {location !== null ? "Edit Location" : "Select Location"}
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black h-100 py-10">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription>
                <Input
                  type="text"
                  value={searchText}
                  onChange={(e) => handleSearch(e)}
                  placeholder="Search for a location"
                  className="mb-3"
                />
              </DialogDescription>
              {isOpen && (
                <Map
                  text={debouncedSearchText}
                  handleSetLocation={handleSetModalLocation}
                  startingLocation={location}
                  allowSearch={allowSearch}
                />
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div
        id="location-info"
        className="select-none  text-sm   h-full text-white bg-opacity-75 pb-0 pt-1"
      >
        <div id="location-details" className="flex flex-col items-center">
          <div id="location-suburb" className="font-medium">
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
                {displayError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    className=" text-fuchsia-600"
                  >
                    Please select a location
                  </motion.p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
