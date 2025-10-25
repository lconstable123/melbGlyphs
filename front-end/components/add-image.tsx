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
      }         group fixed left-0 top-10 z-50 w-25 h-25 border bg-black rounded-r-full`}
    >
      <i
        id="close-button"
        className="pointer-events-auto z-100  w-full h-full flex flex-col justify-center pl-5 cursor-pointer"
      >
        <RiAddLargeFill
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setMode("upload");
            }
          }}
          role="button"
          className="focus:ring-1 text-black focus:ring-offset-0 rounded-full bg-white w-15 h-15 p-1 shadow-lg "
        />
      </i>
    </div>
  );
};
