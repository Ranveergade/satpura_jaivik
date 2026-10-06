# Satpura Jaivik Farmer Producer Company (FPO) Platform

Mobile-First Progressive Web Application (PWA) and Django REST Framework backend designed to deliver end-to-end transparency, financial accountability, real-time IoT monitoring, live CCTV surveillance, and bilingual support (English & Hindi) for agricultural development projects.

---

## System Design & Architecture

The platform uses a decoupled client-server architecture built for low-latency field access, offline PWA synchronization, and role-based data visibility.

```
+-----------------------------------------------------------------------------------+
|                            MOBILE-FIRST NEXT.JS 14 PWA                            |
|                                                                                   |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  | English/Hindi i18n |   | 6 Role Dashboards     |   | PWA Offline Queue      |  |
|  | Translation Engine |   | (Farmer to Management)|   | & Local Cache          |  |
|  +--------------------+   +-----------------------+   +------------------------+  |
|                                       |                                           |
|       +-------------------------------+---------------------------------+         |
|       |                               |                                 |         |
|  +----+------------------+   +--------+---------------+   +-------------+------+  |
|  | Camera Upload Modal   |   | Live CCTV Streaming    |   | Soil & Weather IoT |  |
|  | (Auto GPS/Timestamp)  |   | (Hikvision / Dahua)   |   | Control Gauges     |  |
|  +-----------------------+   +------------------------+   +--------------------+  |
+---------------------------------------+-------------------------------------------+
                                        | JSON / REST over HTTP/HTTPS
                                        v
+-----------------------------------------------------------------------------------+
|                           DJANGO REST FRAMEWORK BACKEND                           |
|                                                                                   |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  | JWT Authentication |   | Role-Based Access     |   | Expense Approval       |  |
|  | & User Management  |   | Control (RBAC Engine) |   | 4-Step Pipeline        |  |
|  +--------------------+   +-----------------------+   +------------------------+  |
|                                       |                                           |
|  +------------------------------------+----------------------------------------+  |
|  |                                    |                                        |  |
|  v                                    v                                        v  |
|  Apps: Users, Farmers,           Apps: CCTV, IoT,             Apps: Reports, Audit |  |
|  Projects, Expenses, WorkLogs    Media, Chat, Notifications   Trail Log Engine     |  |
+---------------------------------------+-------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                            SQLITE / POSTGRESQL DATABASE                            |
+-----------------------------------------------------------------------------------+
```

### Financial Expense Approval Pipeline

Every expense claimed for farm development projects traverses a strict four-stage approval workflow to guarantee financial integrity and subsidy compliance:

```
[ SUBMITTED ]
  Farmer / Field Supervisor uploads invoice with auto GPS tag & metadata.
       |
       v
[ ACCOUNTS_VERIFIED ]
  Accounts Department audits GST compliance, vendor details, and invoice authenticity.
       |
       v
[ ADMIN_APPROVED ]
  Administrator confirms project budget allocation and subsidy eligibility.
       |
       v
[ PAID ]
  Disbursement confirmed by bank/treasury; status made visible on Farmer Dashboard.
```

---

## Role-Based Access Control (RBAC) Matrix

The system provides tailored interfaces for six distinct operational roles:

| Role | Key Capabilities & Interface Scope |
| :--- | :--- |
| **Farmer / Customer** | View project progress, land acreage, approved subsidy vs disbursed funds, camera bill upload, live CCTV feeds, IoT soil telemetry, and chat with supervisor. |
| **Field Supervisor** | Perform GPS site check-ins, record daily work logs and labor attendance, review field expense claims, and upload site photos. |
| **Accounts Department** | Financial ledger inspection, budget utilization monitoring, category-wise expenditure analysis, invoice verification, and payment approvals. |
| **Administrator** | Project registration, budget and subsidy allocation, master user management, global approval overrides, and CSV data exports. |
| **Super Administrator** | Full system administration, role assignment, system settings, and security configuration. |
| **Senior Management** | Executive analytics dashboard, organic certification health indicators, subsidy compliance rates, and GIS land distribution. |

---

## Detailed Directory Structure

