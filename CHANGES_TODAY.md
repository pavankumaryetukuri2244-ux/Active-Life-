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

## 🚀 Git Commits Made Today

| Commit Hash | Message | Description |
|---|---|---|
| `9f86039` | `feat: update UI components, forgot-password flow, API proxy, and services` | Added API proxy, full forgot-password flow, services, and updated all demo pages |
| `20c9aa6` | `refactor: UI design updates, loader removals, and Figma layout styling` | Refactored layouts, removed obsolete loaders, enhanced design aesthetics |
| `bbb5cde` | `feat: user management styling and sidebar fixes` | Initial baseline for user management and navigation updates |
