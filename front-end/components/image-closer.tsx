import { IoMdCloseCircle } from "react-icons/io";

export const ImageCloser = ({
  handleClick,
  ImageKey,
}: {
  handleClick: (key?: string) => void;
  ImageKey?: string;
}) => {
  return (
    <i
      id="close-button"
      className=" absolute top-0 right-0  p-1 rounded-bl-lg z-40  bg-black/90 cursor-pointer"
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
        className="focus:ring-1 focus:ring-offset-0  hover:scale-110 scale-100 w-5 h-5 drop-shadow shadow-lg "
      />
    </i>
  );
};
