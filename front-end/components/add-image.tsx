import { useLocationContext } from "@/lib/providers/location-provider";

import { RiAddLargeFill } from "react-icons/ri";
export const AddImage = () => {
  const { setMode, mode } = useLocationContext();
  return (
    <div
      onClick={() => {
        setMode("upload");
      }}
      className={`transition-all duration-500 ${
        mode !== "upload" ? "translate-x-0" : "-translate-x-full"
      }         group fixed left-0 top-30 z-50 w-17 h-17 border-2 bg-black border-neutral-800 rounded-r-full`}
    >
      <i
        id="close-button"
        className="pointer-events-auto z-100  w-full h-full flex flex-col justify-center pl-4 cursor-pointer"
      >
        <RiAddLargeFill
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setMode("upload");
            }
          }}
          role="button"
          className="focus:ring-1 text-black focus:ring-offset-0 rounded-full bg-white w-9 h-9 p-05 shadow-lg "
        />
      </i>
    </div>
  );
};
