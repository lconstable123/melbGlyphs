import { useEffect } from "react";
// import { fetchSuburbFromCoords } from "../api-utils";
import { useLocationContext } from "../providers/location-provider";
import type {
  TGQLReverseGeocodeData,
  TGQLReverseGeocodeVars,
  TlocationData,
  TuploadImage,
} from "../types";
import { toast } from "react-hot-toast";
import { useQuery } from "@apollo/client/react";
import { REVERSE_GEOCODE, ReverseGeocode } from "../gql-utils";
export const useFetchLocation = (
  imageKey: string,
  location: TlocationData | null,
  serverOrUpload: "server" | "upload"
) => {
  const {
    setUploadedImages,
    handleUpdateImage,
    handleRefreshServerImages,
    setInspectingImage,
  } = useLocationContext();

  const handleSetUploadedSuburb = (suburb: string) => {
    if (serverOrUpload === "server") {
      handleUpdateImage({ suburb }, imageKey);
      setInspectingImage((prev) => ({ ...prev, suburb } as TuploadImage));
    } else {
      setUploadedImages((previmages) =>
        previmages.map((img) =>
          img.id === imageKey ? { ...img, suburb: suburb } : img
        )
      );
    }
  };
  const HandleReverseGeocode = async ({
    latitude,
    longitude,
  }: TlocationData) => {
    const { reverseGeocode: suburb } = await ReverseGeocode(
      latitude || 0,
      longitude || 0
    );
    // toast.success(data);
    if (!suburb) {
      toast.error("Failed to fetch suburb name for the given coordinates.");
      return;
    }
    // toast.success("Fetched suburb: " + suburb);
    handleSetUploadedSuburb(suburb || null);
  };

  useEffect(() => {
    // toast.success("Suburb updating based on location data.");
    HandleReverseGeocode(location as TlocationData);
  }, [location]);

  return {};
};
