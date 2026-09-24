import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  FileText,
  Printer,
  Calendar,
  Building2,
  TrendingUp,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { fetchDashboard, fetchContractors, fetchDepartments } from "../api";
import { useToast } from "../components/Toast";
import { SkeletonCard } from "../components/Skeleton";

export function Reports() {
  const { addToast } = useToast();
  const [dashData, setDashData] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [dRes, cRes, depRes] = await Promise.all([
          fetchDashboard(),
          fetchContractors(),
          fetchDepartments()
        ]);
        if (dRes) setDashData(dRes);
        if (cRes?.contractors) setContractors(cRes.contractors);
        if (depRes?.departments) setDepartments(depRes.departments);
      } catch (e) {
        console.error("Reports load error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleExportCSV = () => {
    if (!dashData) return;
    const rows = [
      ["Metric", "Value"],
      ["Total Projects", dashData.kpis.totalProjects],
      ["Active Projects", dashData.kpis.activeProjects],
      ["At Risk Projects", dashData.kpis.atRisk],
      ["Delayed Projects", dashData.kpis.delayed],
      ["Completed Projects", dashData.kpis.completed],
      ["Total Outlay (Cr)", dashData.kpis.totalBudgetCr],
      ["Utilized Outlay (Cr)", dashData.kpis.utilizedBudgetCr],
      ["State Physical Progress %", dashData.kpis.physicalProgress]
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `NIRMAAN360_Executive_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Statewide summary CSV downloaded.", "success");
  };

  const handlePrintSummary = () => {
    window.print();
  };

  if (isLoading || !dashData) {
    return <SkeletonCard />;
  }

  const { kpis, healthBreakdown, monthlyTrend, deptPerformance } = dashData;

  const contractorChartData = contractors.map((c) => ({
    name: c.name.split(" ")[0],
    completionRate: c.completionRate,
    avgDelay: c.averageDelayDays,
    safety: c.safetyScore
  }));

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <BarChart3 size={28} style={{ color: "var(--gov-maroon)" }} />
            Executive Reports & Statewide Analytics
          </h1>
          <p className="page-header-subtitle">
            Portfolio performance analytics, contractor evaluation benchmarks and financial outgo synthesis.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV Summary
          </button>
          <button className="btn btn-primary btn-sm" onClick={handlePrintSummary}>
            <Printer size={14} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="kpi-grid" style={{ marginBottom: "24px" }}>
        <div className="kpi-card kpi-primary">
          <div className="kpi-label">Monitored Portfolio</div>
          <div className="kpi-value">{kpis.totalProjects}</div>
          <div className="kpi-footer">Active: {kpis.activeProjects}</div>
        </div>

        <div className="kpi-card kpi-atrisk">
          <div className="kpi-label">At Risk Portfolio</div>
          <div className="kpi-value" style={{ color: "var(--status-atrisk)" }}>{kpis.atRisk}</div>
          <div className="kpi-footer">Delayed: {kpis.delayed} works</div>
        </div>

        <div className="kpi-card kpi-gold">
          <div className="kpi-label">Fiscal Sanctions</div>
          <div className="kpi-value">₹{kpis.totalBudgetCr} Cr</div>
          <div className="kpi-footer">Outgo: ₹{kpis.utilizedBudgetCr} Cr</div>
        </div>

        <div className="kpi-card kpi-healthy">
          <div className="kpi-label">Realized Progress</div>
          <div className="kpi-value" style={{ color: "var(--status-healthy)" }}>{kpis.physicalProgress}%</div>
          <div className="kpi-footer">Completed: {kpis.completed} works</div>
        </div>
      </div>

      {/* Charts Grid Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">Physical vs Planned Trajectory</h2>
              <p className="card-subtitle">Monthly aggregate physical accomplishment curve</p>
            </div>
          </div>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[40, 90]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="planned" name="Planned Target" stroke="var(--primary-navy)" strokeWidth={2.5} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="actual" name="Actual Realized" stroke="var(--gov-maroon)" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">Portfolio Risk Distribution</h2>
              <p className="card-subtitle">Classification by rule-based risk rating</p>
            </div>
          </div>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthBreakdown}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {healthBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: Contractor Benchmarks & Department Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">Contractor Performance Index</h2>
              <p className="card-subtitle">Completion rate (%) vs Average Delay (Days)</p>
            </div>
          </div>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractorChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="completionRate" name="Completion Rate (%)" fill="#1b3a5b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgDelay" name="Avg Delay (Days)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">Department Budget Allocation</h2>
              <p className="card-subtitle">Budget sanctioned vs expenditure outgo (₹ Cr)</p>
            </div>
          </div>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis unit=" Cr" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="budget" name="Sanctioned" fill="#7a1f2b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Expended" fill="#d9a441" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