```
satpura_Jaivik/
├── backend/                                # Django REST Framework Backend
│   ├── config/                             # Root Project Configuration
│   │   ├── __init__.py
│   │   ├── settings.py                     # Django Settings, DRF & CORS Configuration
│   │   ├── urls.py                         # Master API Router & URL Definitions
│   │   ├── wsgi.py                         # WSGI Web Server Interface
│   │   └── asgi.py                         # ASGI Async Server Interface
│   ├── apps/                               # Decoupled Django System Applications
│   │   ├── authentication/                 # Auth Config & JWT Utilities
│   │   ├── users/                          # Custom User Model (6 Roles) & Profile Views
│   │   ├── farmers/                        # Farmer Profiles, Land Acreage & Kisan IDs
│   │   ├── projects/                       # Farm Development Projects, GPS & Budgets
│   │   ├── expenses/                       # 4-Step Expense Approval Engine
│   │   ├── work_logs/                      # Supervisor Field Logs & Labor Attendance
│   │   ├── media/                          # Site Photos, Documents & GPS Metadata
│   │   ├── cctv/                           # Live Surveillance Camera Feeds
│   │   ├── iot/                            # Soil Moisture, pH, EC & Climate Sensors
│   │   ├── chat/                           # In-App Messaging between Farmer & Supervisor
│   │   ├── notifications/                  # Real-Time System & Approval Alerts
│   │   ├── reports/                        # Financial & Progress Report Generators
│   │   └── audit/                          # System Audit Log & Action Tracking
│   ├── scripts/                            # Database Automation & Seeding
│   │   └── seed_demo_data.py               # Pre-creates 6 Test Accounts & Project Data
│   ├── manage.py                           # Django CLI Tool
│   └── db.sqlite3                          # SQLite Development Database
│
├── frontend/                               # Next.js 14 Mobile-First PWA
│   ├── src/
│   │   ├── app/                            # App Router Pages
│   │   │   ├── page.tsx                    # Agritech Landing Page
│   │   │   ├── dashboard/                  # Multi-Role PWA Portal Route
│   │   │   │   └── page.tsx                # Main Role-Based Dashboard Container
│   │   │   ├── layout.tsx                  # Global HTML Layout & Fonts
│   │   │   └── globals.css                 # Global CSS & Tailwind Directives
│   │   ├── components/                     # UI & Dashboard Components
│   │   │   ├── Navbar.tsx                  # Landing Page Navigation
│   │   │   ├── Hero.tsx                    # Landing Page Hero Section
│   │   │   ├── ImpactStats.tsx             # FPO Key Metrics Showcase
│   │   │   ├── WhySatpura.tsx              # Value Proposition Section
│   │   │   ├── Ecosystem.tsx               # Agricultural Ecosystem Features
│   │   │   ├── FarmerSection.tsx           # Farmer Empowerment Overview
│   │   │   ├── ProductShowcase.tsx         # Organic Crop Catalog
│   │   │   ├── Traceability.tsx            # Farm-to-Fork Traceability Diagram
│   │   │   ├── Sustainability.tsx          # Soil Regeneration & Bio-Dynamic Practices
│   │   │   ├── ImpactDashboard.tsx         # Public Transparency Impact View
│   │   │   ├── FarmerStories.tsx           # Farmer Case Studies
│   │   │   ├── Testimonials.tsx            # Consumer & FPO Member Feedback
│   │   │   ├── FinalCTA.tsx                # Call to Action Banner
│   │   │   ├── Footer.tsx                  # Global Footer
│   │   │   ├── dashboards/                 # Role-Specific Dashboards
│   │   │   │   ├── FarmerDashboard.tsx     # Farmer Project & Expense Overview
│   │   │   │   ├── SupervisorDashboard.tsx # Field Verification & Work Logs
│   │   │   │   ├── AccountsDashboard.tsx   # Budget Ledger & Financial Audits
│   │   │   │   ├── AdminDashboard.tsx      # System Oversight & CSV Export
│   │   │   │   └── ManagementDashboard.tsx # Executive Analytics & Health Metrics
│   │   │   ├── pwa/                        # PWA Interactive Modals & Controls
│   │   │   │   ├── Navbar.tsx              # PWA App Bar (Bilingual & Role Toggle)
│   │   │   │   ├── PWAHeader.tsx           # Offline Network Status Indicator
│   │   │   │   ├── CameraUploadModal.tsx   # Simulated Bill Upload with Auto GPS
│   │   │   │   ├── CCTVPlayerModal.tsx     # Live Surveillance Camera Feeds
│   │   │   │   ├── IoTDashboardModal.tsx   # Real-Time Telemetry & Irrigation Toggle
│   │   │   │   └── ChatDrawer.tsx          # Supervisor-Farmer Messaging Drawer
│   │   │   └── ui/                         # Atomic Design UI Primitives
│   │   │       ├── Button.tsx              # Custom Animated Buttons
│   │   │       ├── Card.tsx                # Glassmorphic Content Containers
│   │   │       ├── Badge.tsx               # Status & Category Badges
│   │   │       ├── Modal.tsx               # Accessible Modal Container
│   │   │       └── AnimatedBeam.tsx        # Motion Beam Animation Primitive
│   │   └── lib/                            # Application Logic & Data Layer
│   │       ├── i18n.ts                     # Bilingual Translation Dictionary (EN / HI)
│   │       └── api.ts                      # REST API Client with Offline Fallback
│   ├── public/                             # Static Assets & PWA Manifest
│   ├── tailwind.config.ts                  # Tailwind Theme, Colors & Gradients
│   ├── tsconfig.json                       # TypeScript Configuration
│   └── package.json                        # Node Dependencies & Build Scripts
│
├── test_e2e.py                             # End-to-End Integration Test Suite
└── README.md                               # Project Documentation
```

