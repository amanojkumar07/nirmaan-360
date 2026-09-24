import {
  INITIAL_PROJECTS,
  INITIAL_FIELD_REPORTS,
  INITIAL_ALERTS,
  INITIAL_DEPARTMENTS,
  INITIAL_CONTRACTORS
} from "./data/mockData";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper for safe fetch with timeout
async function request(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`[NIRMAAN 360 API] Backend request to ${endpoint} failed (${err.message}). Using resilient prototype fallback engine.`);
    return null; // Signals fallback to caller
  }
}

// ==========================================
// 1. AUTHENTICATION
// ==========================================

export async function loginUser(userId, password, role) {
  const remote = await request("/login", {
    method: "POST",
    body: JSON.stringify({ userId, password, role })
  });

  if (remote) return remote;

  // Resilient offline fallback logic
  const valid = {
    Admin: { pwd: "admin123", role: "Administrator", name: "Dr. V. Rajesh, IAS", dept: "Infrastructure Monitoring Directorate" },
    "Project Officer": { pwd: "officer123", role: "Project Officer", name: "Er. K. Sivaramakrishnan", dept: "Highways & Public Works" },
    "Field Officer": { pwd: "field123", role: "Field Officer", name: "Arun Kumar, AE", dept: "Field Inspection Division" },
    Contractor: { pwd: "contractor123", role: "Contractor", name: "Vikram Seth, Director", dept: "L&T Infrastructure Projects Ltd" }
  };

  const entry = Object.entries(valid).find(([k, v]) => {
    return (
      (userId.toLowerCase() === k.toLowerCase() ||
        (k === "Admin" && userId.toLowerCase() === "admin") ||
        (k === "Project Officer" && userId.toLowerCase() === "officer") ||
        (k === "Field Officer" && userId.toLowerCase() === "field") ||
        (k === "Contractor" && userId.toLowerCase() === "contractor")) &&
      password === v.pwd
    );
  });

  if (entry) {
    return {
      success: true,
      token: "demo-token-" + Date.now(),
      user: {
        id: userId,
        name: entry[1].name,
        role: entry[1].role,
        department: entry[1].dept,
        isDemo: true
      }
    };
  }

  throw new Error("Invalid credentials. Please use demo credentials: admin123, officer123, field123, contractor123");
}

// ==========================================
// 2. DASHBOARD
// ==========================================

