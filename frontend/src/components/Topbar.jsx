import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, Shield, Calendar, ChevronRight } from "lucide-react";
import { fetchProjects } from "../api";

export function Topbar({ setMobileOpen, currentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle global search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetchProjects({ search: searchQuery });
        if (res && res.projects) {
          setSearchResults(res.projects.slice(0, 6));
          setIsSearchOpen(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Compute Breadcrumb
  const pathParts = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "Home", path: "/dashboard" },
    ...pathParts.map((part, idx) => {
      const fullPath = "/" + pathParts.slice(0, idx + 1).join("/");
      const formatted = part
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
      return { label: formatted, path: fullPath };
    })
  ];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <nav aria-label="Breadcrumb" className="breadcrumb-trail">
          {breadcrumbs.map((bc, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={bc.path}>
                {idx > 0 && <ChevronRight size={14} className="breadcrumb-separator" />}
                {isLast ? (
                  <span className="breadcrumb-current">{bc.label}</span>
                ) : (
                  <Link to={bc.path} className="breadcrumb-item">
                    {bc.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      <div className="topbar-center" ref={searchRef}>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="global-search-input"
            placeholder="Search projects (e.g. 'Tindivanam', 'NMRN-001')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
          />
        </div>

        {isSearchOpen && searchResults.length > 0 && (
          <div className="search-dropdown-menu">
            <div style={{ padding: "8px 12px", fontSize: "0.7rem", color: "#627d98", textTransform: "uppercase", fontWeight: 700, borderBottom: "1px solid #e2e8f0" }}>
              Matching Sample Projects ({searchResults.length})
            </div>
            {searchResults.map((proj) => (
              <div
                key={proj.id}
                className="search-item"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                  navigate(`/projects/${proj.id}`);
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="search-item-id">{proj.id}</span>
                  <span className={`badge badge-${proj.status.toLowerCase().replace(" ", "")}`}>
                    {proj.status}
                  </span>
                </div>
                <div className="search-item-title">{proj.name}</div>
                <div className="search-item-meta">
                  <span>{proj.district}</span>
                  <span>•</span>
                  <span>{proj.contractor}</span>
                  <span>•</span>
                  <span>Progress: {proj.actualProgress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="topbar-right">
        <div className="demo-indicator-pill" title="This is a college/hackathon demonstration prototype with sample project data.">
          <span className="pulse-dot" />
          Demonstration Environment
        </div>

        <div className="date-stamp">
          <Calendar size={14} style={{ color: "var(--accent-gold-dark)" }} />
          <span>24 Sep 2026</span>
        </div>

        <Link to="/notifications" className="icon-notification-btn" title="View notifications & alerts" aria-label="Notifications">
          <Bell size={18} />
          <span className="unread-dot">3</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              backgroundColor: "var(--primary-navy)",
              color: "#ffffff",
              padding: "4px 8px",
              borderRadius: "4px"
            }}
          >
            {currentUser?.role || "Project Officer"}
          </span>
        </div>
      </div>
    </header>
  );
}
