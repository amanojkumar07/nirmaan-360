import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RotateCcw, Maximize2, AlertCircle, ExternalLink, Layers } from "lucide-react";

// Fix Leaflet's default icon paths in bundler environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const DEFAULT_CENTER = [12.4037, 79.2101];
const DEFAULT_ZOOM = 10;

export function LeafletMap({
  markers = [],
  height = "560px",
  selectedProject = null,
  onSelectProject = null,
  onResetView = null,
  onFitAll = null,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const markerMapRef = useRef(new Map());
  const navigate = useNavigate();

  const [tileError, setTileError] = useState(false);

  const getColorForStatus = (riskLevel, status) => {
    const val = (riskLevel || status || "").toLowerCase();
    if (val.includes("critical")) return "#EF4444";
    if (val.includes("at risk") || val.includes("atrisk")) return "#F97316";
    if (val.includes("watch")) return "#F59E0B";
    return "#10B981";
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: center || DEFAULT_CENTER,
        zoom: zoom || DEFAULT_ZOOM,
        scrollWheelZoom: true,
        zoomControl: true
      });

      mapInstanceRef.current = map;

      // Standard OpenStreetMap Tiles without API Key
      const osmTileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19
      });

      osmTileLayer.on("tileerror", () => {
        setTileError(true);
      });

      osmTileLayer.addTo(map);

      // Create LayerGroup for markers
      const markerGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markerGroup;
    } catch (e) {
      console.warn("[NIRMAAN 360 GIS] Map initialization warning:", e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when marker data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    markerMapRef.current.clear();

    markers.forEach((m) => {
      const lat = m.latitude || m.lat;
      const lng = m.longitude || m.lng;
      if (!lat || !lng) return;

      const color = getColorForStatus(m.riskLevel, m.status);
      const isCriticalOrAtRisk = (m.riskLevel || m.status || "").toLowerCase().includes("risk") || (m.riskLevel || m.status || "").toLowerCase().includes("critical");

      const iconHtml = `
        <div style="position: relative; width: 30px; height: 36px; cursor: pointer;">
          <svg viewBox="0 0 30 36" width="30" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 21 15 21s15-10.5 15-21c0-8.284-6.716-15-15-15z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
            <circle cx="15" cy="14" r="5" fill="#ffffff"/>
            ${isCriticalOrAtRisk ? `<circle cx="15" cy="14" r="2.5" fill="${color}"/>` : ''}
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "nirmaan-osm-marker",
        html: iconHtml,
        iconSize: [30, 36],
        iconAnchor: [15, 36],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(group);
      markerMapRef.current.set(m.id, marker);

      // Create rich structured popup
      const popupDiv = document.createElement("div");
      popupDiv.style.fontFamily = "'Inter', -apple-system, sans-serif";
      popupDiv.style.padding = "2px";
      popupDiv.style.minWidth = "230px";

      const utilizedStr = m.utilizedBudget ? `₹${m.utilizedBudget} Cr` : (m.budget ? `₹${(m.budget * 0.65).toFixed(0)} Cr` : "N/A");
      const expectedCompletionStr = m.expectedCompletion || m.revisedCompletionDate || m.completionDate || "18 Aug 2027";
      const progressVal = m.actualProgress ?? m.progress ?? 0;
      const statusLabel = m.status || m.riskLevel || "Active";

      popupDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
          <strong style="color:#7A1F2B; font-size:12px; font-family:monospace; letter-spacing:0.04em;">${m.id}</strong>
          <span style="background:${color}22; color:${color}; font-size:10px; font-weight:700; padding:2px 7px; border-radius:4px; text-transform:uppercase; border:1px solid ${color}44;">
            ● ${statusLabel}
          </span>
        </div>
        <div style="font-weight:700; font-size:13px; color:#102A43; line-height:1.25; margin-bottom:8px;">
          ${m.name}
        </div>
        <div style="font-size:11px; color:#627D98; display:flex; flex-direction:column; gap:3px; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between;">
            <span>Physical Progress:</span>
            <strong style="color:#102A43;">${progressVal}%</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Risk Score:</span>
            <strong style="color:${color};">${m.riskScore || "N/A"} / 100</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Sanctioned Budget:</span>
            <strong style="color:#102A43;">₹${m.budget || 0} Cr</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Utilized Outlay:</span>
            <strong style="color:#102A43;">${utilizedStr}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Expected Completion:</span>
            <strong style="color:#102A43;">${expectedCompletionStr}</strong>
          </div>
        </div>
        <button id="btn-popup-inspect-${m.id}" style="
          width:100%;
          background:#102A43;
          color:#ffffff;
          border:none;
          padding:7px 10px;
          font-size:11px;
          font-weight:700;
          border-radius:5px;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:4px;
          letter-spacing:0.03em;
        ">
          VIEW PROJECT →
        </button>
      `;

      marker.bindPopup(popupDiv);

      marker.on("click", () => {
        if (onSelectProject) {
          onSelectProject(m);
        }
      });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`btn-popup-inspect-${m.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            navigate(`/projects/${m.id}`);
          };
        }
      });
    });
  }, [markers, navigate, onSelectProject]);

  // Handle selectedProject pan & popup
  useEffect(() => {
    if (!selectedProject || !mapInstanceRef.current) return;
    const lat = selectedProject.latitude || selectedProject.lat;
    const lng = selectedProject.longitude || selectedProject.lng;
    if (lat && lng) {
      mapInstanceRef.current.flyTo([lat, lng], 12, { animate: true, duration: 1 });
      const marker = markerMapRef.current.get(selectedProject.id);
      if (marker) {
        setTimeout(() => marker.openPopup(), 400);
      }
    }
  }, [selectedProject]);

  // Map Controls: Reset to default view (12.4037, 79.2101, Zoom 10)
  const handleResetMap = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
    }
    if (onResetView) onResetView();
  }, [onResetView]);

  // Map Controls: View all projects (fitBounds)
  const handleFitAll = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const validCoords = markers
      .map((m) => [m.latitude || m.lat, m.longitude || m.lng])
      .filter(([lat, lng]) => Boolean(lat && lng));

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
    }

    if (onFitAll) onFitAll();
  }, [markers, onFitAll]);

  return (
    <div style={{ position: "relative", width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
      {/* Map Tile Error Fallback Notice */}
      {tileError && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1001,
            backgroundColor: "#fffbeb",
            color: "#92400e",
            borderBottom: "1px solid #fde68a",
            padding: "8px 14px",
            fontSize: "0.775rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <AlertCircle size={15} style={{ color: "#d97706", flexShrink: 0 }} />
          <span>Map tiles could not be loaded. Project location data is still available.</span>
        </div>
      )}

      {/* Floating Action Controls on Map (Top Right) */}
      <div
        style={{
          position: "absolute",
          top: tileError ? "42px" : "12px",
          right: "12px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(6px)",
          padding: "6px 10px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(16, 42, 67, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "1px solid var(--border-light)"
        }}
      >
        <button
          onClick={handleResetMap}
          className="btn btn-secondary btn-sm"
          style={{ padding: "4px 8px", fontSize: "0.725rem", gap: "4px" }}
          title="Reset map view to default center (12.4037, 79.2101, Zoom 10)"
        >
          <RotateCcw size={12} /> RESET MAP
        </button>

        <button
          onClick={handleFitAll}
          className="btn btn-primary btn-sm"
          style={{ padding: "4px 8px", fontSize: "0.725rem", gap: "4px" }}
          title="Fit bounds to view all project locations"
        >
          <Maximize2 size={12} /> VIEW ALL PROJECTS
        </button>
      </div>

      {/* Status Legend Overlay (Bottom Left) */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(6px)",
          padding: "7px 12px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(16, 42, 67, 0.12)",
          fontSize: "0.725rem",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          border: "1px solid var(--border-light)"
        }}
      >
        <span style={{ fontWeight: 700, color: "var(--primary-navy)" }}>Project Health:</span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-main)", fontWeight: 600 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#10B981" }} /> Healthy
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-main)", fontWeight: 600 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#F59E0B" }} /> Watch
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-main)", fontWeight: 600 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#F97316" }} /> At Risk
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-main)", fontWeight: 600 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#EF4444" }} /> Critical
        </span>
      </div>

      {/* Leaflet Map Div */}
      <div
        ref={mapContainerRef}
        style={{
          height,
          minHeight: "400px",
          width: "100%",
          backgroundColor: "#e2e8f0"
        }}
      />
    </div>
  );
}
