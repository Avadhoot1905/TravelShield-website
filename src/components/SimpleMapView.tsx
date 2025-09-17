import React, { useEffect, useRef } from "react";

export type Tourist = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  lastUpdated: number;
  direction: number;
  speed: number;
};

type HeatPoint = {
  lat: number;
  lng: number;
  danger: number;
};

type Props = {
  tourists: Tourist[];
  defaultCenter: { lat: number; lng: number };
  isLoadingMaps: boolean;
  error: string | null;
  heatPoints: HeatPoint[];
};

export default function SimpleMapView({
  tourists,
  defaultCenter,
  isLoadingMaps,
  error,
  heatPoints,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const heatmapRef = useRef<any>(null);

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

  // Render tourists as markers (unchanged)
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

  // Render heatmap
  useEffect(() => {
    if (!mapInstance.current || !(window as any).google?.maps?.visualization)
      return;

    // Remove previous heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }

    const google = window.google;
    const heatmapData = heatPoints.map((p) => ({
      location: new google.maps.LatLng(p.lat, p.lng),
      weight: p.danger,
    }));

    heatmapRef.current = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      dissipating: false,
      radius: 100,
      opacity: 0.7,
      gradient: [
        "rgba(0,255,0,0)", // green (safe)
        "rgba(255,255,0,0.7)", // yellow
        "rgba(255,165,0,0.8)", // orange
        "rgba(255,0,0,1)", // red (danger)
      ],
    });

    heatmapRef.current.setMap(mapInstance.current);
  }, [heatPoints]);

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
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
