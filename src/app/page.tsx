"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // User is logged in, redirect to dashboard
      router.push('/dashboard');
    } else {
      // User is not logged in, redirect to login
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      background: "var(--ts-cream)",
      color: "var(--ts-primary)"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "24px", marginBottom: "16px" }}>🛡️</div>
        <div style={{ fontSize: "18px", fontWeight: "600" }}>TravelShield</div>
        <div style={{ fontSize: "14px", marginTop: "8px", color: "var(--ts-secondary)" }}>
          Redirecting...
        </div>
      </div>
    </div>
  );
}
