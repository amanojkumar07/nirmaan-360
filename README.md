# NIRMAAN 360

### Integrated Infrastructure Project Monitoring & Decision Support Platform

> **From Monitoring → Understanding → Simulation → Decision Support**

NIRMAAN 360 is an enterprise-grade command-and-control platform prototype designed for infrastructure leadership, project directors, field monitoring engineers, and execution contractors. It demonstrates how modern public infrastructure administration transitions from passive historical status reporting into active bottleneck isolation, root-cause dependency intelligence, and deterministic what-if scenario simulation.

---

## 🏛️ Prototype Disclaimer & Honesty Statement

> [!NOTE]
> **This project is a college/hackathon demonstration prototype** using fictional infrastructure project datasets and rule-based decision support logic. It is not an official Government of India or Government of Tamil Nadu system, nor does it connect to live classified department networks.
> 
> Honest terminology is strictly maintained throughout:
> * **Prototype Risk Engine** (Rule-based deterministic scoring)
> * **Prototype Simulation Engine** (Schedule elasticity & intervention models)
> * **Demonstration Digital Twin** (Unified multidimensional state representation)
> * **Sample Project Data** (Fictionalized corridor, transit and municipal works)

---

## 🚀 Key Platform Features

* **Infrastructure Command Center (Dashboard):** Real-time statewide KPIs (Active works, At-Risk, Delayed, Fiscal Outlay, Physical Progress), Executive Health donut chart, and critical project alerts.
* **Statewide Project GIS Cockpit:** OpenStreetMap/CartoDB interactive geospatial layer mapping project coordinates with risk-coded status pins and district clustering.
* **Demonstration Digital Project Twin (`NMRN-001`):** Central interactive twin node connected across 8 operational facets (Schedule, Budget, Location, Tasks, Resources, Evidence, Dependencies, Risk) with live telemetry feed.
* **Dependency Intelligence Engine:** Critical Path Method (CPM) graph isolating root statutory constraints (e.g., Land Acquisition RoW) and calculating downstream cascading slippage (+42 days).
* **What-If Simulation Engine:** Rule-based decision simulator testing administrative interventions (Expedite Land Acquisition, Add Workers, Increase Shifts, Material Quotas) with dynamic cost and recovery forecasting.
* **Multidimensional Risk Engine:** 6-axis risk radar evaluating Schedule Gap, Fiscal Disparity, Dependency Bottlenecks, Contractor Track Record, Clearances, and Field Variances.
* **Field Verification Telemetry:** Geo-tagged photographic evidence audit system detecting contractor billing claim discrepancies (>5% variance).
* **Automated Smart Alerts:** Real-time exception dispatch with acknowledgement and escalation workflows.
* **Executive Reports & Analytics:** Printable reports, CSV dataset exports, and contractor benchmarking indices.
* **Role-Based Experience:** Custom navigation and permissions for Administrator, Project Officer, Field Officer, and Contractor personas.

---

## 👥 Demo Authentication Credentials

The application includes built-in 1-click credential buttons on the login screen:

| Role | User ID / Identifier | Demo Password | Focus Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `Admin` | `admin123` | Full access across statewide directory |
| **Project Officer** | `Project Officer` | `officer123` | Project Intelligence, Twins, Simulation & Risks |
| **Field Officer** | `Field Officer` | `field123` | Field Verification, Evidence Repo & GIS |
| **EPC Contractor** | `Contractor` | `contractor123` | Assigned Tasks, Milestones & Progress Claims |

---

## 🛠️ Technology Stack

### Frontend
* **React 18 / 19** + **Vite**
* **React Router DOM v6** (Multi-page routing & deep linking)
* **Lucide React** (Enterprise iconography)
* **Recharts** (Interactive charting: Radar, Line, Bar, Pie)
* **Leaflet & React-Leaflet** (Geospatial mapping & OSM raster layers)
* **Pure Modular CSS** (Official Government Navy `#102A43`, Maroon `#7A1F2B`, and Accent Gold `#D9A441`)

### Backend
* **Python 3.11+**
* **Flask** + **Flask-CORS**
* Python Standard Library (`json`, `datetime`, `os`)

---

## 📂 Project Directory Structure

