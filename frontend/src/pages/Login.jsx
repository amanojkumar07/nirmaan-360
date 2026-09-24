import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, User, ArrowRight, Activity, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { loginUser } from "../api";
import { useToast } from "../components/Toast";

export function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [userId, setUserId] = useState("Project Officer");
  const [password, setPassword] = useState("officer123");
  const [role, setRole] = useState("Project Officer");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e?.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await loginUser(userId, password, role);
      if (res && res.success) {
        localStorage.setItem("nirmaan_user", JSON.stringify(res.user));
        localStorage.setItem("nirmaan_token", res.token);
        if (onLoginSuccess) onLoginSuccess(res.user);
        addToast(`Welcome back, ${res.user.name} (${res.user.role})`, "success");
        navigate("/dashboard");
      } else {
        setErrorMsg(res?.message || "Invalid credentials.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyPreset = (u, p, r) => {
    setUserId(u);
    setPassword(p);
    setRole(r);
    setErrorMsg("");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      {/* Left Branding Showcase */}
      <div
        style={{
          flex: 1.2,
          background: "linear-gradient(135deg, #0b1d30 0%, #102a43 50%, #7a1f2b 100%)",
          color: "#ffffff",
          padding: "60px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Subtle geometric pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(217, 164, 65, 0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.7
          }}
        />

        <div style={{ position: "relative", zIndex: 10 }}>
          {/* Fictional Government Platform Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              backgroundColor: "rgba(217, 164, 65, 0.15)",
              border: "1px solid rgba(217, 164, 65, 0.35)",
              color: "var(--accent-gold)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "32px"
            }}
          >
            <Shield size={14} /> Demonstration Prototype · College / Hackathon
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--gov-maroon) 0%, var(--primary-navy) 100%)",
                border: "2px solid var(--accent-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="1.5" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#D9A441" strokeWidth="3" />
                <polygon points="12 6 16 14 8 14" fill="#7A1F2B" stroke="#D9A441" strokeWidth="1.5" />
                <circle cx="12" cy="14" r="2" fill="#D9A441" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff", lineHeight: 1 }}>
                NIRMAAN <span style={{ color: "var(--accent-gold)" }}>360</span>
              </h1>
              <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>
                Integrated Infrastructure Project Monitoring & Decision Support Platform
              </p>
            </div>
          </div>

          <p style={{ fontSize: "1.05rem", color: "#d1dbe5", maxWidth: "540px", lineHeight: 1.6, marginTop: "24px" }}>
            A state-of-the-art enterprise command-and-control cockpit demonstrating how infrastructure leadership transitions:
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "16px",
              padding: "10px 18px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--accent-gold)"
            }}
          >
            Monitoring → Understanding → Simulation → Decision Support
          </div>

          {/* Key Value Highlights */}
          <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", maxWidth: "560px" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "14px 16px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ color: "var(--accent-gold)", fontWeight: 700, fontSize: "0.85rem", marginBottom: "4px" }}>
                Digital Project Twin
              </div>
              <div style={{ fontSize: "0.775rem", color: "#9fb3c8" }}>
                Unified schedule, budget, tasks, dependencies and ground verification telemetry.
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "14px 16px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ color: "var(--accent-gold)", fontWeight: 700, fontSize: "0.85rem", marginBottom: "4px" }}>
                Dependency Intelligence
              </div>
              <div style={{ fontSize: "0.775rem", color: "#9fb3c8" }}>
                Trace root statutory and supply bottlenecks to calculate downstream cascading delays.
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "14px 16px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ color: "var(--accent-gold)", fontWeight: 700, fontSize: "0.85rem", marginBottom: "4px" }}>
                What-If Simulation Engine
              </div>
              <div style={{ fontSize: "0.775rem", color: "#9fb3c8" }}>
                Rule-based predictive modeling to evaluate delay recovery, resource intensity and cost.
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "14px 16px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ color: "var(--accent-gold)", fontWeight: 700, fontSize: "0.85rem", marginBottom: "4px" }}>
                Field Verification Telemetry
              </div>
              <div style={{ fontSize: "0.775rem", color: "#9fb3c8" }}>
                Automated variance flagging between contractor claims and geo-tagged site evidence.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div style={{ position: "relative", zIndex: 10, marginTop: "40px", fontSize: "0.725rem", color: "var(--text-dim)", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "16px" }}>
          Notice: This software is a college hackathon demonstration prototype utilizing rule-based models and fictional infrastructure data. Not affiliated with any live government department.
        </div>
      </div>

      {/* Right Login Action Card */}
      <div
        style={{
          flex: 0.9,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 36px"
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ marginBottom: "28px" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--gov-maroon)", letterSpacing: "0.06em" }}>
              Secure Authentication Portal
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary-navy)", marginTop: "4px" }}>
              Officer Sign In
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Select a role and enter demonstration credentials to access the infrastructure command deck.
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                backgroundColor: "var(--status-critical-bg)",
                border: "1px solid var(--status-critical-border)",
                color: "var(--status-critical-text)",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px"
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "6px" }}>
                Designated Role
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
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "6px" }}>
                User ID / Identifier
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  className="input-gov"
                  style={{ width: "100%", paddingLeft: "36px" }}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. Project Officer"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "6px" }}>
                Access Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="password"
                  className="input-gov"
                  style={{ width: "100%", paddingLeft: "36px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: "100%", padding: "12px", marginTop: "8px", fontSize: "0.95rem" }}
            >
              {isLoading ? "Validating Credentials..." : "Enter Command Center"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Quick 1-Click Demo Credentials */}
          <div style={{ marginTop: "32px", borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "10px" }}>
              Quick 1-Click Demo Profiles
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("Project Officer", "officer123", "Project Officer")}
                style={{ justifyContent: "flex-start", padding: "8px 10px" }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "var(--primary-navy)" }}>Project Officer</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>officer123</div>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("Admin", "admin123", "Administrator")}
                style={{ justifyContent: "flex-start", padding: "8px 10px" }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "var(--primary-navy)" }}>Admin Director</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>admin123</div>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("Field Officer", "field123", "Field Officer")}
                style={{ justifyContent: "flex-start", padding: "8px 10px" }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "var(--primary-navy)" }}>Field Officer</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>field123</div>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("Contractor", "contractor123", "Contractor")}
                style={{ justifyContent: "flex-start", padding: "8px 10px" }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "var(--primary-navy)" }}>EPC Contractor</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>contractor123</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
