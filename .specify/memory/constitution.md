# Active Life Project Constitution

## 1. Core Principles

### Principle 1: Architectural Separation & Service Centralization
- **Strict I/O Boundary:** Components must never instantiate or invoke `HttpClient` directly. All network I/O, endpoint URLs, query parameter construction, and Bearer token attachments MUST reside exclusively within [`WebapiService`](file:///src/app/services/webapi.service.ts) or domain services.
- **Component Role:** Components are responsible for view-model presentation, user interaction handling, reactive subscriptions, and UI state (pagination, modals, toasts).

### Principle 2: Defensive Authentication & Role Scoping
- **Token Handling:** Authenticated sessions use JWT bearer tokens saved in `localStorage` under `accessToken`.
- **Role Isolation:** Specific restricted accounts (e.g., `testadmin@healthfamily.com`) must only access explicitly permitted routes (`/dashboards/users`, `/dashboards/content`).
- **Route Guarding:** Unauthenticated navigation attempts to protected dashboard routes must immediately redirect to `/pages/login-boxed` via [`AuthGuard`](file:///src/app/auth.guard.ts).

### Principle 3: Design Tokens & Visual Hierarchy
- **Typography:** All headings, titles, and body text must respect the design system defined in [`src/styles.scss`](file:///src/styles.scss) (`Inter` typography, letter spacing, line height standards).
- **Consistent Color Palettes:**
  - Primary Action / Accent: `#3b82f6` / `#2563eb`
  - Success / Upload Gradient: `linear-gradient(135deg, #00C950, #009689)`
  - Status Pills: Standardized emerald for active, amber for inactive, and rose for blocked/failed.
- **No Ad-Hoc Styling:** Use defined SCSS utility classes, custom cards (`.custom-card`), table classes (`.custom-table`), and form controls.

### Principle 4: Memory Safety & Reactive Best Practices
- **RxJS Unsubscription:** All component-level subscriptions must be safely unsubscribed on component teardown using `takeUntil` with a destroy `Subject` or `Subscription.unsubscribe()`.
- **Debounced Inputs:** All free-text searches must debounce by at least 300ms and use `distinctUntilChanged()`.

### Principle 5: Backward Compatibility & Proxy Discipline
- **API Routing:** In local development, all API traffic routes through `/api` using [`proxy.conf.json`](file:///proxy.conf.json) targeting `http://20.193.140.173:8085` to avoid browser CORS errors.
- **Environment Integrity:** Configuration variables must remain isolated in [`environment.ts`](file:///src/environments/environment.ts) and [`environment.prod.ts`](file:///src/environments/environment.prod.ts).

---

## 2. Governance & Enforcement
- **Constitution Check:** Every new feature specification (`spec.md`) and implementation plan (`plan.md`) must pass a compliance check against these 5 principles before implementation.
- **Modifications:** Changes to these principles require team alignment and documentation updates in both this file and [`SPECKIT.md`](file:///SPECKIT.md).
