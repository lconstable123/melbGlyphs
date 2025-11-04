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
    <div className="flex-col flex justify-start ">
      <section className="overflow-hidden select-none pointer-events-none flex flex-col  absolute inset-0   z-30    ">
        <TopBar />
        {/* <TopBar /> */}
        {/* <ItemDebug /> */}
        <AddImage />

        <section className=" border-amber-300 relative flex flex-col h-full w-full    ">
          {inspectingImage && <ImageInspector />}
        </section>

        <div
          className={cn(
            "transition-all duration-500 absolute top-0 left-0 w-full  flex  z-400 ",
            mode !== "upload" ? "-translate-x-full" : "translate-x-0"
          )}
        >
          <SplashScreen />
        </div>
      </section>
      <section className=" absolute inset-0 w-screen h-full     mb-2 ">
        <div className="pointer-events-none absolute inset-0 m-20  z-30 bg-gradient-to-br from-fuchsia-500/10 to-rose-500/0 via-rose-500/2" />
        <div className="pointer-events-none absolute inset-0 z-4 opacity-5 ">
          <div className="absolute inset-0 m-20 border-2 z-30" />
          <div className="absolute top-0 h-20 w-full bg-fuchsia-500   z-4 " />
          <div className="absolute bottom-0 h-20 w-full  bg-fuchsia-500  z-4 " />
          <div className="absolute left-0 w-20 h-full  bg-fuchsia-500  z-4 " />
          <div className="absolute right-0 w-20 h-full  bg-fuchsia-500  z-4 " />
        </div>
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
              <div>{img.isOnServer ? "On Server" : "Local"}</div>
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
