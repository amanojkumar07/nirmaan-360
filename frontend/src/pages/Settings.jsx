import React, { useState } from "react";
import { Settings as SettingsIcon, User, Shield, Bell, Moon, Sun, Laptop, Save, CheckCircle } from "lucide-react";
import { useToast } from "../components/Toast";

export function Settings({ currentUser }) {
  const { addToast } = useToast();

  const [name, setName] = useState(currentUser?.name || "Er. K. Sivaramakrishnan");
  const [role, setRole] = useState(currentUser?.role || "Project Officer");
  const [department, setDepartment] = useState(currentUser?.department || "Highways & Public Works");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...currentUser, name, role, department };
    localStorage.setItem("nirmaan_user", JSON.stringify(updated));
    addToast("Preferences and officer profile saved.", "success");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <SettingsIcon size={28} style={{ color: "var(--gov-maroon)" }} />
            Platform Configuration & Settings
          </h1>
          <p className="page-header-subtitle">
            Officer profile parameters, alert thresholds and demonstration environment preferences.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
        {/* Officer Profile */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: "16px" }}>
            <User size={18} style={{ color: "var(--primary-navy)" }} />
            Officer Profile Details
          </h2>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "4px" }}>
                Full Name & Designation
              </label>
              <input
                type="text"
                className="input-gov"
                style={{ width: "100%" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "4px" }}>
                Assigned Authority Role
              </label>
              <select
                className="select-gov"
                style={{ width: "100%" }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Administrator">Administrator (State Directorate)</option>
                <option value="Project Officer">Project Officer (Highways & Public Works)</option>
                <option value="Field Officer">Field Officer (Inspection Division)</option>
                <option value="Contractor">Contractor (EPC Partner)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "4px" }}>
                Parent Directorate / Department
              </label>
              <input
                type="text"
                className="input-gov"
                style={{ width: "100%" }}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start", marginTop: "8px" }}>
              <Save size={14} /> Save Profile Settings
            </button>
          </form>
        </div>

        {/* System & Demo Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Notification Preferences */}
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: "14px" }}>
              <Bell size={18} style={{ color: "var(--gov-maroon)" }} />
              Alert Subscriptions
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={criticalAlerts}
                  onChange={(e) => setCriticalAlerts(e.target.checked)}
                  style={{ accentColor: "var(--gov-maroon)" }}
                />
                <span>Critical Path Bottleneck Escalations</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  style={{ accentColor: "var(--gov-maroon)" }}
                />
                <span>Field Verification Negative Variance Warnings (&gt;5%)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  style={{ accentColor: "var(--gov-maroon)" }}
                />
                <span>Enable High-Density Data Mode</span>
              </label>
            </div>
          </div>

          {/* Prototype Demonstration Environment Disclaimer */}
          <div className="card" style={{ borderLeft: "5px solid var(--accent-gold)", backgroundColor: "#fffdf9" }}>
            <h2 className="card-title" style={{ color: "var(--primary-navy)", marginBottom: "6px" }}>
              <Shield size={18} style={{ color: "var(--accent-gold-dark)" }} />
              Demonstration Environment
            </h2>
            <div style={{ fontSize: "0.8rem", color: "var(--text-main)", lineHeight: 1.5 }}>
              <div><strong>Environment State:</strong> Active Prototype (Sample Data)</div>
              <div><strong>Backend Service:</strong> Python Flask / REST Micro-API</div>
              <div><strong>Decision Engine:</strong> Rule-Based Deterministic CPM / Variance Logic</div>
              <div style={{ marginTop: "10px", color: "var(--text-muted)", fontSize: "0.75rem", borderTop: "1px solid var(--border-light)", paddingTop: "8px" }}>
                Notice: NIRMAAN 360 is an academic/hackathon prototype. Do not input real confidential official government records.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