export async function fetchDashboard() {
  const remote = await request("/dashboard");
  if (remote) return remote;

  return {
    success: true,
    kpis: {
      totalProjects: 128,
      activeProjects: 94,
      atRisk: 17,
      delayed: 11,
      completed: 23,
      totalBudgetCr: 4820.0,
      utilizedBudgetCr: 2910.0,
      physicalProgress: 67.4
    },
    healthBreakdown: [
      { name: "Healthy", count: 71, color: "#10B981", percentage: 55.5 },
      { name: "Watch", count: 23, color: "#F59E0B", percentage: 18.0 },
      { name: "At Risk", count: 17, color: "#F97316", percentage: 13.3 },
      { name: "Critical", count: 17, color: "#EF4444", percentage: 13.2 }
    ],
    monthlyTrend: [
      { month: "Apr 2026", planned: 52.0, actual: 49.5, expenditureCr: 310 },
      { month: "May 2026", planned: 56.5, actual: 53.0, expenditureCr: 345 },
      { month: "Jun 2026", planned: 61.0, actual: 57.2, expenditureCr: 380 },
      { month: "Jul 2026", planned: 65.5, actual: 60.8, expenditureCr: 410 },
      { month: "Aug 2026", planned: 70.0, actual: 64.1, expenditureCr: 440 },
      { month: "Sep 2026", planned: 74.5, actual: 67.4, expenditureCr: 475 }
    ],
    deptPerformance: [
      { department: "Highways", budget: 1640, spent: 1120, progress: 68.5, active: 28, riskAvg: 38 },
      { department: "Water Resources", budget: 910, spent: 640, progress: 64.0, active: 18, riskAvg: 45 },
      { department: "Transport", budget: 820, spent: 510, progress: 63.2, active: 16, riskAvg: 42 },
      { department: "Municipal Admin", budget: 580, spent: 385, progress: 69.8, active: 12, riskAvg: 36 },
      { department: "Health", budget: 450, spent: 295, progress: 72.4, active: 10, riskAvg: 25 },
      { department: "Urban Dev", budget: 420, spent: 260, progress: 65.1, active: 10, riskAvg: 30 }
    ],
    criticalProjects: [
      {
        id: "NMRN-001",
        name: "Chennai Outer Ring Road Expansion",
        riskLevel: "Critical",
        delayDays: 42,
        actualProgress: 58.0,
        primaryBottleneck: "Land Acquisition",
        action: "Expedite land clearance & deploy additional shifts",
        budget: 850.0
      },
      {
        id: "NMRN-003",
        name: "Madurai Smart Underground Drainage",
        riskLevel: "Critical",
        delayDays: 58,
        actualProgress: 61.0,
        primaryBottleneck: "Sub-surface Rock Hard strata",
        action: "Intervene on sub-surface rock excavation",
        budget: 380.0
      },
      {
        id: "NMRN-013",
        name: "Cuddalore Coastal Port Access Expressway",
        riskLevel: "Critical",
        delayDays: 46,
        actualProgress: 48.0,
        primaryBottleneck: "Bridge Pier Piling in Tidal Estuary",
        action: "Deploy specialized marine salvage divers",
        budget: 310.0
      },
      {
        id: "NMRN-002",
        name: "Tindivanam Integrated Bus Terminal",
        riskLevel: "At Risk",
        delayDays: 34,
        actualProgress: 52.0,
        primaryBottleneck: "Structural Steel Procurement",
        action: "Approve secondary steel supplier mill",
        budget: 240.0
      },
      {
        id: "NMRN-006",
        name: "Salem Municipal Bulk Water Supply",
        riskLevel: "At Risk",
        delayDays: 38,
        actualProgress: 64.0,
        primaryBottleneck: "Forest Clearance for Pipeline Corridor",
        action: "Special Forest DFO coordination meeting",
        budget: 490.0
      }
    ],
    meta: {
      lastSynchronized: "24 September 2026 · 11:45 AM",
      environment: "Demonstration Data"
    }
  };
}

// ==========================================
// 3. PROJECTS REGISTRY & DETAILS
// ==========================================

export async function fetchProjects(params = {}) {
  const query = new URLSearchParams(params).toString();
  const remote = await request(`/projects?${query}`);
  if (remote) return remote;

  let list = [...INITIAL_PROJECTS];
  if (params.department) {
    list = list.filter((p) => p.department.toLowerCase().includes(params.department.toLowerCase()));
  }
  if (params.district) {
    list = list.filter((p) => p.district.toLowerCase().includes(params.district.toLowerCase()));
  }
  if (params.status) {
    list = list.filter((p) => p.status.toLowerCase() === params.status.toLowerCase());
  }
  if (params.risk) {
    list = list.filter((p) => p.riskLevel.toLowerCase() === params.risk.toLowerCase());
  }
  if (params.search) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.id.toLowerCase().includes(s) ||
        p.name.toLowerCase().includes(s) ||
        p.district.toLowerCase().includes(s) ||
        p.contractor.toLowerCase().includes(s)
    );
  }

  return { success: true, total: list.length, projects: list };
}

