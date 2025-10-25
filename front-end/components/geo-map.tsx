import { useLocationContext } from "../src/lib/providers/location-provider";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN!;
import { defaultLocation } from "../src/lib/data";
import toast from "react-hot-toast";
import type { TuploadImage } from "@/lib/types";
export const GeoMap = () => {
  const { uploadedImages, setInspectingImage } = useLocationContext();
  const { setMode, mode } = useLocationContext();
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const handlePopupClick = (img: TuploadImage) => {
    setInspectingImage(img);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [defaultLocation[1], defaultLocation[0]], // [lng, lat]
      zoom: 10,
      pitch: 60,
      bearing: -30,
    });

    mapRef.current = map;

    return () => {
      // markersRef.current.forEach((marker) => marker.remove());
      map.remove();
    };
  }, [mapContainerRef.current]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    uploadedImages.forEach((img) => {
      if (!img.locationData) return;
      const loc = img.locationData;
      if (
        !loc ||
        typeof loc.longitude !== "number" ||
        typeof loc.latitude !== "number"
      )
        return;
      // Custom marker element
      const markerEl = document.createElement("div");
      markerEl.className = "custom-marker";
      markerEl.style.width = "40px";
      markerEl.style.height = "40px";
      markerEl.style.backgroundImage = `url(${img.preview})`;
      markerEl.style.backgroundSize = "cover";
      markerEl.style.border = "3px solid black";
      // markerEl.style.borderRadius = "30%";
      markerEl.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";
      markerEl.style.cursor = "pointer";

      const popup = new mapboxgl.Popup({
        offset: 25,
        className: "custom-popup",
      }).setHTML(`
  <div 
  
  class="map-popup__content">
    <div class="map-popup__image-wrapper">
      <img src="${img.preview}" alt="Image" class="map-popup__image"  />
      <div class="map-popup__fader" ></div>
      <p class="map-popup__update-details">Update details</p>
    </div>
    <div class="map-popup__artist">
      <p>${img.artist ? img.artist : "Unknown Artist"}</p>
    </div>
  </div>
      `);

      popup.on("open", () => {
        const popupEl = popup.getElement();
        if (!popupEl) return; // exit if undefined

        const contentEl = popupEl.querySelector(".map-popup__content");
        if (contentEl) {
          contentEl.addEventListener("click", () => {
            handlePopupClick(img); // your click handler
          });
        }
      });

      // Add marker
      const marker = new mapboxgl.Marker(markerEl, {
        rotationAlignment: "map",
      })
        .setLngLat([loc.longitude, loc.latitude])
        .setPopup(popup) // attach popup
        .addTo(map);
      markersRef.current.push(marker);
    });

    // Fly to the last uploaded image
    if (uploadedImages.length) {
      const last = uploadedImages[uploadedImages.length - 1];
      if (last.locationData) {
        map.flyTo({
          center: [last.locationData.longitude, last.locationData.latitude],
          zoom: 15,
          essential: true,
        });
      }
    }
  }, [uploadedImages]);

  return (
    <div
      onClick={() => {
        if (mode !== "explore") {
          setMode("explore");
          toast.success("Explore mode activated");
        }
      }}
      ref={mapContainerRef}
      className="absolute w-full h-screen "
    />
  );
};
