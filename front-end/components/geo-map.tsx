import { useLocationContext } from "../src/lib/providers/location-provider";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN!;
import { defaultLocation } from "../src/lib/data";
import type { TImage } from "@/lib/types";
import toast from "react-hot-toast";
import { fadeInOnce } from "@/lib/utils";

export const GeoMap = () => {
  const { uploadedImages, setInspectingImage, allImages, hardMapReset } =
    useLocationContext();

  const { setMode, mode } = useLocationContext();

  const [loading, setLoading] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animatedMarkers = useRef<Set<string>>(new Set());
  const animatedPopups = useRef<Set<string>>(new Set());
  const handlePopupClick = (img: TImage) => {
    // toast.success("Inspecting image details...");
    setInspectingImage(img);
  };

  // -----------------------
  // Init map (ONLY ONCE)
  // -----------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [defaultLocation[1], defaultLocation[0]],
      zoom: 10,
      pitch: 60,
      bearing: -30,
    });

    mapRef.current = map;

    map.on("load", () => setLoading(false));

    return () => map.remove();
  }, []); // <-- FIXED (no ref deps!)

  // -----------------------
  // Render markers + popups
  // -----------------------
  useEffect(() => {
    // toast.success("Loading map...");
    const map = mapRef.current;
    if (!map) return;

    setLoading(true);

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    popupsRef.current.forEach((p) => p.remove());
    popupsRef.current = [];

    allImages.forEach((img) => {
      if (!img || !img.id || !img.path || !img.locationData) return;

      const loc = img.locationData;
      if (typeof loc.longitude !== "number" || typeof loc.latitude !== "number")
        return;

      const absoluteUrl = img.path;

      // Marker icon
      const markerEl = document.createElement("div");
      markerEl.classList.add("custom-marker");

      markerEl.style.backgroundImage = `url(${absoluteUrl})`;

      // Popup — never closes
      const popup = new mapboxgl.Popup({
        offset: 25,
        className: "custom-popup",
        closeOnClick: false,
        closeOnMove: false,
        closeButton: false,
        anchor: "bottom",
      }).setLngLat([loc.longitude, loc.latitude]).setHTML(`
        <div class="map-popup__content">
          <div class="map-popup__image-wrapper">
            <img src="${absoluteUrl}" class="map-popup__image" />

          </div>
          <div class="map-popup__artist">
            <p>${img.artist ?? "Unknown Artist"}</p>
          </div>
        </div>
      `);

      // Always open immediately AND forever
      popup.addTo(map);
      popupsRef.current.push(popup);

      const el = popup.getElement();
      el?.querySelector(".map-popup__content")?.addEventListener(
        "click",
        () => {
          handlePopupClick(img);
        }
      );

      const marker = new mapboxgl.Marker(markerEl, {
        rotationAlignment: "map",
      })
        .setLngLat([loc.longitude, loc.latitude])

        .addTo(map);

      markersRef.current.push(marker);
      const el2 = marker.getElement();

      el2?.addEventListener("click", () => {
        handlePopupClick(img);
      });
    });

    // Fly to latest uploaded image
    if (uploadedImages.length > 0) {
      const last = uploadedImages.at(-1)!;
      const loc = last.locationData;
      if (loc) {
        map.flyTo({
          center: [loc.longitude, loc.latitude],
          zoom: 15,
          essential: true,
        });
      }
    }

    const ZOOM_THRESHOLD = 8.42;
    const onZoom = () => {
      const zoom = map.getZoom();
      // toast.success("Zoom level: " + zoom.toFixed(2));
      popupsRef.current.forEach((popup) => {
        if (zoom < ZOOM_THRESHOLD) {
          popup.remove();
        } else {
          if (!popup.isOpen()) popup.addTo(map);
        }
      });
    };

    map.on("zoom", onZoom);

    setLoading(false);
  }, [uploadedImages, allImages, hardMapReset]);

  return (
    <>
      <div ref={mapContainerRef} className="absolute w-full h-screen" />
    </>
  );
};
