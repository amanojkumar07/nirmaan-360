import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  Sliders,
  BarChart2,
  TrendingDown,
  CheckCircle,
  HelpCircle,
  FolderKanban
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from "recharts";
import { fetchProjects, fetchProjectById } from "../api";
import { SkeletonCard } from "../components/Skeleton";

export function RiskAnalytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectIdParam = searchParams.get("project") || "NMRN-001";

  const [projectList, setProjectList] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [pListRes, pDetailRes] = await Promise.all([
          fetchProjects(),
          fetchProjectById(projectIdParam)
        ]);
        if (pListRes?.projects) setProjectList(pListRes.projects);
        if (pDetailRes) setProjectData(pDetailRes);
      } catch (e) {
        console.error("Risk load error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [projectIdParam]);

  if (isLoading || !projectData) {
    return <SkeletonCard />;
  }

  const { project, calculatedRisk } = projectData;

  const radarData = [
    { subject: "Schedule Risk", score: calculatedRisk.factors.scheduleRisk },
    { subject: "Budget Risk", score: calculatedRisk.factors.budgetRisk },
    { subject: "Dependency Risk", score: calculatedRisk.factors.dependencyRisk },
    { subject: "Contractor Risk", score: calculatedRisk.factors.contractorRisk },
    { subject: "Approval Risk", score: calculatedRisk.factors.approvalRisk },
    { subject: "Field Variance", score: calculatedRisk.factors.fieldVarianceRisk }
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <AlertTriangle size={28} style={{ color: "var(--status-critical)" }} />
            Risk & Predictive Analytics
          </h1>
          <p className="page-header-subtitle">
            Prototype Risk Engine evaluating multidimensional project exposure through rule-based indices.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-navy)" }}>
            Assessing Project:
          </label>
          <select
            className="select-gov"
            value={project.id}
            onChange={(e) => setSearchParams({ project: e.target.value })}
            style={{ fontWeight: 700 }}
          >
            {projectList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.name.substring(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Honest Prototype Disclosure */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
          padding: "10px 16px",
          fontSize: "0.8rem",
          color: "#1e40af",
          marginBottom: "20px"
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>
          <strong>Prototype Risk Engine:</strong> Risk scores are generated using transparent, deterministic rule-based logic derived from physical delay days, milestone dependencies and verified field variance. Not trained on sensitive datasets.
        </span>
      </div>

      {/* Composite Risk Score Banner */}
      <div
        className="card"
        style={{
          borderLeft: `6px solid ${
            project.riskScore >= 70 ? "var(--status-critical)" : project.riskScore >= 50 ? "var(--status-atrisk)" : "var(--status-healthy)"
          }`,
          marginBottom: "24px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gov-maroon)" }}>
              {project.id} · {project.department}
            </span>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary-navy)", marginTop: "2px" }}>
              {project.name}
            </h2>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
              <span className={`badge badge-${project.status.toLowerCase().replace(" ", "")}`}>
                {project.status}
              </span>
              <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                Primary Root Bottleneck: <strong style={{ color: "var(--status-critical)" }}>{project.primaryBottleneck || "Land Acquisition"}</strong>
              </span>
            </div>
          </div>

          <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "var(--bg-subtle)", padding: "12px 20px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Composite Risk Score
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: project.riskScore >= 70 ? "var(--status-critical)" : "var(--status-atrisk)", lineHeight: 1.1 }}>
                {project.riskScore} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/100</span>
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: project.riskScore >= 70 ? "var(--status-critical)" : "var(--status-atrisk)" }}>
                {project.riskLevel.toUpperCase()}
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate(`/simulation?project=${project.id}`)}
            >
              <Sliders size={16} /> Simulate Risk Mitigation
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column: Multidimensional Radar vs Factor Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: "24px", marginBottom: "24px" }}>
        {/* Multidimensional Radar Chart */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "6px" }}>
            Risk Factor Polygon
          </h3>
          <p className="card-subtitle">Multivariate risk distribution across six governance dimensions</p>

          <div style={{ height: "300px", width: "100%", marginTop: "10px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--text-main)", fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Risk Factor" dataKey="score" stroke="var(--gov-maroon)" fill="var(--gov-maroon)" fillOpacity={0.4} />
                <Tooltip
                  formatter={(val) => [`${val}%`, "Risk Exposure"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "var(--border-light)", borderRadius: "6px", fontSize: "0.8rem" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Horizontal Factor Progress Bars */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "6px" }}>
            Dimensional Factor Analysis
          </h3>
          <p className="card-subtitle">Factor weighting applied by prototype decision model</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
            {radarData.map((f) => (
              <div key={f.subject}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.825rem", fontWeight: 600 }}>
                  <span style={{ color: "var(--primary-navy)" }}>{f.subject}</span>
                  <span style={{ fontWeight: 800, color: f.score >= 70 ? "var(--status-critical)" : f.score >= 50 ? "var(--status-atrisk)" : "var(--status-healthy)" }}>
                    {f.score}%
                  </span>
                </div>
                <div className="progress-track" style={{ height: "8px" }}>
                  <div
                    className={`progress-fill ${f.score >= 70 ? "fill-critical" : f.score >= 50 ? "fill-atrisk" : "fill-healthy"}`}
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transparent Calculation Rules Card */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: "10px" }}>
          <HelpCircle size={18} style={{ color: "var(--accent-gold-dark)" }} />
          Prototype Risk Engine Evaluation Rules
        </h3>
        <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginBottom: "14px" }}>
          The risk rating is determined dynamically by querying schedule milestones, expenditure ledgers and field inspector uploads against deterministic thresholds:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
          <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--primary-navy)" }}>1. Schedule Lag Rule</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              If actualProgress &lt; plannedProgress - 10%, score escalates proportionally with critical path delay days.
            </div>
          </div>

          <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--primary-navy)" }}>2. Fiscal Disparity Rule</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              If budget utilization outpaces physical realization by &gt; 15%, budget risk score flags potential cost overrun.
            </div>
          </div>

          <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--primary-navy)" }}>3. Dependency Chokepoint Rule</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              If statutory land acquisition or clearance delays exceed buffer threshold, dependency risk spikes to 88%.
            </div>
          </div>

          <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--primary-navy)" }}>4. Field Verification Variance</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              If physical verification variance &gt; 5% against contractor claims, field confidence penalty is enforced.
            </div>
          </div>
        </div>

        {/* Bands Classification Table */}
        <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-light)", paddingTop: "12px", display: "flex", gap: "20px", fontSize: "0.75rem" }}>
          <span><strong>Risk Tiers:</strong></span>
          <span style={{ color: "var(--status-healthy)", fontWeight: 700 }}>0–29: Healthy</span>
          <span style={{ color: "var(--status-watch)", fontWeight: 700 }}>30–49: Watch</span>
          <span style={{ color: "var(--status-atrisk)", fontWeight: 700 }}>50–69: At Risk</span>
          <span style={{ color: "var(--status-critical)", fontWeight: 700 }}>70–100: Critical</span>
        </div>
      </div>
    </div>
  );
}
