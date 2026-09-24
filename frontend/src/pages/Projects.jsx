import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FolderKanban,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Building2,
  AlertCircle,
  RotateCcw
} from "lucide-react";
import { fetchProjects } from "../api";
import { SkeletonTable } from "../components/Skeleton";

export function Projects() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters from URL or default
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedDept, setSelectedDept] = useState(searchParams.get("department") || "");
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get("district") || "");
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "");
  const [selectedRisk, setSelectedRisk] = useState(searchParams.get("risk") || "");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Load projects from API
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchProjects({
          department: selectedDept,
          district: selectedDistrict,
          status: selectedStatus,
          risk: selectedRisk,
          search: searchTerm
        });
        if (res && res.projects) {
          setProjects(res.projects);
        }
      } catch (e) {
        console.error("Failed to load projects:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [selectedDept, selectedDistrict, selectedStatus, selectedRisk, searchTerm]);

  // Extract unique filter dropdown values
  const departments = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.department))).filter(Boolean);
  }, [projects]);

  const districts = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.district))).filter(Boolean);
  }, [projects]);

  // Sorting
  const sortedProjects = useMemo(() => {
    const sorted = [...projects];
    sorted.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [projects, sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDept("");
    setSelectedDistrict("");
    setSelectedStatus("");
    setSelectedRisk("");
    setSearchParams({});
  };

  const exportCSV = () => {
    const headers = ["ID", "Project Name", "Department", "District", "Contractor", "Budget (Cr)", "Utilized (Cr)", "Planned %", "Actual %", "Risk Score", "Status"];
    const rows = sortedProjects.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.department}"`,
      `"${p.district}"`,
      `"${p.contractor}"`,
      p.budget,
      p.utilizedBudget,
      p.plannedProgress,
      p.actualProgress,
      p.riskScore,
      p.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NIRMAAN360_Project_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <FolderKanban size={28} style={{ color: "var(--gov-maroon)" }} />
            Projects Registry
          </h1>
          <p className="page-header-subtitle">
            Central repository of infrastructure works, milestone tracking and contractual status
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-secondary btn-sm" onClick={exportCSV} title="Export CSV table">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="card" style={{ marginBottom: "20px", padding: "16px 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="input-gov"
              style={{ width: "100%", paddingLeft: "32px" }}
              placeholder="Search by ID, title, contractor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-gov"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Highways">Highways & Minor Ports</option>
            <option value="Transport">Transport Department</option>
            <option value="Water">Water Resources</option>
            <option value="Health">Health & Family Welfare</option>
            <option value="Municipal">Municipal Administration</option>
            <option value="Housing">Housing & Urban Dev</option>
          </select>

          <select
            className="select-gov"
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
          >
            <option value="">All Risk Levels</option>
            <option value="Healthy">Healthy (0-29)</option>
            <option value="Watch">Watch (30-49)</option>
            <option value="At Risk">At Risk (50-69)</option>
            <option value="Critical">Critical (70-100)</option>
          </select>

          <select
            className="select-gov"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Watch">Watch</option>
            <option value="At Risk">At Risk</option>
            <option value="Critical">Critical</option>
          </select>

          {(searchTerm || selectedDept || selectedDistrict || selectedRisk || selectedStatus) && (
            <button className="btn btn-secondary btn-sm" onClick={handleResetFilters} title="Reset all filters">
              <RotateCcw size={14} /> Clear
            </button>
          )}

          <div style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Showing {sortedProjects.length} projects
          </div>
        </div>
      </div>

      {/* Projects Table */}
      {isLoading ? (
        <SkeletonTable rows={6} cols={7} />
      ) : sortedProjects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <AlertCircle size={36} style={{ color: "var(--text-muted)", margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary-navy)" }}>
            No projects match the selected filters
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px", maxWidth: "420px", margin: "4px auto 16px" }}>
            Try clearing or modifying your department, district or risk filters to view portfolio records.
          </p>
          <button className="btn btn-primary btn-sm" onClick={handleResetFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort("id")} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    ID <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    Project Name <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Department</th>
                <th>District</th>
                <th>Contractor</th>
                <th onClick={() => toggleSort("budget")} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    Budget <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Physical Progress</th>
                <th>Variance</th>
                <th onClick={() => toggleSort("riskScore")} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    Risk <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((p) => {
                const variance = +(p.actualProgress - p.plannedProgress).toFixed(1);
                return (
                  <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)}>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gov-maroon)" }}>
                        {p.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--primary-navy)", maxWidth: "260px" }}>
                        {p.name}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                        {p.department}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                        {p.district}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                        {p.contractor}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: "0.825rem", color: "var(--primary-navy)" }}>
                        ₹{p.budget} Cr
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        Spent: ₹{p.utilizedBudget} Cr
                      </div>
                    </td>
                    <td>
                      <div className="table-progress-bar-wrap">
                        <div className="progress-track">
                          <div
                            className={`progress-fill ${
                              p.status === "Healthy" ? "fill-healthy" : p.status === "Watch" ? "fill-watch" : "fill-atrisk"
                            }`}
                            style={{ width: `${p.actualProgress}%` }}
                          />
                        </div>
                        <span style={{ fontSize: "0.775rem", fontWeight: 700 }}>
                          {p.actualProgress}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.775rem",
                          color: variance < 0 ? "var(--status-critical)" : "var(--status-healthy)"
                        }}
                      >
                        {variance > 0 ? `+${variance}%` : `${variance}%`}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          color:
                            p.riskScore >= 70
                              ? "var(--status-critical)"
                              : p.riskScore >= 50
                              ? "var(--status-atrisk)"
                              : "var(--status-healthy)"
                        }}
                      >
                        {p.riskScore}/100
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${p.status.toLowerCase().replace(" ", "")}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${p.id}`);
                        }}
                        title="Open detailed project twin"
                      >
                        <Eye size={14} /> Open
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
