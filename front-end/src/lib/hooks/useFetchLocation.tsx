import { useEffect } from "react";
// import { fetchSuburbFromCoords } from "../api-utils";
import { useLocationContext } from "../providers/location-provider";
import type { TlocationData, TuploadImage } from "../types";
import { toast } from "react-hot-toast";
import { useQuery } from "@apollo/client/react";
import { REVERSE_GEOCODE } from "../gql-utils";
export const useFetchLocation = (
  imageKey: string,
  location: TlocationData | null,
  serverOrUpload: "server" | "upload"
) => {
  const { setUploadedImages, handleUpdateImage } = useLocationContext();

  const handleSetUploadedSuburb = (suburb: string) => {
    if (serverOrUpload === "server") {
      handleUpdateImage({ suburb: suburb }, imageKey);
    } else {
      setUploadedImages((previmages) =>
        previmages.map((img) =>
          img.id === imageKey ? { ...img, suburb: suburb } : img
        )
      );
    }
  };

  useEffect(() => {
    // toast.success("suburb finding...");
    const fetchSuburb = async () => {
      if (location) {
        // const suburb = await fetchSuburbFromCoords(
        //   location.latitude,
        //   location.longitude
        // );
        // const { data: suburb } = await fetchSuburbFromCoords(
        //   location.latitude,
        //   location.longitude
        // );
        const { data: suburb } = useQuery(REVERSE_GEOCODE, {
          variables: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });

        console.log(suburb); // This will be the returned suburb string

        toast.success(`fetched suburb...${suburb}`);
        if (suburb) {
          // handleSetUploadedSuburb(suburb);
        }
      }
    };
    fetchSuburb();
  }, [location]);

  return {};
};
