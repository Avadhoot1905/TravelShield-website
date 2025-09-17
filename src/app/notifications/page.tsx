"use client";

import React, { useState } from "react";

// Types
type ZoneType = "green" | "orange" | "red";

interface TouristNotification {
  id: string;
  name: string;
  phone: string;
  address: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  zone: ZoneType;
  lastUpdated: number;
  emergencyContact?: string;
  nationality?: string;
  passportNumber?: string;
}

// Dummy data generator
function generateNotificationData(): TouristNotification[] {
  const names = [
    "Sarah Johnson", "Michael Chen", "Emma Rodriguez", "David Kim", "Lisa Wang",
    "James Wilson", "Maria Garcia", "Robert Brown", "Anna Schmidt", "John Davis",
    "Sophie Martin", "Ahmed Hassan", "Yuki Tanaka", "Carlos Silva", "Priya Patel"
  ];

  const addresses = [
    "123 Main Street, New York, NY", "456 Oak Avenue, Los Angeles, CA", "789 Pine Road, Chicago, IL",
    "321 Elm Street, Houston, TX", "654 Maple Drive, Phoenix, AZ", "987 Cedar Lane, Philadelphia, PA",
    "147 Birch Boulevard, San Antonio, TX", "258 Spruce Street, San Diego, CA", "369 Willow Way, Dallas, TX",
    "741 Poplar Place, San Jose, CA", "852 Ash Avenue, Austin, TX", "963 Hickory Hill, Jacksonville, FL",
    "159 Cherry Court, Fort Worth, TX", "357 Walnut Walk, Columbus, OH", "468 Sycamore Street, Charlotte, NC"
  ];

  const locations = [
    { lat: 25.5, lng: 93.0, address: "Guwahati, Assam" },
    { lat: 26.1, lng: 91.7, address: "Dispur, Assam" },
    { lat: 25.8, lng: 93.4, address: "Jorhat, Assam" },
    { lat: 24.8, lng: 93.9, address: "Imphal, Manipur" },
    { lat: 25.7, lng: 94.1, address: "Kohima, Nagaland" },
    { lat: 23.7, lng: 92.7, address: "Aizawl, Mizoram" },
    { lat: 22.5, lng: 91.8, address: "Agartala, Tripura" },
    { lat: 26.2, lng: 92.0, address: "Tezpur, Assam" },
    { lat: 25.9, lng: 91.9, address: "Nagaon, Assam" },
    { lat: 24.6, lng: 93.0, address: "Churachandpur, Manipur" }
  ];

  const zones: ZoneType[] = ["green", "orange", "red"];
  const nationalities = ["US", "UK", "Canada", "Australia", "Germany", "France", "Japan", "South Korea", "India", "Brazil"];

  return names.map((name, index) => ({
    id: `notification-${index}`,
    name,
    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    address: addresses[index % addresses.length],
    currentLocation: locations[index % locations.length],
    zone: zones[Math.floor(Math.random() * zones.length)],
    lastUpdated: Date.now() - Math.floor(Math.random() * 3600000), // Within last hour
    emergencyContact: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    passportNumber: `${Math.floor(Math.random() * 900000) + 100000}`
  }));
}