---

## Technology Stack

### Backend Framework & Libraries
- **Language**: Python 3.14
- **Web Framework**: Django 6.0
- **API Framework**: Django REST Framework 3.17
- **Authentication**: SimpleJWT (JSON Web Tokens)
- **CORS Handling**: Django CORS Headers 4.9
- **Database**: SQLite (Development) / PostgreSQL (Production ready)

### Frontend Framework & Libraries
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom HSL color tokens (Forest Greens, Leaf Gold, Cream)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Architecture**: Mobile-First Progressive Web Application (PWA)

---

## REST API Endpoints Overview

| Endpoint | Method | Scope / Functionality |
| :--- | :--- | :--- |
| `/api/projects/` | `GET`, `POST` | List all farm development projects or create a new project. |
| `/api/projects/<id>/` | `GET`, `PUT`, `PATCH` | Retrieve or update project details, budget, or status. |
| `/api/expenses/` | `GET`, `POST` | List expenses or submit a new expense claim. |
| `/api/expenses/<id>/update_status/` | `PATCH` | Transition expense status through the 4-step approval pipeline. |
| `/api/users/` | `GET` | Retrieve FPO users filtered by role. |
| `/api/work-logs/` | `GET`, `POST` | Supervisor site check-in logs and labor attendance. |
| `/api/cctv/` | `GET` | Fetch active CCTV camera streams and status. |
| `/api/iot/` | `GET` | Read soil moisture, pH, EC, and climate sensor telemetry. |
| `/api/chat/` | `GET`, `POST` | Exchange messages between farmers and supervisors. |
| `/api/audit/` | `GET` | View immutable system audit log entries. |

---

## Getting Started & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Setting Up Backend (Django REST Framework)

```bash
cd backend

# Install dependencies
python -m pip install django djangorestframework django-cors-headers djangorestframework-simplejwt

# Run migrations
$env:PYTHONPATH="."; python manage.py migrate

# Seed demo dataset (pre-populates 6 role accounts & sample farm projects)
$env:PYTHONPATH="."; $env:PYTHONIOENCODING="utf-8"; python scripts/seed_demo_data.py

# Start Django development server
$env:PYTHONPATH="."; python manage.py runserver 0.0.0.0:8000
```

### 2. Setting Up Frontend (Next.js PWA)

```bash
cd frontend

# Install Node dependencies
npm install

# Run development server
npm run dev
```

The applications will be accessible at:
- **Agritech Landing Page**: `http://localhost:3000/`
- **PWA Portal & Role Dashboards**: `http://localhost:3000/dashboard`
- **Django REST API**: `http://localhost:8000/api/`

---

## Running End-to-End Tests

To execute the automated integration test suite verifying backend API endpoints and frontend page rendering:

```bash
python test_e2e.py
```

Expected Output:

```text
[E2E TEST] Running End-to-End Integration Tests for Satpura Jaivik Platform...

=== 1. Testing Django REST API Backend (Port 8000) ===
  [SUCCESS] Projects Endpoint: HTTP 200 -- Returned 2 items
  [SUCCESS] Expenses Endpoint: HTTP 200 -- Returned 4 items
  [SUCCESS] Users Endpoint: HTTP 200 -- Returned 6 items
  [SUCCESS] Work Logs Endpoint: HTTP 200 -- Returned 1 items
  [SUCCESS] Audit Logs Endpoint: HTTP 200 -- Returned 1 items

=== 2. Testing Next.js Frontend PWA Pages (Port 3000) ===
  [SUCCESS] Landing Page: HTTP 200 -- Server active and rendering HTML
  [SUCCESS] PWA Dashboard Portal: HTTP 200 -- Server active and rendering HTML

[E2E TEST] End-to-End Verification Completed!
```
