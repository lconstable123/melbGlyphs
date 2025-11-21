import { useLocationContext } from "../src/lib/providers/location-provider";
import { Button } from "../src/components/ui/button";
import { ImageUploader } from "./image-uploader";
import { cn } from "../src/lib/utils";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "react-hot-toast";
export const SplashScreen = () => {
  const { setMode, mode, fontsLoaded } = useLocationContext();
  return (
    <>
      <div
        id="splash-screen"
        className={cn(
          "transition-all flex flex-col w-full h-screen items-center justify-center",
          mode === "initial"
            ? "bg-black/60 h-full"
            : "bg-black-0 h-full lg:h-auto"
        )}
      >
        <InfoPanel />
      </div>
    </>
  );
};

const Banner = ({ size }: { size: "small" | "large" }) => {
  return (
    <span
      className={` shrink  w-auto flex items-center justify-center ${
        size === "large" ? "mb-5 sm:mb-4" : "mb-2 lg:mb-0"
      } gap-0 lg:gap-5`}
    >
      <h2
        className={cn(
          "   font-bold max-w-150 color-emphasis ",
          size === "large"
            ? "text-5xl leading-10  sm:text-4xl  sm:leading-8 "
            : "text-2xl"
        )}
      >
        Melbourne Street Project
      </h2>
    </span>
  );
};

const InfoPanel = () => {
  const { setMode, fontsLoaded } = useLocationContext();
  return (
    <div
      onClick={() => setMode("explore")}
      className={cn(
        "transition-opacity duration-700 flex flex-col justify-center items-center h-screen w-screen",
        !fontsLoaded ? "opacity-0" : "opacity-100"
      )}
    >
      <div className="flex pointer-events-auto gap-x-5  relative flex-col w-full sm:w-auto lg:flex-row h-screen sm:h-auto px-10 py-10 items-center bg-saImg justify-center">
        <IoMdCloseCircle
          className="visible sm:invisible  absolute top-2 right-2 w-10 h-10 cursor-pointer"
          onClick={() => setMode("explore")}
        />
        <div className="max-w-80 p-1 text-neutral-300 flex justify-center gap-y-2 items-center flex-col mb-5   ">
          <Banner size="large" />
          <p className="text-sm">
            Explore and contribute to archiving Melbourne's street art.
          </p>
          <p className="text-[9pt] text-neutral-400">
            Accepts all image types: apple .heif images are also supported.
          </p>
        </div>
        <div className="flex items-center justify-center   ">
          <ImageUploader />
        </div>
        <div className="visible sm:invisible w-full sm:w-0 h-20 sm:h-0   " />
      </div>
    </div>
  );
};

const MoreDetails = () => {
  return (
    <div className="flex text-[9pt] flex-col items-center gap-1 text-neutral-400 text-center mt-2  sm:mb-0 sm:mt-5">
      <p className="">
        Accepts all image types: apple .heif images are also supported.
      </p>
    </div>
  );
};

const EnterButton = () => {
  const { setMode } = useLocationContext();
  return (
    <div className=" w-full h-15   ">
      <Button
        className="w-full h-full bg-amber-300 rounded-none text-black text-4xl font-bold"
        onClick={() => {
          setMode("explore");
        }}
        variant="default"
      >
        <p className="text-4xl font-bold">EXPLORE</p>
      </Button>
    </div>
  );
};
