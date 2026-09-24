import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Filter, Layers, Building2, AlertTriangle, ArrowRight } from "lucide-react";
import { fetchGisData } from "../api";
import { LeafletMap } from "../components/LeafletMap";
import { SkeletonCard } from "../components/Skeleton";

export function ProjectGis() {
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const [districtFilter, setDistrictFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchGisData();
        if (res?.markers) setMarkers(res.markers);
      } catch (e) {
        console.error("GIS load error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return <SkeletonCard />;
  }

  const districts = Array.from(new Set(markers.map((m) => m.district))).filter(Boolean);
  const departments = Array.from(new Set(markers.map((m) => m.department))).filter(Boolean);

  const filteredMarkers = markers.filter((m) => {
    if (districtFilter && !m.district.toLowerCase().includes(districtFilter.toLowerCase())) return false;
    if (riskFilter && (m.riskLevel || "").toLowerCase() !== riskFilter.toLowerCase()) return false;
    if (deptFilter && (m.department || "").toLowerCase() !== deptFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <MapPin size={28} style={{ color: "var(--gov-maroon)" }} />
            Project GIS Geospatial Cockpit
          </h1>
          <p className="page-header-subtitle">
            Geographic Information System mapping infrastructure assets, district clusters and spatial risk density.
          </p>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="card" style={{ marginBottom: "20px", padding: "14px 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <select
            className="select-gov"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            <option value="">All Districts ({districts.length})</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            className="select-gov"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>

          <select
            className="select-gov"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="">All Risk Tiers</option>
            <option value="Healthy">Healthy</option>
            <option value="Watch">Watch</option>
            <option value="At Risk">At Risk</option>
            <option value="Critical">Critical</option>
          </select>

          {(districtFilter || riskFilter || deptFilter) && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setDistrictFilter("");
                setRiskFilter("");
                setDeptFilter("");
              }}
            >
              Reset Layers
            </button>
          )}

          <div style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Plotting {filteredMarkers.length} geolocated works
          </div>
        </div>
      </div>

      {/* Main Full GIS Map */}
      <div className="card" style={{ padding: "14px" }}>
        <LeafletMap markers={filteredMarkers} height="560px" />
      </div>
    </div>
  );
}
