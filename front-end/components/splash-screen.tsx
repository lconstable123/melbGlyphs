import { useLocationContext } from "../src/lib/providers/location-provider";
import { Button } from "../src/components/ui/button";
import { ImageForm2 } from "./image-form-2";
import { cn } from "@/lib/utils";
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
        className="flex flex-col items-center gap-y-10 pointer-events-auto "
      >
        <div className="flex flex-row gap-2">
          <div
            id="splash-text"
            className="flex  flex-col  text-neutral-10 gap-y-2  max-w-screen lg:max-w-[1000px] items-center text-center px-0 lg:px-4"
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
      className={` shrink   w-auto flex items-center justify-center ${
        size === "large" ? "mb-10" : "mb-5 lg:mb-2"
      } gap-0 lg:gap-5`}
    >
      <h1
        className={cn(
          "w-fit   font-bold text-neutral-50",
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
        } -translate-y-2  object-contain basis-1 text-white`}
      />
    </span>
  );
};

const InfoPanel = () => {
  const { setMode } = useLocationContext();
  return (
    <div className="flex flex-col  justify-center items-center  h-screen lg:max-w-400">
      <div className="flex  relative flex-col lg:flex-row  h-full lg:h-90  px-5  items-center rounded-lg    bg-black justify-center">
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
          <Banner size="small" />
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
          <ImageForm2 />
        </div>
      </div>
      {/* <EnterButton /> */}
    </div>
  );
};

const MoreDetails = () => {
  return (
    <div className="flex flex-col items-center gap-2 text-neutral-300  text-center mt-7">
      <p className="text-[9pt] ">
        <span className="font-medium font-bolder">
          Accepts all image types:
        </span>{" "}
        apple .heif images are also supported.
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
