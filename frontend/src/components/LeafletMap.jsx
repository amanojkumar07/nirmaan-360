import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, MapPin, ExternalLink, ShieldAlert } from "lucide-react";

// Fix Leaflet's default icon paths in bundler environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export function LeafletMap({ markers = [], height = "450px" }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("gis"); // "gis" or "schematic"

  const getColorForStatus = (riskLevel) => {
    switch ((riskLevel || "").toLowerCase()) {
      case "critical":
        return "#EF4444";
      case "at risk":
        return "#F97316";
      case "watch":
        return "#F59E0B";
      default:
        return "#10B981";
    }
  };

  useEffect(() => {
    if (viewMode !== "gis" || !mapContainerRef.current) return;

    // Destroy existing map if any before recreating
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      // Center on Tamil Nadu (approx 11.1271° N, 78.6569° E)
      const map = L.map(mapContainerRef.current, {
        center: [11.1271, 78.6569],
        zoom: 7,
        scrollWheelZoom: false
      });

      mapInstanceRef.current = map;

      // CartoDB Positron / OSM tiles (crisp enterprise tone)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a> (Demo)',
        maxZoom: 18
      }).addTo(map);

      // Add project markers
      markers.forEach((m) => {
        if (!m.lat || !m.lng) return;

        const color = getColorForStatus(m.riskLevel || m.status);
        const customIcon = L.divIcon({
          className: "custom-gis-pin",
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background-color: ${color};
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <div style="width: 6px; height: 6px; background-color: #ffffff; border-radius: 50%;"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map);

        const popupContent = document.createElement("div");
        popupContent.style.fontFamily = "Inter, sans-serif";
        popupContent.style.padding = "4px";
        popupContent.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <strong style="color:#7A1F2B; font-size:11px; font-family:monospace;">${m.id}</strong>
            <span style="background:${color}22; color:${color}; font-size:10px; font-weight:700; padding:2px 6px; border-radius:3px; text-transform:uppercase;">
              ${m.status || m.riskLevel}
            </span>
          </div>
          <div style="font-weight:700; font-size:13px; color:#102A43; line-height:1.2; margin-bottom:6px;">
            ${m.name}
          </div>
          <div style="font-size:11px; color:#627D98; margin-bottom:8px;">
            <div>District: <strong>${m.district || "Tamil Nadu"}</strong></div>
            <div>Physical Progress: <strong>${m.progress || 0}%</strong></div>
            <div>Risk Score: <strong>${m.riskScore || "N/A"}/100</strong></div>
            <div>Budget: <strong>₹${m.budget || 0} Cr</strong></div>
          </div>
          <button id="btn-inspect-${m.id}" style="
            width:100%;
            background:#102A43;
            color:#ffffff;
            border:none;
            padding:5px 8px;
            font-size:11px;
            font-weight:600;
            border-radius:4px;
            cursor:pointer;
          ">
            Inspect Project Details →
          </button>
        `;

        marker.bindPopup(popupContent);

        marker.on("popupopen", () => {
          const btn = document.getElementById(`btn-inspect-${m.id}`);
          if (btn) {
            btn.onclick = () => {
              navigate(`/projects/${m.id}`);
            };
          }
        });
      });
    } catch (e) {
      console.warn("Leaflet map initialization warning:", e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [markers, viewMode, navigate]);

  return (
    <div style={{ position: "relative", width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
      {/* Map Control Overlay */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 1000,
          background: "#ffffff",
          padding: "6px 12px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "0.75rem",
          fontWeight: 600
        }}
      >
        <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
          <Layers size={14} /> Layer:
        </span>
        <button
          onClick={() => setViewMode("gis")}
          style={{
            background: viewMode === "gis" ? "var(--primary-navy)" : "transparent",
            color: viewMode === "gis" ? "#ffffff" : "var(--primary-navy)",
            border: "1px solid var(--border-light)",
            padding: "3px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          OSM GIS
        </button>
        <button
          onClick={() => setViewMode("schematic")}
          style={{
            background: viewMode === "schematic" ? "var(--primary-navy)" : "transparent",
            color: viewMode === "schematic" ? "#ffffff" : "var(--primary-navy)",
            border: "1px solid var(--border-light)",
            padding: "3px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          District Grid
        </button>
      </div>

      {/* Legend Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(4px)",
          padding: "8px 12px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          fontSize: "0.725rem",
          display: "flex",
          gap: "12px",
          alignItems: "center"
        }}
      >
        <span style={{ fontWeight: 700, color: "var(--primary-navy)" }}>Status:</span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} /> Healthy
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} /> Watch
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F97316" }} /> At Risk
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} /> Critical
        </span>
      </div>

      {viewMode === "gis" ? (
        <div ref={mapContainerRef} style={{ height, width: "100%", backgroundColor: "#e2e8f0" }} />
      ) : (
        /* Stylized District Grid Fallback */
        <div
          style={{
            height,
            width: "100%",
            backgroundColor: "#f8fafc",
            padding: "24px",
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "14px"
          }}
        >
          {markers.map((m) => {
            const color = getColorForStatus(m.riskLevel || m.status);
            return (
              <div
                key={m.id}
                onClick={() => navigate(`/projects/${m.id}`)}
                style={{
                  background: "#ffffff",
                  border: `1.5px solid ${color}44`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: "6px",
                  padding: "12px",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "transform 0.15s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, color: "var(--gov-maroon)" }}>
                    {m.id}
                  </span>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color, textTransform: "uppercase" }}>
                    {m.status || m.riskLevel}
                  </span>
                </div>
                <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", margin: "4px 0" }}>
                  {m.name}
                </div>
                <div style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                  {m.district} · Progress: {m.progress}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
