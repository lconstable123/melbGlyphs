import { useLocationContext } from "../src/lib/providers/location-provider";
import { Button } from "../src/components/ui/button";

import { cn } from "../src/lib/utils";
import { IoMdCloseCircle } from "react-icons/io";
export const TopBar = () => {
  const { setMode, mode } = useLocationContext();
  return (
    <div
      id="top-bar"
      className={cn(
        "transition-all flex  gap-2 bg-black  px-5 py-2  h-auto text-sm   w-full  items-center justify-center",
        mode === "initial" ? "" : ""
      )}
    >
      <h1 className={cn("   font-bold  text-neutral-50")}>
        Melbourne Street Project
      </h1>
      <span className="flex flex-col sm:flex-row ml-auto text-[9pt]  items-center justify-center gap-0 sm:gap-2 ">
        <h2 className="uppercase underline  ">@VirtuallyAnything.xyz.</h2>
        <p className="font-medium font-bolder">V.0.0.1</p>
      </span>
    </div>
  );
};

const Banner = ({ size }: { size: "small" | "large" }) => {
  return (
    <span
      className={` shrink  w-auto flex items-center justify-center ${
        size === "large" ? "mb-5" : "mb-5 lg:mb-2"
      } gap-0 lg:gap-5`}
    >
      <h1
        className={cn(
          "   font-bold max-w-150  text-neutral-50",
          size === "large" ? "text-5xl  leading-15 " : "text-3xl"
        )}
      >
        Melbourne Street Project
      </h1>
      <img
        src="/spray_1.svg"
        alt="Spray can"
        className={`${
          size === "large" ? "w-15" : "w-8"
        } -translate-y-2 rotate-5  object-contain basis-1 text-white`}
      />
    </span>
  );
};

const InfoPanel = () => {
  const { setMode } = useLocationContext();
  return (
    <div className="flex flex-col   justify-center items-center  h-screen lg:max-w-400">
      <div className="flex  relative border-3 border-neutral-700 flex-col lg:flex-row  h-full lg:h-auto px-10 py-10  items-center rounded-lg    bg-black justify-center">
        <IoMdCloseCircle
          className="absolute top-4 right-4 w-10 h-10 cursor-pointer"
          onClick={() => setMode("explore")}
        />
        <img
          src="/qr.png"
          alt="QR code"
          className="hidden lg:block h-45 w-45 aspect-square object-contain "
        />
        <div className="p-5  ">
          <Banner size="large" />
          <span className="flex  items-center justify-center gap-2 mb-2">
            <h2 className="uppercase underline color-emphasis ">
              @VirtuallyAnything.xyz.
            </h2>
            <p className="font-medium font-bolder">V.0.0.1</p>
          </span>

          <p className="text-sm  ">
            Explore and contribute to archiving Melbourne's street art. Upload
            and tag by location and artist.
          </p>
          <MoreDetails />
        </div>
        <div className="flex items-center justify-center   ">
          {/* <img
            src="/qr.png"
            alt="QR code"
            className="block lg:hidden h-45 aspect-square object-contain border "
          /> */}
          {/* <ImageForm2 /> */}
        </div>
      </div>
      {/* <EnterButton /> */}
    </div>
  );
};

const MoreDetails = () => {
  return (
    <div className="flex text-sm     flex-col items-center gap-2 text-neutral-300  text-center mt-7">
      <p className="">
        <span className="">Accepts all image types:</span> apple .heif images
        are also supported.
      </p>
      <div className="flex flex-wrap   items-center gap-2 justify-center">
        <img
          src="/3d.svg"
          alt="Spray can"
          className="w-7  object-contain  text-white"
        />
        <h2 className="  color-emphasis font-semibold">
          COMING SOON: GAUSSIAN SPLATS!
        </h2>
        <img
          src="/3d.svg"
          alt="Spray can"
          className="w-7   object-contain  text-white"
        />
      </div>
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
