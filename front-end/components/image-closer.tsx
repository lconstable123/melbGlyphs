import { cn } from "@/lib/utils";
import { IoMdCloseCircle } from "react-icons/io";

export const ImageCloser = ({
  handleClick,
  ImageKey,
  type = "map",
}: {
  handleClick: (key?: string) => void;
  ImageKey?: string;
  type?: "map" | "inspector";
}) => {
  return (
    <i
      id="close-button"
      className=" absolute top-0 right-0  p-1 rounded-bl-lg z-40  bg-fuchsia-500 cursor-pointer"
    >
      <IoMdCloseCircle
        onClick={() => {
          handleClick(ImageKey);
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick(ImageKey);
          }
        }}
        role="button"
        className={cn(
          `focus:ring-1 text-black focus:ring-offset-0  hover:scale-110 scale-100 w-5 h-5 drop-shadow shadow-lg `,
          type === "map" ? "w-5 h-5 " : "w-7 h-7 sm:w-5 sm:h-5 "
        )}
      />
    </i>
  );
};
