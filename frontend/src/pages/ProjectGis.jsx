import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Filter,
  Search,
  RotateCcw,
  Maximize2,
  ExternalLink,
  GitBranch,
  AlertTriangle,
  Building2,
  Clock,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  Layers
} from "lucide-react";
import { fetchGisData, fetchDashboard } from "../api";
import { LeafletMap } from "../components/LeafletMap";
import { SkeletonCard } from "../components/Skeleton";

export function ProjectGis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get("project") || "NMRN-001";

  const [markers, setMarkers] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [gisRes, dashRes] = await Promise.all([
          fetchGisData(),
          fetchDashboard()
        ]);

        if (gisRes?.markers) {
          setMarkers(gisRes.markers);
          const initial = gisRes.markers.find((m) => m.id === initialProjectId) || gisRes.markers[0];
          setSelectedProject(initial || null);
        }
        if (dashRes) {
          setDashboardData(dashRes);
        }
      } catch (e) {
        console.error("[NIRMAAN 360 GIS] Failed to load GIS data:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [initialProjectId]);

  // Extract unique departments & districts for dropdowns
  const departments = useMemo(() => {
    const defaultDepts = [
      "Highways & Minor Ports",
      "Transport Department",
      "Water Resources Department",
      "Health & Family Welfare",
      "Municipal Administration & Water Supply",
      "Housing & Urban Development",
      "Public Works & Coastal"
    ];
    const fromMarkers = markers.map((m) => m.department).filter(Boolean);
    return Array.from(new Set([...fromMarkers, ...defaultDepts]));
  }, [markers]);

  const districts = useMemo(() => {
    return Array.from(new Set(markers.map((m) => m.district))).filter(Boolean);
  }, [markers]);

  // Filter markers dynamically
  const filteredMarkers = useMemo(() => {
    return markers.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = m.id.toLowerCase().includes(q);
        const matchName = m.name.toLowerCase().includes(q);
        const matchDist = (m.district || "").toLowerCase().includes(q);
        const matchLoc = (m.location || "").toLowerCase().includes(q);
        if (!matchId && !matchName && !matchDist && !matchLoc) return false;
      }

      if (departmentFilter && !(m.department || "").toLowerCase().includes(departmentFilter.toLowerCase())) {
        return false;
      }

      if (districtFilter && !(m.district || "").toLowerCase().includes(districtFilter.toLowerCase())) {
        return false;
      }

      if (riskFilter && (m.riskLevel || "").toLowerCase() !== riskFilter.toLowerCase()) {
        return false;
      }

      if (statusFilter && (m.status || "").toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [markers, searchQuery, departmentFilter, districtFilter, riskFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("");
    setDistrictFilter("");
    setRiskFilter("");
    setStatusFilter("");
  };

  const handleSelectFromList = (p) => {
    setSelectedProject(p);
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  // Summary counts
  const totalCount = dashboardData?.kpis?.totalProjects || 128;
  const activeCount = dashboardData?.kpis?.activeProjects || 94;
  const atRiskCount = dashboardData?.kpis?.atRisk || 17;
  const delayedCount = dashboardData?.kpis?.delayed || 11;
  const completedCount = dashboardData?.kpis?.completed || 23;

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: "16px" }}>
        <div>
          <h1 className="page-header-title">
            <MapPin size={26} style={{ color: "var(--gov-maroon)" }} />
            Project GIS View
          </h1>
          <p className="page-header-subtitle">
            Infrastructure project locations and statewide geospatial intelligence
          </p>
        </div>
      </div>

      {/* Map Intelligence Summary Bar */}
      <div
        className="card"
        style={{
          padding: "10px 18px",
          marginBottom: "16px",
          backgroundColor: "#ffffff",
          borderLeft: "5px solid var(--accent-gold)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "0.825rem" }}>
          <strong style={{ color: "var(--primary-navy)", textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "0.75rem" }}>
            Infrastructure Project Distribution:
          </strong>
          <span><strong>{totalCount}</strong> Total Projects</span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ color: "var(--primary-navy)", fontWeight: 600 }}><strong>{activeCount}</strong> Active</span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ color: "var(--status-atrisk)", fontWeight: 700 }}><strong>{atRiskCount}</strong> At Risk</span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ color: "var(--status-critical)", fontWeight: 700 }}><strong>{delayedCount}</strong> Delayed</span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ color: "var(--status-healthy)", fontWeight: 600 }}><strong>{completedCount}</strong> Completed</span>
        </div>

        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Visible on Map: <strong>{filteredMarkers.length}</strong> of {markers.length} mapped assets
        </div>
      </div>

      {/* Main Enterprise GIS Layout: Filters & Side Panel + Map */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "330px 1fr",
          gap: "20px",
          marginBottom: "20px"
        }}
        className="gis-cockpit-grid"
      >
        {/* Left Side: Project Intelligence & Filtering Panel */}
        <div
          className="card"
          style={{
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            height: "640px",
            overflowY: "auto"
          }}
        >
          {/* Panel Header */}
          <div style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--gov-maroon)", letterSpacing: "0.05em" }}>
                PROJECT GIS
              </span>
              <span style={{ fontSize: "0.725rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {markers.length} Monitored
              </span>
            </div>

            {/* Health Mini Bar */}
            <div style={{ display: "flex", gap: "6px", marginTop: "8px", fontSize: "0.7rem", fontWeight: 700 }}>
              <span style={{ color: "var(--status-healthy)" }}>● 71 Healthy</span>
              <span style={{ color: "var(--status-watch)" }}>● 23 Watch</span>
              <span style={{ color: "var(--status-atrisk)" }}>● 17 At Risk</span>
              <span style={{ color: "var(--status-critical)" }}>● 5 Critical</span>
            </div>
          </div>

          {/* Search Project Input */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "4px" }}>
              Search Project / District
            </label>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="input-gov"
                style={{ width: "100%", paddingLeft: "30px", fontSize: "0.8rem", padding: "6px 10px 6px 30px" }}
                placeholder="e.g. Tindivanam, NMRN-001..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "4px" }}>
              Department
            </label>
            <select
              className="select-gov"
              style={{ width: "100%", fontSize: "0.8rem", padding: "6px 8px" }}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "4px" }}>
              District
            </label>
            <select
              className="select-gov"
              style={{ width: "100%", fontSize: "0.8rem", padding: "6px 8px" }}
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="">All Districts ({districts.length})</option>
              {districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Tier & Status Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "4px" }}>
                Risk Tier
              </label>
              <select
                className="select-gov"
                style={{ width: "100%", fontSize: "0.775rem", padding: "6px" }}
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="">All Risks</option>
                <option value="Healthy">Healthy</option>
                <option value="Watch">Watch</option>
                <option value="At Risk">At Risk</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "4px" }}>
                Status
              </label>
              <select
                className="select-gov"
                style={{ width: "100%", fontSize: "0.775rem", padding: "6px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Healthy">Healthy</option>
                <option value="Watch">Watch</option>
                <option value="At Risk">At Risk</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {(searchQuery || departmentFilter || districtFilter || riskFilter || statusFilter) && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleResetFilters}
              style={{ fontSize: "0.75rem", padding: "4px 8px", width: "100%", justifyContent: "center" }}
            >
              <RotateCcw size={12} /> Clear Filter Constraints
            </button>
          )}

          {/* Filtered Project Results List (Quick Selector) */}
          <div style={{ flex: 1, minHeight: "150px", overflowY: "auto", borderTop: "1px solid var(--border-light)", paddingTop: "10px" }}>
            <div style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
              Matching Projects ({filteredMarkers.length})
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {filteredMarkers.slice(0, 15).map((p) => {
                const isSelected = selectedProject?.id === p.id;
                const color = (p.riskLevel || p.status || "").toLowerCase().includes("critical")
                  ? "var(--status-critical)"
                  : (p.riskLevel || p.status || "").toLowerCase().includes("risk")
                  ? "var(--status-atrisk)"
                  : (p.riskLevel || p.status || "").toLowerCase().includes("watch")
                  ? "var(--status-watch)"
                  : "var(--status-healthy)";

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectFromList(p)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: `1px solid ${isSelected ? "var(--primary-navy)" : "var(--border-light)"}`,
                      borderLeft: `3px solid ${color}`,
                      backgroundColor: isSelected ? "rgba(16, 42, 67, 0.05)" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.12s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.725rem", fontWeight: 700, color: "var(--gov-maroon)" }}>
                        {p.id}
                      </span>
                      <span style={{ fontSize: "0.675rem", fontWeight: 700, color }}>
                        {p.status || p.riskLevel}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.775rem", fontWeight: 700, color: "var(--primary-navy)", lineHeight: 1.25, marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "0.675rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {p.district} · Progress: {p.actualProgress ?? p.progress}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: OpenStreetMap Map Canvas */}
        <div style={{ display: "flex", flexDirection: "column", height: "640px" }}>
          <LeafletMap
            markers={filteredMarkers}
            height="100%"
            selectedProject={selectedProject}
            onSelectProject={(p) => setSelectedProject(p)}
          />
        </div>
      </div>

      {/* Bottom Selected Project Details Card */}
      {selectedProject && (
        <div
          className="card"
          style={{
            borderLeft: `5px solid ${
              (selectedProject.riskLevel || selectedProject.status || "").toLowerCase().includes("critical")
                ? "var(--status-critical)"
                : (selectedProject.riskLevel || selectedProject.status || "").toLowerCase().includes("risk")
                ? "var(--status-atrisk)"
                : (selectedProject.riskLevel || selectedProject.status || "").toLowerCase().includes("watch")
                ? "var(--status-watch)"
                : "var(--status-healthy)"
            }`,
            backgroundColor: "#ffffff",
            padding: "18px 22px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                  Selected Project Dossier
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--gov-maroon)", fontSize: "0.85rem" }}>
                  {selectedProject.id}
                </span>
                <span className={`badge badge-${(selectedProject.status || selectedProject.riskLevel || "Healthy").toLowerCase().replace(" ", "")}`}>
                  {selectedProject.status || selectedProject.riskLevel}
                </span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary-navy)", lineHeight: 1.2 }}>
                {selectedProject.name}
              </h2>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "3px" }}>
                Department: <strong>{selectedProject.department}</strong> · Location: <strong>{selectedProject.location || selectedProject.district}</strong> ({selectedProject.district})
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/projects/${selectedProject.id}`)}
              >
                <Building2 size={14} /> View Project
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate(`/dependencies?project=${selectedProject.id}`)}
              >
                <GitBranch size={14} /> View Dependencies
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate(`/risks?project=${selectedProject.id}`)}
              >
                <AlertTriangle size={14} /> View Risk
              </button>
            </div>
          </div>

          {/* Metric Badges Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
              borderTop: "1px solid var(--border-light)",
              paddingTop: "14px"
            }}
          >
            <div style={{ background: "var(--bg-subtle)", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.675rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Physical Accomplishment
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                {selectedProject.actualProgress ?? selectedProject.progress ?? 0}%
              </div>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.675rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Risk Index
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: selectedProject.riskScore >= 70 ? "var(--status-critical)" : selectedProject.riskScore >= 50 ? "var(--status-atrisk)" : "var(--status-healthy)" }}>
                {selectedProject.riskScore || "N/A"} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>/ 100</span>
              </div>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.675rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Estimated Delay
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: selectedProject.delayDays > 0 ? "var(--status-critical)" : "var(--status-healthy)" }}>
                {selectedProject.delayDays > 0 ? `+${selectedProject.delayDays} days` : "On Schedule"}
              </div>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.675rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Fiscal Outlay (Spent / Sanctioned)
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                ₹{selectedProject.utilizedBudget || (selectedProject.budget * 0.65).toFixed(0)} Cr <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>/ ₹{selectedProject.budget} Cr</span>
              </div>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.675rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Primary Bottleneck
              </div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: selectedProject.primaryBottleneck ? "var(--status-critical)" : "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {selectedProject.primaryBottleneck || "None (On Schedule)"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
