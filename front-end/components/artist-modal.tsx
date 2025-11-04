import { Input } from "../src/components/ui/input";

// import { artists } from "../src/lib/data";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  // SelectValue,
} from "../src/components/ui/select";

import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GET_ARTISTS } from "@/lib/gql-utils";
import type { TGQLGetArtists } from "@/lib/types";
import { useQuery } from "@apollo/client/react";
import { useLocationContext } from "@/lib/providers/location-provider";

export const ArtistModal = ({
  artist,
  handleSetArtist,
  style = "outside",
}: {
  // Imagekey: string;
  artist: string | null;
  handleSetArtist: (artist: string | null) => void;
  style: "outside" | "window";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { refreshArtistList, artistList } = useLocationContext();
  // const { data, loading, error, refetch } =
  //   useQuery<TGQLGetArtists>(GET_ARTISTS);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        refreshArtistList();
        if (!open && artist) {
          handleSetArtist(artist);
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger
        className={cn(
          "bg-black rounded-md   cursor-pointer group h-full w-full *:**:not-[]:l   ",
          "hover-outline  focus-visible:outline-none focus-visible:ring-1"
        )}
      >
        <p
          className={`
             transition-all duration-400 text-sm  px-2 py-1 rounded-md  `}
        >
          {/* <Button size="sm" variant="onImage" accessability={false}> */}
          {artist !== null ? artist : "Tag Artist"}
          {/* </Button> */}
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black   py-10">
        <DialogHeader>
          <DialogTitle className=" text-sm flex justify-between">
            <p className="select-none">Tag an artist</p>
            <p
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="select-none cursor-pointer"
            >
              Search
            </p>
          </DialogTitle>
          <DialogDescription>
            <div className="relative">
              <Input
                type="text"
                aria-label="Artist-dropdown-button"
                value={artist || ""}
                onChange={(e) => handleSetArtist(e.target.value)}
                placeholder="Add Artist"
                className="relative border-0!  z-1000"
              />
              <button
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsDropdownOpen(!isDropdownOpen);
                  }
                }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus-visible:outline-none focus-visible:ring-1 rounded-r-lg pr-2   flex justify-end  items-center absolute right-0 w-60   
                z-2000 h-full top-0  opacity-70"
              >
                <ChevronDownIcon className="size-4" />
              </button>

              <Select
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
                value={artist ? artist : ""}
                onValueChange={(value) => {
                  handleSetArtist(value);
                }}
              >
                <SelectTrigger className="absolute w-full h-full "></SelectTrigger>
                <SelectContent
                  position="popper"
                  align="start"
                  className=" max-h-60  overflow-y-auto"
                >
                  {artistList.map((artist, index) => (
                    <SelectItem
                      key={artist + index}
                      value={artist}
                      onClick={() => {
                        handleSetArtist(artist);
                      }}
                    >
                      {artist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
