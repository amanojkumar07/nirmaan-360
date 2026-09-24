import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Building2,
  Calendar,
  DollarSign,
  AlertTriangle,
  GitBranch,
  FileText,
  Activity,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Camera,
  ChevronRight
} from "lucide-react";
import { fetchProjectById, acknowledgeAlert } from "../api";
import { useToast } from "../components/Toast";
import { SkeletonCard, SkeletonTable } from "../components/Skeleton";

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [projectData, setProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchProjectById(id || "NMRN-001");
        if (res && res.project) {
          setProjectData(res);
          if (res.project.milestones && res.project.milestones.length > 0) {
            setSelectedMilestone(res.project.milestones.find((m) => m.status === "Delayed") || res.project.milestones[0]);
          }
        }
      } catch (e) {
        console.error("Failed to load project details:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading || !projectData) {
    return (
      <div>
        <SkeletonCard />
        <div style={{ marginTop: "20px" }}>
          <SkeletonTable rows={4} cols={5} />
        </div>
      </div>
    );
  }

  const { project, calculatedRisk, fieldReports, alerts } = projectData;

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await acknowledgeAlert(alertId);
      addToast(`Alert ${alertId} marked as acknowledged.`, "success");
      // Local state update
      setProjectData((prev) => ({
        ...prev,
        alerts: prev.alerts.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
      }));
    } catch (e) {
      addToast("Failed to acknowledge alert", "critical");
    }
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "timeline", label: "Timeline & Milestones" },
    { key: "budget", label: "Financial & Budget" },
    { key: "tasks", label: "Tasks & Schedules" },
    { key: "dependencies", label: "Dependencies" },
    { key: "evidence", label: "Field Evidence" },
    { key: "risks", label: "Risk Factors" },
    { key: "alerts", label: "Alerts" },
    { key: "recommendations", label: "Recommendations" }
  ];

  return (
    <div>
      {/* Top Breadcrumb & Action Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <Link to="/projects" style={{ color: "var(--primary-navy)", textDecoration: "none", fontWeight: 600 }}>
            Projects Registry
          </Link>
          <ChevronRight size={14} />
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gov-maroon)" }}>
            {project.id}
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/digital-twin?project=${project.id}`)}
          >
            Digital Twin View →
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/simulation?project=${project.id}`)}
          >
            <Sliders size={14} /> Run Simulation
          </button>
        </div>
      </div>

      {/* Hero Command Banner */}
      <div
        className="card"
        style={{
          borderLeft: `6px solid ${
            project.status === "Healthy"
              ? "var(--status-healthy)"
              : project.status === "Watch"
              ? "var(--status-watch)"
              : "var(--status-critical)"
          }`,
          marginBottom: "20px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 800, color: "var(--gov-maroon)" }}>
                {project.id}
              </span>
              <span className={`badge badge-${project.status.toLowerCase().replace(" ", "")}`}>
                {project.status}
              </span>
              {project.delayDays > 0 && (
                <span className="badge badge-critical">
                  +{project.delayDays} Days Delayed
                </span>
              )}
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-navy)", letterSpacing: "-0.01em" }}>
              {project.name}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
              {project.summary}
            </p>
          </div>

          <div style={{ textAlign: "right", display: "flex", gap: "18px" }}>
            <div style={{ background: "var(--bg-subtle)", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Prototype Risk Score
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: project.riskScore >= 70 ? "var(--status-critical)" : "var(--status-atrisk)" }}>
                {project.riskScore} <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>/100</span>
              </div>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Physical Progress
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                {project.actualProgress}%
              </div>
            </div>
          </div>
        </div>

        {/* Primary Meta Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginTop: "20px",
            borderTop: "1px solid var(--border-light)",
            paddingTop: "16px"
          }}
        >
          <div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              Department
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary-navy)", marginTop: "2px" }}>
              {project.department}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              Location / District
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary-navy)", marginTop: "2px" }}>
              {project.location} ({project.district})
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              EPC Contractor
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary-navy)", marginTop: "2px" }}>
              {project.contractor}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              Project Manager
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary-navy)", marginTop: "2px" }}>
              {project.projectManager}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              Sanctioned Budget
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-navy)", marginTop: "2px" }}>
              ₹{project.budget} Cr (Utilized: ₹{project.utilizedBudget} Cr)
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              Scheduled Target
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary-navy)", marginTop: "2px" }}>
              {project.completionDate} → <span style={{ color: "var(--status-critical)" }}>{project.revisedCompletionDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: "6px", borderBottom: "2px solid var(--border-light)", marginBottom: "20px", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 16px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab.key ? "3px solid var(--gov-maroon)" : "3px solid transparent",
              color: activeTab === tab.key ? "var(--gov-maroon)" : "var(--text-muted)",
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: "0.85rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "12px" }}>
              <Activity size={18} style={{ color: "var(--gov-maroon)" }} />
              Executive Status & Constraints
            </h3>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-main)" }}>
              The <strong>{project.name}</strong> represents a key corridor initiative under the {project.department}.
              Currently, physical accomplishment is running at <strong>{project.actualProgress}%</strong> against a planned trajectory of <strong>{project.plannedProgress}%</strong>, resulting in a net variance of <strong>{(project.actualProgress - project.plannedProgress).toFixed(1)}%</strong>.
            </p>

            <div style={{ marginTop: "16px", background: "var(--bg-subtle)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "6px" }}>
                Identified Root Constraint:
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge badge-critical">{project.primaryBottleneck || "Land Acquisition"}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Cascading an estimated <strong>+{project.delayDays} days</strong> across 4 downstream milestones.
                </span>
              </div>
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/dependencies?project=${project.id}`)}
              >
                Inspect Dependency Graph <GitBranch size={14} />
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab("timeline")}
              >
                View Milestone Milestones
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "12px" }}>
              <ShieldCheck size={18} style={{ color: "var(--accent-gold-dark)" }} />
              Quick Decision Support
            </h3>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginBottom: "16px" }}>
              The prototype recommendation engine suggests immediate intervention on the root bottleneck.
            </p>

            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "12px", marginBottom: "14px" }}>
              <div style={{ fontWeight: 700, color: "#166534", fontSize: "0.85rem", marginBottom: "4px" }}>
                Recommended Action:
              </div>
              <div style={{ fontSize: "0.8rem", color: "#15803d" }}>
                Expedite statutory revenue arbitration camp in Tiruvallur package and sanction double shifts for bridge piling.
              </div>
            </div>

            <button
              className="btn btn-maroon btn-sm"
              style={{ width: "100%" }}
              onClick={() => navigate(`/simulation?project=${project.id}`)}
            >
              <Sliders size={14} /> Test Recovery with What-If Simulation
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TIMELINE */}
      {activeTab === "timeline" && (
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">Interactive Milestone Sequence</h3>
              <p className="card-subtitle">Click milestone node to inspect task dependencies and slippage</p>
            </div>
          </div>

          {/* Milestone nodes horizontal chain */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              overflowX: "auto",
              padding: "20px 10px",
              backgroundColor: "var(--bg-subtle)",
              borderRadius: "8px",
              marginBottom: "24px"
            }}
          >
            {(project.milestones || []).map((m, idx) => {
              const isSelected = selectedMilestone?.id === m.id;
              const isDelayed = m.status === "Delayed";
              const isCompleted = m.status === "Completed";
              const isCurrent = m.status === "Current";

              let borderColor = "var(--border-light)";
              let bg = "#ffffff";
              if (isDelayed) {
                borderColor = "var(--status-critical)";
                bg = "#fef2f2";
              } else if (isCompleted) {
                borderColor = "var(--status-healthy)";
                bg = "#ecfdf5";
              } else if (isCurrent) {
                borderColor = "var(--primary-navy)";
                bg = "#eff6ff";
              }

              return (
                <React.Fragment key={m.id}>
                  <div
                    onClick={() => setSelectedMilestone(m)}
                    style={{
                      border: `2px solid ${borderColor}`,
                      backgroundColor: bg,
                      padding: "12px 16px",
                      borderRadius: "8px",
                      minWidth: "170px",
                      cursor: "pointer",
                      boxShadow: isSelected ? "0 0 0 3px rgba(16, 42, 67, 0.2)" : "none",
                      transition: "all 0.15s ease",
                      flexShrink: 0
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-muted)" }}>
                        {m.id}
                      </span>
                      <span className={`badge badge-${m.status.toLowerCase()}`}>
                        {m.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--primary-navy)", margin: "6px 0 2px" }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      Target: {m.target}
                    </div>
                    {m.delayDays && (
                      <div style={{ fontSize: "0.7rem", color: "var(--status-critical)", fontWeight: 700, marginTop: "2px" }}>
                        +{m.delayDays}d slippage
                      </div>
                    )}
                  </div>
                  {idx < (project.milestones || []).length - 1 && (
                    <ChevronRight size={18} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Selected Milestone Detail Box */}
          {selectedMilestone && (
            <div style={{ backgroundColor: "#ffffff", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--gov-maroon)" }}>
                    Milestone {selectedMilestone.id}
                  </span>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                    {selectedMilestone.name}
                  </h4>
                </div>
                <span className={`badge badge-${selectedMilestone.status.toLowerCase()}`}>
                  {selectedMilestone.status}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "12px" }}>
                <div style={{ background: "var(--bg-subtle)", padding: "10px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Target Date</div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary-navy)" }}>{selectedMilestone.target}</div>
                </div>
                <div style={{ background: "var(--bg-subtle)", padding: "10px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Completion Realized</div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary-navy)" }}>{selectedMilestone.completed || "In Execution"}</div>
                </div>
                <div style={{ background: "var(--bg-subtle)", padding: "10px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Milestone Progress</div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--gov-maroon)" }}>{selectedMilestone.progress}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: BUDGET */}
      {activeTab === "budget" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div className="card">
            <h3 className="card-title">Fiscal Outlay Breakdown</h3>
            <div style={{ margin: "20px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.85rem", fontWeight: 600 }}>
                <span>Budget Utilization</span>
                <span>₹{project.utilizedBudget} Cr / ₹{project.budget} Cr ({(project.utilizedBudget / project.budget * 100).toFixed(1)}%)</span>
              </div>
              <div className="progress-track" style={{ height: "10px" }}>
                <div
                  className="progress-fill fill-navy"
                  style={{ width: `${(project.utilizedBudget / project.budget) * 100}%` }}
                />
              </div>
            </div>

            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", padding: "12px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 700, color: "#9a3412", fontSize: "0.85rem" }}>
                Physical vs Financial Discrepancy Alert:
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9a3412", marginTop: "4px" }}>
                Financial outgo (66.3%) outpaces physical accomplishment (58.0%) by 8.3%. Interim RA billing audit is advised before next contractor release.
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Interim Running Account (RA) Bills</h3>
            <table className="gov-table" style={{ marginTop: "12px" }}>
              <thead>
                <tr>
                  <th>Bill #</th>
                  <th>Date</th>
                  <th>Amount (Cr)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RA-17</td>
                  <td>12 Aug 2026</td>
                  <td>₹28.4 Cr</td>
                  <td><span className="badge badge-healthy">Passed</span></td>
                </tr>
                <tr>
                  <td>RA-16</td>
                  <td>04 Jun 2026</td>
                  <td>₹34.1 Cr</td>
                  <td><span className="badge badge-healthy">Passed</span></td>
                </tr>
                <tr>
                  <td>RA-18</td>
                  <td>Pending</td>
                  <td>₹32.0 Cr</td>
                  <td><span className="badge badge-watch">Under Review</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TASKS */}
      {activeTab === "tasks" && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "14px" }}>
            Operational Task Schedule
          </h3>
          <div className="table-responsive">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Task Name</th>
                  <th>Milestone</th>
                  <th>Planned Window</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Bottleneck / Blocker</th>
                </tr>
              </thead>
              <tbody>
                {(project.tasks || []).map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{t.id}</td>
                    <td style={{ fontWeight: 600, color: "var(--primary-navy)" }}>{t.name}</td>
                    <td>{t.milestone}</td>
                    <td style={{ fontSize: "0.775rem" }}>{t.plannedStart} → {t.plannedEnd}</td>
                    <td>
                      <div className="table-progress-bar-wrap">
                        <div className="progress-track">
                          <div className="progress-fill fill-healthy" style={{ width: `${t.progress}%` }} />
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{t.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${t.status.toLowerCase().replace(" ", "")}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      {t.blocker ? (
                        <span style={{ color: "var(--status-critical)", fontWeight: 600, fontSize: "0.75rem" }}>
                          {t.blocker}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DEPENDENCIES */}
      {activeTab === "dependencies" && (
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">Downstream Dependency Path</h3>
              <p className="card-subtitle">Critical path link tracing upstream blockers to target delivery</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/dependencies?project=${project.id}`)}>
              Full Dependency Intelligence →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
            {(project.dependencies || []).map((dep, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border-light)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontWeight: 700, color: "var(--primary-navy)", fontSize: "0.85rem" }}>
                    {dep.source}
                  </span>
                  <ArrowRight size={14} style={{ color: "var(--gov-maroon)" }} />
                  <span style={{ fontWeight: 700, color: "var(--primary-navy)", fontSize: "0.85rem" }}>
                    {dep.target}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--status-critical)", fontWeight: 700 }}>
                    +{dep.impactDays} Days Delay
                  </span>
                  <span className={`badge badge-${dep.status.toLowerCase().replace(" ", "")}`}>
                    {dep.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: EVIDENCE */}
      {activeTab === "evidence" && (
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">Field Verification & Geo-Tagged Evidence</h3>
              <p className="card-subtitle">Recent inspections conducted by field engineers</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/field-verification")}>
              Field Operations Deck →
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginTop: "14px" }}>
            {fieldReports.map((r) => (
              <div key={r.id} style={{ border: "1px solid var(--border-light)", borderRadius: "8px", overflow: "hidden", backgroundColor: "#ffffff" }}>
                <div style={{ height: "160px", backgroundColor: "#cbd5e1", position: "relative" }}>
                  <img src={r.evidencePhoto} alt={r.evidenceTag} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(16,42,67,0.85)", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700 }}>
                    {r.evidenceTag}
                  </span>
                </div>
                <div style={{ padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                    <span>{r.officer}</span>
                    <span>{r.date}</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--gov-maroon)", marginBottom: "8px" }}>
                    GPS: {r.gps}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      Claimed: {r.reportedProgress}% | Verified: <strong>{r.verifiedProgress}%</strong>
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: r.variance < 0 ? "var(--status-critical)" : "var(--status-healthy)" }}>
                      {r.variance}%
                    </span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {r.remarks}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: RISKS */}
      {activeTab === "risks" && (
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">Prototype Risk Engine Breakdown</h3>
              <p className="card-subtitle">
                Composite Score: <strong>{calculatedRisk?.compositeScore}/100 ({calculatedRisk?.riskLevel})</strong>
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/risks")}>
              Full Risk Analytics →
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginTop: "16px" }}>
            {calculatedRisk?.factors &&
              Object.entries(calculatedRisk.factors).map(([key, val]) => {
                const label = key.replace("Risk", "").replace(/([A-Z])/g, " $1");
                return (
                  <div key={key} style={{ background: "var(--bg-subtle)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.825rem", fontWeight: 600 }}>
                      <span style={{ textTransform: "capitalize" }}>{label} Factor</span>
                      <span style={{ fontWeight: 800, color: val >= 70 ? "var(--status-critical)" : val >= 50 ? "var(--status-atrisk)" : "var(--status-healthy)" }}>
                        {val}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className={`progress-fill ${val >= 70 ? "fill-critical" : val >= 50 ? "fill-atrisk" : "fill-healthy"}`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <div style={{ marginTop: "18px", padding: "12px", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", fontSize: "0.775rem", color: "#92400e" }}>
            <strong>Rule-Based Model Notice:</strong> {calculatedRisk?.formulaExplanation}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ALERTS */}
      {activeTab === "alerts" && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "14px" }}>
            Active Smart Alerts ({alerts.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {alerts.map((a) => (
              <div
                key={a.id}
                style={{
                  padding: "14px 16px",
                  borderRadius: "8px",
                  border: `1px solid ${a.acknowledged ? "var(--border-light)" : "var(--status-critical-border)"}`,
                  backgroundColor: a.acknowledged ? "var(--bg-subtle)" : "#fffaf9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span className={`badge badge-${a.severity.toLowerCase().replace(" ", "")}`}>
                      {a.severity}
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--primary-navy)", fontSize: "0.875rem" }}>
                      {a.title}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      {a.date || a.timestamp}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-main)" }}>
                    {a.message}
                  </p>
                </div>

                <div>
                  {a.acknowledged ? (
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--status-healthy)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={14} /> Acknowledged
                    </span>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleAcknowledgeAlert(a.id)}
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: RECOMMENDATIONS */}
      {activeTab === "recommendations" && (
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">Prototype Recommendations</h3>
              <p className="card-subtitle">Suggested corrective interventions to recover critical path milestones</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "14px" }}>
            <div style={{ border: "1px solid var(--border-light)", borderRadius: "8px", padding: "16px", backgroundColor: "#f8fafc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div>
                  <span className="badge badge-critical" style={{ marginBottom: "6px" }}>Priority Intervention</span>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                    Expedite Land Acquisition & Deploy Additional Shifts
                  </h4>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/simulation?project=${project.id}&intervention=Expedite Land Acquisition`)}
                >
                  <Sliders size={14} /> Simulate Intervention
                </button>
              </div>

              <p style={{ fontSize: "0.825rem", color: "var(--text-main)", lineHeight: 1.5, marginBottom: "12px" }}>
                Convene joint taluk revenue arbitration camp for Section 3D awards in Tiruvallur package to clear right-of-way for hydraulic piling rigs.
              </p>

              <div style={{ display: "flex", gap: "18px", fontSize: "0.775rem", fontWeight: 700, color: "var(--primary-navy)", borderTop: "1px solid var(--border-light)", paddingTop: "10px" }}>
                <span>Expected Delay Reduction: <strong style={{ color: "var(--status-healthy)" }}>21 Days</strong></span>
                <span>•</span>
                <span>Risk Reduction: <strong style={{ color: "var(--status-healthy)" }}>-18%</strong></span>
                <span>•</span>
                <span>Estimated Cost Outlay: <strong>₹4.5 Cr</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
