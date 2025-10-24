import "./App.css";

import { ImageForm } from "../components/image-form";
import { Button } from "./components/ui/button";
import { useLocationContext } from "./lib/providers/location-provider";
import { GeoMap } from "../components/geo-map";
import { ImageInspector } from "../components/image-inspector";
function App() {
  const { uploadedImages, mode, inspectingImage } = useLocationContext();
  return (
    <div className="flex-col flex justify-start">
      <section className=" absolute inset-0 w-screen h-screen    bg-neutral-950 mb-2 ">
        {mode === "initial" && <SplashScreen />}
        {mode === "explore" && (
          <section>
            {inspectingImage && <ImageInspector />}
            <GeoMap />
          </section>
        )}

        <ItemDebug />
      </section>
      <section className="pointer-events-none  h-screen flex-col items-center w-full flex  z-0   border-white">
        <div className="mt-auto mb-10 pointer-events-auto ">
          <ImageForm />
        </div>
      </section>
    </div>
  );
}

export default App;

export const SplashScreen = () => {
  const { setMode } = useLocationContext();
  return (
    <div
      id="splash-screen"
      className="flex flex-col gap-y-2  h-200 w-full items-center justify-center"
    >
      <div id="splash-contnent" className="flex flex-col items-center gap-y-6">
        <div
          id="splash-text"
          className="flex flex-col text-neutral-10 gap-y-2 max-w-xl items-center text-center px-4"
        >
          <img src="/qr.png" alt="QR code" className="w-30 border mb-4" />

          <h1 className="uppercase text-4xl font-bold text-neutral-50">
            Melbourne Street Project
          </h1>
          {/* <h2 className=" font-bold text-white"> by @VirtuallyAnything.xyz</h2> */}
          <p className="text-sm">
            Explore and contribute to archiving Melbourne's street art. Upload
            images and tag them by location and artist. If you upload from your
            phone, the photo location will be added automatically.
            <p className="text-sm ">
              Accepts all image types, apple .heif images are also supported.
            </p>
            <h2 className=" mt-2  text-fuchsia-500 font-semibold">
              COMING SOON: GAUSSIAN SPLATS!
            </h2>
          </p>
        </div>
        <Button
          onClick={() => {
            setMode("explore");
          }}
          variant="default"
        >
          ENTER
        </Button>
      </div>
    </div>
  );
};

export const ItemDebug = () => {
  const { uploadedImages } = useLocationContext();

  return (
    <div className=" absolute top-4 left-4">
      <ul className="flex flex-col gap-4 text-[7pt]">
        {uploadedImages?.map((img) => {
          return (
            <li key={img.key} className="flex gap-2">
              <div>{img.key.slice(0, 20)}</div>
              <div>{img.artist}</div>
              <div>{img.locationData?.latitude}</div>
              <div>{img.locationData?.longitude}</div>
              <div>{img.suburb}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
