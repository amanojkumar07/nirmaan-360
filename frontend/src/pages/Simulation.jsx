import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info
} from "lucide-react";
import { runSimulation, fetchProjects } from "../api";
import { useToast } from "../components/Toast";
import { SkeletonCard } from "../components/Skeleton";

export function Simulation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const projectIdParam = searchParams.get("project") || "NMRN-001";
  const interventionParam = searchParams.get("intervention") || "Expedite Land Acquisition";

  const [projectList, setProjectList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(projectIdParam);
  const [selectedIntervention, setSelectedIntervention] = useState(interventionParam);
  const [resourceSlider, setResourceSlider] = useState(65);
  const [delayReductionDays, setDelayReductionDays] = useState(25);

  const [simResult, setSimResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetchProjects();
        if (res?.projects) setProjectList(res.projects);
      } catch (e) {
        console.error("Failed to load project list:", e);
      }
    }
    loadProjects();
  }, []);

  // Initial simulation run on load
  useEffect(() => {
    executeSimulation();
  }, [selectedProjectId]);

  const executeSimulation = async () => {
    setIsRunning(true);
    try {
      const res = await runSimulation({
        projectId: selectedProjectId,
        intervention: selectedIntervention,
        resourceSlider,
        delayReductionDays
      });
      if (res) {
        setSimResult(res);
        addToast("Simulation calculation updated successfully.", "success");
      }
    } catch (e) {
      addToast("Failed to compute simulation model", "critical");
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setSelectedIntervention("Expedite Land Acquisition");
    setResourceSlider(65);
    setDelayReductionDays(25);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Sliders size={28} style={{ color: "var(--accent-gold-dark)" }} />
            What-If Simulation Engine
          </h1>
          <p className="page-header-subtitle">
            Evaluate administrative, capital and workforce interventions before executing field orders.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-navy)" }}>
            Active Project:
          </label>
          <select
            className="select-gov"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
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

      {/* Honest Prototype Notice */}
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
          marginBottom: "24px"
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>
          <strong>Prototype Simulation Engine:</strong> Rule-based demonstration model using sample project data. Computes schedule elasticity, intervention rates and recovery variance deterministically without black-box ML claims.
        </span>
      </div>

      {/* Simulation Cockpit Grid */}
      <div className="simulation-grid">
        {/* Left: Interactive Input Controls */}
        <div className="sim-controls-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 className="card-title">Intervention Parameters</h2>
            <button className="btn btn-secondary btn-sm" onClick={handleReset}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "8px" }}>
              Select Proposed Intervention Policy
            </label>
            <select
              className="select-gov"
              style={{ width: "100%", fontWeight: 600 }}
              value={selectedIntervention}
              onChange={(e) => setSelectedIntervention(e.target.value)}
            >
              <option value="Expedite Land Acquisition">Expedite Land Acquisition (Revenue arbitration & direct award)</option>
              <option value="Add Workers">Add Workers (Deploy supplementary civil labor gangs)</option>
              <option value="Change Contractor">Change Contractor (Invoke penalty & re-tender balance work)</option>
              <option value="Increase Material Supply">Increase Material Supply (Advance steel & cement quotas)</option>
              <option value="Resolve Approval Delay">Resolve Approval Delay (Inter-departmental single window)</option>
              <option value="Increase Working Shifts">Increase Working Shifts (Round-the-clock 3-shift roster)</option>
            </select>
          </div>

          <div className="sim-slider-group">
            <div className="sim-slider-label">
              <span>Resource Allocation Intensity:</span>
              <span style={{ fontWeight: 800, color: "var(--gov-maroon)" }}>{resourceSlider}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={resourceSlider}
              onChange={(e) => setResourceSlider(Number(e.target.value))}
              className="sim-slider"
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>Standard Baseline (0%)</span>
              <span>Maximum Acceleration (100%)</span>
            </div>
          </div>

          <div className="sim-slider-group">
            <div className="sim-slider-label">
              <span>Target Delay Reduction Goal:</span>
              <span style={{ fontWeight: 800, color: "var(--primary-navy)" }}>{delayReductionDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={delayReductionDays}
              onChange={(e) => setDelayReductionDays(Number(e.target.value))}
              className="sim-slider"
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>0 Days</span>
              <span>60 Days</span>
            </div>
          </div>

          <div style={{ background: "var(--bg-subtle)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-light)", marginBottom: "20px" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Estimated Fiscal Outlay Required
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--primary-navy)", margin: "4px 0" }}>
              +₹{(resourceSlider * 0.18 * 1.1).toFixed(1)} Cr
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Budget rate calculated via standard CPWD/State Schedule of Rates escalation coefficient.
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "0.95rem", fontWeight: 800 }}
            onClick={executeSimulation}
            disabled={isRunning}
          >
            {isRunning ? "Running Mathematical Simulation..." : "RUN SIMULATION MODEL"}
            {!isRunning && <Play size={18} fill="currentColor" />}
          </button>
        </div>

        {/* Right: Comparative Results (Before vs After) */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">Scenario Comparison: Baseline vs Simulated</h2>
              <p className="card-subtitle">Projected critical path milestone shifts</p>
            </div>
          </div>

          {simResult && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div className="sim-compare-grid">
                {/* Current Baseline Box */}
                <div className="sim-scenario-box">
                  <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                    Current Baseline
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Projected Completion</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                      {simResult.current.completionDate}
                    </div>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Composite Risk Level</div>
                    <span className="badge badge-critical" style={{ marginTop: "2px" }}>
                      {simResult.current.riskLevel} ({simResult.current.riskScore}/100)
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Remaining Delay</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--status-critical)" }}>
                      +{simResult.current.delayRemainingDays} Days
                    </div>
                  </div>
                </div>

                {/* Simulated Scenario Box */}
                <div className="sim-scenario-box simulated">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#166534" }}>
                      Simulated Scenario
                    </div>
                    <span style={{ fontSize: "0.65rem", background: "#bbf7d0", color: "#14532d", fontWeight: 700, padding: "2px 6px", borderRadius: "4px" }}>
                      Recovered
                    </span>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "0.7rem", color: "#166534" }}>Recovered Completion Date</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#14532d" }}>
                      {simResult.simulated.completionDate}
                    </div>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "0.7rem", color: "#166534" }}>Simulated Risk Level</div>
                    <span className="badge badge-watch" style={{ marginTop: "2px" }}>
                      {simResult.simulated.riskLevel} ({simResult.simulated.riskScore}/100)
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#166534" }}>Schedule Recovery Realized</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#15803d" }}>
                      {simResult.recoveryDays} Days
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Metrics Bar */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  marginTop: "16px",
                  padding: "14px",
                  backgroundColor: "var(--bg-subtle)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-light)"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Days Recovered</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--status-healthy)" }}>
                    {simResult.recoveryDays} Days
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Risk Score Reduction</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--status-healthy)" }}>
                    -{simResult.riskReductionPoints} Pts
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Additional Outlay</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                    +₹{simResult.costImpactCr} Cr
                  </div>
                </div>
              </div>

              {/* Explanation Note */}
              <div style={{ marginTop: "16px", padding: "14px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.825rem", color: "var(--text-main)", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--primary-navy)" }}>Decision Support Synthesis:</strong> {simResult.explanation}
              </div>

              {/* Recommendation Action Button */}
              <div style={{ marginTop: "auto", paddingTop: "16px", display: "flex", gap: "10px" }}>
                <button
                  className="btn btn-maroon"
                  style={{ flex: 1 }}
                  onClick={() => {
                    addToast(`Intervention '${selectedIntervention}' assigned to project docket.`, "success");
                    navigate(`/recommendations?project=${selectedProjectId}`);
                  }}
                >
                  <Sparkles size={16} /> Adopt Intervention as Recommended Action
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
