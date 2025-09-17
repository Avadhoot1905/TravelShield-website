"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

// Google Maps script loader and components
import SimpleMapView, { Tourist } from "../../components/SimpleMapView";
import Sidebar from "../../components/Sidebar";

// Types
type TouristLocal = Tourist;

//regions data
// ...existing code...
type DangerLevel = "low" | "medium" | "high";
type RegionGeo = {
  id: string;
  name: string;
  danger: DangerLevel;
  geojson: GeoJSON.Feature<GeoJSON.Polygon>;
};
const mockRegions: RegionGeo[] = [
  {
    id: "region-1",
    name: "Region A",
    danger: "high",
    geojson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [93.05, 25.65],
            [93.15, 25.65],
            [93.15, 25.55],
            [93.05, 25.55],
            [93.05, 25.65],
          ],
        ],
      },
    },
  },
  // Add more regions with different coordinates and danger levels
];
type HeatPoint = {
  lat: number;
  lng: number;
  danger: number; // 0 (safe) to 1 (danger)
};

// Example: generate heat points from regions
// ...existing code...
function isPointInPolygon(
  lat: number,
  lng: number,
  polygon: [number, number][]
) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1];
    const xj = polygon[j][0],
      yj = polygon[j][1];
    if (
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

function generateHeatPointsForRegion(
  region: RegionGeo,
  count: number
): HeatPoint[] {
  const coords = region.geojson.geometry.coordinates[0];
  const lats = coords.map(([lng, lat]) => lat);
  const lngs = coords.map(([lng, lat]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Convert coords to [lat, lng] for isPointInPolygon
  const polygonLatLng: [number, number][] = coords.map(([lng, lat]) => [
    lat,
    lng,
  ]);

  const points: HeatPoint[] = [];
  let attempts = 0;
  while (points.length < count && attempts < count * 10) {
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lng = minLng + Math.random() * (maxLng - minLng);
    if (isPointInPolygon(lat, lng, polygonLatLng)) {
      points.push({
        lat,
        lng,
        danger:
          region.danger === "high" ? 1 : region.danger === "medium" ? 0.6 : 0.3,
      });
    }
    attempts++;
  }
  return points;
}

// Generate more heat points for all regions
const heatPoints: HeatPoint[] = mockRegions.flatMap(
  (region) => generateHeatPointsForRegion(region, 20) // 20 points per region
);
// ...existing code...
// Enhanced mock data generator with realistic tourist names
function generateMockTourists(
  count: number,
  center: { lat: number; lng: number }
): Tourist[] {
  const names = [
    "Sarah Johnson",
    "Michael Chen",
    "Emma Rodriguez",
    "David Kim",
    "Lisa Wang",
    "James Wilson",
    "Maria Garcia",
    "Robert Brown",
    "Anna Schmidt",
    "John Davis",
    "Sophie Martin",
    "Ahmed Hassan",
    "Yuki Tanaka",
    "Carlos Silva",
    "Priya Patel",
    "Alex Thompson",
    "Nina Petrov",
    "Hiroshi Yamamoto",
    "Isabella Rossi",
    "Marcus Johnson",
    "Elena Popov",
    "Rajesh Kumar",
    "Jennifer Lee",
    "Mohammed Ali",
    "Catherine O'Connor",
    "Thomas Mueller",
    "Aisha Khan",
    "Lucas Anderson",
    "Fatima Al-Zahra",
    "Daniel Kim",
    "Sofia Rodriguez",
    "Arjun Patel",
    "Emily Watson",
    "Hassan Al-Mahmoud",
    "Grace Liu",
    "Oliver Smith",
    "Zara Ahmed",
    "Liam O'Brien",
    "Aria Singh",
    "Noah Johnson",
    "Maya Patel",
    "Ethan Brown",
    "Luna Garcia",
    "Mason Davis",
    "Chloe Wilson",
    "Jackson Miller",
    "Ava Martinez",
    "Lucas Taylor",
    "Isabella Anderson",
    "William Thomas",
    "Sophia Jackson",
    "Benjamin White",
    "Mia Harris",
    "Alexander Martin",
    "Charlotte Thompson",
    "James Garcia",
    "Amelia Martinez",
    "Michael Robinson",
    "Harper Clark",
    "Daniel Rodriguez",
    "Evelyn Lewis",
    "Matthew Lee",
    "Abigail Walker",
    "Anthony Hall",
    "Emily Allen",
    "Christopher Young",
    "Elizabeth King",
    "Andrew Wright",
    "Samantha Lopez",
    "Joshua Hill",
    "Madison Scott",
    "Ryan Green",
    "Ashley Adams",
    "Nicholas Baker",
    "Brittany Nelson",
    "Tyler Carter",
    "Stephanie Mitchell",
    "Brandon Perez",
    "Nicole Roberts",
    "Jacob Turner",
    "Rachel Phillips",
    "Zachary Campbell",
    "Lauren Parker",
    "Kevin Evans",
    "Megan Edwards",
    "Justin Collins",
    "Kayla Stewart",
    "Tyler Sanchez",
    "Brittany Morris",
    "Austin Rogers",
    "Samantha Reed",
    "Jordan Cook",
    "Taylor Morgan",
    "Hunter Bell",
    "Destiny Murphy",
    "Cameron Bailey",
    "Jasmine Rivera",
    "Blake Cooper",
    "Sierra Richardson",
    "Connor Cox",
    "Makayla Ward",
    "Landon Torres",
    "Paige Peterson",
    "Caleb Gray",
    "Jenna Ramirez",
    "Isaac James",
    "Brooke Watson",
    "Nathan Brooks",
    "Kaitlyn Kelly",
    "Luke Sanders",
    "Mackenzie Price",
    "Owen Bennett",
    "Haley Wood",
    "Gavin Barnes",
    "Jocelyn Ross",
    "Landon Henderson",
    "Jade Coleman",
    "Eli Jenkins",
    "Molly Perry",
    "Carson Powell",
    "Savannah Long",
    "Parker Patterson",
    "Faith Hughes",
    "Colton Flores",
    "Jillian Washington",
    "Brayden Butler",
    "Kendall Simmons",
    "Jaxon Foster",
    "Makenzie Gonzales",
    "Preston Bryant",
    "Jordyn Alexander",
    "Tristan Russell",
    "Payton Griffin",
    "Bryce Diaz",
    "Kylie Hayes",
  ];

  const result: Tourist[] = [];
  for (let i = 0; i < count; i++) {
    // Spread tourists across Northeast India region with more realistic distribution
    const latOffset = (Math.random() - 0.5) * 3; // ~300km spread
    const lngOffset = (Math.random() - 0.5) * 3; // ~300km spread
    result.push({
      id: `tourist-${i}`,
      name: names[i % names.length],
      location: {
        lat: center.lat + latOffset + (Math.random() - 0.5) * 0.5,
        lng: center.lng + lngOffset + (Math.random() - 0.5) * 0.5,
      },
      lastUpdated: Date.now() - Math.floor(Math.random() * 3600000), // Within last hour
      direction: Math.random() * 360, // random direction 0-360 degrees
      speed: 1 + Math.random() * 4, // 1-5 km/h walking speed
    });
  }
  return result;
}

// Replace with your Google Maps API key via NEXT_PUBLIC env var
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function DashboardPage() {
  const defaultCenter = useMemo(() => ({ lat: 25.5, lng: 93.0 }), []); // Center of Northeast India

  const [tourists, setTourists] = useState<TouristLocal[]>([]);
  const [isLoadingMaps, setIsLoadingMaps] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState<boolean>(false);

  // Set client flag and initialize tourists on client side only
  useEffect(() => {
    setIsClient(true);
    const mockTourists = generateMockTourists(120, defaultCenter);
    setTourists(mockTourists);
    console.log("Generated tourists:", mockTourists.length);
  }, [defaultCenter]);

  // Load Google Maps JS API (v=weekly to ensure modern features)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google && window.google.maps) {
      setIsLoadingMaps(false);
      return; // already loaded
    }

    // Check if script is already being loaded or exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      return; // script already exists
    }

    // Check if we have a valid API key
    console.log("API Key check:", {
      hasKey: !!GOOGLE_MAPS_API_KEY,
      keyLength: GOOGLE_MAPS_API_KEY?.length,
      keyValue: GOOGLE_MAPS_API_KEY?.substring(0, 10) + "...",
    });

    const hasValidApiKey =
      GOOGLE_MAPS_API_KEY &&
      GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY" &&
      GOOGLE_MAPS_API_KEY !== "demo" &&
      GOOGLE_MAPS_API_KEY.length > 10;

    if (!hasValidApiKey) {
      console.warn("No valid Google Maps API key found. Map will not load.");
      setError(
        "No valid Google Maps API key found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local for full functionality."
      );
      setIsLoadingMaps(false);
      setMapsLoaded(false);
      return;
    }

    setIsLoadingMaps(true);
    const script = document.createElement("script");
    const apiKey = GOOGLE_MAPS_API_KEY;

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places,visualization`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Google Maps script loaded, checking if API is available...");
      // Add a small delay to ensure the API is fully initialized
      setTimeout(() => {
        if (window.google && window.google.maps) {
          setIsLoadingMaps(false);
          setMapsLoaded(true);
          setError(null);
          console.log("Google Maps loaded successfully");

          // Check for common API key issues
          setTimeout(() => {
            if (window.google && window.google.maps) {
              try {
                // Try to create a test map to check permissions
                const testDiv = document.createElement("div");
                testDiv.style.width = "1px";
                testDiv.style.height = "1px";
                testDiv.style.position = "absolute";
                testDiv.style.top = "-1000px";
                document.body.appendChild(testDiv);

                const testMap = new window.google.maps.Map(testDiv, {
                  center: { lat: 0, lng: 0 },
                  zoom: 1,
                });

                setTimeout(() => {
                  const hasTiles = testDiv.querySelector(
                    'img[src*="maps.googleapis.com"]'
                  );
                  console.log("API Key permissions test:", {
                    hasTiles: !!hasTiles,
                  });
                  if (!hasTiles) {
                    console.warn(
                      "API Key may not have proper permissions for Maps JavaScript API"
                    );
                    setError(
                      "Google Maps API key may not have proper permissions. Please check your API key settings in Google Cloud Console."
                    );
                  }
                  document.body.removeChild(testDiv);
                }, 1000);
              } catch (error) {
                console.error("Error testing API key permissions:", error);
              }
            }
          }, 2000);
        } else {
          console.warn("Google Maps script loaded but API not available");
          setError("Google Maps API not available after loading");
          setIsLoadingMaps(false);
          setMapsLoaded(false);
        }
      }, 100);
    };
    script.onerror = (error) => {
      setIsLoadingMaps(false);
      setMapsLoaded(false);
      setError(
        "Failed to load Google Maps. Please check your API key or internet connection."
      );
      console.error("Failed to load Google Maps script:", error);
    };
    document.head.appendChild(script);
  }, []);

  // No movement - tourists are static

  const handleFitToTourists = useCallback(() => {
    if (!(window as unknown as { google?: { maps?: unknown } }).google?.maps)
      return;
    if (tourists.length === 0) return;
    // We create a temporary bounds and let MapView handle it via custom event
    const bounds = new window.google.maps.LatLngBounds();
    tourists.forEach((t) =>
      bounds.extend(
        new window.google.maps.LatLng(t.location.lat, t.location.lng)
      )
    );
    const event = new CustomEvent("fit-to-bounds", {
      detail: { bounds: bounds.toJSON() },
    });
    window.dispatchEvent(event);
  }, [tourists]);

  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const event = new CustomEvent("pan-to", {
          detail: { center: { lat: latitude, lng: longitude } },
        });
        window.dispatchEvent(event);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const handleLogout = useCallback(() => {
    // Clear any stored auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Redirect to login page
    window.location.href = "/login";
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidebar
        tourists={isClient ? tourists : []}
        onFitToTourists={handleFitToTourists}
        onLocateUser={handleLocateUser}
        onLogout={handleLogout}
      />
      {mapsLoaded ? (
        <SimpleMapView
          tourists={isClient ? tourists : []}
          defaultCenter={defaultCenter}
          isLoadingMaps={isLoadingMaps}
          error={error}
          heatPoints={heatPoints}
        />
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            background: "#f8fafc",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🗺️</div>
          <div
            style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}
          >
            Loading Map...
          </div>
          <div style={{ fontSize: "14px", color: "#9ca3af" }}>
            {isLoadingMaps
              ? "Please wait while Google Maps loads"
              : "Initializing map components..."}
          </div>
          {error && (
            <div
              style={{
                marginTop: "16px",
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #fecaca",
                fontSize: "14px",
                maxWidth: "400px",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                ⚠️ Map Error
              </div>
              <div>{error}</div>
              <div
                style={{ fontSize: "12px", marginTop: "8px", color: "#7f1d1d" }}
              >
                To fix this: Create a .env.local file with
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