```text
nirmaan.360/
│
├── backend/
│   ├── app.py                 # Flask REST API, datasets & simulation engines
│   └── requirements.txt       # Flask & Flask-CORS
│
├── frontend/
│   ├── src/
│   │   ├── api.js             # API client with hybrid live/offline mock fallback
│   │   ├── App.jsx            # Main app shell, routes & auth state
│   │   ├── App.css            # Enterprise government design system styles
│   │   ├── main.jsx           # React DOM root with BrowserRouter
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    # Responsive collapsible navigation with role filters
│   │   │   ├── Topbar.jsx     # Global search, breadcrumbs & date indicator
│   │   │   ├── LeafletMap.jsx # Interactive Leaflet GIS map with status pins
│   │   │   ├── Toast.jsx      # Lightweight notification toast provider
│   │   │   └── Skeleton.jsx   # Polished shimmer skeleton loading states
│   │   ├── pages/
│   │   │   ├── Login.jsx              # Split-screen auth with 1-click profiles
│   │   │   ├── Dashboard.jsx          # Command Center, KPIs & statewide charts
│   │   │   ├── Projects.jsx           # Filterable & sortable project registry
│   │   │   ├── ProjectDetail.jsx      # 9-tab project dossier & CPM timeline
│   │   │   ├── DigitalTwin.jsx        # Central twin node & 8 orbital modules
│   │   │   ├── Dependencies.jsx       # Root bottleneck CPM graph (+42d impact)
│   │   │   ├── Simulation.jsx         # What-If simulator with before/after delta
│   │   │   ├── RiskAnalytics.jsx      # 6-axis radar & rule-based engine logic
│   │   │   ├── Recommendations.jsx    # Prescribed interventions with direct action
│   │   │   ├── FieldVerification.jsx  # Telemetry audit & claim variance flags
│   │   │   ├── EvidenceRepository.jsx # Photographic site evidence repository
│   │   │   ├── ProjectGis.jsx         # Geospatial layer view with district filters
│   │   │   ├── SmartAlerts.jsx        # Critical threshold exception dispatch
│   │   │   ├── Notifications.jsx      # Notification center & read states
│   │   │   ├── Reports.jsx            # Printable executive summary & CSV export
│   │   │   └── Settings.jsx           # Preferences & environment disclaimer
│   │   └── data/
│   │       └── mockData.js    # Resilient client-side dataset mirror
│   ├── package.json
│   ├── netlify.toml           # Netlify SPA redirect rules
│   └── .env.example
│
├── README.md
├── LICENSE
└── .gitignore
```

---

## 💻 Local Setup & Execution

### Prerequisites
* **Node.js** (v18+) & **npm**
* **Python** (v3.9+)

### 1. Start Backend Service
```bash
cd backend
pip install -r requirements.txt
python app.py
```
> The Flask API will start at `http://localhost:5000` with endpoints mounted under `/api/*`.

### 2. Start Frontend Application
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
> The Vite development server will start at `http://localhost:5173`. Open in your browser.

---

## 🌐 Netlify & Cloud Deployment

### 1. Push Code via GitHub Desktop
1. Open **GitHub Desktop**.
2. Click **File → Add Local Repository** and select the folder:
   ```text
   nirmaan.360
   ```
3. Commit all files with message: `feat: Initial NIRMAAN 360 infrastructure platform release`.
4. Click **Publish repository** to push to your GitHub account.

### 2. Deploy Frontend to Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Select **Add new site → Import an existing project → GitHub**.
3. Select your `nirmaan.360` repository.
4. Configure Build Settings:
   * **Base directory:** `frontend`
   * **Build command:** `npm run build`
   * **Publish directory:** `frontend/dist`
5. Under **Environment variables**, set:
   ```env
   VITE_API_URL=https://your-backend-service.onrender.com/api
   ```
   *(Note: If left unset, the frontend includes a built-in resilient mock engine that operates seamlessly during static evaluations).*
6. Click **Deploy Site**. The included `frontend/netlify.toml` guarantees that SPA routes (`/dashboard`, `/projects/NMRN-001`, `/simulation`, etc.) resolve without 404 errors on browser refresh.

---

## 🎯 Complete Demonstration Scenario Walkthrough

Follow this step-by-step sequence to deliver a convincing presentation:

