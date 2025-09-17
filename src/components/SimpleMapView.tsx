"use client";

import React, { useEffect, useRef, useState } from "react";

export type Tourist = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  lastUpdated: number;
  direction: number;
  speed: number;
};

type SimpleMapViewProps = {
  tourists: Tourist[];
  defaultCenter: { lat: number; lng: number };
  isLoadingMaps: boolean;
  error: string | null;
};

export default function SimpleMapView(props: SimpleMapViewProps) {
  const { tourists, defaultCenter, isLoadingMaps, error } = props;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize map
  useEffect(() => {
    console.log("SimpleMapView useEffect triggered", {
      isClient,
      isLoadingMaps,
      error,
      hasGoogle: !!(window as unknown as { google?: { maps?: unknown } }).google
        ?.maps,
      hasContainer: !!mapContainerRef.current,
      hasMap: !!mapRef.current,
    });

    if (typeof window === "undefined") return;
    if (!mapContainerRef.current) return;
    if (!(window as unknown as { google?: { maps?: unknown } }).google?.maps)
      return;
    if (mapRef.current) return;

    console.log("Initializing Google Map...");

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 11,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [], // Use default styles
      disableDefaultUI: false,
      zoomControl: true,
      scrollwheel: true,
      draggable: true,
    });
    mapRef.current = map;

    // Ensure tiles load properly
    map.addListener("tilesloaded", () => {
      console.log("Map tiles loaded successfully");
    });

    map.addListener("idle", () => {
      console.log("Map is idle - tiles should be loaded");
    });

    map.addListener("error", (error) => {
      console.error("Map error:", error);
    });

    // Check if tiles are actually loading
    setTimeout(() => {
      if (mapRef.current) {
        const mapDiv = mapRef.current.getDiv();
        const hasTiles = mapDiv.querySelector(
          'img[src*="maps.googleapis.com"]'
        );
        console.log("Map tiles check:", { hasTiles: !!hasTiles });
        if (!hasTiles) {
          console.warn(
            "No map tiles detected - this might be an API key permissions issue"
          );
        }
      }
    }, 2000);

    // Force a refresh of the map
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.setCenter(mapRef.current.getCenter());
      }
    }, 1000);

    console.log("Google Map initialized successfully");
  }, [defaultCenter]);

  // Add tourist markers
  useEffect(() => {
    if (!mapRef.current || !(window as unknown as { google?: unknown }).google)
      return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    console.log("Adding markers for tourists:", tourists.length);

    // Add new markers
    tourists.forEach((tourist) => {
      const marker = new window.google.maps.Marker({
        position: tourist.location,
        map: mapRef.current,
        title: tourist.name,
        icon: {
          url:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#007AFF" stroke="#ffffff" stroke-width="3"/>
              <path d="M16 8 L22 16 L16 14 L10 16 Z" fill="#ffffff" stroke="#007AFF" stroke-width="1"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16),
        },
      });

      // Add click listener
      marker.addListener("click", () => {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; color: #007AFF;">${
                tourist.name
              }</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">
                Location: ${tourist.location.lat.toFixed(
                  4
                )}, ${tourist.location.lng.toFixed(4)}<br>
                Speed: ${tourist.speed.toFixed(1)} km/h<br>
                Direction: ${tourist.direction.toFixed(0)}°
              </p>
            </div>
          `,
        });
        infoWindow.open(mapRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    console.log("Markers added:", markersRef.current.length);

    // Force map refresh to ensure tiles load
    if (mapRef.current) {
      setTimeout(() => {
        if (mapRef.current) {
          const center = mapRef.current.getCenter();
          if (center) {
            mapRef.current.setCenter(center);
          }
        }
      }, 500);
    }
  }, [tourists]);

  // Listen for control events from parent
  useEffect(() => {
    function onFitToBounds(e: Event) {
      if (!mapRef.current) return;
      const detail = (e as CustomEvent).detail as {
        bounds: google.maps.LatLngBoundsLiteral;
      };
      const bounds = new google.maps.LatLngBounds(detail.bounds);
      mapRef.current.fitBounds(bounds, 48);
    }

    function onPanTo(e: Event) {
      if (!mapRef.current) return;
      const detail = (e as CustomEvent).detail as {
        center: { lat: number; lng: number };
      };
      mapRef.current.panTo(detail.center);
      mapRef.current.setZoom(13);
    }

    window.addEventListener("fit-to-bounds", onFitToBounds as EventListener);
    window.addEventListener("pan-to", onPanTo as EventListener);
    return () => {
      window.removeEventListener(
        "fit-to-bounds",
        onFitToBounds as EventListener
      );
      window.removeEventListener("pan-to", onPanTo as EventListener);
    };
  }, []);

  return (
    <div style={{ flex: 1, position: "relative" }}>
      {isClient &&
        (isLoadingMaps ||
          (typeof window !== "undefined" && !window.google)) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              background: "#f8fafc",
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🗺️</div>
            <div>Loading map...</div>
            {isLoadingMaps && (
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                Please wait while Google Maps loads
              </div>
            )}
          </div>
        )}
      {isClient && !isLoadingMaps && !window.google && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            background: "#f8fafc",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🗺️</div>
          <div
            style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}
          >
            Map Unavailable
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#9ca3af",
              textAlign: "center",
              maxWidth: "300px",
            }}
          >
            Google Maps requires a valid API key to display. Please check your
            configuration.
          </div>
        </div>
      )}
      {isClient && error && (
        <div
          style={{
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
            fontSize: "14px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
            ⚠️ Map Error
          </div>
          <div>{error}</div>
          <div style={{ fontSize: "12px", marginTop: "8px", color: "#7f1d1d" }}>
            To fix this: Create a .env.local file with
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
          </div>
        </div>
      )}
      <div
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
          background: "#e5e7eb",
          minHeight: "400px",
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}