export default function NotificationsPage() {
  const [notifications] = useState<TouristNotification[]>(generateNotificationData());
  const [selectedTourist, setSelectedTourist] = useState<TouristNotification | null>(null);

  const handleNotificationClick = (tourist: TouristNotification) => {
    setSelectedTourist(tourist);
  };

  const handleCloseModal = () => {
    setSelectedTourist(null);
  };

  const getZoneClass = (zone: ZoneType) => {
    switch (zone) {
      case "green":
        return "ts-notification-green";
      case "orange":
        return "ts-notification-orange";
      case "red":
        return "ts-notification-red";
      default:
        return "ts-notification-green";
    }
  };

  const getZoneBadgeClass = (zone: ZoneType) => {
    switch (zone) {
      case "green":
        return "ts-zone-badge-green";
      case "orange":
        return "ts-zone-badge-orange";
      case "red":
        return "ts-zone-badge-red";
      default:
        return "ts-zone-badge-green";
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  // Filter notifications by zone (orange and red only as per requirements)
  const filteredNotifications = notifications.filter(n => n.zone === "orange" || n.zone === "red");

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "var(--ts-cream)", 
      padding: "20px" 
    }}>
      <div style={{ 
        maxWidth: "800px", 
        margin: "0 auto",
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "2px solid var(--ts-accent)"
        }}>
          <h1 style={{ 
            fontSize: "28px", 
            fontWeight: "700", 
            color: "var(--ts-primary)",
            margin: 0
          }}>
            Zone Alerts
          </h1>
          <div style={{ 
            display: "flex", 
            gap: "12px" 
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px" 
            }}>
              <div style={{ 
                width: "12px", 
                height: "12px", 
                borderRadius: "50%", 
                background: "var(--ts-orange)" 
              }}></div>
              <span style={{ fontSize: "14px", color: "var(--ts-secondary)" }}>
                Orange Zone ({notifications.filter(n => n.zone === "orange").length})
              </span>
            </div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px" 
            }}>
              <div style={{ 
                width: "12px", 
                height: "12px", 
                borderRadius: "50%", 
                background: "var(--ts-red)" 
              }}></div>
              <span style={{ fontSize: "14px", color: "var(--ts-secondary)" }}>
                Red Zone ({notifications.filter(n => n.zone === "red").length})
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ 
            color: "var(--ts-secondary)", 
            fontSize: "16px",
            margin: 0
          }}>
            Tourists who have entered restricted zones requiring immediate attention.
          </p>
        </div>

        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "12px" 
        }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              color: "var(--ts-secondary)" 
            }}>
              <h3 style={{ margin: "0 0 8px 0", color: "var(--ts-primary)" }}>No Active Alerts</h3>
              <p style={{ margin: 0 }}>All tourists are currently in safe zones.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`ts-notification-strip ${getZoneClass(notification.zone)}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="ts-notification-info">
                  <div className="ts-notification-zone">
                    {notification.name} - {notification.zone.toUpperCase()} ZONE
                  </div>
                  <div className="ts-notification-time">
                    Last updated: {formatTime(notification.lastUpdated)}
                  </div>
                </div>
                <div className={`ts-zone-badge ${getZoneBadgeClass(notification.zone)}`}>
                  {notification.zone.toUpperCase()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back to Dashboard Button */}
        <div style={{ 
          marginTop: "32px", 
          textAlign: "center" 
        }}>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="ts-btn"
            style={{ 
              padding: "12px 24px", 
              fontSize: "16px",
              background: "var(--ts-primary)",
              color: "white",
              border: "2px solid var(--ts-primary)"
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedTourist && (
        <div className="ts-modal-overlay" onClick={handleCloseModal}>
          <div className="ts-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ts-modal-header">
              <h2 className="ts-modal-title">Tourist Details</h2>
              <button className="ts-modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <div className={`ts-zone-badge ${getZoneBadgeClass(selectedTourist.zone)}`}>
                {selectedTourist.zone.toUpperCase()} ZONE
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div className="ts-detail-row">
                <span className="ts-detail-label">Name:</span>
                <span className="ts-detail-value">{selectedTourist.name}</span>
              </div>
              
              <div className="ts-detail-row">
                <span className="ts-detail-label">Phone:</span>
                <span className="ts-detail-value">{selectedTourist.phone}</span>
              </div>
              
              <div className="ts-detail-row">
                <span className="ts-detail-label">Address:</span>
                <span className="ts-detail-value">{selectedTourist.address}</span>
              </div>
              
              <div className="ts-detail-row">
                <span className="ts-detail-label">Current Location:</span>
                <span className="ts-detail-value">{selectedTourist.currentLocation.address}</span>
              </div>
              
              <div className="ts-detail-row">
                <span className="ts-detail-label">Coordinates:</span>
                <span className="ts-detail-value">
                  {selectedTourist.currentLocation.lat.toFixed(6)}, {selectedTourist.currentLocation.lng.toFixed(6)}
                </span>
              </div>
              
              <div className="ts-detail-row">
                <span className="ts-detail-label">Nationality:</span>
                <span className="ts-detail-value">{selectedTourist.nationality}</span>
              </div>
              
              <div className="ts-detail-row">
                <span className="ts-detail-label">Passport:</span>
                <span className="ts-detail-value">{selectedTourist.passportNumber}</span>
              </div>
              
              <div className="ts-detail-row">
                <span className="ts-detail-label">Emergency Contact:</span>
                <span className="ts-detail-value">{selectedTourist.emergencyContact}</span>
              </div>
              
              <div className="ts-detail-row">
                <span className="ts-detail-label">Last Updated:</span>
                <span className="ts-detail-value">{formatTime(selectedTourist.lastUpdated)}</span>
              </div>
            </div>

            <div style={{ 
              marginTop: "24px", 
              display: "flex", 
              gap: "12px", 
              justifyContent: "flex-end" 
            }}>
              <button
                onClick={handleCloseModal}
                className="ts-btn"
                style={{ 
                  background: "var(--ts-accent)", 
                  color: "var(--ts-primary)",
                  border: "2px solid var(--ts-primary)"
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Action for emergency response
                  alert(`Emergency response initiated for ${selectedTourist.name}`);
                  handleCloseModal();
                }}
                className="ts-btn"
                style={{ 
                  background: "var(--ts-red)", 
                  color: "white",
                  border: "2px solid var(--ts-red)"
                }}
              >
                Emergency Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