1. **Step 1 — Authentication:**
   * Open the login page.
   * Click the **Project Officer** 1-click preset (`officer123`) and submit.
2. **Step 2 — Statewide Command Center (`/dashboard`):**
   * Review high-level indicators (128 total projects, 17 at risk, ₹4,820 Cr outlay, 67.4% progress).
   * Click the **At Risk** slice in the *Executive Project Health* chart to filter map markers.
   * In the *Critical Projects* panel, locate **NMRN-001 (Chennai Outer Ring Road Expansion)**.
3. **Step 3 — Project Dossier (`/projects/NMRN-001`):**
   * Inspect the 58% actual vs 70% planned progress.
   * Click through the tabs: **Timeline** (observe Milestone M2 Land Acquisition marked *Delayed* by 18 days), **Budget**, **Tasks**, and **Field Evidence**.
4. **Step 4 — Digital Project Twin (`/digital-twin`):**
   * Explore the central twin node with 8 orbiting modules (Schedule, Budget, Location, Tasks, Resources, Evidence, Dependencies, Risk).
   * Review the *Twin Health Indices* and live telemetry feed.
5. **Step 5 — Dependency Intelligence (`/dependencies`):**
   * Trace the Critical Path: `Land Acquisition (+18d)` → `Foundation Piling` → `Structural Decking` → `Road Work`.
   * Highlight the **+42 days downstream impact** and read the *Why This Matters* card.
6. **Step 6 — What-If Simulation (`/simulation`):**
   * Select intervention: **Expedite Land Acquisition**.
   * Adjust *Resource Intensity* to **65%** and target delay reduction to **25 days**.
   * Click **RUN SIMULATION MODEL**.
   * Observe the side-by-side delta: Completion advances from **18 Aug 2027** to **06 Jul 2027** (+43 days recovered), Risk drops from **HIGH (72)** to **MEDIUM (54)** at an outlay of **+₹12.9 Cr**.
7. **Step 7 — Field Telemetry & Verification (`/field-verification`):**
   * Review report `FR-2026-101`: Contractor claimed 62% vs verified 54% (-8.0% variance).
   * Click to inspect the geo-tagged photographic evidence.
8. **Step 8 — Smart Alerts (`/alerts`):**
   * Locate the Critical alert for `NMRN-001` Land Acquisition threshold breach.
   * Click **Acknowledge** to verify live visual state update and toast confirmation.
9. **Step 9 — Executive Reports (`/reports`):**
   * View the contractor performance benchmarks and department outgo distributions.
   * Click **Export CSV Summary** or **Print / Export PDF**.

---

## 📡 API Endpoints Reference

All endpoints return JSON responses with standard HTTP status codes:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/login` | Authenticates demo officer role and issues session token |
| `GET` | `/api/dashboard` | Statewide KPI tallies, health breakdown, and trend curves |
| `GET` | `/api/projects` | Filterable project register (`?department=`, `?risk=`, `?search=`) |
| `GET` | `/api/projects/<id>` | Full dossier, milestone schedule, tasks and risk breakdown |
| `GET` | `/api/dependencies/<id>` | CPM critical path graph, root bottleneck and downstream impact |
| `POST` | `/api/simulate` | Evaluates what-if intervention policies and calculates recovery days |
| `GET` | `/api/risk/<id>` | Multidimensional 6-factor risk analysis |
| `GET` | `/api/recommendations/<id>` | Prioritized administrative interventions and expected yields |
| `GET` | `/api/field-reports` | Telemetry logs, claimed vs verified progress, and variance scores |
| `POST` | `/api/field-reports` | Records new field inspection audit |
| `GET` | `/api/alerts` | Smart threshold breach exceptions (`?severity=`) |
| `POST` | `/api/alerts/<id>/acknowledge` | Acknowledges an active exception alert |
| `GET` | `/api/evidence` | Geo-tagged photographic site evidence dockets |
| `GET` | `/api/gis` | Geospatial marker coordinates for mapping engines |
| `GET` | `/api/contractors` | Contractor performance track records and delay indices |
| `GET` | `/api/departments` | Department budget sanction and expenditure allocations |
| `GET` | `/api/notifications` | User notification center dispatches and unread counts |

---

## ⚖️ License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
