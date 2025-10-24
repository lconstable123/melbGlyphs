import { useLocationContext } from "../src/lib/providers/location-provider";
import { ImageCloser } from "./image-closer";

export const ImageInspector = () => {
  const { inspectingImage, setInspectingImage } = useLocationContext();
  return (
    <div className="w-200 h-100  fixed top-30 z-100 left-60 bg-black text-white  max-w-sm  overflow-auto">
      {inspectingImage ? (
        <div>
          {/* <h2 className="font-bold mb-2">
            {inspectingImage.artist ? inspectingImage.artist : "Unknown Artist"}
          </h2> */}
          <ImageCloser
            handleClick={() => {
              setInspectingImage(null);
            }}
            ImageKey={inspectingImage.key}
          />
          <img
            src={inspectingImage.preview}
            alt="Image"
            className="w-full h-full"
          />
        </div>
      ) : (
        <p>No image selected</p>
      )}
    </div>
  );
};
