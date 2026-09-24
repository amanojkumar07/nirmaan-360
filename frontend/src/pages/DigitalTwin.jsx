import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Cpu,
  Calendar,
  DollarSign,
  MapPin,
  ListTodo,
  Truck,
  Camera,
  GitBranch,
  AlertTriangle,
  ArrowRight,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
  Layers
} from "lucide-react";
import { fetchProjects, fetchProjectById } from "../api";
import { SkeletonCard } from "../components/Skeleton";

export function DigitalTwin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectIdParam = searchParams.get("project") || "NMRN-001";

  const [projectList, setProjectList] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [activeModule, setActiveModule] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [pListRes, pDetailRes] = await Promise.all([
          fetchProjects(),
          fetchProjectById(projectIdParam)
        ]);
        if (pListRes?.projects) setProjectList(pListRes.projects);
        if (pDetailRes?.project) setCurrentProject(pDetailRes.project);
      } catch (e) {
        console.error("Twin load error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [projectIdParam]);

  const handleProjectSelect = (e) => {
    const newId = e.target.value;
    setSearchParams({ project: newId });
  };

  if (isLoading || !currentProject) {
    return <SkeletonCard />;
  }

  const p = currentProject;

  const twinModules = [
    {
      id: "schedule",
      title: "Schedule",
      icon: Calendar,
      summary: `Planned ${p.plannedProgress}% vs Actual ${p.actualProgress}%`,
      detail: `Slippage: +${p.delayDays || 0} days off baseline`,
      status: p.delayDays > 15 ? "Critical" : "Healthy"
    },
    {
      id: "budget",
      title: "Budget",
      icon: DollarSign,
      summary: `Sanctioned ₹${p.budget} Cr`,
      detail: `Utilized ₹${p.utilizedBudget} Cr (${(p.utilizedBudget / p.budget * 100).toFixed(0)}%)`,
      status: (p.financialProgress - p.actualProgress) > 5 ? "Watch" : "Healthy"
    },
    {
      id: "location",
      title: "Location / GIS",
      icon: MapPin,
      summary: `${p.district}`,
      detail: `${p.location || "Corridor Segment"}`,
      status: "Healthy"
    },
    {
      id: "tasks",
      title: "Tasks",
      icon: ListTodo,
      summary: `${(p.tasks || []).length || 6} Monitored Tasks`,
      detail: `${(p.tasks || []).filter(t => t.status === "Delayed").length || 2} Delayed Tasks`,
      status: "At Risk"
    },
    {
      id: "resources",
      title: "Resources",
      icon: Truck,
      summary: "3 Piling Rigs · 140 Laborers",
      detail: "1 Concrete Batching Plant",
      status: "Watch"
    },
    {
      id: "evidence",
      title: "Field Evidence",
      icon: Camera,
      summary: "Ground Verification Telemetry",
      detail: "Variance: -8.0% (Verified 54%)",
      status: "Critical"
    },
    {
      id: "dependencies",
      title: "Dependencies",
      icon: GitBranch,
      summary: "4 Linked Milestones",
      detail: `Root Bottleneck: ${p.primaryBottleneck || "Land Acquisition"}`,
      status: "Critical"
    },
    {
      id: "risk",
      title: "Risk State",
      icon: AlertTriangle,
      summary: `Risk Score: ${p.riskScore}/100`,
      detail: `Level: ${p.riskLevel} (Rule-derived)`,
      status: p.riskLevel
    }
  ];

  const activityFeed = [
    { time: "10:42 AM", title: "Field verification uploaded", desc: "Inspection FR-2026-101 recorded by Arun Kumar, AE. Variance flagged at -8.0%.", type: "critical" },
    { time: "09:30 AM", title: "Foundation milestone delayed", desc: "Sub-base piling milestone M4 adjusted +18 days due to RoW corridor litigation.", type: "warning" },
    { time: "Yesterday", title: "Material delivery confirmed", desc: "Batch #14 OPC 53-grade cement delivered and passed laboratory 7-day slump test.", type: "healthy" },
    { time: "Yesterday", title: "Statutory approval pending", desc: "Revenue arbitration hearing notice issued for Section 3D awards in Tiruvallur.", type: "warning" }
  ];

  return (
    <div className="twin-container">
      {/* Header with Project Selector */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Cpu size={28} style={{ color: "var(--accent-gold)" }} />
            Digital Project Twin
          </h1>
          <p className="page-header-subtitle">
            A demonstration digital representation of project state, schedule, resources, dependencies and field information.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-navy)" }}>
            Select Active Twin:
          </label>
          <select
            className="select-gov"
            value={p.id}
            onChange={handleProjectSelect}
            style={{ fontWeight: 700 }}
          >
            {projectList.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.id} - {proj.name.substring(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Holographic / Command Central Twin Stage */}
      <div className="twin-stage">
        <div className="twin-grid-overlay" />

        {/* Central Core Twin Node */}
        <div className="twin-center-node">
          <div style={{ fontSize: "0.7rem", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 800 }}>
            CORE DIGITAL TWIN
          </div>
          <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: "2px 0" }}>
            {p.id}
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>
            {p.actualProgress}% COMPLETE
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              backgroundColor: p.riskScore >= 70 ? "#ef4444" : "#f97316",
              color: "#ffffff",
              padding: "2px 8px",
              borderRadius: "4px",
              marginTop: "6px"
            }}
          >
            RISK {p.riskScore} · {p.riskLevel.toUpperCase()}
          </div>
        </div>

        {/* 8 Connected Orbital Modules */}
        <div className="twin-orbit-grid">
          {twinModules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="twin-module-card"
                onClick={() => {
                  if (m.id === "dependencies") navigate(`/dependencies?project=${p.id}`);
                  if (m.id === "risk") navigate(`/risks?project=${p.id}`);
                  if (m.id === "evidence") navigate("/field-verification");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="twin-module-title">
                  <Icon size={14} />
                  <span>{m.title}</span>
                  <span
                    className={`badge badge-${m.status.toLowerCase().replace(" ", "")}`}
                    style={{ marginLeft: "auto", fontSize: "0.6rem" }}
                  >
                    {m.status}
                  </span>
                </div>
                <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "#ffffff", marginTop: "4px" }}>
                  {m.summary}
                </div>
                <div style={{ fontSize: "0.725rem", color: "#9fb3c8", marginTop: "2px" }}>
                  {m.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Twin Metrics Strip */}
      <div>
        <h3 className="card-title" style={{ marginBottom: "14px" }}>
          Project Twin Health Indices
        </h3>
        <div className="twin-metrics-row">
          <div className="twin-metric-box">
            <div className="twin-metric-value" style={{ color: "var(--status-watch)" }}>62%</div>
            <div className="twin-metric-label">Schedule Health</div>
          </div>
          <div className="twin-metric-box">
            <div className="twin-metric-value" style={{ color: "var(--primary-navy)" }}>71%</div>
            <div className="twin-metric-label">Budget Health</div>
          </div>
          <div className="twin-metric-box">
            <div className="twin-metric-value" style={{ color: "var(--status-healthy)" }}>84%</div>
            <div className="twin-metric-label">Field Confidence</div>
          </div>
          <div className="twin-metric-box">
            <div className="twin-metric-value" style={{ color: "var(--status-critical)" }}>43%</div>
            <div className="twin-metric-label">Dependency Health</div>
          </div>
          <div className="twin-metric-box">
            <div className="twin-metric-value" style={{ color: "var(--status-watch)" }}>76%</div>
            <div className="twin-metric-label">Resource Availability</div>
          </div>
        </div>
      </div>

      {/* Two Column: Live Twin Activity Feed & Operational Synopsis */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">
                <Activity size={18} style={{ color: "var(--gov-maroon)" }} />
                Twin Real-Time Telemetry Feed
              </h3>
              <p className="card-subtitle">Chronological event log synchronized from field and scheduling engines</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activityFeed.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "12px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border-light)"
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--gov-maroon)", minWidth: "75px" }}>
                  {item.time}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-navy)" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "12px" }}>
            <Sparkles size={18} style={{ color: "var(--accent-gold-dark)" }} />
            Twin Actions & Simulation
          </h3>
          <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginBottom: "16px", lineHeight: 1.5 }}>
            Because this digital twin links statutory clearances with field resource allocation, interventions can be simulated before deploying government capital.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/dependencies?project=${p.id}`)}
              style={{ justifyContent: "flex-start" }}
            >
              <GitBranch size={16} /> Trace Downstream Bottlenecks
            </button>
            <button
              className="btn btn-maroon"
              onClick={() => navigate(`/simulation?project=${p.id}`)}
              style={{ justifyContent: "flex-start" }}
            >
              <Cpu size={16} /> Launch What-If Simulation Engine
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/projects/${p.id}`)}
              style={{ justifyContent: "flex-start" }}
            >
              <Layers size={16} /> Open Detailed Project Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
