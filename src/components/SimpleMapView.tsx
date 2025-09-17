import React, { useEffect, useRef } from "react";

export type Tourist = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  lastUpdated: number;
  direction: number;
  speed: number;
};

// ...existing code...
type DangerLevel = "low" | "medium" | "high";
type RegionGeo = {
  id: string;
  name: string;
  danger: DangerLevel;
  geojson: GeoJSON.Feature<GeoJSON.Polygon>;
};

type Props = {
  tourists: Tourist[];
  defaultCenter: { lat: number; lng: number };
  isLoadingMaps: boolean;
  error: string | null;
  regions?: RegionGeo[];
};

function getDangerColor(danger: DangerLevel): string {
  // Gradient: high (red) -> medium (orange) -> low (green)
  if (danger === "high") return "rgba(239,68,68,0.6)"; // red
  if (danger === "medium") return "rgba(245,158,66,0.6)"; // orange
  return "rgba(34,197,94,0.6)"; // green
}

export default function SimpleMapView({
  tourists,
  defaultCenter,
  isLoadingMaps,
  error,
  regions = [],
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const dataLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !(window as any).google?.maps) return;
    if (mapInstance.current) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 8,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
  }, [defaultCenter]);

  // Render tourists as markers
  useEffect(() => {
    if (!mapInstance.current || !(window as any).google?.maps) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    tourists.forEach((tourist) => {
      const marker = new window.google.maps.Marker({
        position: tourist.location,
        map: mapInstance.current,
        title: tourist.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#2563eb",
          fillOpacity: 0.9,
          strokeColor: "#1e40af",
          strokeWeight: 2,
        },
      });
      markersRef.current.push(marker);
    });
  }, [tourists]);

  // Render regions as polygons with gradient color
  useEffect(() => {
    if (!mapInstance.current || !(window as any).google?.maps) return;

    // Remove previous data layer
    if (dataLayerRef.current) {
      dataLayerRef.current.setMap(null);
    }
    const dataLayer = new window.google.maps.Data({ map: mapInstance.current });
    dataLayerRef.current = dataLayer;

    regions.forEach((region) => {
      dataLayer.addGeoJson(region.geojson);
    });

    dataLayer.setStyle((feature: any) => {
      // Use danger property for color
      const danger: DangerLevel =
        regions.find(
          (r) => r.geojson.properties?.id === feature.getProperty("id")
        )?.danger || "low";
      return {
        fillColor: getDangerColor(danger),
        fillOpacity: 0.6,
        strokeColor: "#222",
        strokeWeight: 2,
      };
    });

    // Info window on click
    dataLayer.addListener("click", (event: any) => {
      const danger: DangerLevel =
        regions.find(
          (r) => r.geojson.properties?.id === event.feature.getProperty("id")
        )?.danger || "low";
      const info = new window.google.maps.InfoWindow({
        content: `<div>
          <strong>${event.feature.getProperty("name")}</strong><br/>
          Danger: <span style="color:${getDangerColor(
            danger
          )};font-weight:bold">${danger.toUpperCase()}</span>
        </div>`,
        position: event.latLng,
      });
      info.open(mapInstance.current);
      setTimeout(() => info.close(), 2500);
    });
  }, [regions]);

  // ...fit-to-bounds and pan-to code unchanged...

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "0 0 0 0",
        }}
      />
      {error && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "8px",
            border: "2px solid #fecaca",
            fontSize: "14px",
            zIndex: 10,
            maxWidth: "400px",
          }}
        >
          <strong>Map Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
