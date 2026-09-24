import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Search,
  Filter,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  X
} from "lucide-react";
import { fetchEvidence, fetchProjects } from "../api";
import { SkeletonCard } from "../components/Skeleton";

export function EvidenceRepository() {
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [eRes, pRes] = await Promise.all([fetchEvidence(), fetchProjects()]);
        if (eRes?.evidenceItems) setEvidenceItems(eRes.evidenceItems);
        if (pRes?.projects) setProjectList(pRes.projects);
      } catch (e) {
        console.error("Evidence repository fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return <SkeletonCard />;
  }

  const filteredItems = evidenceItems.filter((item) => {
    if (selectedProject && item.projectId !== selectedProject) return false;
    if (statusFilter && item.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <ImageIcon size={28} style={{ color: "var(--gov-maroon)" }} />
            Evidence Repository
          </h1>
          <p className="page-header-subtitle">
            Central repository of geo-tagged photographic evidence, site telemetry notes and quality audits.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card" style={{ marginBottom: "20px", padding: "14px 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <select
            className="select-gov"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">All Projects</option>
            {projectList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.name.substring(0, 30)}...
              </option>
            ))}
          </select>

          <select
            className="select-gov"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Verification Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Requires Review">Requires Review</option>
            <option value="Watch">Watch</option>
          </select>

          {(selectedProject || statusFilter) && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSelectedProject("");
                setStatusFilter("");
              }}
            >
              Reset Filters
            </button>
          )}

          <div style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Showing {filteredItems.length} photographic records
          </div>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="evidence-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="evidence-card">
            <div className="evidence-image-wrap">
              <img src={item.photoUrl} alt={item.tag} className="evidence-image" />
              <span className="evidence-tag-pill">{item.tag}</span>
              <button
                onClick={() => setSelectedImageModal(item)}
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  background: "rgba(16, 42, 67, 0.8)",
                  border: "none",
                  color: "#ffffff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.7rem",
                  fontWeight: 600
                }}
              >
                <ZoomIn size={12} /> Inspect
              </button>
            </div>

            <div style={{ padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--gov-maroon)" }}>
                  {item.projectId}
                </span>
                <span className={`badge badge-${item.status.toLowerCase().replace(" ", "")}`}>
                  {item.status}
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary-navy)", marginBottom: "6px" }}>
                {item.projectName}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "0.725rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <User size={12} /> Officer: {item.officer}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={12} /> {item.date} · {item.time}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-mono)" }}>
                  <MapPin size={12} /> {item.gps}
                </div>
              </div>

              <div style={{ fontSize: "0.775rem", color: "var(--text-main)", background: "var(--bg-subtle)", padding: "8px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
                {item.remarks}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Zoom View */}
      {selectedImageModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(11, 29, 48, 0.8)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setSelectedImageModal(null)}
        >
          <div
            className="card"
            style={{ maxWidth: "700px", width: "100%", padding: "20px", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <h3 className="card-title">Evidence Dossier: {selectedImageModal.id}</h3>
                <p className="card-subtitle">{selectedImageModal.projectName} ({selectedImageModal.projectId})</p>
              </div>
              <button
                onClick={() => setSelectedImageModal(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: "380px", overflow: "hidden", borderRadius: "8px", marginBottom: "14px" }}>
              <img src={selectedImageModal.photoUrl} alt="Enlarged evidence" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.8rem", color: "var(--text-main)" }}>
              <div><strong>Field Officer:</strong> {selectedImageModal.officer}</div>
              <div><strong>Timestamp:</strong> {selectedImageModal.date} {selectedImageModal.time}</div>
              <div><strong>GPS Tag:</strong> {selectedImageModal.gps}</div>
              <div><strong>Verified Status:</strong> {selectedImageModal.status}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
