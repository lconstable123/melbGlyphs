import { Input } from "../src/components/ui/input";
// import { IoMdCloseCircle } from "react-icons/io";
import { Map } from "./map";
import { useDebounce } from "../src/lib/hooks";
import { Button } from "../src/components/ui/button";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../src/components/ui/dialog";
import type { TlocationData } from "../src/lib/types";
import toast from "react-hot-toast";

export const LocationModal = ({
  location,
  setGlobalLocation,
  imagekey,
  style = "outside",
}: {
  location: TlocationData | null;

  setGlobalLocation: (pos: TlocationData, id: string) => void;
  imagekey: string;
  style: "outside" | "window";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const debouncedSearchText = useDebounce(searchText, 200);
  const [allowSearch, setAllowSearch] = useState<boolean>(true);
  const [localLocation, setLocalLocation] = useState<TlocationData | null>(
    location
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAllowSearch(true);
    setSearchText(e.target.value);
  };

  const handleSetGlobalLocation = (pos: TlocationData) => {
    // toast.success("Location updated!");

    setGlobalLocation(pos, imagekey);
  };

  const handleSetModalLocation = (pos: TlocationData) => {
    // toast.success("local Location updated!");
    setLocalLocation(pos);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        toast.success(
          open ? "Opened location selector" : "Closed location selector"
        );
        if (!open && localLocation) {
          handleSetGlobalLocation(localLocation);
          setAllowSearch(false);
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" cursor-pointer group h-full w-full  "
      >
        <div
          className={`
           hover-outline rounded-lg outline-fuchsia-500/40
          `}
        >
          <Button role="button" type="button" size="sm" variant="onImage">
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
  );
};
