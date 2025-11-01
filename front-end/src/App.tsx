import "./App.css";

import { SplashScreen } from "../components/splash-screen";
import { useLocationContext } from "./lib/providers/location-provider";
import { GeoMap } from "../components/geo-map";
import { ImageInspector } from "../components/image-inspector";
import { ImageUploads } from "../components/image-uploads";
import { AddImage } from "../components/add-image";
import { TopBar } from "../components/topbar";
import { cn } from "./lib/utils";
function App() {
  const { uploadedImages, mode, inspectingImage, allImages } =
    useLocationContext();
  return (
    <div className="flex-col flex justify-start">
      <section className="overflow-hidden select-none pointer-events-none  absolute inset-0 w-screen h-screen z-30    ">
        <TopBar />
        {/* <ItemDebug /> */}
        <AddImage />
        {mode === "explore" && (
          <section className="relative  w-full h-full">
            {inspectingImage && <ImageInspector />}
          </section>
        )}
        <div
          className={cn(
            "transition-all duration-500",
            mode !== "upload" ? "-translate-x-full" : "translate-x-0"
          )}
        >
          <SplashScreen />
        </div>
      </section>
      <section className=" absolute inset-0 w-screen h-full     mb-2 ">
        <GeoMap />
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
  const { uploadedImages, allImages, serverImages } = useLocationContext();

  return (
    <div className="pointer-events-auto select-all w-full h-20  absolute top-50 left-4 z-500">
      <ul className="flex flex-col gap-4 text-[7pt] text-left">
        <p>Server Images</p>
        {serverImages?.map((img) => {
          // console.log(img.preview);
          return (
            <li key={img.id} className="flex gap-2">
              {/* <div>{img.key.slice(0, 20)}</div> */}
              <div>{img.artist}</div>
              <div>{img.locationData?.latitude}</div>
              <div>{img.locationData?.longitude}</div>
              <div>{img.suburb}</div>
              {/* <div>{img.preview}</div> */}
              <div>{img.path}</div>
              <div>{img.capped}</div>
            </li>
          );
        })}
      </ul>
      <ul className="flex flex-col gap-4 text-[7pt] text-left mt-10">
        <p>Uploading Images</p>
        {uploadedImages?.map((img) => {
          // console.log(img.preview);
          return (
            <li key={img.id} className="flex gap-2">
              <div>{img.id.slice(0, 20)}</div>
              {/* <div>{img.artist}</div> */}
              <div>{img.locationData?.latitude}</div>
              <div>{img.locationData?.longitude}</div>
              {/* <div>{img.suburb}</div> */}
              {/* <div>{img.preview}</div> */}
              <div>{img.path}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
