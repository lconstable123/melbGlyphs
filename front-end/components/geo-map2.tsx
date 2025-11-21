import { useLocationContext } from "../src/lib/providers/location-provider";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN!;
import { defaultLocation } from "../src/lib/data";
import type { TImage } from "@/lib/types";
import { cn, fadeInOnce } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export const GeoMap2 = () => {
  const {
    uploadedImages,
    inspectingImage,
    setInspectingImage,
    allImages,
    hardMapReset,
    forceSelectedUpdate,
    mapLoading,
    setMapLoading,
    mapPitch,
    mapBearing,
  } = useLocationContext();

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const popupsRef = useRef<Map<string, mapboxgl.Popup>>(new Map());

  const ZOOM_THRESHOLD = 8.42;

  const handleClick = (img: TImage) => setInspectingImage(img);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [defaultLocation[1], defaultLocation[0]],
      zoom: 10,
      pitch: mapPitch,
      bearing: mapBearing,
    });

    mapRef.current = map;
    map.on("load", () => setMapLoading(false));
    // Zoom listener (throttled by Mapbox internally)
    map.on("zoom", () => {
      const zoom = map.getZoom();
      popupsRef.current.forEach((popup) => {
        const el = popup.getElement();
        if (!el) return;
        el.style.display = zoom < ZOOM_THRESHOLD ? "none" : "block";
      });
    });

    return () => {
      map.remove();
      markersRef.current.clear();
      popupsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1️⃣ Remove markers/popups for images that no longer exist
    const currentIds = new Set(allImages.map((i) => i.id).filter(Boolean));
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
    popupsRef.current.forEach((popup, id) => {
      if (!currentIds.has(id)) {
        popup.remove();
        popupsRef.current.delete(id);
      }
    });

    // 2️⃣ Add or update markers/popups
    allImages.forEach((img) => {
      if (!img?.id || !img?.locationData || !img.path) return;
      const { id, locationData, path, artist } = img;
      const { latitude, longitude } = locationData;

      // MARKER
      if (!markersRef.current.has(id)) {
        const markerEl = document.createElement("div");
        markerEl.className = "custom-marker";
        markerEl.style.backgroundImage = `url(${path})`;
        fadeInOnce(markerEl, `marker-${id}`);
        const marker = new mapboxgl.Marker(markerEl, {
          rotationAlignment: "map",
        })
          .setLngLat([longitude, latitude])
          .addTo(map);
        markerEl.addEventListener("click", () => handleClick(img));
        markersRef.current.set(id, marker);
      } else {
        // optional: update position if it moved
        markersRef.current.get(id)!.setLngLat([longitude, latitude]);
      }

      // POPUP
      if (!popupsRef.current.has(id)) {
        const popupHtml = `
        
            <div class="map-popup__content">
          <div class="map-popup__image-wrapper">
            <img src="${path}" class="map-popup__image" />

          </div>
          <div class="map-popup__artist">
            <p>${artist ?? "Unknown Artist"}</p>
          </div>
        </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: 25,
          className: "custom-popup",
          closeOnClick: false,
          closeOnMove: false,
          closeButton: false,
          anchor: "bottom",
        })
          .setLngLat([longitude, latitude])
          .setHTML(popupHtml)
          .addTo(map);
        const el = popup.getElement();
        el?.querySelector(".map-popup__content")?.addEventListener(
          "click",
          () => handleClick(img)
        );
        el!.style.display = map.getZoom() < ZOOM_THRESHOLD ? "none" : "block";
        el!.classList.add(`no-select`);
        fadeInOnce(el!, `popup-${id}`);
        popupsRef.current.set(id, popup);
      } else {
        {
          const popup = popupsRef.current.get(id)!;
          popup.setLngLat([longitude, latitude]); // update position
        }
      }
    });

    if (uploadedImages.length > 0) {
      const last = uploadedImages.at(-1)!;
      if (!last.locationData) return;
      const { longitude, latitude } = last.locationData;
      map.flyTo({ center: [longitude, latitude], zoom: 15, essential: true });
    }
  }, [allImages, uploadedImages, hardMapReset]);

  const updateMarker = (inspectingImage: TImage) => {
    const popup = popupsRef.current.get(inspectingImage.id)!;
    popup.setHTML(`
            <div class="map-popup__content">
              <div class="map-popup__image-wrapper">
                <img src="${inspectingImage.path}" class="map-popup__image" />
              </div>
              <div class="map-popup__artist">
                <p>${inspectingImage.artist ?? "Unknown Artist"}</p>
              </div>
            </div>
          `);
    if (inspectingImage.locationData) {
      popup.setLngLat([
        inspectingImage.locationData.longitude,
        inspectingImage.locationData.latitude,
      ]);
    }
  };

  useEffect(() => {
    if (!inspectingImage) return;
    updateMarker(inspectingImage);
  }, [forceSelectedUpdate]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.easeTo({
      pitch: mapPitch,
      bearing: mapBearing,
      duration: 1000,
    });
  }, [mapPitch, mapBearing]);

  return (
    <>
      <div
        className={cn(
          " pointer-events-none transition-all duration-1000 absolute w-full h-screen bg-neutral-950 z-10",
          mapLoading ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="absolute bottom-40 sm:bottom-20 md:bottom-40  left-1/2 translate-x-[-50%] z-20 p-2 bg-neutral-900 rounded-md text-white flex items-center gap-2">
          <div className="flex flex-row gap-2">
            <p>Loading Map....</p>
            <Spinner />
          </div>
        </div>
      </div>
      <div ref={containerRef} className="absolute w-full h-screen" />;
    </>
  );
};
