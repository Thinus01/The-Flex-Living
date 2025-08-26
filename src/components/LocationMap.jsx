import { useEffect, useRef, useState } from "react";
import CardShell from "./CardShell";
import { loadGoogleMaps } from "../lib/googleMaps";

// location map component
export default function LocationMap({ center, zoom = 14 }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // maps api key
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID"; // vector map id

  const divRef = useRef(null); // map container ref
  const mapRef = useRef(null); // map instance ref
  const markerRef = useRef(null); // marker instance ref

  const [ready, setReady] = useState(Boolean(window.google?.maps?.Map)); // maps ready flag
  const [err, setErr] = useState(null); // error state

  // initialize and mount map
  useEffect(() => {
    let alive = true;
    if (!apiKey || !center?.lat || !center?.lng) return; // config guard

    (async () => {
      try {
        await loadGoogleMaps(apiKey); // load script

        // wait for Maps object
        const waitUntil = Date.now() + 3000;
        while (!window.google?.maps?.Map) {
          if (Date.now() > waitUntil) throw new Error("Maps API not ready");
          await new Promise(r => setTimeout(r, 50));
        }
        if (!alive || !divRef.current) return;

        const gmaps = window.google.maps;

        // create or update map
        if (!mapRef.current) {
          mapRef.current = new gmaps.Map(divRef.current, {
            center,
            zoom,
            mapId,
            disableDefaultUI: true,
          });
        } else {
          mapRef.current.setCenter(center);
          mapRef.current.setZoom(zoom);
        }

        // create or update marker
        const hasAdvanced = Boolean(gmaps.marker?.AdvancedMarkerElement);
        if (!markerRef.current) {
          markerRef.current = hasAdvanced
            ? new gmaps.marker.AdvancedMarkerElement({
                map: mapRef.current,
                position: center,
                title: "Property location",
              })
            : new gmaps.Marker({
                map: mapRef.current,
                position: center,
                title: "Property location",
              });
        } else {
          if (hasAdvanced) {
            markerRef.current.position = center;
            markerRef.current.map = mapRef.current;
          } else {
            markerRef.current.setPosition(center);
            markerRef.current.setMap(mapRef.current);
          }
        }

        setReady(true); // mark ready
      } catch (e) {
        if (alive) setErr(e?.message || "Map failed to load"); // store error
      }
    })();

    return () => { alive = false }; // cleanup flag
  }, [apiKey, center?.lat, center?.lng, zoom, mapId]);

  return (
    <CardShell title="Location">
      {!apiKey ? (
        // missing api key fallback
        <div className="relative overflow-hidden rounded-xl ring-1 ring-slate-200">
          <div className="h-[360px] w-full bg-gray-100 grid place-items-center">
            <p className="text-sm text-gray-600">
              Add <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env</code> to enable the map
            </p>
          </div>
        </div>
      ) : (
        // map wrapper
        <div className="relative overflow-hidden rounded-xl ring-1 ring-slate-200">
          {!ready && <div className="h-[360px] w-full bg-gray-100 animate-pulse" /> /* loading placeholder */}
          <div ref={divRef} className="h-[360px] w-full" /> {/* live map target */}
        </div>
      )}

      <p className="sr-only">Lat {center?.lat}, Lng {center?.lng}</p> {/* screen reader coords */}
      {err && <p className="mt-2 text-xs text-red-600">{err}</p> /* error message */}
    </CardShell>
  );
}
