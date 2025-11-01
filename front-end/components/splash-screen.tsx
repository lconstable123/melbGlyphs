import { useLocationContext } from "../src/lib/providers/location-provider";
import { Button } from "../src/components/ui/button";
import { ImageUploader } from "./image-uploader";
import { cn } from "../src/lib/utils";
import { IoMdCloseCircle } from "react-icons/io";
export const SplashScreen = () => {
  const { setMode, mode } = useLocationContext();
  return (
    <div
      id="splash-screen"
      className={cn(
        "transition-all flex flex-col gap-y-2    w-full  items-center justify-center",
        mode === "initial"
          ? "bg-black/60 h-full"
          : "bg-black-0 h-full lg:h-auto"
      )}
    >
      <div
        id="splash-contnent"
        className="flex flex-col items-center gap-y-10  "
      >
        <div className="flex flex-row gap-2">
          <div
            id="splash-text"
            className="flex   flex-col pointer-events-none select-none  text-neutral-10 gap-y-2  max-w-screen lg:max-w-[1300px] items-center text-center px-0 lg:px-4"
          >
            <InfoPanel />

            {/* <MoreDetails /> */}
          </div>
        </div>
      </div>
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
          "   font-bold max-w-150 color-emphasis ",
          size === "large"
            ? "text-4xl leading-11 sm:text-5xl  sm:leading-15 "
            : "text-3xl"
        )}
      >
        Melbourne Street Project
      </h1>
      <img
        src="/spray_1.svg"
        alt="Spray can"
        className={`${
          size === "large" ? "w-12 sm:w-15" : "w-8"
        } -translate-y-2 rotate-5  object-contain basis-1 text-white`}
      />
    </span>
  );
};

const InfoPanel = () => {
  const { setMode } = useLocationContext();
  return (
    <div className="flex flex-col   justify-center items-center  h-screen lg:max-w-400">
      <div className="flex pointer-events-auto  relative border-3 border-neutral-700 flex-col lg:flex-row  h-full lg:h-auto px-3 py-10  items-center rounded-lg bg-saImg     justify-center">
        <IoMdCloseCircle
          className="absolute top-4 right-4 w-10 h-10 cursor-pointer"
          onClick={() => setMode("explore")}
        />
        <img
          src="/qr.png"
          alt="QR code"
          className="hidden lg:block h-45 w-45 aspect-square object-contain "
        />
        <div className="p-5 text-neutral-300  ">
          <Banner size="large" />
          <span className="flex  items-center justify-center gap-2 mb-2">
            <h2 className="uppercase underline  ">@VirtuallyAnything.xyz.</h2>
            <p className="font-medium font-bolder">V.0.0.1</p>
          </span>

          <p className="text-[8pt] sm:text-sm  ">
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
          <ImageUploader />
        </div>
      </div>
      {/* <EnterButton /> */}
    </div>
  );
};

const MoreDetails = () => {
  return (
    <div className="flex text-[8pt] sm:text-sm     flex-col items-center gap-2 text-neutral-300 text-center mt-3 sm:mt-7">
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
