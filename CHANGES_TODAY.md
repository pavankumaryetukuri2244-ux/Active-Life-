# Active Life - Development Updates & Changelog

**Date:** August 28, 2026  
**Repository:** [pavankumaryetukuri2244-ux/Active-Life-](https://github.com/pavankumaryetukuri2244-ux/Active-Life-)  
**Branch:** `main`

---

## 📋 Overview of Changes Made Today

Today's updates covered full UI redesigns, end-to-end functionality implementation, API proxy setup, backend service integration, authentication workflows, and global stylesheet modernization.

---

## 1. ⚙️ Configuration & Infrastructure

### [`proxy.conf.json`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/proxy.conf.json) *(New File)*
- Configured local Angular development server proxy for `/api` targeting `http://20.193.140.173:8085`.
- Enabled `changeOrigin: true` and `secure: false` to resolve CORS issues during local testing.

### [`angular.json`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/angular.json)
- Added `proxyConfig: "proxy.conf.json"` under `projects.architect.serve.options` so `npm start` automatically utilizes proxy routing.

---

## 2. 🎨 Global Styling & Theme Modernization

### [`src/styles.scss`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/styles.scss)
- **Modern Design System**: Added responsive container styling, card elevation, border-radius standards, and sleek typography tokens.
- **Custom UI Components**:
  - Polished table designs (`.custom-table`, `.table-hover`, clean headers, status badges).
  - Modal styles (`.custom-modal`, backdrop blur, header icons, modern footer buttons).
  - Form elements (floating labels, smooth focus outlines, custom search inputs with icon prefix).
  - Status pills (`.badge-active`, `.badge-inactive`, `.badge-pending`, `.badge-warning`).
  - Action buttons (`.btn-primary-gradient`, `.btn-icon`, `.btn-action-view`, `.btn-action-edit`, `.btn-action-delete`).
  - Toggle switches and custom checkboxes.
  - Pagination bar controls and page indicators.

---

## 3. 🌐 Service & API Layer

### [`src/app/services/webapi.service.ts`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/services/webapi.service.ts)
- Configured centralized API requests with error handling and headers.
- **Authentication**:
  - `login(payload)`
  - `requestForgotPasswordOtp(email)`
  - `verifyOtp(email, otp)`
  - `resetPassword(payload)`
- **User Management**:
  - `getUsers(params)`, `createUser(user)`, `updateUser(id, user)`, `deleteUser(id)`, `toggleUserStatus(id, status)`
- **Content Management**:
  - `getContentList()`, `createContent(formData)`, `updateContent(id, data)`, `deleteContent(id)`, `changeContentStatus(id, status)`
- **Preventive Care**:
  - `getCarePrograms()`, `createCareProgram(program)`, `updateCareProgram(id, program)`, `deleteCareProgram(id)`
- **Audit Logs & Analytics**:
  - `getAuditLogs(filters)`, `getDashboardStats()`, `getChartData()`

---

## 4. 🔐 Authentication & Password Recovery

### [`src/app/DemoPages/UserPages/forgot-password-boxed/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/DemoPages/UserPages/forgot-password-boxed/)
- **HTML & TS Redesign**: Created a seamless 4-step wizard:
  1. **Step 1 - Email Input**: Validates email format and requests OTP.
  2. **Step 2 - OTP Verification**: 6-digit pin entry, countdown timer for resend, verify button.
  3. **Step 3 - Reset Password**: New password and confirmation input with dynamic validation & visibility toggle.
  4. **Step 4 - Success Screen**: Confirmation message with direct link to navigate back to login.

### [`src/app/DemoPages/UserPages/login-boxed/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/DemoPages/UserPages/login-boxed/)
- Modern boxed login card with branded logo, floating labels, password visibility toggle, remember-me checkbox, loading state, and error handling.

---

## 5. 👥 User Management Module

### [`src/app/DemoPages/UserManagement/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/DemoPages/UserManagement/)
- **Data Table**: Displays users with avatars, names, emails, roles, assigned departments, status badges, and last active dates.
- **Search & Filters**: Real-time filtering by role, status, and search query.
- **Modals & Actions**:
  - Add New User modal with validation.
  - Edit User modal with prefilled data.
  - Delete user confirmation modal.
  - Quick toggle for user active/inactive status.
- **Pagination**: Complete pagination controls with items-per-page selector.

---

## 6. 📊 Dashboard & Analytics

### [`src/app/DemoPages/Dashboards/analytics/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/DemoPages/Dashboards/analytics/)
- **KPI Metrics Cards**: Total Users, Active Subscriptions, Preventive Care Enrollments, and Platform Engagement rate.
- **Interactive Visuals**: Chart containers, recent activity feed, quick action shortcuts, and summary statistics.

---

## 7. 📁 Content Management Module

### [`src/app/DemoPages/ContentManagement/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/DemoPages/ContentManagement/)
- **Content Grid & List**: Category filtering (Articles, Videos, Guidelines, Newsletters).
- **CRUD Operations**: Content creation modal with thumbnail upload, title, description, and status flags.
- **Status Management**: Publish / Draft / Archive state controls and action triggers.

---

## 8. 🩺 Preventive Care Module

### [`src/app/DemoPages/PreventiveCare/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/DemoPages/PreventiveCare/)
- **Health Programs**: List and card view of active wellness & preventive health campaigns.
- **Participant Tracking**: Enrollment counts, scheduled sessions, completion rates, and status filters.
- **Program Management**: Add/edit care programs and manage schedule notifications.

---

## 9. 📜 Audit Logs Module

### [`src/app/DemoPages/AuditLogs/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/DemoPages/AuditLogs/)
- **Security & Activity Tracking**: Logs user login events, data modifications, role updates, and system events.
- **Filters & Search**: Date-range filtering, severity indicators (Info, Success, Warning, Danger), and IP address logging.

---

## 10. 🧭 Layout, Navigation & Routing

### [`src/app/Layout/Components/sidebar/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/Layout/Components/sidebar/)
- Streamlined sidebar menu with modern icons, active link indicator, collapsible sections, and mobile drawer support.

### [`src/app/app-routing.module.ts`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/app-routing.module.ts)
- Cleaned up routing table, lazy loading, and redirect fallback routes.

---

## 11. 📢 Health Awareness Module

### [`src/app/Pages/HealthAwareness/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/Pages/HealthAwareness/)
- **Campaign & Protocol Management**: Directory for preventive health campaigns (cardiovascular protection, maternal anemia, monsoon disease containment, low-glycemic diabetes lifestyle).
- **KPI Metrics Cards**: Total Campaigns, Active Initiatives, Community Reach, and Detailed Protocols.
- **Search & Filtering**: Debounced search bar, category tabs (Maternal, Heart, Chronic, Seasonal, Nutrition, Mental Health), and status filters.
- **Grid & Table Views**: Responsive campaign cards with action protocol checklists, read times, and audience metrics.
- **Modals**: Full campaign creation/edit modal and interactive Clinical Advisory reader.

---

## 12. 🏅 Healthcare Champions Module

### [`src/app/Pages/HealthcareChampions/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/Pages/HealthcareChampions/)
- **Community Health Leader Directory**: Dedicated registry for medical mentors, certified doulas, clinical nutritionists, and health educators.
- **KPI Metrics Cards**: Total Champions, Active In Field, Coverage Districts/Zones, and Families Mentored.
- **Search & Filtering**: Search by name, specialty, district, and contact with domain category tabs.
- **Champion Cards & Table**: High-fidelity cards featuring initials avatars, verified badges, rating stars, contact details, and mentoring statistics.
- **Modals**: Champion registration/edit modal and comprehensive Impact Profile modal.

---

## 13. 🌿 Home Remedies Module

### [`src/app/Pages/HomeRemedies/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/Pages/HomeRemedies/)
- **Evidence-Based Natural Remedies**: Curated remedies for everyday ailments (cough, acid reflux, eczema, joint stiffness, sleep tension).
- **KPI Metrics Cards**: Total Remedies, Doctor Verified, Common Ailments Covered, and Community Views.
- **Search & Filtering**: Search by remedy, ailment, or ingredient keywords with category tabs and Doctor Verified filtering.
- **Remedy Cards & Table**: Detailed recipe cards with difficulty tags, prep time, ingredient chips, and therapeutic mechanism summary.
- **Modals**: Add/Edit remedy modal with ingredient checklist, step-by-step instructions, dosage timing, precautions, and doctor verification. Interactive Remedy Preparation Protocol guide modal.

---

## 14. 🤝 Support Groups Module

### [`src/app/Pages/SupportGroups/`](file:///c:/Users/Y.PAVAN%20CHOWDARY/Downloads/src%201/src/app/Pages/SupportGroups/)
- **Doctor-Guided Peer Circles & Recovery Cohorts**: Comprehensive hub for specialized support circles (Postpartum & New Mothers, Type 2 Diabetes Lifestyle, Anxiety & Burnout Resilience, Breast Cancer Warriors, Cardiac Rehab, Caregivers of Senior Dementia, Mindful Sobriety, and Gut Health/IBS).
- **KPI Metrics Cards**: Total Support Circles, Enrolled Members, Active / Upcoming Sessions, and Doctor Moderated percentage.
- **Search & Filtering**: Real-time debounced keyword search (name, facilitator, ailment, topic tag), category tabs, meeting format filter (Online, In-Person, Hybrid), and status filter (Active, Upcoming, Full, Paused).
- **Grid & Table Views**: High-fidelity circle cards featuring category pill, format indicator, facilitator avatar & doctor verification badge, schedule & next session date, interactive capacity tracker progress bar, and topic tags.
- **Modals**:
  - **Create / Edit Support Circle**: Modal for scheduling circles, facilitator credentials, maximum capacity, discussion ground rules, and contact info.
  - **Circle Protocol & Guidelines**: Comprehensive modal with direct meeting link copy, discussion ground rules checklist, explored themes, and active participant roster.
  - **Participant RSVP & Enrollment**: Clean registration modal with seat capacity verification and confirmation alert.

---

## 🚀 Git Commits Made Today

| Commit Hash | Message | Description |
|---|---|---|
| `9f86039` | `feat: update UI components, forgot-password flow, API proxy, and services` | Added API proxy, full forgot-password flow, services, and updated all demo pages |
| `20c9aa6` | `refactor: UI design updates, loader removals, and Figma layout styling` | Refactored layouts, removed obsolete loaders, enhanced design aesthetics |
| `bbb5cde` | `feat: user management styling and sidebar fixes` | Initial baseline for user management and navigation updates |

