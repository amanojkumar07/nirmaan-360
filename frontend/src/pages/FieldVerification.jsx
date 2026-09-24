import React, { useState, useEffect } from "react";
import {
  ClipboardCheck,
  Camera,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  X,
  FileCheck2,
  Filter
} from "lucide-react";
import { fetchFieldReports } from "../api";
import { useToast } from "../components/Toast";
import { SkeletonCard, SkeletonTable } from "../components/Skeleton";

export function FieldVerification() {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // New report modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectId, setNewProjectId] = useState("NMRN-001");
  const [newReported, setNewReported] = useState(60);
  const [newVerified, setNewVerified] = useState(54);
  const [newRemarks, setNewRemarks] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchFieldReports();
        if (res) {
          setData(res);
          if (res.reports && res.reports.length > 0) {
            setSelectedReport(res.reports[0]);
          }
        }
      } catch (e) {
        console.error("Field verification load error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !data) {
    return <SkeletonCard />;
  }

  const { reports, summary } = data;

  const filteredReports = statusFilter === "All"
    ? reports
    : reports.filter((r) => r.status.toLowerCase() === statusFilter.toLowerCase());

  const handleCreateReport = (e) => {
    e.preventDefault();
    const variance = +(newVerified - newReported).toFixed(1);
    const newReport = {
      id: `FR-2026-${reports.length + 101}`,
      projectId: newProjectId,
      projectName: newProjectId === "NMRN-001" ? "Chennai Outer Ring Road Expansion" : "Tindivanam Bus Terminal",
      officer: "Arun Kumar, AE",
      date: "2026-09-24",
      time: "11:45 AM",
      gps: "13.0827° N, 80.2707° E",
      reportedProgress: Number(newReported),
      verifiedProgress: Number(newVerified),
      variance,
      status: Math.abs(variance) > 5 ? "Requires Review" : "Verified",
      remarks: newRemarks || "Site inspection conducted using calibrated mobile survey tool.",
      evidencePhoto: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80",
      evidenceTag: "Civil Verification",
      verified: true
    };

    setData((prev) => ({
      ...prev,
      reports: [newReport, ...prev.reports],
      summary: {
        ...prev.summary,
        verifiedToday: prev.summary.verifiedToday + 1,
        requiresReview: Math.abs(variance) > 5 ? prev.summary.requiresReview + 1 : prev.summary.requiresReview
      }
    }));
    setSelectedReport(newReport);
    setShowAddModal(false);
    addToast("New field verification report recorded.", "success");
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <ClipboardCheck size={28} style={{ color: "var(--gov-maroon)" }} />
            Field Operations & Verification
          </h1>
          <p className="page-header-subtitle">
            Ground telemetry verification, geo-tagged site evidence audits and contractor claim variance detection.
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> New Field Audit Entry
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: "24px" }}>
        <div className="kpi-card kpi-atrisk">
          <div className="kpi-top-row">
            <span className="kpi-label">Pending Verification</span>
            <div className="kpi-icon-wrap"><Clock size={18} style={{ color: "var(--status-atrisk)" }} /></div>
          </div>
          <div className="kpi-value">{summary.pendingVerification}</div>
          <div className="kpi-footer">Scheduled for inspection</div>
        </div>

        <div className="kpi-card kpi-healthy">
          <div className="kpi-top-row">
            <span className="kpi-label">Verified Today</span>
            <div className="kpi-icon-wrap"><CheckCircle2 size={18} style={{ color: "var(--status-healthy)" }} /></div>
          </div>
          <div className="kpi-value">{summary.verifiedToday}</div>
          <div className="kpi-footer">Geo-tagged submissions</div>
        </div>

        <div className="kpi-card kpi-critical">
          <div className="kpi-top-row">
            <span className="kpi-label">Requires Review</span>
            <div className="kpi-icon-wrap"><AlertTriangle size={18} style={{ color: "var(--status-critical)" }} /></div>
          </div>
          <div className="kpi-value" style={{ color: "var(--status-critical)" }}>{summary.requiresReview}</div>
          <div className="kpi-footer">Variance discrepancy &gt; 5%</div>
        </div>

        <div className="kpi-card kpi-primary">
          <div className="kpi-top-row">
            <span className="kpi-label">Evidence Uploaded</span>
            <div className="kpi-icon-wrap"><Camera size={18} style={{ color: "var(--primary-navy)" }} /></div>
          </div>
          <div className="kpi-value">{summary.evidenceUploaded}</div>
          <div className="kpi-footer">Photographic dockets</div>
        </div>
      </div>

      {/* Two Column: Table and Geo-Tagged Evidence Inspector */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: "24px" }}>
        {/* Table of Reports */}
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">Field Inspection Log</h2>
              <p className="card-subtitle">Verified physical accomplishment against contractor billing claims</p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <select
                className="select-gov"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Requires Review">Requires Review</option>
                <option value="Verified">Verified</option>
                <option value="Watch">Watch</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Project</th>
                  <th>Officer</th>
                  <th>Claimed</th>
                  <th>Verified</th>
                  <th>Variance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedReport(r)}
                    style={{
                      backgroundColor: selectedReport?.id === r.id ? "rgba(16, 42, 67, 0.06)" : undefined
                    }}
                  >
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gov-maroon)" }}>
                        {r.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--primary-navy)", maxWidth: "180px" }}>
                        {r.projectName}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{r.projectId}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.775rem" }}>{r.officer}</span>
                    </td>
                    <td>{r.reportedProgress}%</td>
                    <td>
                      <strong style={{ color: "var(--primary-navy)" }}>{r.verifiedProgress}%</strong>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          color: r.variance < -5 ? "var(--status-critical)" : r.variance < 0 ? "var(--status-atrisk)" : "var(--status-healthy)"
                        }}
                      >
                        {r.variance}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${r.status.toLowerCase().replace(" ", "")}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geo-Tagged Evidence Detail Panel */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">
                <MapPin size={18} style={{ color: "var(--gov-maroon)" }} />
                Geo-Tagged Evidence Inspector
              </h2>
              <p className="card-subtitle">Sample photographic evidence & GPS coordinate seal</p>
            </div>
          </div>

          {selectedReport ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Photo Frame */}
              <div style={{ height: "220px", borderRadius: "8px", overflow: "hidden", position: "relative", backgroundColor: "#0b1d30", marginBottom: "16px" }}>
                <img
                  src={selectedReport.evidencePhoto}
                  alt={selectedReport.evidenceTag}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(16,42,67,0.85)", color: "#ffffff", padding: "3px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700 }}>
                  Sample Evidence · Demonstration Data
                </div>
                <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.75)", color: "var(--accent-gold)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>
                  {selectedReport.gps}
                </div>
              </div>

              {/* Attributes Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <div style={{ background: "var(--bg-subtle)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Project</div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary-navy)" }}>{selectedReport.projectId}</div>
                </div>

                <div style={{ background: "var(--bg-subtle)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Field Officer</div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary-navy)" }}>{selectedReport.officer}</div>
                </div>

                <div style={{ background: "var(--bg-subtle)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Inspection Timestamp</div>
                  <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--primary-navy)" }}>{selectedReport.date} · {selectedReport.time}</div>
                </div>

                <div style={{ background: "var(--bg-subtle)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Audit Status</div>
                  <span className={`badge badge-${selectedReport.status.toLowerCase().replace(" ", "")}`} style={{ marginTop: "2px" }}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              {/* Progress Variance Callout */}
              <div
                style={{
                  padding: "12px",
                  borderRadius: "6px",
                  backgroundColor: selectedReport.variance < 0 ? "#fef2f2" : "#ecfdf5",
                  border: `1px solid ${selectedReport.variance < 0 ? "#fecaca" : "#a7f3d0"}`,
                  marginBottom: "14px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: selectedReport.variance < 0 ? "#991b1b" : "#065f46" }}>
                    Progress Variance
                  </span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 900, color: selectedReport.variance < 0 ? "#dc2626" : "#059669" }}>
                    {selectedReport.variance}%
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-main)", marginTop: "2px" }}>
                  Reported by EPC: <strong>{selectedReport.reportedProgress}%</strong> | Ground Truth Verified: <strong>{selectedReport.verifiedProgress}%</strong>
                </div>
              </div>

              {/* Remarks */}
              <div style={{ fontSize: "0.8rem", color: "var(--text-main)", lineHeight: 1.5, background: "var(--bg-subtle)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-light)", flex: 1 }}>
                <strong style={{ color: "var(--primary-navy)" }}>Field Engineer Remarks:</strong>
                <p style={{ marginTop: "4px", color: "var(--text-muted)" }}>{selectedReport.remarks}</p>
              </div>
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              Select a field report from the list to inspect evidence.
            </div>
          )}
        </div>
      </div>

      {/* New Report Modal Dialog */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(16, 42, 67, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div className="card" style={{ maxWidth: "480px", width: "100%", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="card-title">Record Field Audit</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateReport} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", display: "block", marginBottom: "4px" }}>
                  Project Target
                </label>
                <select
                  className="select-gov"
                  style={{ width: "100%" }}
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                >
                  <option value="NMRN-001">NMRN-001 - Chennai Outer Ring Road</option>
                  <option value="NMRN-002">NMRN-002 - Tindivanam Bus Terminal</option>
                  <option value="NMRN-003">NMRN-003 - Madurai Smart Drainage</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", display: "block", marginBottom: "4px" }}>
                    Claimed Progress %
                  </label>
                  <input
                    type="number"
                    className="input-gov"
                    style={{ width: "100%" }}
                    value={newReported}
                    onChange={(e) => setNewReported(e.target.value)}
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", display: "block", marginBottom: "4px" }}>
                    Verified Progress %
                  </label>
                  <input
                    type="number"
                    className="input-gov"
                    style={{ width: "100%" }}
                    value={newVerified}
                    onChange={(e) => setNewVerified(e.target.value)}
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", display: "block", marginBottom: "4px" }}>
                  Field Engineer Remarks
                </label>
                <textarea
                  className="input-gov"
                  style={{ width: "100%", height: "80px", resize: "none" }}
                  placeholder="Record ground observations, equipment idle status, work front availability..."
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Submit Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