export async function fetchProjectById(id) {
  const remote = await request(`/projects/${id}`);
  if (remote) return remote;

  const proj = INITIAL_PROJECTS.find((p) => p.id.toUpperCase() === (id || "").toUpperCase()) || INITIAL_PROJECTS[0];
  const fieldReports = INITIAL_FIELD_REPORTS.filter((r) => r.projectId === proj.id);
  const alerts = INITIAL_ALERTS.filter((a) => a.projectId === proj.id);

  return {
    success: true,
    project: proj,
    calculatedRisk: {
      compositeScore: proj.riskScore,
      riskLevel: proj.riskLevel,
      factors: {
        scheduleRisk: 82.0,
        budgetRisk: 61.0,
        dependencyRisk: 88.0,
        contractorRisk: 54.0,
        approvalRisk: 73.0,
        fieldVarianceRisk: 67.0
      },
      formulaExplanation: "Calculated via Rule-Based Prototype Risk Engine using Schedule Gap (28%), Dependencies (24%), Budget Outgo Disparity (18%), Contractor Track Record (12%), Clearance Bottlenecks (10%), and Verified Field Variance (8%)."
    },
    fieldReports,
    alerts
  };
}

// ==========================================
// 4. DEPENDENCY INTELLIGENCE
// ==========================================

export async function fetchDependencies(id) {
  const remote = await request(`/dependencies/${id}`);
  if (remote) return remote;

  const proj = INITIAL_PROJECTS.find((p) => p.id.toUpperCase() === (id || "").toUpperCase()) || INITIAL_PROJECTS[0];

  return {
    success: true,
    projectId: proj.id,
    projectName: proj.name,
    rootBottleneck: {
      name: "Land Acquisition & RoW (Package 3 Tiruvallur)",
      status: "Delayed",
      delay: "+18 days (Buffer exhausted)",
      downstreamImpactDays: 42,
      affectedMilestones: 4,
      affectedTasks: 11,
      risk: "CRITICAL",
      whyItMatters: "Delay in statutory land acquisition in Tiruvallur parcel blocks continuous access for heavy hydraulic piling rigs. This in turn halts superstructure girder casting, cascading a cumulative 42 days delay onto the final bituminous wearing course and public handover."
    },
    nodes: [
      { id: "node-1", name: "Statutory Land Acquisition & RoW", department: "Revenue / Highways", status: "Delayed", delayDays: 18, isRootBottleneck: true, progress: 82, affectedMilestones: 4, affectedTasks: 11 },
      { id: "node-2", name: "Cast-in-Situ Substructure Piling", department: "Civil Contractor", status: "At Risk", delayDays: 24, isRootBottleneck: false, progress: 52, affectedMilestones: 3, affectedTasks: 8 },
      { id: "node-3", name: "Pier Cap Casting & Deck Girders", department: "Structures Team", status: "At Risk", delayDays: 36, isRootBottleneck: false, progress: 38, affectedMilestones: 2, affectedTasks: 6 },
      { id: "node-4", name: "Bituminous Pavement & Medians", department: "Paving Gang", status: "At Risk", delayDays: 42, isRootBottleneck: false, progress: 10, affectedMilestones: 1, affectedTasks: 4 },
      { id: "node-5", name: "Lighting, Signage & Safety Certification", department: "Safety Directorate", status: "At Risk", delayDays: 42, isRootBottleneck: false, progress: 0, affectedMilestones: 1, affectedTasks: 2 }
    ],
    edges: [
      { from: "node-1", to: "node-2", label: "Blocks excavation & piling" },
      { from: "node-2", to: "node-3", label: "Sequential pier erection" },
      { from: "node-3", to: "node-4", label: "Requires continuous deck cure" },
      { from: "node-4", to: "node-5", label: "Final statutory commissioning" }
    ]
  };
}

// ==========================================
// 5. WHAT-IF SIMULATION ENGINE
// ==========================================

