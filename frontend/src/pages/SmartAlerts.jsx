import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Send,
  Eye,
  Clock,
  Filter,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { fetchAlerts, acknowledgeAlert } from "../api";
import { useToast } from "../components/Toast";
import { SkeletonCard } from "../components/Skeleton";

export function SmartAlerts() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [alerts, setAlerts] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchAlerts(severityFilter);
        if (res?.alerts) setAlerts(res.alerts);
      } catch (e) {
        console.error("Alerts load error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [severityFilter]);

  const handleAcknowledge = async (id) => {
    try {
      await acknowledgeAlert(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
      );
      addToast(`Alert ${id} acknowledged.`, "success");
    } catch (e) {
      addToast("Failed to acknowledge alert", "critical");
    }
  };

  const handleEscalate = (id, projName) => {
    addToast(`Escalation file created for ${projName} (${id}).`, "warning");
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  const criticalCount = alerts.filter((a) => a.severity === "Critical").length;
  const unackCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Bell size={28} style={{ color: "var(--gov-maroon)" }} />
            Smart Alerts & Exception Dispatch
          </h1>
          <p className="page-header-subtitle">
            Automated threshold violation triggers across critical path dependencies, schedule slippage and field variance.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <span className="badge badge-critical" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
            {criticalCount} Critical Exceptions
          </span>
          <span className="badge badge-watch" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
            {unackCount} Unacknowledged
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "12px", overflowX: "auto" }}>
        {[
          { label: "All Alerts", val: "" },
          { label: "Critical", val: "Critical" },
          { label: "Warning", val: "Warning" },
          { label: "Field Verification", val: "Field Verification" },
          { label: "Information", val: "Information" }
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setSeverityFilter(tab.val)}
            className={`btn btn-sm ${severityFilter === tab.val ? "btn-primary" : "btn-secondary"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {alerts.map((a) => {
          const isCrit = a.severity === "Critical";
          const isWarn = a.severity === "Warning";
          const isField = a.severity === "Field Verification";

          let borderAccent = "var(--border-light)";
          if (isCrit) borderAccent = "var(--status-critical)";
          else if (isWarn) borderAccent = "var(--status-watch)";
          else if (isField) borderAccent = "var(--status-atrisk)";

          return (
            <div
              key={a.id}
              className="card"
              style={{
                borderLeft: `5px solid ${borderAccent}`,
                backgroundColor: a.acknowledged ? "#f8fafc" : "#ffffff",
                opacity: a.acknowledged ? 0.88 : 1
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span className={`badge badge-${a.severity.toLowerCase().replace(" ", "")}`}>
                      {a.severity}
                    </span>
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gov-maroon)" }}>
                      {a.projectId}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>•</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} /> {a.timestamp}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--primary-navy)" }}>
                    {a.title}
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Project: <strong>{a.projectName}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/projects/${a.projectId}`)}
                  >
                    <Eye size={14} /> View
                  </button>

                  {!a.acknowledged ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAcknowledge(a.id)}
                    >
                      <CheckCircle2 size={14} /> Acknowledge
                    </button>
                  ) : (
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--status-healthy)", display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px" }}>
                      <CheckCircle2 size={14} /> Acknowledged
                    </span>
                  )}

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEscalate(a.id, a.projectName)}
                    style={{ color: "var(--status-critical)" }}
                  >
                    <Send size={14} /> Escalate
                  </button>
                </div>
              </div>

              <div style={{ margin: "12px 0", fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.5 }}>
                {a.message}
              </div>

              {a.recommendedAction && (
                <div style={{ backgroundColor: "var(--bg-subtle)", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-light)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <strong style={{ color: "var(--gov-maroon)" }}>Prescribed Action:</strong>
                  <span style={{ color: "var(--text-main)" }}>{a.recommendedAction}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
