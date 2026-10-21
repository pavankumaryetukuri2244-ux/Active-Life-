# SpecKit: Active Life Admin Portal

> **Specification-Driven Development (SDD) Master Kit**  
> **Repository:** `pavankumaryetukuri2244-ux/Active-Life-`  
> **Framework:** Angular 19.2 (Standalone & Modular) • TypeScript 5.7 • SCSS • Bootstrap 5.3  
> **Backend Integration:** REST API via `http://20.193.140.173:8085` (Local proxy configured at `/api`)  
> **Version:** 1.0.0  
> **Status:** Active / In-Development  

---

## 📑 Table of Contents
1. [Project Overview & System Architecture](#1-project-overview--system-architecture)
2. [SpecKit Constitution (Guiding Principles)](#2-speckit-constitution-guiding-principles)
3. [Module Specifications (`spec.md`)](#3-module-specifications)
   - [3.1 Authentication & Access Control](#31-authentication--access-control)
   - [3.2 Analytics Dashboard](#32-analytics-dashboard)
   - [3.3 User Management](#33-user-management)
   - [3.4 Content Management](#34-content-management)
   - [3.5 Preventive Care](#35-preventive-care)
   - [3.6 Audit Logs](#36-audit-logs)
4. [API & Service Contract Matrix](#4-api--service-contract-matrix)
5. [Technical Implementation Plan (`plan.md`)](#5-technical-implementation-plan)
6. [Tasks & Execution Roadmap (`tasks.md`)](#6-tasks--execution-roadmap)
7. [Environment & Deployment Blueprint](#7-environment--deployment-blueprint)

---

## 1. Project Overview & System Architecture

### 1.1 Overview
Active Life is an enterprise healthcare management administration portal designed for healthcare administrators, medical operators, and content curators. It provides centralized management for patient accounts, preventive care schedules (pregnancy care & infant vaccinations), health media content (gym, meditation, educational videos), platform audit logging, and engagement analytics.

### 1.2 Tech Stack
- **Frontend Framework:** Angular 19.2.0
- **Language:** TypeScript 5.7.2
- **State Management & Async:** RxJS 7.8.0, @ngrx/store 19.0.0
- **Styling & Design System:** Vanilla SCSS + Bootstrap 5.3.8 + SweetAlert2 + Animate-Sass
- **Iconography:** FontAwesome Free Solid/Regular SVG 7.3.1 + PE7 Icons
- **Data Visualizations:** Chart.js 4.5.1 + ng2-charts 6.0.1
- **UI Components:** Angular Material CDK 19.2.19, NgbBootstrap 18.0.0, ngx-toastr 19.0.0, DataTables
- **Date Utilities:** Moment.js 2.30.1

### 1.3 Layout Architecture
The portal utilizes a dual-layout structural design:
```text
Root Router
├── PagesLayoutComponent (Public / Guest)
│   ├── /pages/login-boxed                -> LoginBoxedComponent
│   └── /pages/forgot-password-boxed       -> ForgotPasswordBoxedComponent
└── BaseLayoutComponent (Protected by AuthGuard)
    ├── AppHeader & User Profile Dropdown
    ├── AppSidebar (Dynamic active link indicators)
    ├── Main Content Outlet:
    │   ├── /dashboards/analytics         -> AnalyticsComponent
    │   ├── /dashboards/users             -> UserManagementComponent
    │   ├── /dashboards/content           -> ContentManagementComponent
    │   ├── /dashboards/preventive-care   -> PreventiveCareComponent
    │   ├── /dashboards/health-awareness  -> HealthAwarenessComponent
    │   ├── /dashboards/healthcare-champions -> HealthcareChampionsComponent
    │   ├── /dashboards/home-remedies     -> HomeRemediesComponent
    │   └── /dashboards/audit-logs        -> AuditLogsComponent
    └── AppFooter
```

---

## 2. SpecKit Constitution (Guiding Principles)

All AI agents, developers, and pull requests contributing to this codebase MUST conform to this Constitution:

### Principle I: Strict Architectural Separation
- **Services handle data and I/O:** Components must never call `HttpClient` directly. All remote endpoints, token injection, and API transformations belong exclusively inside [`WebapiService`](file:///src/app/services/webapi.service.ts) or dedicated domain services.
- **Components handle view models and events:** Business rules, pagination states, and modal visibility states belong in the component TypeScript file.

### Principle II: Defensive Authentication & Role Safety
- Authentication state is tracked in `localStorage` (`accessToken`, `isLoggedIn`, `adminEmail`, `adminProfile`).
- The [`AuthGuard`](file:///src/app/auth.guard.ts) enforces route restrictions. Role-restricted users (e.g., `testadmin@healthfamily.com`) are strictly scoped to permitted domains (`/dashboards/users`, `/dashboards/content`). All unauthorized navigations are safely redirected.
- Bearer tokens are attached to authenticated HTTP request headers.

### Principle III: Design System & Styling Governance
- No hardcoded ad-hoc inline styles for core elements. Use reusable typography tokens (`Inter` font family, font-weights 400/500/600/700), standard card elevation, and CSS custom variables defined in [`src/styles.scss`](file:///src/styles.scss).
- Standard UI tokens:
  - Primary Accent: `#3b82f6` / `#2563eb` (Blue Gradient)
  - Success / Action Gradient: `#00C950` to `#009689`
  - Warning / Inactive Badges: Soft pill styling with explicit contrast ratios.
  - Neutral Backgrounds: `#F8FAFC` (Canvas), `#FFFFFF` (Cards/Modals), `#0F172A` (Text Primary).

### Principle IV: Reactive Asynchrony & Resource Cleanup
- Subscriptions to observables in components must be handled safely using `takeUntil(this.destroy$)`, `AsyncPipe`, or explicitly destroyed in `ngOnDestroy` to prevent memory leaks.
- Debounced search queries must use `debounceTime(300)` and `distinctUntilChanged()`.

### Principle V: Spec-Driven Change Control
- No new features, routes, or API endpoints may be introduced without first updating this `SPECKIT.md` (or the corresponding `.specify/` specification).

---

## 3. Module Specifications

### 3.1 Authentication & Access Control

#### What & Why
Secure administrator entry point with multi-step password recovery. Ensures unauthorized visitors cannot inspect protected healthcare metrics or mutate patient/content records.

#### Requirements
- **Login Flow (`/pages/login-boxed`):**
  - Form validation: Valid email format and non-empty password.
  - Upon successful response: store `accessToken`, `isLoggedIn = 'true'`, `adminEmail`, and `adminProfile`.
  - Redirect authenticated admin to `/dashboards/analytics` (or `/dashboards/users` for scoped test admins).
- **Forgot Password Flow (`/pages/forgot-password-boxed`):**
  - Step 1: Email verification & OTP dispatch.
  - Step 2: 6-digit OTP verification with 60-second resend countdown.
  - Step 3: Secure password reset with live strength validation and password reveal toggle.
  - Step 4: Success confirmation with direct action button to login.
- **Route Guarding:**
  - Unauthenticated access attempts to `/dashboards/*` redirect to `/pages/login-boxed`.

---

### 3.2 Analytics Dashboard

#### What & Why
Real-time operational dashboard providing bird’s-eye visibility into user adoption, active care programs, and platform activity.

#### Requirements
- **KPI Metrics Cards:**
  - Total Registered Users (dynamic via `/api/v1/admin/dashboard`).
  - Active Health Subscriptions.
  - Preventive Care Enrollments.
  - Engagement Rate & Trend Indicators.
- **Visualizations:**
  - Monthly user registration trends (Chart.js Line/Area Chart).
  - Preventive care completion vs. pending tracking.
- **Error Resiliency:**
  - Fallback mock counters when backend dashboard service is temporarily unreachable or initial cold-start latency occurs.

---

### 3.3 User Management

#### What & Why
Comprehensive administration directory for viewing, searching, filtering, and moderating registered application users and family accounts.

#### Requirements
- **User Directory Table:**
  - Columns: Avatar (dynamic gradient), User Name, Email, Contact Number, Family Members count, Account Status, Created Date, Actions.
  - Status Pills: `ACTIVE` (Emerald), `INACTIVE` (Amber), `BLOCKED` (Rose/Red).
- **Filtering & Search:**
  - Instant debounced search querying across name, email, and phone number.
  - Tabbed filters: `ALL`, `ACTIVE`, `INACTIVE`, `BLOCKED`.
- **User Moderation Actions:**
  - Quick toggle to activate/deactivate/block accounts via `/api/v1/users/status`.
  - Pagination controls: Page size selector (10, 25, 50), Next/Previous, and Current Page indicators.

---

### 3.4 Content Management

#### What & Why
Digital asset library for healthcare and wellness media. Allows administrators to upload, categorize, review, and toggle public visibility of videos and articles.

#### Requirements
- **Categories:** Gym / Fitness, Meditation / Mindfulness, Wellness & Pregnancy Videos, Health Guidelines.
- **Media Upload Modal:**
  - Metadata: Title, Category, Level (Beginner / Intermediate / Advanced), Tags, Media File or URL path.
  - Validation: Required title, valid category, and media payload.
- **Media Card / Grid Display:**
  - Thumbnail / sanitized preview with duration and view metrics counter.
  - Status toggle (`Active` vs. `Disabled`).
  - Safe sanitization using `DomSanitizer` for embedded media iframes and video assets.

---

### 3.5 Preventive Care

#### What & Why
Core healthcare module configuring gestational milestones, maternal scans, and infant immunization schedules.

#### Requirements
- **Pregnancy Stages:**
  - Timeline intervals (Week ranges: e.g., Week 1-4, 5-8, 9-12).
  - Trimester grouping (First, Second, Third Trimester).
  - Key Milestones & Ultrasound / Medical scan schedules.
  - Modal form for creating and updating pregnancy stages via `/api/v1/admin/preventive-care/pregnancy-stage`.
  - Active/Inactive stage toggle via `/api/v1/admin/preventive-care/pregnancy-stage/status`.
- **Vaccination Schedules:**
  - **Child Vaccines:** Vaccine Name, Recommended Age, Number of Doses, Priority (`High`, `Medium`, `Low`), Description.
  - **Pregnancy Vaccines:** Vaccine Name, Recommended Timing, Priority, Clinical Notes.
  - Full CRUD operations via `/api/v1/admin/preventive-care/child-vaccines` and `/api/v1/admin/preventive-care/add-pregnancy-vaccine`.

---

### 3.6 Audit Logs

#### What & Why
Compliance and regulatory audit trail logging every administrative intervention, status mutation, content publish, and authentication event.

#### Requirements
- **Log Table Attributes:**
  - Log ID, Timestamp, Admin Name, Action Type, Target Module, IP Address, Status (`SUCCESS` / `FAILED`).
- **Audit Filter Controls:**
  - Search by admin user or keyword.
  - Module selector (`User Management`, `Content Management`, `Preventive Care`, `Authentication`).
  - Date Range Pickers (`fromDate`, `toDate`).
- **Data Export:**
  - Capability to export filtered audit trails to CSV/Excel for compliance archives.

---

### 3.7 Health Awareness

#### What & Why
Public health awareness campaigns and clinical preventative protocols educating expectant mothers, families, and community members on major wellness concerns (maternal health, cardiovascular protection, dengue prevention, diabetes lifestyle modification).

#### Requirements
- **KPI Metrics:** Total Campaigns, Active Initiatives, Community Reach, Detailed Protocols.
- **Filtering & Search:** Debounced keyword search, category filtering (Maternal Care, Heart Health, Chronic Disease, Seasonal & Viral, Nutrition, Mental Well-being), and publication status.
- **Campaign Directory:** Card and table views, summary preview, clinical protocol checklist, target audience, reading duration, view metrics.
- **CRUD & Modals:** Add/Edit campaign modal with category, audience, read time, summary, detailed medical guidelines, and key action points. Clinical advisory reader modal.

---

### 3.8 Healthcare Champions

#### What & Why
Centralized administration directory for community health ambassadors, certified doulas, clinical nutritionists, and field medical leaders providing grassroots healthcare guidance and family mentoring.

#### Requirements
- **KPI Metrics:** Total Champions, Active In Field, Coverage Districts/Zones, Families Mentored.
- **Filtering & Search:** Search across name, specialty, district, and contact. Filters for medical domain (Maternal Health, Pediatric, Diabetes, Cardiovascular, Geriatric, Mental Health) and operational status (Active, On Leave, Inactive).
- **Directory Display:** High-impact champion cards with profile avatars, verified badges, rating, experience, assigned organization, region, contact numbers, and mentoring statistics.
- **CRUD & Modals:** Champion registration and editing modal; comprehensive impact profile modal displaying reviews, credentials, certifications, and contact channels.

---

### 3.9 Home Remedies

#### What & Why
Evidence-based, natural, and doctor-verified home remedy repository for everyday wellness and minor ailments (cough, acid reflux, eczema, joint stiffness, sleep tension).

#### Requirements
- **KPI Metrics:** Total Remedies, Doctor Verified, Common Ailments Covered, Community Views.
- **Filtering & Search:** Search by remedy title, targeted ailment, or ingredient keywords (e.g. ginger, turmeric, aloe vera). Filter by category and Doctor Verified status.
- **Remedy Directory:** Remedy cards with ailment tags, difficulty levels (Easy, Moderate, Advanced), prep time, ingredient chips, and therapeutic mechanism summary.
- **CRUD & Modals:** Add/Edit home remedy modal with ingredient checklist, step-by-step instructions, dosage timing, precautions/contraindications, and doctor verification flag. Comprehensive remedy guide popup modal.

---

## 4. API & Service Contract Matrix

All API interactions flow through [`WebapiService`](file:///src/app/services/webapi.service.ts):

| Endpoint | Method | Purpose | Auth Required |
|:---|:---:|:---|:---:|
| `/api/v1/auth/login` | `POST` | Admin authentication & JWT token generation | No |
| `/api/v1/admin/dashboard` | `POST` | Dashboard metrics & monthly registration graphs | Yes (Bearer) |
| `/api/v1/users` | `POST` | Paginated, filtered user directory listing | Yes (Bearer) |
| `/api/v1/users/status` | `POST` | Modify user account status (`ACTIVE`/`INACTIVE`/`BLOCKED`) | Yes (Bearer) |
| `/api/v1/admin/preventive-care` | `POST` | Fetch all pregnancy stages and vaccine programs | Yes (Bearer) |
| `/api/v1/admin/preventive-care/pregnancy-stage` | `POST` | Add or update a pregnancy milestone stage | Yes (Bearer) |
| `/api/v1/admin/preventive-care/pregnancy-stage/status` | `POST` | Toggle active status of a pregnancy stage | Yes (Bearer) |
| `/api/v1/admin/preventive-care/child-vaccines` | `POST` | Add or update child vaccination timeline | Yes (Bearer) |
| `/api/v1/admin/preventive-care/add-pregnancy-vaccine` | `POST` | Add or update maternal vaccination schedule | Yes (Bearer) |
| `/api/v1/content/upload` | `POST` | Upload new health video, guideline, or article | Yes (Bearer) |
| `/api/v1/audit-logs` | `POST` | Paginated search & filtering of platform audit events | Yes (Bearer) |
| `/api/v1/health-awareness` | `POST` | Fetch and search public health awareness campaigns | Yes (Bearer) |
| `/api/v1/health-awareness/save` | `POST` | Create or update health awareness campaign | Yes (Bearer) |
| `/api/v1/health-awareness/status` | `POST` | Toggle active or draft status of awareness campaign | Yes (Bearer) |
| `/api/v1/healthcare-champions` | `POST` | Fetch registered healthcare ambassadors & mentors | Yes (Bearer) |
| `/api/v1/healthcare-champions/save` | `POST` | Register or update healthcare champion profile | Yes (Bearer) |
| `/api/v1/healthcare-champions/status` | `POST` | Toggle active status of healthcare champion | Yes (Bearer) |
| `/api/v1/home-remedies` | `POST` | Fetch curated, verified home remedy catalog | Yes (Bearer) |
| `/api/v1/home-remedies/save` | `POST` | Add or update natural remedy protocol and ingredients | Yes (Bearer) |
| `/api/v1/home-remedies/status` | `POST` | Toggle active or verified status of home remedy | Yes (Bearer) |

---

## 5. Technical Implementation Plan (`plan.md`)

### 5.1 Proxy Configuration & CORS Prevention
- Local development runs via Angular CLI proxy configured in [`proxy.conf.json`](file:///proxy.conf.json):
  ```json
  {
    "/api": {
      "target": "http://20.193.140.173:8085",
      "secure": false,
      "changeOrigin": true,
      "logLevel": "debug"
    }
  }
  ```
- Registered in [`angular.json`](file:///angular.json) under `projects.active-life.architect.serve.options.proxyConfig`.

### 5.2 Responsive Breakpoints & Shell
- Layout automatically responds across Mobile (<768px), Tablet (768px - 1024px), and Desktop (>1024px).
- Fixed top navigation header with persistent breadcrumb context and quick profile actions.
- Collapsible sidebar drawer with memory of expanded menu groups.

---

## 6. Tasks & Execution Roadmap (`tasks.md`)

- [x] **Phase 1: Environment & Proxy Setup**
  - [x] Configure `proxy.conf.json` for backend target `http://20.193.140.173:8085`.
  - [x] Link proxy in `angular.json` for `npm start`.
- [x] **Phase 2: Authentication & Guarding**
  - [x] Implement `LoginBoxedComponent` with JWT token persistence.
  - [x] Implement multi-step `ForgotPasswordBoxedComponent` (Email -> OTP -> Reset -> Success).
  - [x] Build `AuthGuard` with role-based restriction for `testadmin@healthfamily.com`.
- [x] **Phase 3: Module Enhancements & UI Modernization**
  - [x] Analytics dashboard with Chart.js registration metrics.
  - [x] User management with status pill styling, debounced search, and pagination.
  - [x] Content management with category switching and upload flow.
  - [x] Preventive care with pregnancy stages and dual vaccine schedules.
  - [x] Audit logs with date-range filters and export capability.
- [ ] **Phase 4: Testing & Hardening**
  - [ ] Karma & Jasmine unit test coverage for `WebapiService`.
  - [ ] E2E integration test for login and route protection.
  - [ ] Global HTTP Interceptor for automatic 401 token refresh or redirect.

---

## 7. Environment & Deployment Blueprint

| Environment | Service URL | Configuration File |
|:---|:---|:---|
| **Development** | `http://20.193.140.173:8085` (proxied via `/api`) | [`src/environments/environment.ts`](file:///src/environments/environment.ts) |
| **Production** | Azure Static Web App / Managed API Gateway | [`src/environments/environment.prod.ts`](file:///src/environments/environment.prod.ts) |
| **Static Web App Config** | Azure routing fallback to `/index.html` | [`src/staticwebapp.config.json`](file:///src/staticwebapp.config.json) |

---
*Created and maintained as the canonical SpecKit document for the Active Life project.*
