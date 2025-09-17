"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Google Maps script loader and components
import SimpleMapView, { Tourist } from "../../components/SimpleMapView";
import Sidebar from "../../components/Sidebar";

// Types
type TouristLocal = Tourist;

// Enhanced mock data generator with realistic tourist names
function generateMockTourists(count: number, center: { lat: number; lng: number }): Tourist[] {
  const names = [
    "Sarah Johnson", "Michael Chen", "Emma Rodriguez", "David Kim", "Lisa Wang",
    "James Wilson", "Maria Garcia", "Robert Brown", "Anna Schmidt", "John Davis",
    "Sophie Martin", "Ahmed Hassan", "Yuki Tanaka", "Carlos Silva", "Priya Patel",
    "Alex Thompson", "Nina Petrov", "Hiroshi Yamamoto", "Isabella Rossi", "Marcus Johnson",
    "Elena Popov", "Rajesh Kumar", "Jennifer Lee", "Mohammed Ali", "Catherine O'Connor",
    "Thomas Mueller", "Aisha Khan", "Lucas Anderson", "Fatima Al-Zahra", "Daniel Kim",
    "Sofia Rodriguez", "Arjun Patel", "Emily Watson", "Hassan Al-Mahmoud", "Grace Liu",
    "Oliver Smith", "Zara Ahmed", "Liam O'Brien", "Aria Singh", "Noah Johnson",
    "Maya Patel", "Ethan Brown", "Luna Garcia", "Mason Davis", "Chloe Wilson",
    "Jackson Miller", "Ava Martinez", "Lucas Taylor", "Isabella Anderson", "William Thomas",
    "Sophia Jackson", "Benjamin White", "Mia Harris", "Alexander Martin", "Charlotte Thompson",
    "James Garcia", "Amelia Martinez", "Michael Robinson", "Harper Clark", "Daniel Rodriguez",
    "Evelyn Lewis", "Matthew Lee", "Abigail Walker", "Anthony Hall", "Emily Allen",
    "Christopher Young", "Elizabeth King", "Andrew Wright", "Samantha Lopez", "Joshua Hill",
    "Madison Scott", "Ryan Green", "Ashley Adams", "Nicholas Baker", "Brittany Nelson",
    "Tyler Carter", "Stephanie Mitchell", "Brandon Perez", "Nicole Roberts", "Jacob Turner",
    "Rachel Phillips", "Zachary Campbell", "Lauren Parker", "Kevin Evans", "Megan Edwards",
    "Justin Collins", "Kayla Stewart", "Tyler Sanchez", "Brittany Morris", "Austin Rogers",
    "Samantha Reed", "Jordan Cook", "Taylor Morgan", "Hunter Bell", "Destiny Murphy",
    "Cameron Bailey", "Jasmine Rivera", "Blake Cooper", "Sierra Richardson", "Connor Cox",
    "Makayla Ward", "Landon Torres", "Paige Peterson", "Caleb Gray", "Jenna Ramirez",
    "Isaac James", "Brooke Watson", "Nathan Brooks", "Kaitlyn Kelly", "Luke Sanders",
    "Mackenzie Price", "Owen Bennett", "Haley Wood", "Gavin Barnes", "Jocelyn Ross",
    "Landon Henderson", "Jade Coleman", "Eli Jenkins", "Molly Perry", "Carson Powell",
    "Savannah Long", "Parker Patterson", "Faith Hughes", "Colton Flores", "Jillian Washington",
    "Brayden Butler", "Kendall Simmons", "Jaxon Foster", "Makenzie Gonzales", "Preston Bryant",
    "Jordyn Alexander", "Tristan Russell", "Payton Griffin", "Bryce Diaz", "Kylie Hayes"
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
        lng: center.lng + lngOffset + (Math.random() - 0.5) * 0.5 
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
    console.log('Generated tourists:', mockTourists.length);
  }, [defaultCenter]);

  // Load Google Maps JS API (v=weekly to ensure modern features)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google && window.google.maps) {
      setIsLoadingMaps(false);
      return; // already loaded
    }

    // Check if script is already being loaded or exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      return; // script already exists
    }

    // If no API key, show a warning but still try to load with a demo key
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      console.warn("No Google Maps API key found. Map may not load properly.");
      setError("No Google Maps API key found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local for full functionality.");
    }

    setIsLoadingMaps(true);
    const script = document.createElement("script");
    // Use a demo key if no API key is provided (limited functionality)
    const apiKey = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY' 
      ? GOOGLE_MAPS_API_KEY 
      : 'AIzaSyBFw0Qbyq9zTFTd-tUY6dgsWcQfWzJjJjJ'; // This is a placeholder - won't work
    
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoadingMaps(false);
      setMapsLoaded(true);
      console.log("Google Maps loaded successfully");
    };
    script.onerror = () => {
      setIsLoadingMaps(false);
      setMapsLoaded(false);
      setError("Failed to load Google Maps. Using fallback view. Please check your API key or internet connection.");
      console.error("Failed to load Google Maps script");
    };
    document.head.appendChild(script);
  }, []);

  // No movement - tourists are static

  const handleFitToTourists = useCallback(() => {
    if (!(window as any).google || !(window as any).google.maps) return;
    if (tourists.length === 0) return;
    // We create a temporary bounds and let MapView handle it via custom event
    const bounds = new window.google.maps.LatLngBounds();
    tourists.forEach((t) => bounds.extend(new window.google.maps.LatLng(t.location.lat, t.location.lng)));
    const event = new CustomEvent("fit-to-bounds", { detail: { bounds: bounds.toJSON() } });
    window.dispatchEvent(event);
  }, [tourists]);

  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const event = new CustomEvent("pan-to", { detail: { center: { lat: latitude, lng: longitude } } });
        window.dispatchEvent(event);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const handleLogout = useCallback(() => {
    // Clear any stored auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login';
  }, []);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", width: "100%" }}>
      <Sidebar tourists={isClient ? tourists : []} onFitToTourists={handleFitToTourists} onLocateUser={handleLocateUser} onLogout={handleLogout} />
      mapsLoaded ? (
        <SimpleMapView tourists={isClient ? tourists : []} defaultCenter={defaultCenter} isLoadingMaps={isLoadingMaps} error={null} />
      )
    </div>
  );
}


