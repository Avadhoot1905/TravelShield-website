"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { ScatterplotLayer, IconLayer } from "@deck.gl/layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";

export type Tourist = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  lastUpdated: number;
  direction: number; // bearing in degrees (0-360)
  speed: number; // km/h
};

export type HeatZone = {
  id: string;
  center: { lat: number; lng: number };
  radius: number; // in meters
  type: 'red' | 'orange' | 'green';
  intensity: number;
};

type MapViewProps = {
  tourists: Tourist[];
  defaultCenter: { lat: number; lng: number };
  isLoadingMaps: boolean;
  error: string | null;
};

export default function MapView(props: MapViewProps) {
  const { tourists, defaultCenter, isLoadingMaps, error } = props;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const overlayRef = useRef<GoogleMapsOverlay | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(11);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize map and overlay
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapContainerRef.current) return;
    if (!(window as any).google || !(window as any).google.maps) return;
    if (mapRef.current) return;

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 11,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
    });
    mapRef.current = map;

    // Track zoom level changes
    const zoomListener = map.addListener('zoom_changed', () => {
      setZoomLevel(map.getZoom() || 11);
    });

    const overlay = new GoogleMapsOverlay({ layers: [] });
    overlay.setMap(map);
    overlayRef.current = overlay;

    return () => {
      if (zoomListener) {
        window.google.maps.event.removeListener(zoomListener);
      }
    };
  }, [defaultCenter]);

  // Generate static heat zones (risk areas) spread across Northeast India
  const heatZones = useMemo((): HeatZone[] => [
    // Assam
    { id: 'zone-1', center: { lat: 26.2006, lng: 92.9376 }, radius: 800, type: 'red', intensity: 1.0 }, // Guwahati
    { id: 'zone-2', center: { lat: 26.1445, lng: 91.7362 }, radius: 600, type: 'red', intensity: 1.0 }, // Tezpur
    { id: 'zone-3', center: { lat: 24.8167, lng: 92.8000 }, radius: 700, type: 'red', intensity: 1.0 }, // Silchar
    { id: 'zone-4', center: { lat: 27.4728, lng: 95.0388 }, radius: 500, type: 'red', intensity: 1.0 }, // Dibrugarh
    
    // Arunachal Pradesh
    { id: 'zone-5', center: { lat: 28.2180, lng: 94.7278 }, radius: 600, type: 'red', intensity: 1.0 }, // Itanagar
    { id: 'zone-6', center: { lat: 27.5889, lng: 95.9692 }, radius: 500, type: 'red', intensity: 1.0 }, // Pasighat
    { id: 'zone-7', center: { lat: 28.0667, lng: 95.3333 }, radius: 400, type: 'red', intensity: 1.0 }, // Ziro
    
    // Meghalaya
    { id: 'zone-8', center: { lat: 25.5788, lng: 91.8933 }, radius: 600, type: 'red', intensity: 1.0 }, // Shillong
    { id: 'zone-9', center: { lat: 25.3000, lng: 91.5833 }, radius: 500, type: 'red', intensity: 1.0 }, // Tura
    { id: 'zone-10', center: { lat: 25.5167, lng: 91.2667 }, radius: 400, type: 'red', intensity: 1.0 }, // Nongstoin
    
    // Manipur
    { id: 'zone-11', center: { lat: 24.8167, lng: 93.9500 }, radius: 700, type: 'red', intensity: 1.0 }, // Imphal
    { id: 'zone-12', center: { lat: 24.5000, lng: 93.7667 }, radius: 500, type: 'red', intensity: 1.0 }, // Thoubal
    { id: 'zone-13', center: { lat: 25.1167, lng: 94.3667 }, radius: 400, type: 'red', intensity: 1.0 }, // Ukhrul
    
    // Mizoram
    { id: 'zone-14', center: { lat: 23.7271, lng: 92.7176 }, radius: 600, type: 'red', intensity: 1.0 }, // Aizawl
    { id: 'zone-15', center: { lat: 23.1667, lng: 92.9000 }, radius: 500, type: 'red', intensity: 1.0 }, // Lunglei
    { id: 'zone-16', center: { lat: 22.4833, lng: 92.7167 }, radius: 400, type: 'red', intensity: 1.0 }, // Saiha
    
    // Nagaland
    { id: 'zone-17', center: { lat: 25.6667, lng: 94.1167 }, radius: 600, type: 'red', intensity: 1.0 }, // Kohima
    { id: 'zone-18', center: { lat: 26.1000, lng: 94.5167 }, radius: 500, type: 'red', intensity: 1.0 }, // Dimapur
    { id: 'zone-19', center: { lat: 25.9000, lng: 93.7333 }, radius: 400, type: 'red', intensity: 1.0 }, // Mokokchung
    
    // Tripura
    { id: 'zone-20', center: { lat: 23.8315, lng: 91.2862 }, radius: 600, type: 'red', intensity: 1.0 }, // Agartala
    { id: 'zone-21', center: { lat: 23.3333, lng: 91.5000 }, radius: 500, type: 'red', intensity: 1.0 }, // Udaipur
    { id: 'zone-22', center: { lat: 24.2500, lng: 91.6667 }, radius: 400, type: 'red', intensity: 1.0 }, // Kailashahar
    
    // Sikkim
    { id: 'zone-23', center: { lat: 27.3389, lng: 88.6065 }, radius: 500, type: 'red', intensity: 1.0 }, // Gangtok
    { id: 'zone-24', center: { lat: 27.3333, lng: 88.6167 }, radius: 400, type: 'red', intensity: 1.0 }, // Namchi
    { id: 'zone-25', center: { lat: 27.5000, lng: 88.5000 }, radius: 300, type: 'red', intensity: 1.0 }, // Mangan
  ], []);

  // Build deck.gl layers from tourist data and heat zones
  const layers = useMemo(() => {
    console.log('Building layers with tourists:', tourists.length);
    // Static heat zones with red centers fading to green edges
    const heatZonePoints = heatZones.flatMap(zone => {
      const points = [];
      const steps = 50; // More points for smoother gradient
      for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * 2 * Math.PI;
        // Create concentric circles from center to edge
        for (let r = 0; r < 10; r++) {
          const distance = (zone.radius / 10) * r;
          const lat = zone.center.lat + (distance / 111000) * Math.cos(angle);
          const lng = zone.center.lng + (distance / (111000 * Math.cos(zone.center.lat * Math.PI / 180))) * Math.sin(angle);
          
          // Calculate intensity based on distance from center (red at center, green at edge)
          const normalizedDistance = r / 10; // 0 at center, 1 at edge
          const intensity = 1 - normalizedDistance; // 1 at center, 0 at edge
          
          points.push({
            position: [lng, lat],
            weight: intensity,
            distance: normalizedDistance
          });
        }
      }
      return points;
    });

    // Tourist points with direction (static)
    const touristPoints = tourists.map((t) => ({
      position: [t.location.lng, t.location.lat],
      name: t.name,
      id: t.id,
      direction: t.direction,
      speed: t.speed
    }));

    // Heat zones layer with red-to-green gradient
    const heatmap = new HeatmapLayer({
      id: "risk-heatmap",
      data: heatZonePoints,
      getPosition: (d: any) => d.position,
      getWeight: (d: any) => d.weight,
      radiusPixels: 100,
      intensity: 1,
      colorRange: [
        [255, 0, 0, 255],    // red at center
        [255, 100, 0, 200],  // orange-red
        [255, 150, 0, 150],  // orange
        [255, 200, 0, 100],  // yellow-orange
        [0, 255, 0, 50]      // green at edge
      ],
      getColorWeight: (d: any) => d.distance
    });

    // Tourist icons with arrows (static) - larger and more visible
    const touristIcons = new IconLayer({
      id: "tourist-icons",
      data: touristPoints,
      getPosition: (d: any) => d.position,
      getIcon: () => ({
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="16" fill="#007AFF" stroke="#ffffff" stroke-width="4"/>
            <path d="M24 12 L32 24 L24 20 L16 24 Z" fill="#ffffff" stroke="#007AFF" stroke-width="1"/>
          </svg>
        `),
        width: 48,
        height: 48,
        anchorX: 24,
        anchorY: 24
      }),
      getAngle: (d: any) => d.direction,
      sizeScale: Math.max(0.8, 2.5 - (zoomLevel - 8) * 0.2), // Dynamic sizing based on zoom
      pickable: true
    });

    return [heatmap, touristIcons];
  }, [tourists, heatZones, zoomLevel]);

  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current.setProps({ layers });
  }, [layers]);

  // Listen for control events from parent (fit bounds, pan to)
  useEffect(() => {
    function onFitToBounds(e: Event) {
      if (!mapRef.current) return;
      const detail = (e as CustomEvent).detail as { bounds: google.maps.LatLngBoundsLiteral };
      const bounds = new google.maps.LatLngBounds(detail.bounds);
      mapRef.current.fitBounds(bounds, 48);
    }

    function onPanTo(e: Event) {
      if (!mapRef.current) return;
      const detail = (e as CustomEvent).detail as { center: { lat: number; lng: number } };
      mapRef.current.panTo(detail.center);
      mapRef.current.setZoom(13);
    }

    window.addEventListener("fit-to-bounds", onFitToBounds as EventListener);
    window.addEventListener("pan-to", onPanTo as EventListener);
    return () => {
      window.removeEventListener("fit-to-bounds", onFitToBounds as EventListener);
      window.removeEventListener("pan-to", onPanTo as EventListener);
    };
  }, []);

  return (
    <div style={{ flex: 1, position: "relative" }}>
      {isClient && (isLoadingMaps || (typeof window !== "undefined" && !window.google)) && (
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
          color: "#6b7280",
          background: "#f8fafc",
          zIndex: 10
        }}>
          <div style={{ fontSize: "18px", marginBottom: "8px" }}>🗺️</div>
          <div>Loading map...</div>
          {isLoadingMaps && <div style={{ fontSize: "12px", marginTop: "4px" }}>Please wait while Google Maps loads</div>}
        </div>
      )}
      {isClient && error && (
        <div style={{ 
          position: "absolute", 
          top: 12, 
          left: 12, 
          right: 12,
          background: "#fee2e2", 
          color: "#991b1b", 
          padding: 12, 
          borderRadius: 8, 
          border: "2px solid #fecaca",
          zIndex: 20,
          fontSize: "14px"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>⚠️ Map Error</div>
          <div>{error}</div>
          <div style={{ fontSize: "12px", marginTop: "8px", color: "#7f1d1d" }}>
            To fix this: Create a .env.local file with NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
          </div>
        </div>
      )}
      <div 
        ref={mapContainerRef} 
        style={{ 
          height: "100%", 
          width: "100%",
          background: "#e5e7eb",
          minHeight: "400px"
        }} 
      />
    </div>
  );
}


