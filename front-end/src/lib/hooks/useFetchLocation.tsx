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
import { REVERSE_GEOCODE } from "../gql-utils";
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
  const { data, loading, error } = useQuery<
    TGQLReverseGeocodeData,
    TGQLReverseGeocodeVars
  >(REVERSE_GEOCODE, {
    variables: {
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
    },

    skip: !location, // prevents query if no coords
  });

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

  useEffect(() => {
    if (loading) {
    } else if (error) {
      // toast.error("Error fetching suburb: " + error.message);
    } else if (data?.reverseGeocode) {
      const suburb = data.reverseGeocode;
      // toast.success("found suburb with location:" + suburb);
      handleSetUploadedSuburb(suburb);
    }
  }, [data, loading, error]);

  return {};
};
