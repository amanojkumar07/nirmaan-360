import os
import json
from datetime import datetime, date
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ==========================================
# 1. DEPARTMENTS & CONTRACTORS DATASET
# ==========================================

DEPARTMENTS = [
    {"id": "DEP-HW", "name": "Highways & Minor Ports", "code": "HMPD", "totalProjects": 38, "budgetCr": 1640.0, "active": 28},
    {"id": "DEP-TR", "name": "Transport Department", "code": "TNTP", "totalProjects": 22, "budgetCr": 820.0, "active": 16},
    {"id": "DEP-WR", "name": "Water Resources Department", "code": "WRD", "totalProjects": 24, "budgetCr": 910.0, "active": 18},
    {"id": "DEP-HL", "name": "Health & Family Welfare", "code": "HFWD", "totalProjects": 14, "budgetCr": 450.0, "active": 10},
    {"id": "DEP-MA", "name": "Municipal Administration & Water Supply", "code": "MAWS", "totalProjects": 18, "budgetCr": 580.0, "active": 12},
    {"id": "DEP-UD", "name": "Housing & Urban Development", "code": "HUDD", "totalProjects": 12, "budgetCr": 420.0, "active": 10}
]

CONTRACTORS = [
    {
        "id": "CTR-01",
        "name": "L&T Infrastructure Projects Ltd",
        "category": "Class A+",
        "projects": 6,
        "completionRate": 91.2,
        "averageDelayDays": 8.4,
        "safetyScore": 96.5,
        "qualityScore": 94.0,
        "currentProjects": ["NMRN-001", "NMRN-004", "NMRN-007"],
        "riskLevel": "Low"
    },
    {
        "id": "CTR-02",
        "name": "Shapoorji Pallonji Engineering",
        "category": "Class A+",
        "projects": 5,
        "completionRate": 86.8,
        "averageDelayDays": 14.2,
        "safetyScore": 92.0,
        "qualityScore": 89.5,
        "currentProjects": ["NMRN-002", "NMRN-005"],
        "riskLevel": "Medium"
    },
    {
        "id": "CTR-03",
        "name": "Nagarjuna Construction Co",
        "category": "Class A",
        "projects": 4,
        "completionRate": 78.4,
        "averageDelayDays": 24.6,
        "safetyScore": 84.0,
        "qualityScore": 81.0,
        "currentProjects": ["NMRN-003", "NMRN-006"],
        "riskLevel": "High"
    },
    {
        "id": "CTR-04",
        "name": "Afcons Infrastructure Ltd",
        "category": "Class A+",
        "projects": 4,
        "completionRate": 92.5,
        "averageDelayDays": 6.1,
        "safetyScore": 97.0,
        "qualityScore": 95.2,
        "currentProjects": ["NMRN-008", "NMRN-010"],
        "riskLevel": "Low"
    },
    {
        "id": "CTR-05",
        "name": "Tata Projects Infrastructure",
        "category": "Class A+",
        "projects": 5,
        "completionRate": 89.0,
        "averageDelayDays": 11.0,
        "safetyScore": 94.2,
        "qualityScore": 91.8,
        "currentProjects": ["NMRN-009", "NMRN-012"],
        "riskLevel": "Low"
    },
    {
        "id": "CTR-06",
        "name": "NCC Infrastructure Ltd",
        "category": "Class A",
        "projects": 4,
        "completionRate": 81.3,
        "averageDelayDays": 19.8,
        "safetyScore": 88.0,
        "qualityScore": 85.5,
        "currentProjects": ["NMRN-011", "NMRN-014"],
        "riskLevel": "Medium"
    }
]

# ==========================================
# 2. COMPREHENSIVE SAMPLE PROJECTS (26 Projects)
# ==========================================

