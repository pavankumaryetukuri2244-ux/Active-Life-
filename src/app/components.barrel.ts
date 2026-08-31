// Barrel file for all components to be used in routing
// This prevents circular dependencies while making components available to routing

// Dashboard components
export { AnalyticsComponent } from './Pages/Dashboards/analytics/analytics.component';
export { UserManagementComponent } from './Pages/UserManagement/user-management.component';
export { ContentManagementComponent } from './Pages/ContentManagement/content-management.component';
export { PreventiveCareComponent } from './Pages/PreventiveCare/preventive-care.component';
export { AuditLogsComponent } from './Pages/AuditLogs/audit-logs.component';

// User pages components
export { ForgotPasswordBoxedComponent } from './Pages/UserPages/forgot-password-boxed/forgot-password-boxed.component';
export { LoginBoxedComponent } from './Pages/UserPages/login-boxed/login-boxed.component';
export { RegisterBoxedComponent } from './Pages/UserPages/register-boxed/register-boxed.component';
