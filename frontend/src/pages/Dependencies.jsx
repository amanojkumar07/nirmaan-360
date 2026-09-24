import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  GitBranch,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { fetchDependencies, fetchProjects } from "../api";
import { SkeletonCard } from "../components/Skeleton";

export function Dependencies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectIdParam = searchParams.get("project") || "NMRN-001";

  const [depData, setDepData] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [depRes, pRes] = await Promise.all([
          fetchDependencies(projectIdParam),
          fetchProjects()
        ]);
        if (depRes) {
          setDepData(depRes);
          setSelectedNode(depRes.nodes.find((n) => n.isRootBottleneck) || depRes.nodes[0]);
        }
        if (pRes?.projects) setProjectList(pRes.projects);
      } catch (e) {
        console.error("Dependency fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [projectIdParam]);

  if (isLoading || !depData) {
    return <SkeletonCard />;
  }

  const { rootBottleneck, nodes, edges, projectId, projectName } = depData;

  return (
    <div className="dependency-flow">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <GitBranch size={28} style={{ color: "var(--gov-maroon)" }} />
            Dependency Intelligence
          </h1>
          <p className="page-header-subtitle">
            Identify root bottlenecks, calculate downstream cascading impact and mitigate critical path vulnerabilities.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-navy)" }}>
            Project Scope:
          </label>
          <select
            className="select-gov"
            value={projectId}
            onChange={(e) => setSearchParams({ project: e.target.value })}
            style={{ fontWeight: 700 }}
          >
            {projectList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.name.substring(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Root Bottleneck Card */}
      <div className="bottleneck-hero-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#fee2e2", color: "#991b1b", padding: "4px 10px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px" }}>
              <ShieldAlert size={14} /> IDENTIFIED ROOT BOTTLENECK
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-navy)" }}>
              {rootBottleneck.name}
            </h2>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "6px" }}>
              <span className="badge badge-critical">{rootBottleneck.status}</span>
              <span style={{ fontWeight: 700, color: "var(--status-critical)", fontSize: "0.85rem" }}>
                {rootBottleneck.delay}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Project: {projectName} ({projectId})
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate(`/simulation?project=${projectId}&intervention=Expedite Land Acquisition`)}
          >
            <Sliders size={16} /> Simulate Interventions on this Bottleneck
          </button>
        </div>

        {/* Impact Numbers Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginTop: "20px", borderTop: "1px solid #fecaca", paddingTop: "16px" }}>
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid #fecaca" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Downstream Cascading Impact
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--status-critical)" }}>
              +{rootBottleneck.downstreamImpactDays} Days
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid #fecaca" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Affected Milestones
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--gov-maroon)" }}>
              {rootBottleneck.affectedMilestones} Milestones
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid #fecaca" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Subordinate Tasks Blocked
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--primary-navy)" }}>
              {rootBottleneck.affectedTasks} Tasks
            </div>
          </div>

          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid #fecaca" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Critical Path Threat
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--status-critical)" }}>
              {rootBottleneck.risk}
            </div>
          </div>
        </div>

        {/* "Why this matters" Explanatory Card */}
        <div style={{ marginTop: "16px", backgroundColor: "#ffffff", padding: "14px 18px", borderRadius: "8px", border: "1px solid #fed7aa" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gov-maroon)", fontWeight: 800, fontSize: "0.85rem", marginBottom: "4px" }}>
            <HelpCircle size={16} /> Why This Matters
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.5 }}>
            {rootBottleneck.whyItMatters}
          </p>
        </div>
      </div>

      {/* Critical Path Sequential Flow Diagram */}
      <div className="card">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Downstream Dependency Sequence</h3>
            <p className="card-subtitle">Click any node to evaluate upstream constraints and dependent activities</p>
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Sequential CPM (Critical Path Method) Topology
          </span>
        </div>

        <div className="dependency-nodes-strip">
          {nodes.map((node, idx) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  className={`dep-node-card ${node.isRootBottleneck ? "bottleneck" : "at-risk-node"}`}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    boxShadow: isSelected ? "0 0 0 3px rgba(16, 42, 67, 0.25)" : "none",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.675rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-muted)" }}>
                      STEP 0{idx + 1}
                    </span>
                    <span className={`badge badge-${node.status.toLowerCase().replace(" ", "")}`}>
                      {node.status}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--primary-navy)", margin: "8px 0 4px" }}>
                    {node.name}
                  </div>

                  <div style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                    Owner: {node.department}
                  </div>

                  <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: node.delayDays > 0 ? "var(--status-critical)" : "var(--status-healthy)" }}>
                      +{node.delayDays}d Slippage
                    </span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-navy)" }}>
                      {node.progress}%
                    </span>
                  </div>
                </div>

                {idx < nodes.length - 1 && (
                  <div className="dep-arrow" title={edges[idx]?.label}>
                    <ArrowRight size={22} style={{ color: "var(--gov-maroon)" }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Node Detailed Inspector */}
        {selectedNode && (
          <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "var(--bg-subtle)", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "var(--gov-maroon)" }}>
                  Inspecting Node
                </span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--primary-navy)" }}>
                  {selectedNode.name}
                </h4>
              </div>
              <span className={`badge badge-${selectedNode.status.toLowerCase().replace(" ", "")}`}>
                {selectedNode.status}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "12px" }}>
              <div style={{ background: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Responsible Agency</div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary-navy)" }}>{selectedNode.department}</div>
              </div>
              <div style={{ background: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Impact on Delivery</div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--status-critical)" }}>+{selectedNode.delayDays} Calendar Days</div>
              </div>
              <div style={{ background: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Downstream Milestones Preserved if Resolved</div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--status-healthy)" }}>{selectedNode.affectedMilestones} Milestones</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
