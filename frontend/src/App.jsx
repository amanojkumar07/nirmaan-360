import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { ToastProvider } from "./components/Toast";

// Pages
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { DigitalTwin } from "./pages/DigitalTwin";
import { Dependencies } from "./pages/Dependencies";
import { Simulation } from "./pages/Simulation";
import { RiskAnalytics } from "./pages/RiskAnalytics";
import { Recommendations } from "./pages/Recommendations";
import { FieldVerification } from "./pages/FieldVerification";
import { EvidenceRepository } from "./pages/EvidenceRepository";
import { ProjectGis } from "./pages/ProjectGis";
import { SmartAlerts } from "./pages/SmartAlerts";
import { Notifications } from "./pages/Notifications";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

import "./App.css";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("nirmaan_user");
      return stored
        ? JSON.parse(stored)
        : {
            id: "Project Officer",
            name: "Er. K. Sivaramakrishnan",
            role: "Project Officer",
            department: "Highways & Minor Ports",
            isDemo: true
          };
    } catch {
      return null;
    }
  });

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("nirmaan_user");
    localStorage.removeItem("nirmaan_token");
    setCurrentUser(null);
  };

  const isLoginPage = location.pathname === "/login";

  if (!currentUser && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  if (isLoginPage) {
    return (
      <Login
        onLoginSuccess={(u) => {
          setCurrentUser(u);
        }}
      />
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="main-wrapper">
        <Topbar
          setMobileOpen={setMobileOpen}
          currentUser={currentUser}
        />

        <main className="content-body">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/dependencies" element={<Dependencies />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/risks" element={<RiskAnalytics />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/field-verification" element={<FieldVerification />} />
            <Route path="/evidence" element={<EvidenceRepository />} />
            <Route path="/gis" element={<ProjectGis />} />
            <Route path="/alerts" element={<SmartAlerts />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings currentUser={currentUser} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