export async function runSimulation(payload) {
  const remote = await request("/simulate", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  if (remote) return remote;

  const { projectId = "NMRN-001", intervention = "Expedite Land Acquisition", resourceSlider = 65, delayReductionDays = 25 } = payload;
  const resourceFactor = (resourceSlider / 100.0) * 18.0;
  const calculatedRecoveryDays = Math.min(55, Math.max(5, Math.round(22 + resourceFactor + delayReductionDays * 0.35)));
  const costImpact = +(resourceSlider * 0.18 * 1.1).toFixed(1);
  const currentRisk = 72;
  const simulatedRisk = Math.max(20, currentRisk - Math.round((resourceSlider / 100.0) * 20 + 4));

  return {
    success: true,
    meta: {
      engine: "Prototype Simulation Engine",
      model: "Rule-based demonstration model using sample project data"
    },
    inputs: { projectId, intervention, resourceIntensity: resourceSlider, delayReductionInput: delayReductionDays },
    current: {
      completionDate: "18 Aug 2027",
      riskScore: currentRisk,
      riskLevel: "HIGH",
      delayRemainingDays: 42
    },
    simulated: {
      completionDate: calculatedRecoveryDays >= 40 ? "06 Jul 2027" : "22 Jul 2027",
      riskScore: simulatedRisk,
      riskLevel: simulatedRisk < 55 ? "MEDIUM" : "HIGH",
      delayRemainingDays: Math.max(0, 42 - calculatedRecoveryDays)
    },
    recoveryDays: calculatedRecoveryDays,
    costImpactCr: costImpact,
    riskReductionPoints: currentRisk - simulatedRisk,
    recommendationConfidence: "High (Rule-verified)",
    explanation: `Applying '${intervention}' at ${resourceSlider}% resource intensity recovers approximately ${calculatedRecoveryDays} calendar days with an estimated budget adjustment of ₹${costImpact} Cr, bringing project risk down to ${simulatedRisk}.`
  };
}

// ==========================================
// 6. RECOMMENDATIONS
// ==========================================

export async function fetchRecommendations(id) {
  const remote = await request(`/recommendations/${id}`);
  if (remote) return remote;

  const proj = INITIAL_PROJECTS.find((p) => p.id.toUpperCase() === (id || "").toUpperCase()) || INITIAL_PROJECTS[0];

  return {
    success: true,
    projectId: proj.id,
    recommendations: [
      {
        id: "REC-01",
        projectId: proj.id,
        projectName: proj.name,
        primaryBottleneck: proj.primaryBottleneck || "Land Acquisition",
        recommendation: "Expedite approval and allocate an additional field coordination team for Section 3D awards.",
        rationale: "Land acquisition package in Tiruvallur is the single root constraint gating subsequent bored piling.",
        impact: {
          delayReductionDays: 21,
          riskReductionPercent: 18,
          affectedMilestonesSaved: 3,
          costCr: 4.5
        },
        status: "Ready for Assignment",
        urgency: "High"
      },
      {
        id: "REC-02",
        projectId: proj.id,
        projectName: proj.name,
        primaryBottleneck: "Flyover Piling Productivity",
        recommendation: "Contract 2 supplementary hydraulic rotary piling rigs with dual-shift crew rotation.",
        rationale: "Substructure completion rate is running 35% below targeted daily meterage.",
        impact: {
          delayReductionDays: 14,
          riskReductionPercent: 12,
          affectedMilestonesSaved: 2,
          costCr: 6.8
        },
        status: "Under Evaluation",
        urgency: "Medium"
      }
    ]
  };
}

// ==========================================
// 7. FIELD VERIFICATION & EVIDENCE
// ==========================================

export async function fetchFieldReports() {
  const remote = await request("/field-reports");
  if (remote) return remote;

  return {
    success: true,
    total: INITIAL_FIELD_REPORTS.length,
    reports: INITIAL_FIELD_REPORTS,
    summary: {
      pendingVerification: 12,
      verifiedToday: 24,
      requiresReview: INITIAL_FIELD_REPORTS.filter((r) => r.status === "Requires Review").length,
      evidenceUploaded: 38
    }
  };
}

export async function fetchEvidence() {
  const remote = await request("/evidence");
  if (remote) return remote;

  return {
    success: true,
    total: INITIAL_FIELD_REPORTS.length,
    evidenceItems: INITIAL_FIELD_REPORTS.map((r, i) => ({
      id: `EVD-${i + 1}`,
      reportId: r.id,
      projectId: r.projectId,
      projectName: r.projectName,
      officer: r.officer,
      date: r.date,
      time: r.time,
      gps: r.gps,
      tag: r.evidenceTag,
      photoUrl: r.evidencePhoto,
      verifiedProgress: r.verifiedProgress,
      status: r.status,
      remarks: r.remarks
    }))
  };
}

// ==========================================
// 8. ALERTS & NOTIFICATIONS
// ==========================================

export async function fetchAlerts(severity = "") {
  const query = severity ? `?severity=${severity}` : "";
  const remote = await request(`/alerts${query}`);
  if (remote) return remote;

  let list = [...INITIAL_ALERTS];
  if (severity) {
    list = list.filter((a) => a.severity.toLowerCase() === severity.toLowerCase());
  }
  return { success: true, total: list.length, alerts: list };
}

export async function acknowledgeAlert(id) {
  const remote = await request(`/alerts/${id}/acknowledge`, { method: "POST" });
  if (remote) return remote;

  const a = INITIAL_ALERTS.find((item) => item.id === id);
  if (a) a.acknowledged = true;
  return { success: true, message: `Alert ${id} acknowledged` };
}

export async function fetchNotifications() {
  const remote = await request("/notifications");
  if (remote) return remote;

  return {
    success: true,
    notifications: [
      { id: "NOTIF-1", category: "Critical", title: "Critical Bottleneck in NMRN-001", time: "10 mins ago", read: false, message: "Land acquisition delay escalated to Chief Engineer level." },
      { id: "NOTIF-2", category: "Action Required", title: "Field Verification Pending Signoff", time: "45 mins ago", read: false, message: "Field inspection FR-2026-101 has negative 8% variance." },
      { id: "NOTIF-3", category: "Warning", title: "Budget Utilization Anomaly", message: "NMRN-003 financial drawal is outpacing physical achievement.", time: "2 hours ago", read: false },
      { id: "NOTIF-4", category: "Information", title: "Quarterly Milestone Passed", message: "NMRN-004 completed segmental decking 5 days ahead of schedule.", time: "Yesterday", read: true }
    ],
    unreadCount: 3
  };
}

// ==========================================
// 9. GIS & MASTER DATA
// ==========================================

export async function fetchGisData() {
  const remote = await request("/gis");
  if (remote) return remote;

  return {
    success: true,
    markers: INITIAL_PROJECTS.map((p) => ({
      id: p.id,
      name: p.name,
      lat: p.lat || p.latitude,
      lng: p.lng || p.longitude,
      latitude: p.latitude || p.lat,
      longitude: p.longitude || p.lng,
      location: p.location || "",
      district: p.district,
      department: p.department,
      progress: p.actualProgress,
      actualProgress: p.actualProgress,
      planned: p.plannedProgress,
      plannedProgress: p.plannedProgress,
      riskScore: p.riskScore,
      riskLevel: p.riskLevel,
      status: p.status,
      budget: p.budget,
      utilizedBudget: p.utilizedBudget || 0,
      expectedCompletion: p.revisedCompletionDate || p.completionDate || "31 Dec 2026",
      delayDays: p.delayDays || 0,
      primaryBottleneck: p.primaryBottleneck || "",
      contractor: p.contractor || ""
    }))
  };
}

export async function fetchContractors() {
  const remote = await request("/contractors");
  if (remote) return remote;
  return { success: true, contractors: INITIAL_CONTRACTORS };
}

export async function fetchDepartments() {
  const remote = await request("/departments");
  if (remote) return remote;
  return { success: true, departments: INITIAL_DEPARTMENTS };
}
