import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  GitBranch,
  MapPin,
  ClipboardCheck,
  Image as ImageIcon,
  AlertTriangle,
  Sliders,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, currentUser, onLogout }) {
  const navigate = useNavigate();
  const role = currentUser?.role || "Project Officer";

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const navItems = [
    {
      section: "Overview",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["Administrator", "Project Officer", "Field Officer", "Contractor"] }
      ]
    },
    {
      section: "Project Intelligence",
      items: [
        { label: "Projects Registry", path: "/projects", icon: FolderKanban, roles: ["Administrator", "Project Officer", "Field Officer", "Contractor"] },
        { label: "Digital Project Twin", path: "/digital-twin", icon: Cpu, roles: ["Administrator", "Project Officer"] },
        { label: "Dependency Intelligence", path: "/dependencies", icon: GitBranch, roles: ["Administrator", "Project Officer"] },
        { label: "Project GIS View", path: "/gis", icon: MapPin, roles: ["Administrator", "Project Officer", "Field Officer"] }
      ]
    },
    {
      section: "Field Operations",
      items: [
        { label: "Field Verification", path: "/field-verification", icon: ClipboardCheck, roles: ["Administrator", "Field Officer", "Project Officer", "Contractor"] },
        { label: "Evidence Repository", path: "/evidence", icon: ImageIcon, roles: ["Administrator", "Field Officer", "Project Officer", "Contractor"] }
      ]
    },
    {
      section: "Decision Support",
      items: [
        { label: "Risk & Analytics", path: "/risks", icon: AlertTriangle, roles: ["Administrator", "Project Officer"] },
        { label: "What-If Simulation", path: "/simulation", icon: Sliders, roles: ["Administrator", "Project Officer"] },
        { label: "Recommended Actions", path: "/recommendations", icon: Sparkles, roles: ["Administrator", "Project Officer"] }
      ]
    },
    {
      section: "Analytics & Oversight",
      items: [
        { label: "Reports & Analytics", path: "/reports", icon: BarChart3, roles: ["Administrator", "Project Officer"] }
      ]
    },
    {
      section: "Administration",
      items: [
        { label: "Smart Alerts", path: "/alerts", icon: Bell, roles: ["Administrator", "Project Officer", "Contractor"], badge: "3" },
        { label: "Notifications", path: "/notifications", icon: Bell, roles: ["Administrator", "Field Officer", "Project Officer"] },
        { label: "Settings", path: "/settings", icon: Settings, roles: ["Administrator", "Project Officer", "Field Officer", "Contractor"] }
      ]
    }
  ];

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(16, 42, 67, 0.6)",
            zIndex: 95
          }}
        />
      )}

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="brand-wrapper" onClick={() => setMobileOpen(false)}>
            <div className="brand-symbol">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="1.5" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#D9A441" strokeWidth="3" />
                <polygon points="12 6 16 14 8 14" fill="#7A1F2B" stroke="#D9A441" strokeWidth="1.5" />
                <circle cx="12" cy="14" r="2" fill="#D9A441" />
              </svg>
            </div>
            {!collapsed && (
              <div className="brand-text-block">
                <span className="brand-title">
                  NIRMAAN <span className="gold-accent">360</span>
                </span>
                <span className="brand-tagline">Integrated Infra Platform</span>
              </div>
            )}
          </NavLink>

          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="sidebar-nav">
          {navItems.map((sec, idx) => {
            const visibleItems = sec.items.filter((item) => item.roles.includes(role));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} style={{ marginBottom: "12px" }}>
                {!collapsed && <div className="nav-section-title">{sec.section}</div>}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={18} style={{ flexShrink: 0 }} />
                      {!collapsed && <span>{item.label}</span>}
                      {!collapsed && item.badge && <span className="nav-badge">{item.badge}</span>}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User Snippet Footer */}
        <div className="sidebar-footer">
          <div className="user-snippet">
            <div className="user-avatar" title={currentUser?.name}>
              {currentUser?.name ? currentUser.name.charAt(0) : "U"}
            </div>
            {!collapsed && (
              <div className="user-info">
                <div className="user-name" title={currentUser?.name}>
                  {currentUser?.name || "Demo Officer"}
                </div>
                <div className="user-role-badge">
                  {role} · Demo
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="logout-icon-btn"
              title="Logout session"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
