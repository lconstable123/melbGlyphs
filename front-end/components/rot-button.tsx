import { useLocationContext } from "@/lib/providers/location-provider";
import { MdOutlineFlipCameraAndroid } from "react-icons/md";
import { RiAddLargeFill } from "react-icons/ri";
export const RotateButton = () => {
  const { setMode, mode, handleMapBearing } = useLocationContext();
  return (
    <div
      onClick={() => {
        // setMode("upload");
        handleMapBearing();
      }}
      className={`transition-all duration-500 ${
        mode !== "upload" ? "translate-x-0" : "-translate-x-full"
      }       group fixed left-0 top-50 z-50 w-17 h-17  bg-black border-neutral-800 rounded-r-full`}
    >
      <i
        id="close-button"
        className="pointer-events-auto z-100  w-full h-full flex flex-col justify-center pl-4 cursor-pointer "
      >
        <div className="rounded-full w-9 h-9 bg-white">
          <MdOutlineFlipCameraAndroid
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                // setMode("upload");
              }
            }}
            role="button"
            className="focus:ring-1 rounded-full text-black focus:ring-offset-0 w-full h-full scale-80  p-05 shadow-lg "
          />
        </div>
      </i>
    </div>
  );
};
