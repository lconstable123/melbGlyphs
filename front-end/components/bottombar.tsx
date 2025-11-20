import { useLocationContext } from "@/lib/providers/location-provider";
import type { TImages } from "@/lib/types";
import { useEffect } from "react";

export const BottomBar = ({ images }: { images: TImages }) => {
  const { refreshArtistList, artistList, setFilterArtist, handleHardMapReset } =
    useLocationContext();
  useEffect(() => {
    refreshArtistList();
    handleHardMapReset();
  }, []);
  const handleChangeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedArtist = event.target.value;
    setFilterArtist(selectedArtist === "all" ? null : selectedArtist);
  };
  return (
    <div className=" z-100 flex flex-col justify-start  items-center pt-2 pointer-events-auto mt-auto w-screen h-45 sm:h-15  bg-black">
      <select
        onChange={handleChangeFilter}
        className=" border border-white/40 bg-black text-white  w-40 h-7 px-2 py-0 mx-7  text-sm"
      >
        <option value="all" disabled selected>
          Filter by artist
        </option>
        <option value="all">ALL</option>
        {artistList.map((artist, index) => (
          <option key={index} value={artist}>
            {artist}
          </option>
        ))}
      </select>
      {/* <div className="w-full h-20 mt-auto  bg-white/10" /> */}
    </div>
  );
};
