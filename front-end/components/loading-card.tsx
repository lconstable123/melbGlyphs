import { Spinner } from "@/components/ui/spinner";

import { RiAddLargeFill } from "react-icons/ri";

export const LoadingCard = () => {
  return (
    <div className="w-50 h-50 relative flex items-center justify-center bg-black/10 outline-1">
      <Spinner />
      <p className="absolute bottom-2 text-xs">Converting Image</p>
    </div>
  );
};

export const ImgSkeleton = ({
  handleUploadImage,
}: {
  handleUploadImage: () => void;
}) => {
  return (
    <div
      onClick={handleUploadImage}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleUploadImage();
        }
      }}
      className="        transition-all  cursor-pointer flex justify-center group items-center gap-2 w-full h-full border-2 border-dashed border-gray-300 bg-gray-50/10 opacity-20 focus:opacity-30    hover:opacity-30 rounded-lg"
    >
      <RiAddLargeFill className=" w-10 h-10" />
    </div>
  );
};