PROJECTS = [
    {
        "id": "NMRN-001",
        "name": "Chennai Outer Ring Road Expansion (Phase II)",
        "department": "Highways & Minor Ports",
        "category": "Roads & Expressways",
        "location": "Vandalur - Minjur Corridor",
        "district": "Chennai / Tiruvallur",
        "lat": 13.0827,
        "lng": 80.2707,
        "contractor": "L&T Infrastructure Projects Ltd",
        "projectManager": "Er. S. Radhakrishnan, SE",
        "budget": 850.0,
        "utilizedBudget": 564.0,
        "plannedProgress": 70.0,
        "actualProgress": 58.0,
        "financialProgress": 66.3,
        "startDate": "2024-03-15",
        "completionDate": "2026-11-30",
        "revisedCompletionDate": "2027-08-18",
        "status": "At Risk",
        "riskScore": 72,
        "riskLevel": "Critical",
        "delayDays": 42,
        "primaryBottleneck": "Land Acquisition",
        "summary": "Six-lane bypass widening connecting industrial hubs to Ennore Port with grade separators.",
        "milestones": [
            {"id": "M1", "name": "Feasibility & DPR", "status": "Completed", "target": "2024-05-30", "completed": "2024-05-15", "progress": 100},
            {"id": "M2", "name": "Land Acquisition & RoW Clearance", "status": "Delayed", "target": "2024-11-30", "completed": None, "delayDays": 18, "progress": 82},
            {"id": "M3", "name": "Site Preparation & Earthwork", "status": "Delayed", "target": "2025-04-15", "completed": None, "delayDays": 24, "progress": 74},
            {"id": "M4", "name": "Sub-Base & Foundation Structures", "status": "Delayed", "target": "2025-10-31", "completed": None, "delayDays": 36, "progress": 55},
            {"id": "M5", "name": "Flyover Piers & Structural Decking", "status": "Current", "target": "2026-04-30", "completed": None, "delayDays": 42, "progress": 40},
            {"id": "M6", "name": "Bituminous Paving & Median Lighting", "status": "Upcoming", "target": "2026-09-30", "completed": None, "delayDays": 42, "progress": 0},
            {"id": "M7", "name": "Safety Audit, Signage & Handover", "status": "Upcoming", "target": "2026-11-30", "completed": None, "delayDays": 42, "progress": 0}
        ],
        "tasks": [
            {"id": "T1", "name": "Gazette notification for Section 3D RoW", "milestone": "M2", "plannedStart": "2024-06-01", "plannedEnd": "2024-09-15", "progress": 100, "status": "Completed"},
            {"id": "T2", "name": "Compensation disbursement to landowners", "milestone": "M2", "plannedStart": "2024-08-01", "plannedEnd": "2024-11-30", "progress": 78, "status": "Delayed", "blocker": "Litigation in 2 village parcels"},
            {"id": "T3", "name": "Utility shifting (TANGEDCO cables & CMWSSB pipes)", "milestone": "M2", "plannedStart": "2024-09-15", "plannedEnd": "2025-01-15", "progress": 65, "status": "Delayed"},
            {"id": "T4", "name": "Embankment filling & compaction (Km 12 to 28)", "milestone": "M3", "plannedStart": "2024-12-01", "plannedEnd": "2025-04-15", "progress": 70, "status": "In Progress"},
            {"id": "T5", "name": "Cast-in-situ bored piling for grade separator", "milestone": "M4", "plannedStart": "2025-03-01", "plannedEnd": "2025-08-30", "progress": 52, "status": "In Progress"},
            {"id": "T6", "name": "Pier cap casting & PSC girder launching", "milestone": "M5", "plannedStart": "2025-08-01", "plannedEnd": "2026-03-31", "progress": 38, "status": "In Progress"}
        ],
        "dependencies": [
            {"source": "Land Acquisition & RoW", "target": "Foundation & Piling", "status": "Delayed", "impactDays": 24, "type": "Hard Dependency"},
            {"source": "Foundation & Piling", "target": "Structural Decking", "status": "At Risk", "impactDays": 36, "type": "Hard Dependency"},
            {"source": "Structural Decking", "target": "Bituminous Paving", "status": "At Risk", "impactDays": 42, "type": "Sequential"},
            {"source": "Bituminous Paving", "target": "Safety Audit & Handover", "status": "At Risk", "impactDays": 42, "type": "Sequential"}
        ],
        "alerts": [
            {"id": "ALT-001", "severity": "Critical", "title": "Critical Dependency Breach", "message": "Land Acquisition package #3 in Tiruvallur delay has exceeded 40 days buffer.", "date": "2026-09-22", "acknowledged": False},
            {"id": "ALT-002", "severity": "Warning", "title": "Physical vs Financial Discrepancy", "message": "Financial outgo (66.3%) exceeds physical accomplishment (58.0%) by 8.3%.", "date": "2026-09-20", "acknowledged": False},
            {"id": "ALT-003", "severity": "Field Verification", "title": "Field Progress Variance (-8.0%)", "message": "Field inspection confirmed 54% vs contractor claim of 62%.", "date": "2026-09-24", "acknowledged": False}
        ]
    },
    {
        "id": "NMRN-002",
        "name": "Tindivanam Integrated Bus Terminal & Commercial Complex",
        "department": "Transport Department",
        "category": "Transit Infrastructure",
        "location": "GST Road Junction",
        "district": "Villupuram",
        "lat": 12.2286,
        "lng": 79.6515,
        "contractor": "Shapoorji Pallonji Engineering",
        "projectManager": "Er. K. Murugan, EE",
        "budget": 240.0,
        "utilizedBudget": 162.0,
        "plannedProgress": 65.0,
        "actualProgress": 52.0,
        "financialProgress": 67.5,
        "startDate": "2024-05-10",
        "completionDate": "2026-08-30",
        "revisedCompletionDate": "2027-02-15",
        "status": "At Risk",
        "riskScore": 68,
        "riskLevel": "At Risk",
        "delayDays": 34,
        "primaryBottleneck": "Structural Steel Procurement",
        "summary": "Modern 40-bay bus terminus with integrated multi-level commercial concourse and electric bus depot.",
        "milestones": [
            {"id": "M1", "name": "Statutory Approvals & Site Handover", "status": "Completed", "target": "2024-07-31", "progress": 100},
            {"id": "M2", "name": "Basement Excavation & Raft Foundation", "status": "Completed", "target": "2024-12-15", "progress": 100},
            {"id": "M3", "name": "Terminal Building Structural Superstructure", "status": "Delayed", "target": "2025-08-30", "delayDays": 34, "progress": 58},
            {"id": "M4", "name": "Space Frame Canopy & Roofing", "status": "Upcoming", "target": "2026-03-31", "progress": 10},
            {"id": "M5", "name": "Passenger Concourse & Amenities", "status": "Upcoming", "target": "2026-08-30", "progress": 0}
        ],
        "tasks": [
            {"id": "T1", "name": "Procurement of specialized steel sections", "milestone": "M3", "plannedStart": "2025-01-01", "plannedEnd": "2025-04-30", "progress": 60, "status": "Delayed"},
            {"id": "T2", "name": "Raft slab reinforcement & concreting", "milestone": "M2", "plannedStart": "2024-09-01", "plannedEnd": "2024-12-15", "progress": 100, "status": "Completed"}
        ],
        "dependencies": [
            {"source": "Steel Supply Delivery", "target": "Superstructure Erection", "status": "Delayed", "impactDays": 34, "type": "Supply Chain"}
        ],
        "alerts": [
            {"id": "ALT-004", "severity": "Warning", "title": "Material Delivery Hold", "message": "Delay in high-tensile structural tubular trusses from primary rolling mill.", "date": "2026-09-21", "acknowledged": True}
        ]
    },
    {
        "id": "NMRN-003",
        "name": "Madurai Smart Underground Drainage Network (Phase III)",
        "department": "Municipal Administration & Water Supply",
        "category": "Water & Drainage",
        "location": "Vaigai River North Bank",
        "district": "Madurai",
        "lat": 9.9252,
        "lng": 78.1198,
        "contractor": "Nagarjuna Construction Co",
        "projectManager": "Er. P. Shanmugam, SE",
        "budget": 380.0,
        "utilizedBudget": 290.0,
        "plannedProgress": 85.0,
        "actualProgress": 61.0,
        "financialProgress": 76.3,
        "startDate": "2023-11-01",
        "completionDate": "2026-06-30",
        "revisedCompletionDate": "2027-04-10",
        "status": "Critical",
        "riskScore": 84,
        "riskLevel": "Critical",
        "delayDays": 58,
        "primaryBottleneck": "Sub-surface Rock Hard strata",
        "summary": "Laying 210 km sewer collection lines, 6 lift stations and modern 45 MLD sewage treatment plant.",
        "milestones": [
            {"id": "M1", "name": "Geotech Survey & Trenchless Approvals", "status": "Completed", "target": "2024-02-28", "progress": 100},
            {"id": "M2", "name": "Pipeline Trenching in Dense Urban Sectors", "status": "Delayed", "target": "2025-06-30", "delayDays": 58, "progress": 62},
            {"id": "M3", "name": "Pumping Stations Electro-mechanical", "status": "Delayed", "target": "2026-01-31", "delayDays": 40, "progress": 45},
            {"id": "M4", "name": "Commissioning & House Service Ties", "status": "Upcoming", "target": "2026-06-30", "progress": 0}
        ],
        "tasks": [
            {"id": "T1", "name": "Controlled trench micro-tunneling near Meenakshi zone", "milestone": "M2", "plannedStart": "2024-05-01", "plannedEnd": "2025-03-31", "progress": 55, "status": "Delayed"}
        ],
        "dependencies": [
            {"source": "Rock Blasting Non-percussive clearances", "target": "Sewer Piping", "status": "Delayed", "impactDays": 58, "type": "Clearance"}
        ],
        "alerts": [
            {"id": "ALT-005", "severity": "Critical", "title": "Progress Gap Exceeds 20%", "message": "Actual progress (61%) lags planned target (85%) by 24% points.", "date": "2026-09-23", "acknowledged": False}
        ]
    },
    {
        "id": "NMRN-004",
        "name": "Coimbatore Avinashi Road Elevated Corridor",
        "department": "Highways & Minor Ports",
        "category": "Roads & Expressways",
        "location": "Goldwins to Uppilipalayam",
        "district": "Coimbatore",
        "lat": 11.0168,
        "lng": 76.9558,
        "contractor": "L&T Infrastructure Projects Ltd",
        "projectManager": "Er. N. Karthikeyan, CE",
        "budget": 1620.0,
        "utilizedBudget": 1390.0,
        "plannedProgress": 88.0,
        "actualProgress": 84.0,
        "financialProgress": 85.8,
        "startDate": "2022-12-01",
        "completionDate": "2026-10-31",
        "revisedCompletionDate": "2026-12-15",
        "status": "Watch",
        "riskScore": 38,
        "riskLevel": "Watch",
        "delayDays": 14,
        "primaryBottleneck": "Traffic Diversion Approvals",
        "summary": "10.1 km 4-lane elevated expressway spanning Avinashi Road to reduce city travel time by 45 minutes.",
        "milestones": [
            {"id": "M1", "name": "Foundations & Pier Launching", "status": "Completed", "target": "2024-06-30", "progress": 100},
            {"id": "M2", "name": "Segmental Deck Girders Launching", "status": "Completed", "target": "2025-08-31", "progress": 100},
            {"id": "M3", "name": "Ramp Connectors & Junction Decking", "status": "Current", "target": "2026-05-31", "progress": 82},
            {"id": "M4", "name": "Wearing Coat, Crash Barriers & Lighting", "status": "Upcoming", "target": "2026-10-31", "progress": 25}
        ],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-005",
        "name": "Villupuram District Super Specialty Hospital Expansion",
        "department": "Health & Family Welfare",
        "category": "Healthcare Facilities",
        "location": "Mundiyampakkam Campus",
        "district": "Villupuram",
        "lat": 12.0116,
        "lng": 79.5298,
        "contractor": "Shapoorji Pallonji Engineering",
        "projectManager": "Er. R. Geetha, EE",
        "budget": 210.0,
        "utilizedBudget": 135.0,
        "plannedProgress": 62.0,
        "actualProgress": 59.0,
        "financialProgress": 64.2,
        "startDate": "2024-04-01",
        "completionDate": "2026-12-31",
        "revisedCompletionDate": "2027-01-20",
        "status": "Healthy",
        "riskScore": 26,
        "riskLevel": "Healthy",
        "delayDays": 7,
        "primaryBottleneck": "Medical Gas Pipeline Vendor Selection",
        "summary": "350-bed pediatric and oncology wing with 8 state-of-the-art modular operation theatres.",
        "milestones": [
            {"id": "M1", "name": "Structural RCC Shell", "status": "Completed", "target": "2025-03-31", "progress": 100},
            {"id": "M2", "name": "HVAC, Electrical & Fire Systems", "status": "Current", "target": "2026-06-30", "progress": 72},
            {"id": "M3", "name": "Clean Room & Modular OT Fit-out", "status": "Upcoming", "target": "2026-12-31", "progress": 15}
        ],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-006",
        "name": "Salem Municipal Bulk Water Supply & Distribution",
        "department": "Water Resources Department",
        "category": "Water & Drainage",
        "location": "Mettur Dam to Salem Feeder",
        "district": "Salem",
        "lat": 11.6643,
        "lng": 78.1460,
        "contractor": "Nagarjuna Construction Co",
        "projectManager": "Er. M. Sivakumar, SE",
        "budget": 490.0,
        "utilizedBudget": 380.0,
        "plannedProgress": 78.0,
        "actualProgress": 64.0,
        "financialProgress": 77.5,
        "startDate": "2023-08-15",
        "completionDate": "2026-07-31",
        "revisedCompletionDate": "2027-02-28",
        "status": "At Risk",
        "riskScore": 64,
        "riskLevel": "At Risk",
        "delayDays": 38,
        "primaryBottleneck": "Forest Clearance for Pipeline Corridor",
        "summary": "165 MLD raw water intake from Cauvery, treatment facility and 88 km master transmission mains.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-007",
        "name": "Trichy Semi-Ring Road Development (Phase I)",
        "department": "Highways & Minor Ports",
        "category": "Roads & Expressways",
        "location": "Jeeyapuram to Thuvakudi",
        "district": "Tiruchirappalli",
        "lat": 10.7905,
        "lng": 78.7047,
        "contractor": "L&T Infrastructure Projects Ltd",
        "projectManager": "Er. V. Anbarasan, SE",
        "budget": 640.0,
        "utilizedBudget": 485.0,
        "plannedProgress": 75.0,
        "actualProgress": 73.0,
        "financialProgress": 75.8,
        "startDate": "2023-10-01",
        "completionDate": "2026-09-30",
        "revisedCompletionDate": "2026-10-20",
        "status": "Healthy",
        "riskScore": 22,
        "riskLevel": "Healthy",
        "delayDays": 5,
        "primaryBottleneck": "Railway Overbridge Design Clearance",
        "summary": "28 km 4-lane bypass connecting NH 81 and NH 83 with 2 major railway overbridges.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-008",
        "name": "Kanyakumari Shoreline & Coastal Protection Works",
        "department": "Public Works & Coastal",
        "category": "Coastal Infrastructure",
        "location": "Colachel to Manakudi Coast",
        "district": "Kanyakumari",
        "lat": 8.0883,
        "lng": 77.5385,
        "contractor": "Afcons Infrastructure Ltd",
        "projectManager": "Er. B. Joseph, EE",
        "budget": 185.0,
        "utilizedBudget": 168.0,
        "plannedProgress": 95.0,
        "actualProgress": 94.0,
        "financialProgress": 90.8,
        "startDate": "2023-01-10",
        "completionDate": "2026-05-31",
        "revisedCompletionDate": "2026-06-15",
        "status": "Healthy",
        "riskScore": 18,
        "riskLevel": "Healthy",
        "delayDays": 0,
        "primaryBottleneck": "Monsoon Sea Conditions",
        "summary": "Submerged geo-tube reefs, tetrapod groynes and sea wall protection for vulnerable fishing hamlets.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-009",
        "name": "Thanjavur Smart Heritage Corridor & Solar Transitway",
        "department": "Housing & Urban Development",
        "category": "Urban Infrastructure",
        "location": "Brihadeeswara Temple Perimeter",
        "district": "Thanjavur",
        "lat": 10.7870,
        "lng": 79.1378,
        "contractor": "Tata Projects Infrastructure",
        "projectManager": "Er. D. Ramanathan, EE",
        "budget": 125.0,
        "utilizedBudget": 72.0,
        "plannedProgress": 60.0,
        "actualProgress": 55.0,
        "financialProgress": 57.6,
        "startDate": "2024-06-01",
        "completionDate": "2026-11-30",
        "revisedCompletionDate": "2026-12-20",
        "status": "Healthy",
        "riskScore": 24,
        "riskLevel": "Healthy",
        "delayDays": 8,
        "primaryBottleneck": "ASI Heritage Clearance",
        "summary": "Pedestrianized cobblestone cultural plazas, battery-tram track and heritage illumination.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-010",
        "name": "Vellore Palar River Intake & Recharge Reservoir",
        "department": "Water Resources Department",
        "category": "Water & Drainage",
        "location": "Katpadi - Virinjipuram Stretch",
        "district": "Vellore",
        "lat": 12.9165,
        "lng": 79.1325,
        "contractor": "Afcons Infrastructure Ltd",
        "projectManager": "Er. S. Balamurugan, EE",
        "budget": 290.0,
        "utilizedBudget": 215.0,
        "plannedProgress": 74.0,
        "actualProgress": 70.0,
        "financialProgress": 74.1,
        "startDate": "2023-12-01",
        "completionDate": "2026-09-30",
        "revisedCompletionDate": "2026-10-31",
        "status": "Healthy",
        "riskScore": 28,
        "riskLevel": "Healthy",
        "delayDays": 9,
        "primaryBottleneck": "Seasonal sand scouring control",
        "summary": "Check dam cum subsurface dyke with collector wells to secure year-round drinking water.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-011",
        "name": "Tirunelveli High-Tech Industrial Logistics Park",
        "department": "Transport Department",
        "category": "Transit Infrastructure",
        "location": "Gangaikondan SIPCOT",
        "district": "Tirunelveli",
        "lat": 8.7139,
        "lng": 77.7567,
        "contractor": "NCC Infrastructure Ltd",
        "projectManager": "Er. C. Venkatesh, EE",
        "budget": 340.0,
        "utilizedBudget": 240.0,
        "plannedProgress": 68.0,
        "actualProgress": 54.0,
        "financialProgress": 70.5,
        "startDate": "2024-02-15",
        "completionDate": "2026-12-15",
        "revisedCompletionDate": "2027-04-01",
        "status": "Watch",
        "riskScore": 48,
        "riskLevel": "Watch",
        "delayDays": 22,
        "primaryBottleneck": "Heavy Power Grid Substation Handover",
        "summary": "Multi-modal container freight station, cold storage chain and bonded customs warehousing.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-012",
        "name": "Erode Perundurai Eco-Industrial Stormwater Drain",
        "department": "Municipal Administration & Water Supply",
        "category": "Water & Drainage",
        "location": "Perundurai SIPCOT Area",
        "district": "Erode",
        "lat": 11.3410,
        "lng": 77.7172,
        "contractor": "Tata Projects Infrastructure",
        "projectManager": "Er. K. Natarajan, EE",
        "budget": 160.0,
        "utilizedBudget": 142.0,
        "plannedProgress": 92.0,
        "actualProgress": 90.0,
        "financialProgress": 88.7,
        "startDate": "2023-05-10",
        "completionDate": "2026-06-30",
        "revisedCompletionDate": "2026-07-15",
        "status": "Healthy",
        "riskScore": 15,
        "riskLevel": "Healthy",
        "delayDays": 3,
        "primaryBottleneck": "Canal cross-culvert widening",
        "summary": "Engineered concrete canals and oil-water separators preventing runoff contamination.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-013",
        "name": "Cuddalore Coastal Port Access Expressway",
        "department": "Highways & Minor Ports",
        "category": "Roads & Expressways",
        "location": "Semmandalam to Port Jetty",
        "district": "Cuddalore",
        "lat": 11.7480,
        "lng": 79.7714,
        "contractor": "L&T Infrastructure Projects Ltd",
        "projectManager": "Er. P. Arumugam, SE",
        "budget": 310.0,
        "utilizedBudget": 218.0,
        "plannedProgress": 64.0,
        "actualProgress": 48.0,
        "financialProgress": 70.3,
        "startDate": "2024-03-01",
        "completionDate": "2026-11-15",
        "revisedCompletionDate": "2027-05-30",
        "status": "At Risk",
        "riskScore": 70,
        "riskLevel": "Critical",
        "delayDays": 46,
        "primaryBottleneck": "Bridge Pier Piling in Tidal Estuary",
        "summary": "Heavy-duty 4-lane concrete road connecting cargo berths to NH 32 with estuary bridge.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-014",
        "name": "Dindigul Fruit & Vegetable Agribusiness Mega-Hub",
        "department": "Housing & Urban Development",
        "category": "Urban Infrastructure",
        "location": "Oddanchatram Market Bypass",
        "district": "Dindigul",
        "lat": 10.3673,
        "lng": 77.9803,
        "contractor": "NCC Infrastructure Ltd",
        "projectManager": "Er. A. Senthamarai, EE",
        "budget": 145.0,
        "utilizedBudget": 98.0,
        "plannedProgress": 72.0,
        "actualProgress": 68.0,
        "financialProgress": 67.5,
        "startDate": "2024-01-20",
        "completionDate": "2026-08-31",
        "revisedCompletionDate": "2026-09-20",
        "status": "Healthy",
        "riskScore": 25,
        "riskLevel": "Healthy",
        "delayDays": 6,
        "primaryBottleneck": "Cold store compressor import delivery",
        "summary": "Direct farmer-to-buyer sorting concourse with 2,500 MT atmosphere-controlled storage.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-015",
        "name": "Hosur Tech City Arterial Ring & Underpasses",
        "department": "Highways & Minor Ports",
        "category": "Roads & Expressways",
        "location": "Bagalur Road to IT SEZ",
        "district": "Krishnagiri",
        "lat": 12.7409,
        "lng": 77.8253,
        "contractor": "L&T Infrastructure Projects Ltd",
        "projectManager": "Er. J. Vignesh, SE",
        "budget": 520.0,
        "utilizedBudget": 395.0,
        "plannedProgress": 80.0,
        "actualProgress": 76.0,
        "financialProgress": 75.9,
        "startDate": "2023-09-15",
        "completionDate": "2026-10-31",
        "revisedCompletionDate": "2026-11-20",
        "status": "Watch",
        "riskScore": 34,
        "riskLevel": "Watch",
        "delayDays": 11,
        "primaryBottleneck": "High-tension power line realignment",
        "summary": "Ring network with 3 vehicular underpasses connecting tech parks to Bangalore border.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-016",
        "name": "Nagapattinam Harbor Modernization & Breakwater",
        "department": "Public Works & Coastal",
        "category": "Coastal Infrastructure",
        "location": "Kaduvaiyar Estuary Port",
        "district": "Nagapattinam",
        "lat": 10.7656,
        "lng": 79.8424,
        "contractor": "Afcons Infrastructure Ltd",
        "projectManager": "Er. T. Kasinathan, SE",
        "budget": 275.0,
        "utilizedBudget": 182.0,
        "plannedProgress": 66.0,
        "actualProgress": 50.0,
        "financialProgress": 66.1,
        "startDate": "2024-02-01",
        "completionDate": "2026-12-31",
        "revisedCompletionDate": "2027-05-15",
        "status": "At Risk",
        "riskScore": 67,
        "riskLevel": "At Risk",
        "delayDays": 36,
        "primaryBottleneck": "Dredging barge availability",
        "summary": "Harbor basin deepening to 5.5m draft, 600m groyne extensions and automated fish auction hub.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-017",
        "name": "Kanchipuram Silk Weavers Integrated Technology Park",
        "department": "Housing & Urban Development",
        "category": "Urban Infrastructure",
        "location": "Orikkai Sector",
        "district": "Kanchipuram",
        "lat": 12.8342,
        "lng": 79.7036,
        "contractor": "Shapoorji Pallonji Engineering",
        "projectManager": "Er. S. Devarajan, EE",
        "budget": 115.0,
        "utilizedBudget": 82.0,
        "plannedProgress": 75.0,
        "actualProgress": 72.0,
        "financialProgress": 71.3,
        "startDate": "2024-01-10",
        "completionDate": "2026-08-31",
        "revisedCompletionDate": "2026-09-15",
        "status": "Healthy",
        "riskScore": 20,
        "riskLevel": "Healthy",
        "delayDays": 4,
        "primaryBottleneck": "Solar rooftop tie-in metering",
        "summary": "Common facility center for warp dyeing, computerized jacquard looms and export center.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-018",
        "name": "Tiruppur Smart Effluent Common Treatment Facility",
        "department": "Municipal Administration & Water Supply",
        "category": "Water & Drainage",
        "location": "Chinnakarai Industrial Cluster",
        "district": "Tiruppur",
        "lat": 11.1085,
        "lng": 77.3411,
        "contractor": "Tata Projects Infrastructure",
        "projectManager": "Er. M. Gunasekaran, SE",
        "budget": 330.0,
        "utilizedBudget": 278.0,
        "plannedProgress": 86.0,
        "actualProgress": 82.0,
        "financialProgress": 84.2,
        "startDate": "2023-06-01",
        "completionDate": "2026-07-31",
        "revisedCompletionDate": "2026-08-30",
        "status": "Watch",
        "riskScore": 32,
        "riskLevel": "Watch",
        "delayDays": 10,
        "primaryBottleneck": "RO Membrane import customs release",
        "summary": "Zero-Liquid Discharge plant treating 24 MLD textile processing wastewater with salt recovery.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-019",
        "name": "Pudukkottai Medical College Campus Phase II",
        "department": "Health & Family Welfare",
        "category": "Healthcare Facilities",
        "location": "Mullur Campus",
        "district": "Pudukkottai",
        "lat": 10.3797,
        "lng": 78.8208,
        "contractor": "NCC Infrastructure Ltd",
        "projectManager": "Er. R. Soundar, EE",
        "budget": 175.0,
        "utilizedBudget": 120.0,
        "plannedProgress": 70.0,
        "actualProgress": 65.0,
        "financialProgress": 68.5,
        "startDate": "2024-03-10",
        "completionDate": "2026-11-30",
        "revisedCompletionDate": "2026-12-28",
        "status": "Watch",
        "riskScore": 36,
        "riskLevel": "Watch",
        "delayDays": 12,
        "primaryBottleneck": "Hostel block lift installation",
        "summary": "Auditorium, residential quarters for 150 resident physicians and emergency trauma care center.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-020",
        "name": "Ramanathapuram Desalination Water Conveyance Trunk",
        "department": "Water Resources Department",
        "category": "Water & Drainage",
        "location": "Valinokkam to Paramakudi",
        "district": "Ramanathapuram",
        "lat": 9.3639,
        "lng": 78.8395,
        "contractor": "Nagarjuna Construction Co",
        "projectManager": "Er. K. Sivaram, SE",
        "budget": 410.0,
        "utilizedBudget": 298.0,
        "plannedProgress": 76.0,
        "actualProgress": 60.0,
        "financialProgress": 72.6,
        "startDate": "2023-10-15",
        "completionDate": "2026-08-31",
        "revisedCompletionDate": "2027-03-15",
        "status": "At Risk",
        "riskScore": 69,
        "riskLevel": "Critical",
        "delayDays": 40,
        "primaryBottleneck": "Railway track crossing thrust boring permissions",
        "summary": "112 km ductile iron feeder grid transmitting 60 MLD potable water to arid taluks.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-021",
        "name": "Theni Hill Slope Stabilisation & Tunnel Bypass",
        "department": "Highways & Minor Ports",
        "category": "Roads & Expressways",
        "location": "Bodinayakanur Ghat Section",
        "district": "Theni",
        "lat": 10.0104,
        "lng": 77.4768,
        "contractor": "Afcons Infrastructure Ltd",
        "projectManager": "Er. S. Chandran, SE",
        "budget": 295.0,
        "utilizedBudget": 210.0,
        "plannedProgress": 73.0,
        "actualProgress": 69.0,
        "financialProgress": 71.1,
        "startDate": "2023-11-20",
        "completionDate": "2026-10-31",
        "revisedCompletionDate": "2026-11-30",
        "status": "Healthy",
        "riskScore": 27,
        "riskLevel": "Healthy",
        "delayDays": 8,
        "primaryBottleneck": "Monsoon landslide reinforcement",
        "summary": "1.4 km twin tube tunnel bypassing 18 hairpin bends with slope soil-nailing barriers.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-022",
        "name": "Karur Textile Cargo Transit Freight Terminal",
        "department": "Transport Department",
        "category": "Transit Infrastructure",
        "location": "Vennamalai Bypass",
        "district": "Karur",
        "lat": 10.9601,
        "lng": 78.0766,
        "contractor": "Shapoorji Pallonji Engineering",
        "projectManager": "Er. G. Ravikumar, EE",
        "budget": 140.0,
        "utilizedBudget": 122.0,
        "plannedProgress": 89.0,
        "actualProgress": 87.0,
        "financialProgress": 87.1,
        "startDate": "2023-07-01",
        "completionDate": "2026-06-30",
        "revisedCompletionDate": "2026-07-10",
        "status": "Healthy",
        "riskScore": 14,
        "riskLevel": "Healthy",
        "delayDays": 2,
        "primaryBottleneck": "Weighbridge calibration",
        "summary": "Integrated textile export marshalling yard with dedicated customs clearing station.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-023",
        "name": "Namakkal Poultry & Agro Cold-Chain Corridor",
        "department": "Housing & Urban Development",
        "category": "Urban Infrastructure",
        "location": "Mohanur Road Industrial Area",
        "district": "Namakkal",
        "lat": 11.2189,
        "lng": 78.1674,
        "contractor": "NCC Infrastructure Ltd",
        "projectManager": "Er. T. Selvaraj, EE",
        "budget": 110.0,
        "utilizedBudget": 92.0,
        "plannedProgress": 84.0,
        "actualProgress": 81.0,
        "financialProgress": 83.6,
        "startDate": "2024-01-05",
        "completionDate": "2026-09-30",
        "revisedCompletionDate": "2026-10-15",
        "status": "Healthy",
        "riskScore": 21,
        "riskLevel": "Healthy",
        "delayDays": 4,
        "primaryBottleneck": "Cold-room insulation panel supply",
        "summary": "Automated packing hub and solar refrigerated transit center for export quality poultry products.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-024",
        "name": "Sivaganga Vaigai Check Dam & Ground Water Injection",
        "department": "Water Resources Department",
        "category": "Water & Drainage",
        "location": "Manamadurai Stretch",
        "district": "Sivaganga",
        "lat": 9.8433,
        "lng": 78.4809,
        "contractor": "Tata Projects Infrastructure",
        "projectManager": "Er. P. Jayaraman, EE",
        "budget": 165.0,
        "utilizedBudget": 138.0,
        "plannedProgress": 82.0,
        "actualProgress": 79.0,
        "financialProgress": 83.6,
        "startDate": "2023-11-10",
        "completionDate": "2026-07-31",
        "revisedCompletionDate": "2026-08-20",
        "status": "Healthy",
        "riskScore": 23,
        "riskLevel": "Healthy",
        "delayDays": 6,
        "primaryBottleneck": "Sluice gate electro-hydraulic actuator",
        "summary": "Recharge check dam raising local water table by 3.2 meters across 14 surrounding agrarian hamlets.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-025",
        "name": "Ariyalur Mineral Logistics Heavy Haul Rail Overbridge",
        "department": "Highways & Minor Ports",
        "category": "Roads & Expressways",
        "location": "Cement Corridor KM 14",
        "district": "Ariyalur",
        "lat": 11.1401,
        "lng": 79.0786,
        "contractor": "L&T Infrastructure Projects Ltd",
        "projectManager": "Er. R. Elangovan, SE",
        "budget": 195.0,
        "utilizedBudget": 146.0,
        "plannedProgress": 78.0,
        "actualProgress": 65.0,
        "financialProgress": 74.8,
        "startDate": "2023-12-05",
        "completionDate": "2026-10-31",
        "revisedCompletionDate": "2027-02-15",
        "status": "Watch",
        "riskScore": 46,
        "riskLevel": "Watch",
        "delayDays": 20,
        "primaryBottleneck": "Southern Railway line block clearance",
        "summary": "Heavy-duty 4-lane bowstring girder flyover eliminating level crossing bottleneck for mineral freight.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    },
    {
        "id": "NMRN-026",
        "name": "Perambalur Government District Hospital Trauma Wing",
        "department": "Health & Family Welfare",
        "category": "Healthcare Facilities",
        "location": "Four Roads Junction",
        "district": "Perambalur",
        "lat": 11.2342,
        "lng": 78.8820,
        "contractor": "Shapoorji Pallonji Engineering",
        "projectManager": "Er. S. Meenakshi, EE",
        "budget": 88.0,
        "utilizedBudget": 74.0,
        "plannedProgress": 91.0,
        "actualProgress": 88.0,
        "financialProgress": 84.0,
        "startDate": "2024-02-01",
        "completionDate": "2026-06-30",
        "revisedCompletionDate": "2026-07-20",
        "status": "Healthy",
        "riskScore": 17,
        "riskLevel": "Healthy",
        "delayDays": 3,
        "primaryBottleneck": "Emergency lift fire clearance",
        "summary": "Level-2 trauma resuscitation suite with dedicated air ambulance rooftop helipad facility.",
        "milestones": [],
        "tasks": [],
        "dependencies": [],
        "alerts": []
    }
]

# Ensure every project supports both latitude/longitude and lat/lng
for _p in PROJECTS:
    if "lat" in _p and "latitude" not in _p:
        _p["latitude"] = _p["lat"]
    if "lng" in _p and "longitude" not in _p:
        _p["longitude"] = _p["lng"]

# ==========================================
# 3. FIELD VERIFICATION REPORTS DATASET (22+ reports)
# ==========================================

FIELD_REPORTS = [
    {
        "id": "FR-2026-101",
        "projectId": "NMRN-001",
        "projectName": "Chennai Outer Ring Road Expansion",
        "officer": "Arun Kumar, AE",
        "date": "2026-09-24",
        "time": "10:42 AM",
        "gps": "13.0827° N, 80.2707° E",
        "reportedProgress": 62.0,
        "verifiedProgress": 54.0,
        "variance": -8.0,
        "status": "Requires Review",
        "remarks": "Earthwork compaction between Km 18 and 22 is stalled due to ongoing demarcation dispute. Contractor claimed 62% but physical ground realization is 54%.",
        "evidencePhoto": "/evidence/road_earthwork_101.jpg",
        "evidenceTag": "Earthwork & RoW",
        "verified": False
    },
    {
        "id": "FR-2026-102",
        "projectId": "NMRN-002",
        "projectName": "Tindivanam Integrated Bus Terminal",
        "officer": "K. Meenakshi, AEE",
        "date": "2026-09-23",
        "time": "02:15 PM",
        "gps": "12.2286° N, 79.6515° E",
        "reportedProgress": 56.0,
        "verifiedProgress": 52.0,
        "variance": -4.0,
        "status": "Watch",
        "remarks": "Substructure columns completed. Steel truss fabrication yard is 40% idle awaiting raw tubular sections.",
        "evidencePhoto": "/evidence/bus_terminal_102.jpg",
        "evidenceTag": "Superstructure RCC",
        "verified": True
    },
    {
        "id": "FR-2026-103",
        "projectId": "NMRN-003",
        "projectName": "Madurai Smart Underground Drainage",
        "officer": "T. Sundararajan, AE",
        "date": "2026-09-23",
        "time": "11:30 AM",
        "gps": "9.9252° N, 78.1198° E",
        "reportedProgress": 68.0,
        "verifiedProgress": 61.0,
        "variance": -7.0,
        "status": "Requires Review",
        "remarks": "Rock fracturing rig broken down in narrow ward street. Pipeline laying at standstill for 9 days.",
        "evidencePhoto": "/evidence/madurai_drain_103.jpg",
        "evidenceTag": "Trench Excavation",
        "verified": False
    },
    {
        "id": "FR-2026-104",
        "projectId": "NMRN-004",
        "projectName": "Coimbatore Avinashi Road Elevated Corridor",
        "officer": "D. Karthik, AEE",
        "date": "2026-09-24",
        "time": "09:10 AM",
        "gps": "11.0168° N, 76.9558° E",
        "reportedProgress": 85.0,
        "verifiedProgress": 84.0,
        "variance": -1.0,
        "status": "Verified",
        "remarks": "Segmental launching gantry operating at optimal speed. Night shift barricading conforms to IRC 2020.",
        "evidencePhoto": "/evidence/flyover_cbe_104.jpg",
        "evidenceTag": "Segmental Deck",
        "verified": True
    },
    {
        "id": "FR-2026-105",
        "projectId": "NMRN-005",
        "projectName": "Villupuram District Hospital Expansion",
        "officer": "S. Kavitha, AE",
        "date": "2026-09-22",
        "time": "03:45 PM",
        "gps": "12.0116° N, 79.5298° E",
        "reportedProgress": 60.0,
        "verifiedProgress": 59.0,
        "variance": -1.0,
        "status": "Verified",
        "remarks": "Internal masonry and plumbing shafts 90% completed on floors 1-3. High workmanship standard.",
        "evidencePhoto": "/evidence/hospital_vpm_105.jpg",
        "evidenceTag": "Hospital MEP",
        "verified": True
    },
    {
        "id": "FR-2026-106",
        "projectId": "NMRN-006",
        "projectName": "Salem Municipal Bulk Water Supply",
        "officer": "V. Parthiban, AE",
        "date": "2026-09-21",
        "time": "12:05 PM",
        "gps": "11.6643° N, 78.1460° E",
        "reportedProgress": 70.0,
        "verifiedProgress": 64.0,
        "variance": -6.0,
        "status": "Requires Review",
        "remarks": "Pumping main welded joint ultrasonic testing failed in 4 nodes. Retesting mandated.",
        "evidencePhoto": "/evidence/salem_pipe_106.jpg",
        "evidenceTag": "Intake Pipeline",
        "verified": False
    },
    {
        "id": "FR-2026-107",
        "projectId": "NMRN-007",
        "projectName": "Trichy Semi-Ring Road Development",
        "officer": "R. Selvam, AEE",
        "date": "2026-09-22",
        "time": "10:15 AM",
        "gps": "10.7905° N, 78.7047° E",
        "reportedProgress": 74.0,
        "verifiedProgress": 73.0,
        "variance": -1.0,
        "status": "Verified",
        "remarks": "Granular Sub-Base (GSB) laying completed up to Chainage 18+200. Quality test cubes passed 28-day cure.",
        "evidencePhoto": "/evidence/trichy_ring_107.jpg",
        "evidenceTag": "GSB Pavement",
        "verified": True
    },
    {
        "id": "FR-2026-108",
        "projectId": "NMRN-008",
        "projectName": "Kanyakumari Coastal Protection Works",
        "officer": "A. Antony, AE",
        "date": "2026-09-20",
        "time": "04:30 PM",
        "gps": "8.0883° N, 77.5385° E",
        "reportedProgress": 95.0,
        "verifiedProgress": 94.0,
        "variance": -1.0,
        "status": "Verified",
        "remarks": "Final batch of 12-ton tetrapods successfully armored along Manakudi headland.",
        "evidencePhoto": "/evidence/coastal_kk_108.jpg",
        "evidenceTag": "Marine Armor",
        "verified": True
    },
    {
        "id": "FR-2026-109",
        "projectId": "NMRN-013",
        "projectName": "Cuddalore Port Access Expressway",
        "officer": "B. Govindaraj, AE",
        "date": "2026-09-19",
        "time": "01:20 PM",
        "gps": "11.7480° N, 79.7714° E",
        "reportedProgress": 55.0,
        "verifiedProgress": 48.0,
        "variance": -7.0,
        "status": "Requires Review",
        "remarks": "Estuary pier well foundation sinking obstructed by sunken debris. Needs specialized marine diver clearance.",
        "evidencePhoto": "/evidence/cuddalore_port_109.jpg",
        "evidenceTag": "Marine Piling",
        "verified": False
    },
    {
        "id": "FR-2026-110",
        "projectId": "NMRN-016",
        "projectName": "Nagapattinam Harbor Breakwater",
        "officer": "M. Manikandan, AE",
        "date": "2026-09-18",
        "time": "11:50 AM",
        "gps": "10.7656° N, 79.8424° E",
        "reportedProgress": 58.0,
        "verifiedProgress": 50.0,
        "variance": -8.0,
        "status": "Requires Review",
        "remarks": "Dredging cutter suction barge experienced engine failure. Tidal entrance depth restricted.",
        "evidencePhoto": "/evidence/naga_harbor_110.jpg",
        "evidenceTag": "Harbor Dredging",
        "verified": False
    },
    {
        "id": "FR-2026-111",
        "projectId": "NMRN-020",
        "projectName": "Ramanathapuram Desalination Water Conveyance",
        "officer": "C. Vijay, AEE",
        "date": "2026-09-17",
        "time": "03:15 PM",
        "gps": "9.3639° N, 78.8395° E",
        "reportedProgress": 68.0,
        "verifiedProgress": 60.0,
        "variance": -8.0,
        "status": "Requires Review",
        "remarks": "Railway horizontal boring push jacking paused awaiting safety officer certificate from Madurai Division.",
        "evidencePhoto": "/evidence/ramnad_pipe_111.jpg",
        "evidenceTag": "Micro-Tunneling",
        "verified": False
    },
    {
        "id": "FR-2026-112",
        "projectId": "NMRN-025",
        "projectName": "Ariyalur Mineral Logistics Rail Overbridge",
        "officer": "E. Prakash, AE",
        "date": "2026-09-16",
        "time": "10:00 AM",
        "gps": "11.1401° N, 79.0786° E",
        "reportedProgress": 70.0,
        "verifiedProgress": 65.0,
        "variance": -5.0,
        "status": "Watch",
        "remarks": "Composite girder assembly in yard finished; awaiting 4-hour railway power shutdown window.",
        "evidencePhoto": "/evidence/ariyalur_rob_112.jpg",
        "evidenceTag": "Steel Girder",
        "verified": True
    }
]

# ==========================================
# 4. SMART ALERTS DATASET (26+ alerts)
# ==========================================

ALERTS = [
    {
        "id": "ALT-101",
        "projectId": "NMRN-001",
        "projectName": "Chennai Outer Ring Road Expansion",
        "severity": "Critical",
        "category": "Dependency",
        "title": "Critical Path Land Acquisition Overdue (+18 Days)",
        "message": "Delay in Tiruvallur package directly stalls Foundation work, cascading +42 days downstream delay.",
        "timestamp": "2026-09-24 10:45 AM",
        "recommendedAction": "Escalate to District Collector for fast-track award disbursement.",
        "acknowledged": False
    },
    {
        "id": "ALT-102",
        "projectId": "NMRN-001",
        "projectName": "Chennai Outer Ring Road Expansion",
        "severity": "Critical",
        "category": "Field Verification",
        "title": "Significant Field Verification Discrepancy (-8.0%)",
        "message": "Reported 62% vs physically verified 54% in field inspection FR-2026-101.",
        "timestamp": "2026-09-24 11:00 AM",
        "recommendedAction": "Issue show-cause audit notice to lead contractor surveyor.",
        "acknowledged": False
    },
    {
        "id": "ALT-103",
        "projectId": "NMRN-003",
        "projectName": "Madurai Smart Underground Drainage",
        "severity": "Critical",
        "category": "Schedule",
        "title": "Progress Gap Exceeds 24% Schedule Threshold",
        "message": "Actual progress 61.0% vs target 85.0%. 58 days off critical path schedule.",
        "timestamp": "2026-09-23 04:30 PM",
        "recommendedAction": "Deploy secondary rock trenching rig and double evening shifts.",
        "acknowledged": False
    },
    {
        "id": "ALT-104",
        "projectId": "NMRN-013",
        "projectName": "Cuddalore Port Access Expressway",
        "severity": "Critical",
        "category": "Schedule",
        "title": "Estuary Well Sinking Delay Exceeds 45 Days",
        "message": "Submarine obstruction in well foundation #4 halting superstructure schedule.",
        "timestamp": "2026-09-23 09:15 AM",
        "recommendedAction": "Contract professional diving and blasting specialists.",
        "acknowledged": False
    },
    {
        "id": "ALT-105",
        "projectId": "NMRN-020",
        "projectName": "Ramanathapuram Desalination Water Conveyance",
        "severity": "Critical",
        "category": "Approval",
        "title": "Railway Track Crossing Safety Clearance Pending 32 Days",
        "message": "Pipeline jacking stopped awaiting Madurai Railway Division safety concurrence.",
        "timestamp": "2026-09-22 02:40 PM",
        "recommendedAction": "Principal Secretary level coordination meeting with DRM Madurai.",
        "acknowledged": False
    },
    {
        "id": "ALT-106",
        "projectId": "NMRN-001",
        "projectName": "Chennai Outer Ring Road Expansion",
        "severity": "Warning",
        "category": "Budget",
        "title": "Financial Outgo Disproportionate to Work Done",
        "message": "Financial expenditure at 66.3% (₹564 Cr) while physical progress is only 58.0%.",
        "timestamp": "2026-09-21 05:20 PM",
        "recommendedAction": "Withhold interim RA bill #18 pending milestone verification.",
        "acknowledged": True
    },
    {
        "id": "ALT-107",
        "projectId": "NMRN-002",
        "projectName": "Tindivanam Integrated Bus Terminal",
        "severity": "Warning",
        "category": "Contractor",
        "title": "Structural Steel Fabricator Raw Material Delivery Lag",
        "message": "Fabricator plant utilization dropped 40% due to delays at primary steel mill.",
        "timestamp": "2026-09-21 11:10 AM",
        "recommendedAction": "Authorize secondary approved rolling mill source under emergency clause.",
        "acknowledged": False
    },
    {
        "id": "ALT-108",
        "projectId": "NMRN-006",
        "projectName": "Salem Municipal Bulk Water Supply",
        "severity": "Warning",
        "category": "Field Verification",
        "title": "Weld Defect Ratio Exceeds Quality Tolerance",
        "message": "Field inspection discovered 4 ultrasonic flaws in high-pressure pumping line.",
        "timestamp": "2026-09-20 03:15 PM",
        "recommendedAction": "Impose mandatory radiographic testing across all 88 km segments.",
        "acknowledged": False
    },
    {
        "id": "ALT-109",
        "projectId": "NMRN-016",
        "projectName": "Nagapattinam Harbor Breakwater",
        "severity": "Warning",
        "category": "Contractor",
        "title": "Cutter Dredger Equipment Breakdown",
        "message": "Dredger mechanical stoppage risking silting in newly deepened approach channel.",
        "timestamp": "2026-09-19 01:45 PM",
        "recommendedAction": "Mobilize backup dredger from Tuticorin Port Trust.",
        "acknowledged": True
    },
    {
        "id": "ALT-110",
        "projectId": "NMRN-011",
        "projectName": "Tirunelveli Industrial Logistics Park",
        "severity": "Warning",
        "category": "Approval",
        "title": "TANGEDCO Substation Feeder Line Right-of-Way",
        "message": "110 kV dedicated feeder line connection awaiting local agricultural RoW clearances.",
        "timestamp": "2026-09-18 10:30 AM",
        "recommendedAction": "Convene joint taluk revenue and electricity board hearing.",
        "acknowledged": False
    },
    {
        "id": "ALT-111",
        "projectId": "NMRN-004",
        "projectName": "Coimbatore Avinashi Road Elevated Corridor",
        "severity": "Information",
        "category": "Milestone",
        "title": "Milestone M2 Segment Launching Completed",
        "message": "100% of 98 precast segmental spans successfully erected along Avinashi arterial.",
        "timestamp": "2026-09-18 04:00 PM",
        "recommendedAction": "Commence ramp structural deck concrete pours.",
        "acknowledged": True
    },
    {
        "id": "ALT-112",
        "projectId": "NMRN-008",
        "projectName": "Kanyakumari Coastal Protection Works",
        "severity": "Information",
        "category": "Milestone",
        "title": "All 1,200 Tetrapod Units Positioned Ahead of Schedule",
        "message": "Manakudi coastal reach stabilized with zero lost time injuries recorded.",
        "timestamp": "2026-09-17 02:00 PM",
        "recommendedAction": "Schedule joint final inspection with Institute of Ocean Technology.",
        "acknowledged": True
    },
    {
        "id": "ALT-113",
        "projectId": "NMRN-025",
        "projectName": "Ariyalur Mineral Logistics Rail Overbridge",
        "severity": "Warning",
        "category": "Dependency",
        "title": "Girder Erection Awaiting Railway Traffic Power Block",
        "message": "Southern Railway slot allocation delayed by 14 days due to coal freight routing.",
        "timestamp": "2026-09-16 09:00 AM",
        "recommendedAction": "Engage Railway Board liaison officer for upcoming Sunday block.",
        "acknowledged": False
    },
    {
        "id": "ALT-114",
        "projectId": "NMRN-005",
        "projectName": "Villupuram District Hospital Expansion",
        "severity": "Information",
        "category": "Quality",
        "title": "Modular OT HVAC Cleanliness Level Class 100 Achieved",
        "message": "Air change rates and HEPA filter tests passed NABH baseline standards.",
        "timestamp": "2026-09-15 11:30 AM",
        "recommendedAction": "Proceed with medical gas pipeline terminal certification.",
        "acknowledged": True
    },
    {
        "id": "ALT-115",
        "projectId": "NMRN-018",
        "projectName": "Tiruppur Smart Effluent Treatment Facility",
        "severity": "Information",
        "category": "Supply",
        "title": "High-Pressure RO Desalination Membranes Cleared Customs",
        "message": "Final consignment of sea-freight membrane filtration units arrived at Chennai port.",
        "timestamp": "2026-09-14 03:20 PM",
        "recommendedAction": "Expedite green channel port clearance for transport to Tiruppur.",
        "acknowledged": True
    }
]

# ==========================================
# 5. NOTIFICATIONS
# ==========================================

NOTIFICATIONS = [
    {"id": "NOTIF-1", "category": "Critical", "title": "Critical Bottleneck in NMRN-001", "time": "10 mins ago", "read": False, "message": "Land acquisition delay escalated to Chief Engineer level."},
    {"id": "NOTIF-2", "category": "Action Required", "title": "Field Verification Pending Signoff", "time": "45 mins ago", "read": False, "message": "Field inspection FR-2026-101 has negative 8% variance."},
    {"id": "NOTIF-3", "category": "Warning", "title": "Budget Utilization Anomaly", "message": "NMRN-003 financial drawal is outpacing physical achievement.", "time": "2 hours ago", "read": False},
    {"id": "NOTIF-4", "category": "Information", "title": "Quarterly Milestone Passed", "message": "NMRN-004 completed segmental decking 5 days ahead of schedule.", "time": "Yesterday", "read": True},
    {"id": "NOTIF-5", "category": "Critical", "title": "Emergency Blasting Hold", "message": "Madurai Smart Drainage stopped by district safety team.", "time": "Yesterday", "read": True}
]

# ==========================================
# 6. RULE-BASED PROTOTYPE RISK ENGINE
# ==========================================

def calculate_prototype_risk(project):
    """
    Demonstration Rule-Based Prototype Risk Engine
    Transparent mathematical calculation, not trained ML.
    """
    schedule_gap = max(0.0, project["plannedProgress"] - project["actualProgress"])
    budget_gap = max(0.0, project["financialProgress"] - project["actualProgress"])
    
    # 1. Schedule Risk Score (0 - 100)
    schedule_risk = min(100.0, (schedule_gap / 20.0) * 80.0 + (project.get("delayDays", 0) / 45.0) * 20.0)
    
    # 2. Budget Risk Score (0 - 100)
    budget_risk = min(100.0, (budget_gap / 15.0) * 75.0 + ((project["utilizedBudget"] / max(1.0, project["budget"])) * 25.0))
    
    # 3. Dependency Risk Score (0 - 100)
    dep_risk = 88.0 if project.get("primaryBottleneck") and project.get("delayDays", 0) > 30 else (55.0 if project.get("delayDays", 0) > 15 else 20.0)
    
    # 4. Contractor Historical Risk Score (0 - 100)
    ctr_name = project.get("contractor", "")
    ctr = next((c for c in CONTRACTORS if c["name"] == ctr_name), None)
    contractor_risk = 75.0 if (ctr and ctr["riskLevel"] == "High") else (45.0 if (ctr and ctr["riskLevel"] == "Medium") else 22.0)
    
    # 5. Approval & Clearance Risk Score (0 - 100)
    approval_risk = 73.0 if "Clearance" in project.get("primaryBottleneck", "") or "Acquisition" in project.get("primaryBottleneck", "") else 25.0
    
    # 6. Field Variance Score (0 - 100)
    # Check if field report exists for project
    fr = next((f for f in FIELD_REPORTS if f["projectId"] == project["id"]), None)
    field_variance = abs(fr["variance"]) * 8.5 if fr else 15.0
    field_variance = min(100.0, field_variance)
    
    # Weighted composite risk calculation
    composite = (
        schedule_risk * 0.28 +
        budget_risk * 0.18 +
        dep_risk * 0.24 +
        contractor_risk * 0.12 +
        approval_risk * 0.10 +
        field_variance * 0.08
    )
    
    composite_clamped = int(max(10, min(95, round(composite))))
    
    if composite_clamped >= 70:
        level = "Critical"
    elif composite_clamped >= 50:
        level = "At Risk"
    elif composite_clamped >= 30:
        level = "Watch"
    else:
        level = "Healthy"
        
    return {
        "compositeScore": composite_clamped,
        "riskLevel": level,
        "factors": {
            "scheduleRisk": round(schedule_risk, 1),
            "budgetRisk": round(budget_risk, 1),
            "dependencyRisk": round(dep_risk, 1),
            "contractorRisk": round(contractor_risk, 1),
            "approvalRisk": round(approval_risk, 1),
            "fieldVarianceRisk": round(field_variance, 1)
        },
        "formulaExplanation": "Calculated via Rule-Based Prototype Risk Engine using Schedule Gap (28%), Dependencies (24%), Budget Outgo Disparity (18%), Contractor Track Record (12%), Clearance Bottlenecks (10%), and Verified Field Variance (8%)."
    }

# ==========================================
# 7. PROTOTYPE WHAT-IF SIMULATION ENGINE
# ==========================================

INTERVENTIONS = {
    "Expedite Land Acquisition": {"baseRecoveryDays": 22, "costRateCrPerPoint": 0.18, "riskReductionMax": 20, "description": "Form special revenue arbitration camp and expedite direct compensation awards."},
    "Add Workers": {"baseRecoveryDays": 14, "costRateCrPerPoint": 0.12, "riskReductionMax": 12, "description": "Deploy supplementary skilled labour gangs across bridge and earthwork packages."},
    "Change Contractor": {"baseRecoveryDays": -15, "costRateCrPerPoint": 0.35, "riskReductionMax": 5, "description": "Invoke penalty clause and re-tender balance work (introduces initial mobilization lag)."},
    "Increase Material Supply": {"baseRecoveryDays": 16, "costRateCrPerPoint": 0.15, "riskReductionMax": 14, "description": "Contract dedicated rolling mill production lines and advance vendor payments."},
    "Resolve Approval Delay": {"baseRecoveryDays": 20, "costRateCrPerPoint": 0.05, "riskReductionMax": 16, "description": "Convene inter-departmental empowered committee for single-window clearances."},
    "Increase Working Shifts": {"baseRecoveryDays": 18, "costRateCrPerPoint": 0.14, "riskReductionMax": 15, "description": "Institute round-the-clock 3-shift operations with floodlit staging and safety teams."}
}

# ==========================================
# 8. API ROUTE HANDLERS
# ==========================================

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "NIRMAAN 360 Demonstration API",
        "version": "1.0.0",
        "environment": "Demonstration Prototype",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    user_id = data.get("userId", "").strip()
    password = data.get("password", "").strip()
    role = data.get("role", "").strip()
    
    # Valid Demo Credentials
    valid_users = {
        "Admin": {"pwd": "admin123", "role": "Administrator", "name": "Dr. V. Rajesh, IAS", "dept": "Infrastructure Monitoring Directorate"},
        "Project Officer": {"pwd": "officer123", "role": "Project Officer", "name": "Er. K. Sivaramakrishnan", "dept": "Highways & Public Works"},
        "Field Officer": {"pwd": "field123", "role": "Field Officer", "name": "Arun Kumar, AE", "dept": "Field Inspection Division"},
        "Contractor": {"pwd": "contractor123", "role": "Contractor", "name": "Vikram Seth, Director", "dept": "L&T Infrastructure Projects Ltd"}
    }
    
    matched = None
    for k, v in valid_users.items():
        if (user_id.lower() == k.lower() or (k == "Admin" and user_id.lower() == "admin") or (k == "Project Officer" and user_id.lower() == "officer") or (k == "Field Officer" and user_id.lower() == "field") or (k == "Contractor" and user_id.lower() == "contractor")) and password == v["pwd"]:
            matched = v
            break
            
    if matched:
        return jsonify({
            "success": True,
            "message": "Authentication successful (Demonstration Session)",
            "token": "demo-token-" + datetime.now().strftime("%Y%m%d%H%M%S"),
            "user": {
                "id": user_id,
                "name": matched["name"],
                "role": matched["role"],
                "department": matched["dept"],
                "isDemo": True
            }
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid credentials. Use demo passwords: admin123, officer123, field123, contractor123"
        }), 401

@app.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    # Dynamic calculations across projects
    total_projects = 128  # Representing state portfolio
    active_projects = 94
    at_risk_count = 17
    delayed_count = 11
    completed_count = 23
    
    total_budget_cr = 4820.0
    utilized_budget_cr = 2910.0
    overall_progress = 67.4
    
    # Executive Health Breakdown
    health_breakdown = [
        {"name": "Healthy", "count": 71, "color": "#10B981", "percentage": 55.5},
        {"name": "Watch", "count": 23, "color": "#F59E0B", "percentage": 18.0},
        {"name": "At Risk", "count": 17, "color": "#F97316", "percentage": 13.3},
        {"name": "Critical", "count": 17, "color": "#EF4444", "percentage": 13.2}
    ]
    
    # Monthly Progress Trend
    monthly_trend = [
        {"month": "Apr 2026", "planned": 52.0, "actual": 49.5, "expenditureCr": 310},
        {"month": "May 2026", "planned": 56.5, "actual": 53.0, "expenditureCr": 345},
        {"month": "Jun 2026", "planned": 61.0, "actual": 57.2, "expenditureCr": 380},
        {"month": "Jul 2026", "planned": 65.5, "actual": 60.8, "expenditureCr": 410},
        {"month": "Aug 2026", "planned": 70.0, "actual": 64.1, "expenditureCr": 440},
        {"month": "Sep 2026", "planned": 74.5, "actual": 67.4, "expenditureCr": 475}
    ]
    
    # Department Performance
    dept_performance = [
        {"department": "Highways", "budget": 1640, "spent": 1120, "progress": 68.5, "active": 28, "riskAvg": 38},
        {"department": "Water Resources", "budget": 910, "spent": 640, "progress": 64.0, "active": 18, "riskAvg": 45},
        {"department": "Transport", "budget": 820, "spent": 510, "progress": 63.2, "active": 16, "riskAvg": 42},
        {"department": "Municipal Admin", "budget": 580, "spent": 385, "progress": 69.8, "active": 12, "riskAvg": 36},
        {"department": "Health", "budget": 450, "spent": 295, "progress": 72.4, "active": 10, "riskAvg": 25},
        {"department": "Urban Dev", "budget": 420, "spent": 260, "progress": 65.1, "active": 10, "riskAvg": 30}
    ]
    
    # Critical Projects Requiring Immediate Attention
    critical_projects = [
        {
            "id": p["id"],
            "name": p["name"],
            "riskLevel": p["riskLevel"],
            "delayDays": p["delayDays"],
            "actualProgress": p["actualProgress"],
            "primaryBottleneck": p["primaryBottleneck"],
            "action": "Expedite land clearance & deploy additional shifts" if p["id"] == "NMRN-001" else "Intervene on sub-surface rock excavation",
            "budget": p["budget"]
        }
        for p in PROJECTS if p["riskLevel"] in ["Critical", "At Risk"]
    ][:5]
    
    return jsonify({
        "success": True,
        "kpis": {
            "totalProjects": total_projects,
            "activeProjects": active_projects,
            "atRisk": at_risk_count,
            "delayed": delayed_count,
            "completed": completed_count,
            "totalBudgetCr": total_budget_cr,
            "utilizedBudgetCr": utilized_budget_cr,
            "physicalProgress": overall_progress
        },
        "healthBreakdown": health_breakdown,
        "monthlyTrend": monthly_trend,
        "deptPerformance": dept_performance,
        "criticalProjects": critical_projects,
        "meta": {
            "lastSynchronized": "24 September 2026 · 11:45 AM",
            "environment": "Demonstration Prototype"
        }
    })

@app.route("/api/projects", methods=["GET"])
def get_projects():
    # Filtering parameters
    department = request.args.get("department", "").strip()
    district = request.args.get("district", "").strip()
    status = request.args.get("status", "").strip()
    risk = request.args.get("risk", "").strip()
    search = request.args.get("search", "").strip().lower()
    
    filtered = PROJECTS[:]
    
    if department:
        filtered = [p for p in filtered if department.lower() in p["department"].lower()]
    if district:
        filtered = [p for p in filtered if district.lower() in p["district"].lower()]
    if status:
        filtered = [p for p in filtered if status.lower() == p["status"].lower()]
    if risk:
        filtered = [p for p in filtered if risk.lower() == p["riskLevel"].lower()]
    if search:
        filtered = [
            p for p in filtered
            if search in p["id"].lower()
            or search in p["name"].lower()
            or search in p["district"].lower()
            or search in p["contractor"].lower()
        ]
        
    return jsonify({
        "success": True,
        "total": len(filtered),
        "projects": filtered
    })

@app.route("/api/projects/<project_id>", methods=["GET"])
def get_project_detail(project_id):
    proj = next((p for p in PROJECTS if p["id"].upper() == project_id.upper()), None)
    if not proj:
        return jsonify({"success": False, "message": f"Project '{project_id}' not found"}), 404
        
    risk_info = calculate_prototype_risk(proj)
    
    # Associated field reports
    reports = [f for f in FIELD_REPORTS if f["projectId"] == proj["id"]]
    alerts = [a for a in ALERTS if a["projectId"] == proj["id"]]
    
    return jsonify({
        "success": True,
        "project": proj,
        "calculatedRisk": risk_info,
        "fieldReports": reports,
        "alerts": alerts
    })

@app.route("/api/dependencies/<project_id>", methods=["GET"])
def get_dependencies(project_id):
    proj = next((p for p in PROJECTS if p["id"].upper() == project_id.upper()), None)
    if not proj:
        proj = PROJECTS[0]  # Fallback to NMRN-001 demo project
        
    # Standard deep dependency graph for demonstration
    nodes = [
        {"id": "node-1", "name": "Statutory Land Acquisition & RoW", "department": "Revenue / Highways", "status": "Delayed", "delayDays": 18, "isRootBottleneck": True, "progress": 82, "affectedMilestones": 4, "affectedTasks": 11},
        {"id": "node-2", "name": "Cast-in-Situ Substructure Piling", "department": "Civil Contractor", "status": "At Risk", "delayDays": 24, "isRootBottleneck": False, "progress": 52, "affectedMilestones": 3, "affectedTasks": 8},
        {"id": "node-3", "name": "Pier Cap Casting & Deck Girders", "department": "Structures Team", "status": "At Risk", "delayDays": 36, "isRootBottleneck": False, "progress": 38, "affectedMilestones": 2, "affectedTasks": 6},
        {"id": "node-4", "name": "Bituminous Pavement & Medians", "department": "Paving Gang", "status": "At Risk", "delayDays": 42, "isRootBottleneck": False, "progress": 10, "affectedMilestones": 1, "affectedTasks": 4},
        {"id": "node-5", "name": "Lighting, Signage & Safety Certification", "department": "Safety Directorate", "status": "At Risk", "delayDays": 42, "isRootBottleneck": False, "progress": 0, "affectedMilestones": 1, "affectedTasks": 2}
    ]
    
    edges = [
        {"from": "node-1", "to": "node-2", "label": "Blocks excavation & piling"},
        {"from": "node-2", "to": "node-3", "label": "Sequential pier erection"},
        {"from": "node-3", "to": "node-4", "label": "Requires continuous deck cure"},
        {"from": "node-4", "to": "node-5", "label": "Final statutory commissioning"}
    ]
    
    return jsonify({
        "success": True,
        "projectId": proj["id"],
        "projectName": proj["name"],
        "rootBottleneck": {
            "name": "Land Acquisition & RoW (Package 3 Tiruvallur)",
            "status": "Delayed",
            "delay": "+18 days (Buffer exhausted)",
            "downstreamImpactDays": 42,
            "affectedMilestones": 4,
            "affectedTasks": 11,
            "risk": "CRITICAL",
            "whyItMatters": "Delay in statutory land acquisition in Tiruvallur parcel blocks continuous access for heavy hydraulic piling rigs. This in turn halts superstructure girder casting, cascading a cumulative 42 days delay onto the final bituminous wearing course and public handover."
        },
        "nodes": nodes,
        "edges": edges
    })

@app.route("/api/risk/<project_id>", methods=["GET"])
def get_project_risk(project_id):
    proj = next((p for p in PROJECTS if p["id"].upper() == project_id.upper()), None)
    if not proj:
        proj = PROJECTS[0]
        
    risk_info = calculate_prototype_risk(proj)
    return jsonify({
        "success": True,
        "projectId": proj["id"],
        "projectName": proj["name"],
        "risk": risk_info
    })

@app.route("/api/simulate", methods=["POST"])
def run_simulation():
    """
    Prototype What-If Simulation Engine
    Calculates impact of proposed administrative or resource interventions.
    """
    data = request.get_json() or {}
    project_id = data.get("projectId", "NMRN-001")
    intervention_name = data.get("intervention", "Expedite Land Acquisition")
    resource_slider = float(data.get("resourceSlider", 65)) # 0 - 100
    delay_reduction_input = float(data.get("delayReductionDays", 25)) # 0 - 60
    
    proj = next((p for p in PROJECTS if p["id"].upper() == project_id.upper()), PROJECTS[0])
    
    intervention_spec = INTERVENTIONS.get(intervention_name, INTERVENTIONS["Expedite Land Acquisition"])
    base_recovery = intervention_spec["baseRecoveryDays"]
    
    # Formula for recovery days
    resource_factor = (resource_slider / 100.0) * 18.0
    calculated_recovery_days = int(round(base_recovery + resource_factor + (delay_reduction_input * 0.35)))
    calculated_recovery_days = max(5, min(55, calculated_recovery_days))
    
    # Cost impact in ₹ Crores
    cost_impact_cr = round(resource_slider * intervention_spec["costRateCrPerPoint"] * 1.1, 2)
    
    # Risk score reduction
    risk_reduction_points = int(round((resource_slider / 100.0) * intervention_spec["riskReductionMax"] + 4))
    
    current_risk_score = proj.get("riskScore", 72)
    simulated_risk_score = max(18, current_risk_score - risk_reduction_points)
    
    # Dates
    current_completion_str = proj.get("revisedCompletionDate", "2027-08-18")
    
    # Compute simulated completion date approximation
    # 43 days earlier than Aug 18, 2027 is approx Jul 06, 2027
    simulated_completion_str = "2027-07-06" if project_id == "NMRN-001" and calculated_recovery_days >= 40 else "2027-07-22"
    
    simulated_level = "Medium" if simulated_risk_score < 60 else "High"
    if simulated_risk_score < 35:
        simulated_level = "Low"
        
    current_level = "HIGH" if current_risk_score >= 65 else "MEDIUM"
    
    return jsonify({
        "success": True,
        "meta": {
            "engine": "Prototype Simulation Engine",
            "model": "Rule-based demonstration model using sample project data"
        },
        "inputs": {
            "projectId": proj["id"],
            "intervention": intervention_name,
            "resourceIntensity": resource_slider,
            "delayReductionInput": delay_reduction_input
        },
        "current": {
            "completionDate": current_completion_str,
            "riskScore": current_risk_score,
            "riskLevel": current_level,
            "delayRemainingDays": proj.get("delayDays", 42)
        },
        "simulated": {
            "completionDate": simulated_completion_str,
            "riskScore": simulated_risk_score,
            "riskLevel": simulated_level,
            "delayRemainingDays": max(0, proj.get("delayDays", 42) - calculated_recovery_days)
        },
        "recoveryDays": calculated_recovery_days,
        "costImpactCr": cost_impact_cr,
        "riskReductionPoints": risk_reduction_points,
        "recommendationConfidence": "High (Rule-verified)",
        "explanation": f"Applying '{intervention_name}' at {resource_slider:.0f}% intensity recoups approximately {calculated_recovery_days} calendar days from the critical path with an estimated additional expenditure of ₹{cost_impact_cr} Cr, dropping overall composite project risk by {risk_reduction_points} points."
    })

@app.route("/api/recommendations/<project_id>", methods=["GET"])
def get_recommendations(project_id):
    proj = next((p for p in PROJECTS if p["id"].upper() == project_id.upper()), PROJECTS[0])
    
    recs = [
        {
            "id": "REC-01",
            "projectId": proj["id"],
            "projectName": proj["name"],
            "primaryBottleneck": proj.get("primaryBottleneck", "Land Acquisition"),
            "recommendation": "Expedite approval and allocate an additional field coordination team for Section 3D awards.",
            "rationale": "Land acquisition package in Tiruvallur is the single root constraint gating subsequent bored piling.",
            "impact": {
                "delayReductionDays": 21,
                "riskReductionPercent": 18,
                "affectedMilestonesSaved": 3,
                "costCr": 4.5
            },
            "status": "Ready for Assignment",
            "urgency": "High"
        },
        {
            "id": "REC-02",
            "projectId": proj["id"],
            "projectName": proj["name"],
            "primaryBottleneck": "Flyover Piling Productivity",
            "recommendation": "Contract 2 supplementary hydraulic rotary piling rigs with dual-shift crew rotation.",
            "rationale": "Substructure completion rate is running 35% below targeted daily meterage.",
            "impact": {
                "delayReductionDays": 14,
                "riskReductionPercent": 12,
                "affectedMilestonesSaved": 2,
                "costCr": 6.8
            },
            "status": "Under Evaluation",
            "urgency": "Medium"
        }
    ]
    
    return jsonify({
        "success": True,
        "projectId": proj["id"],
        "recommendations": recs
    })

@app.route("/api/field-reports", methods=["GET", "POST"])
def handle_field_reports():
    if request.method == "POST":
        data = request.get_json() or {}
        new_report = {
            "id": f"FR-2026-{len(FIELD_REPORTS) + 101}",
            "projectId": data.get("projectId", "NMRN-001"),
            "projectName": data.get("projectName", "Chennai Outer Ring Road Expansion"),
            "officer": data.get("officer", "Field Officer Demo"),
            "date": datetime.now().strftime("%Y-%m-%d"),
            "time": datetime.now().strftime("%I:%M %p"),
            "gps": data.get("gps", "13.0827° N, 80.2707° E"),
            "reportedProgress": float(data.get("reportedProgress", 50)),
            "verifiedProgress": float(data.get("verifiedProgress", 48)),
            "variance": round(float(data.get("verifiedProgress", 48)) - float(data.get("reportedProgress", 50)), 1),
            "status": "Requires Review" if abs(float(data.get("verifiedProgress", 48)) - float(data.get("reportedProgress", 50))) > 5 else "Verified",
            "remarks": data.get("remarks", "Field verification recorded via mobile portal."),
            "evidencePhoto": "/evidence/sample_site.jpg",
            "evidenceTag": data.get("evidenceTag", "General Inspection"),
            "verified": True
        }
        FIELD_REPORTS.insert(0, new_report)
        return jsonify({"success": True, "report": new_report, "message": "Field verification recorded successfully."})
        
    return jsonify({
        "success": True,
        "total": len(FIELD_REPORTS),
        "reports": FIELD_REPORTS,
        "summary": {
            "pendingVerification": 12,
            "verifiedToday": 24,
            "requiresReview": len([r for r in FIELD_REPORTS if r["status"] == "Requires Review"]),
            "evidenceUploaded": 38
        }
    })

@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    severity = request.args.get("severity", "").strip()
    res = ALERTS[:]
    if severity:
        res = [a for a in res if a["severity"].lower() == severity.lower()]
    return jsonify({
        "success": True,
        "total": len(res),
        "alerts": res
    })

@app.route("/api/alerts/<alert_id>/acknowledge", methods=["POST"])
def acknowledge_alert(alert_id):
    alert = next((a for a in ALERTS if a["id"].upper() == alert_id.upper()), None)
    if alert:
        alert["acknowledged"] = True
        return jsonify({"success": True, "message": f"Alert {alert_id} acknowledged", "alert": alert})
    return jsonify({"success": False, "message": "Alert not found"}), 404

@app.route("/api/evidence", methods=["GET"])
def get_evidence():
    return jsonify({
        "success": True,
        "total": len(FIELD_REPORTS),
        "evidenceItems": [
            {
                "id": f"EVD-{idx+1}",
                "reportId": r["id"],
                "projectId": r["projectId"],
                "projectName": r["projectName"],
                "officer": r["officer"],
                "date": r["date"],
                "time": r["time"],
                "gps": r["gps"],
                "tag": r["evidenceTag"],
                "photoUrl": r["evidencePhoto"],
                "verifiedProgress": r["verifiedProgress"],
                "status": r["status"],
                "remarks": r["remarks"]
            }
            for idx, r in enumerate(FIELD_REPORTS)
        ]
    })

@app.route("/api/gis", methods=["GET"])
def get_gis_data():
    gis_markers = [
        {
            "id": p["id"],
            "name": p["name"],
            "lat": p["lat"],
            "lng": p["lng"],
            "latitude": p.get("latitude", p["lat"]),
            "longitude": p.get("longitude", p["lng"]),
            "district": p["district"],
            "department": p["department"],
            "location": p.get("location", ""),
            "progress": p["actualProgress"],
            "actualProgress": p["actualProgress"],
            "planned": p["plannedProgress"],
            "plannedProgress": p["plannedProgress"],
            "riskScore": p["riskScore"],
            "riskLevel": p["riskLevel"],
            "status": p["status"],
            "budget": p["budget"],
            "utilizedBudget": p.get("utilizedBudget", 0),
            "expectedCompletion": p.get("revisedCompletionDate") or p.get("completionDate", ""),
            "delayDays": p.get("delayDays", 0),
            "primaryBottleneck": p.get("primaryBottleneck", ""),
            "contractor": p.get("contractor", "")
        }
        for p in PROJECTS
    ]
    return jsonify({
        "success": True,
        "markers": gis_markers
    })

@app.route("/api/contractors", methods=["GET"])
def get_contractors():
    return jsonify({
        "success": True,
        "contractors": CONTRACTORS
    })

@app.route("/api/departments", methods=["GET"])
def get_departments():
    return jsonify({
        "success": True,
        "departments": DEPARTMENTS
    })

@app.route("/api/notifications", methods=["GET"])
def get_notifications():
    unread_count = len([n for n in NOTIFICATIONS if not n["read"]])
    return jsonify({
        "success": True,
        "notifications": NOTIFICATIONS,
        "unreadCount": unread_count
    })

@app.route("/api/notifications/mark-read", methods=["POST"])
def mark_notifications_read():
    for n in NOTIFICATIONS:
        n["read"] = True
    return jsonify({"success": True, "message": "All notifications marked as read"})

# ==========================================
# 9. SERVER ENTRY POINT
# ==========================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[*] NIRMAAN 360 Demonstration API starting on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
