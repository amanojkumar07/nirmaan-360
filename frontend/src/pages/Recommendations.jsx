import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GitBranch,
  Building2,
  Clock,
  ShieldCheck,
  Send
} from "lucide-react";
import { fetchProjects, fetchRecommendations } from "../api";
import { useToast } from "../components/Toast";
import { SkeletonCard } from "../components/Skeleton";

export function Recommendations() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [atRiskProjects, setAtRiskProjects] = useState([]);
  const [recommendationsByProject, setRecommendationsByProject] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const pRes = await fetchProjects();
        if (pRes?.projects) {
          const highRisk = pRes.projects.filter(
            (p) => p.riskLevel === "Critical" || p.riskLevel === "At Risk"
          );
          setAtRiskProjects(highRisk);

          // Fetch recommendations for each at risk project
          const recPromises = highRisk.map(async (p) => {
            const r = await fetchRecommendations(p.id);
            return { id: p.id, recs: r?.recommendations || [] };
          });
          const recResults = await Promise.all(recPromises);
          const recMap = {};
          recResults.forEach((item) => {
            recMap[item.id] = item.recs;
          });
          setRecommendationsByProject(recMap);
        }
      } catch (e) {
        console.error("Failed to load recommendations:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleAssignAction = (projName, recTitle) => {
    addToast(`Action assigned to Project Officer: ${recTitle}`, "success");
  };

  const handleEscalate = (projId) => {
    addToast(`Escalation docket submitted to Principal Secretary for project ${projId}.`, "warning");
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Sparkles size={28} style={{ color: "var(--accent-gold-dark)" }} />
            Recommended Actions & Decision Support
          </h1>
          <p className="page-header-subtitle">
            Algorithmic interventions prioritized by bottleneck severity, schedule recovery yield and cost viability.
          </p>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {atRiskProjects.map((proj) => {
          const recs = recommendationsByProject[proj.id] || [];
          return (
            <div key={proj.id} className="card" style={{ borderLeft: "6px solid var(--status-critical)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--gov-maroon)" }}>
                      {proj.id}
                    </span>
                    <span className={`badge badge-${proj.riskLevel.toLowerCase().replace(" ", "")}`}>
                      {proj.riskLevel}
                    </span>
                    <span className="badge badge-critical">
                      +{proj.delayDays}d Delayed
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                    {proj.name}
                  </h2>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Department: <strong>{proj.department}</strong> · Primary Bottleneck: <strong style={{ color: "var(--status-critical)" }}>{proj.primaryBottleneck}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/dependencies?project=${proj.id}`)}
                  >
                    <GitBranch size={14} /> View Dependency
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/simulation?project=${proj.id}`)}
                  >
                    <Sliders size={14} /> Simulate Recovery
                  </button>
                </div>
              </div>

              {/* Recommendation Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recs.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      backgroundColor: "var(--bg-subtle)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "8px",
                      padding: "16px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <div>
                        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", color: "var(--gov-maroon)" }}>
                          Primary Bottleneck: {rec.primaryBottleneck}
                        </span>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--primary-navy)", marginTop: "2px" }}>
                          {rec.recommendation}
                        </h3>
                      </div>
                      <span className="badge badge-info">{rec.status}</span>
                    </div>

                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                      <strong>Rationale:</strong> {rec.rationale}
                    </p>

                    {/* Expected Impact Strip */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                        gap: "10px",
                        backgroundColor: "#ffffff",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-light)",
                        marginBottom: "14px"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.675rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Delay Reduction</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--status-healthy)" }}>
                          {rec.impact.delayReductionDays} Days
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "0.675rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Risk Reduction</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--status-healthy)" }}>
                          -{rec.impact.riskReductionPercent}%
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "0.675rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Milestones Saved</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                          {rec.impact.affectedMilestonesSaved}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "0.675rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Estimated Cost</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                          ₹{rec.impact.costCr} Cr
                        </div>
                      </div>
                    </div>

                    {/* Decision Action Buttons */}
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/simulation?project=${proj.id}&intervention=${encodeURIComponent(rec.primaryBottleneck)}`)}
                      >
                        <Sliders size={14} /> Simulate
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleAssignAction(proj.name, rec.recommendation)}
                      >
                        <CheckCircle2 size={14} /> Assign Action
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEscalate(proj.id)}
                        style={{ color: "var(--status-critical)" }}
                      >
                        <Send size={14} /> Escalate to Directorate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
