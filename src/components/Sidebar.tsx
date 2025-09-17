"use client";

import React from "react";
import type { Tourist } from "./MapView";

type SidebarProps = {
  tourists: Tourist[];
  onFitToTourists: () => void;
  onLocateUser: () => void;
  onLogout: () => void;
};

export default function Sidebar(props: SidebarProps) {
  const { tourists, onFitToTourists, onLocateUser, onLogout } = props;

  return (
    <aside className="ts-sidebar">
      <h2 className="ts-sidebar-title">Operations Dashboard</h2>
      <div className="ts-actions">
        <button onClick={onFitToTourists} className="ts-btn">View Current Locations</button>
        <button onClick={onLocateUser} className="ts-btn">My Location</button>
      </div>
      <div className="ts-section">
        <h3 className="ts-section-title">Notifications</h3>
        <div 
          className="ts-card" 
          style={{ cursor: "pointer", transition: "all 0.2s ease" }}
          onClick={() => window.location.href = "/notifications"}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--ts-accent)";
            e.currentTarget.style.transform = "translateX(2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--ts-cream)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          View Zone Alerts →
        </div>
      </div>
      <div className="ts-section">
        <h3 className="ts-section-title">Tourists ({tourists.length})</h3>
        <div className="ts-list">
          {tourists.slice(0, 20).map((t) => (
            <div key={t.id} className="ts-list-item">
              <span>{t.name}</span>
              <span className="ts-muted">
                {t.location.lat.toFixed(3)}, {t.location.lng.toFixed(3)}
              </span>
            </div>
          ))}
          {tourists.length > 20 && (
            <div style={{ 
              textAlign: "center", 
              padding: "8px", 
              color: "var(--ts-secondary)", 
              fontSize: "12px" 
            }}>
              ... and {tourists.length - 20} more
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <button onClick={onLogout} className="ts-btn" style={{ width: '100%', background: '#dc2626', color: 'white', border: '2px solid #dc2626' }}>
          Logout
        </button>
      </div>
    </aside>
  );
}


