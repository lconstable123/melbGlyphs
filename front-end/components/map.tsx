import { queryLocation } from "../src/lib/api-utils";
import type { Tcoordinates, TlocationData } from "../src/lib/types";
import { useEffect, useState } from "react";
import { defaultLocation } from "../src/lib/data";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { DivIcon } from "leaflet";
import toast from "react-hot-toast";
export const Map = ({
  text,
  handleSetLocation,
  startingLocation,
  allowSearch,
}: {
  text: string;
  handleSetLocation: (pos: TlocationData) => void;
  startingLocation: TlocationData | null;
  allowSearch: boolean;
}) => {
  //fitzroy

  const circleIcon = new DivIcon({
    className: "custom-circle-icon", // we'll style this in CSS
    html: "<div></div>", // empty div to style
    iconSize: [20, 20], // width, height of the circle
    iconAnchor: [10, 10], // center the circle on the coordinates
  });

  const startingLoc: [number, number] = startingLocation
    ? [startingLocation.latitude, startingLocation.longitude]
    : defaultLocation;

  const [selectedPosition, setSelectedPosition] = useState<Tcoordinates | null>(
    startingLoc
  );

  const [cursorPosition, setCursorPosition] = useState<Tcoordinates | null>(
    startingLoc
  );

  const handleSearch = async (query: string) => {
    if (!allowSearch) return;
    // toast.success(`Searching for location: ${query}`);
    // api query for coords
    const data = await queryLocation(query);
    const location: Tcoordinates = [
      parseFloat(data[0].lat),
      parseFloat(data[0].lon),
    ];
    setSelectedPosition(location);
    setCursorPosition(location);
  };

  const ParseAsLocationObject = (loc: Tcoordinates): TlocationData => {
    return { latitude: loc[0], longitude: loc[1] };
  };

  // useEffect(() => {
  //   toast.success(
  //     `Cursor position updated: [${cursorPosition?.[0].toFixed(
  //       4
  //     )}, ${cursorPosition?.[1].toFixed(4)}]`
  //   );
  // }, [cursorPosition]);

  function ClickHandler({
    onClick,
    handleSetLocation,
  }: {
    onClick: (pos: Tcoordinates) => void;
    handleSetLocation: (pos: TlocationData) => void;
  }) {
    const parseLoc = (loc: Tcoordinates) => ({
      latitude: loc[0],
      longitude: loc[1],
    });

    useMapEvents({
      click(e) {
        onClick([e.latlng.lat, e.latlng.lng]);
        const coords: Tcoordinates = [e.latlng.lat, e.latlng.lng];
        handleSetLocation(parseLoc(coords));
      },
    });
    return null;
  }

  // listen for text changes to trigger search
  useEffect(() => {
    if (text.length === 0) {
      return;
    }
    handleSearch(text);
  }, [text]);

  // whenever cursorPosition changes, update global location
  useEffect(() => {
    if (cursorPosition)
      handleSetLocation(ParseAsLocationObject(cursorPosition));
  }, [selectedPosition, cursorPosition]);

  useEffect(() => {
    if (startingLocation) {
      const loc: Tcoordinates = [
        startingLocation.latitude,
        startingLocation.longitude,
      ];

      setCursorPosition(loc);
    } else {
      // fallback to default only if not already set
      if (!selectedPosition) {
        setSelectedPosition(defaultLocation);
        setCursorPosition(defaultLocation);
      }
    }
  }, [startingLocation]);

  return (
    <div className="w-full  h-full bg-gray-500">
      <MapContainer
        center={selectedPosition || [51.505, -0.09]} // Default to London
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        key={selectedPosition ? selectedPosition.join(",") : "default-map"}
      >
        <TileLayer
          //   attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler
          onClick={setCursorPosition}
          handleSetLocation={handleSetLocation}
        />
        {selectedPosition && (
          <Marker
            icon={circleIcon}
            position={cursorPosition || selectedPosition}
          >
            <Popup>Selected Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
