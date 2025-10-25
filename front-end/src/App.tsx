import "./App.css";

import { ImageForm } from "../components/image-form";
import { Button } from "./components/ui/button";
import { SplashScreen } from "../components/splash-screen";
import { useLocationContext } from "./lib/providers/location-provider";
import { GeoMap } from "../components/geo-map";
import { ImageInspector } from "../components/image-inspector";
import { ImageUploads } from "../components/image-uploads";
import { AddImage } from "../components/add-image";
import { cn } from "./lib/utils";
function App() {
  const { uploadedImages, mode, inspectingImage } = useLocationContext();
  return (
    <div className="flex-col flex justify-start">
      <section className="overflow-hidden select-none pointer-events-none  absolute inset-0 w-screen h-screen z-30    ">
        <AddImage />
        <div
          className={cn(
            "transition-all duration-500",
            mode !== "upload" ? "-translate-x-full" : "translate-x-0"
          )}
        >
          <SplashScreen />
        </div>
      </section>
      <section className=" absolute inset-0 w-screen h-screen     mb-2 ">
        {mode === "explore" && (
          <section>{inspectingImage && <ImageInspector />}</section>
        )}
        <GeoMap />

        <ItemDebug />
      </section>
      <section className="pointer-events-none  h-screen flex-col items-center w-full flex  z-0   border-white">
        <div className="mt-auto mb-5 pointer-events-auto ">
          <ImageUploads />
        </div>
      </section>
    </div>
  );
}

export default App;

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
