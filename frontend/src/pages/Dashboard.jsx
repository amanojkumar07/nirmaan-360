import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  BarChart2,
  ArrowRight,
  Filter,
  ShieldAlert,
  Building2,
  FileCheck2
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { fetchDashboard, fetchGisData } from "../api";
import { LeafletMap } from "../components/LeafletMap";
import { SkeletonCard, SkeletonTable } from "../components/Skeleton";

export function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [gisMarkers, setGisMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHealthFilter, setSelectedHealthFilter] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [dashRes, gisRes] = await Promise.all([fetchDashboard(), fetchGisData()]);
        if (dashRes) setData(dashRes);
        if (gisRes && gisRes.markers) setGisMarkers(gisRes.markers);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !data) {
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonTable rows={4} cols={5} />
      </div>
    );
  }

  const { kpis, healthBreakdown, monthlyTrend, deptPerformance, criticalProjects, meta } = data;

  const filteredMarkers = selectedHealthFilter === "All"
    ? gisMarkers
    : gisMarkers.filter((m) => (m.status || m.riskLevel || "").toLowerCase() === selectedHealthFilter.toLowerCase());

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Building2 size={28} style={{ color: "var(--gov-maroon)" }} />
            Infrastructure Command Center
          </h1>
          <p className="page-header-subtitle">
            Statewide infrastructure monitoring, risk intelligence and predictive decision support
          </p>
        </div>

        <div className="sync-info-box">
          <div className="sync-info-item">
            <span className="sync-label">Last Synchronized</span>
            <span className="sync-value">{meta?.lastSynchronized || "24 September 2026 · 11:45 AM"}</span>
          </div>
          <div style={{ width: "1px", height: "24px", backgroundColor: "var(--border-light)" }} />
          <div className="sync-info-item">
            <span className="sync-label">Environment</span>
            <span className="sync-value" style={{ color: "var(--accent-gold-dark)" }}>
              {meta?.environment || "Demonstration Data"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-primary">
          <div className="kpi-top-row">
            <span className="kpi-label">Total Projects</span>
            <div className="kpi-icon-wrap"><FolderKanban size={18} /></div>
          </div>
          <div className="kpi-value">{kpis.totalProjects}</div>
          <div className="kpi-footer">
            <span>Portfolio Across 38 Districts</span>
          </div>
        </div>

        <div className="kpi-card kpi-primary">
          <div className="kpi-top-row">
            <span className="kpi-label">Active Works</span>
            <div className="kpi-icon-wrap"><TrendingUp size={18} style={{ color: "var(--primary-navy)" }} /></div>
          </div>
          <div className="kpi-value">{kpis.activeProjects}</div>
          <div className="kpi-footer">
            <span className="trend-badge trend-up">● In Execution</span>
          </div>
        </div>

        <div
          className="kpi-card kpi-atrisk"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedHealthFilter("At Risk");
            navigate("/projects?risk=At Risk");
          }}
          title="Click to view all At Risk projects"
        >
          <div className="kpi-top-row">
            <span className="kpi-label">At Risk</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: "var(--status-atrisk-bg)", color: "var(--status-atrisk)" }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: "var(--status-atrisk)" }}>{kpis.atRisk}</div>
          <div className="kpi-footer">
            <span className="trend-badge trend-warn">+3 this month</span>
          </div>
        </div>

        <div className="kpi-card kpi-critical">
          <div className="kpi-top-row">
            <span className="kpi-label">Delayed Projects</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: "var(--status-critical-bg)", color: "var(--status-critical)" }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: "var(--status-critical)" }}>{kpis.delayed}</div>
          <div className="kpi-footer">
            <span className="trend-badge trend-down">Schedule breach &gt; 15d</span>
          </div>
        </div>

        <div className="kpi-card kpi-healthy">
          <div className="kpi-top-row">
            <span className="kpi-label">Completed Works</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: "var(--status-healthy-bg)", color: "var(--status-healthy)" }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: "var(--status-healthy)" }}>{kpis.completed}</div>
          <div className="kpi-footer">
            <span>Commissioned & handed over</span>
          </div>
        </div>

        <div className="kpi-card kpi-gold">
          <div className="kpi-top-row">
            <span className="kpi-label">Total Outlay</span>
            <div className="kpi-icon-wrap" style={{ backgroundColor: "var(--accent-gold-light)", color: "var(--accent-gold-dark)" }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="kpi-value">₹{kpis.totalBudgetCr.toLocaleString()} Cr</div>
          <div className="kpi-footer">
            <span>Utilized: ₹{kpis.utilizedBudgetCr.toLocaleString()} Cr ({(kpis.utilizedBudgetCr / kpis.totalBudgetCr * 100).toFixed(1)}%)</span>
          </div>
        </div>

        <div className="kpi-card kpi-primary">
          <div className="kpi-top-row">
            <span className="kpi-label">State Physical Progress</span>
            <div className="kpi-icon-wrap"><BarChart2 size={18} style={{ color: "var(--primary-navy)" }} /></div>
          </div>
          <div className="kpi-value">{kpis.physicalProgress}%</div>
          <div className="kpi-footer">
            <span>Target: 74.5% (Variance -7.1%)</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Executive Health & GIS Statewide Map */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.9fr", gap: "24px", marginBottom: "24px" }}>
        {/* Executive Project Health Breakdown */}
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">
                <PieIcon size={18} style={{ color: "var(--gov-maroon)" }} />
                Executive Project Health
              </h2>
              <p className="card-subtitle">Click slice or pill to filter project map & register</p>
            </div>
            {selectedHealthFilter !== "All" && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedHealthFilter("All")}
              >
                Reset Filter
              </button>
            )}
          </div>

          <div style={{ height: "220px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthBreakdown}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  onClick={(entry) => setSelectedHealthFilter(entry.name)}
                  cursor="pointer"
                >
                  {healthBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={selectedHealthFilter === entry.name ? "var(--primary-navy)" : "#ffffff"}
                      strokeWidth={selectedHealthFilter === entry.name ? 3 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name, item) => [`${val} Projects (${item.payload.percentage}%)`, name]}
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "var(--border-light)", borderRadius: "6px", fontSize: "0.8rem" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Health Category Filter Pills */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginTop: "12px" }}>
            {healthBreakdown.map((item) => {
              const isSelected = selectedHealthFilter === item.name;
              return (
                <div
                  key={item.name}
                  onClick={() => setSelectedHealthFilter(isSelected ? "All" : item.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: isSelected ? "var(--primary-navy)" : "var(--bg-subtle)",
                    color: isSelected ? "#ffffff" : "var(--text-main)",
                    cursor: "pointer",
                    border: `1px solid ${isSelected ? "var(--primary-navy)" : "var(--border-light)"}`,
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: item.color }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statewide Project GIS Map */}
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">
                Statewide Project GIS View
              </h2>
              <p className="card-subtitle">
                {selectedHealthFilter === "All"
                  ? `Displaying all ${gisMarkers.length} georeferenced works`
                  : `Filtered by: ${selectedHealthFilter} (${filteredMarkers.length} works)`}
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/gis")}
            >
              Full GIS Cockpit →
            </button>
          </div>

          <LeafletMap markers={filteredMarkers} height="320px" />
        </div>
      </div>

      {/* Critical Projects Requiring Immediate Attention Panel */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-header-flex">
          <div>
            <h2 className="card-title" style={{ color: "var(--status-critical-text)" }}>
              <ShieldAlert size={20} style={{ color: "var(--status-critical)" }} />
              Projects Requiring Immediate Attention
            </h2>
            <p className="card-subtitle">
              Prioritized by rule-based prototype risk engine algorithms
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/projects?risk=Critical")}>
            View All Critical ({criticalProjects.length})
          </button>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Risk Level</th>
                <th>Delay</th>
                <th>Physical Progress</th>
                <th>Primary Bottleneck</th>
                <th>Recommended Action</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {criticalProjects.map((p) => (
                <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)}>
                  <td>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gov-maroon)" }}>
                      {p.id}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--primary-navy)" }}>{p.name}</td>
                  <td>
                    <span className={`badge badge-${p.riskLevel.toLowerCase().replace(" ", "")}`}>
                      {p.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "var(--status-critical)", fontWeight: 700 }}>
                      +{p.delayDays} days
                    </span>
                  </td>
                  <td>
                    <div className="table-progress-bar-wrap">
                      <div className="progress-track">
                        <div
                          className="progress-fill fill-atrisk"
                          style={{ width: `${p.actualProgress}%` }}
                        />
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{p.actualProgress}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                      {p.primaryBottleneck}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                      {p.action}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${p.id}`);
                      }}
                    >
                      Inspect <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Physical vs Planned Progress Timeline */}
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">Physical vs Planned Progress</h2>
              <p className="card-subtitle">Monthly aggregate performance trend across state works</p>
            </div>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[40, 90]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val, name) => [`${val}%`, name === "planned" ? "Planned Target" : "Actual Progress"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "var(--border-light)", borderRadius: "6px", fontSize: "0.8rem" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Line type="monotone" dataKey="planned" name="Planned Target" stroke="var(--primary-navy)" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="actual" name="Actual Realized" stroke="var(--gov-maroon)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Budget & Progress Performance */}
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">Department Performance & Outlay</h2>
              <p className="card-subtitle">Sanctioned budget (₹ Cr) vs actual expenditure</p>
            </div>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformance} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis unit=" Cr" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val, name) => [`₹${val} Cr`, name === "budget" ? "Budget Sanctioned" : "Expenditure Outgo"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "var(--border-light)", borderRadius: "6px", fontSize: "0.8rem" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="budget" name="Sanctioned" fill="#1b3a5b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Expenditure" fill="#d9a441" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
