// Barrel file for all components to be used in routing
// This prevents circular dependencies while making components available to routing

// Dashboard components
export { AnalyticsComponent } from './DemoPages/Dashboards/analytics/analytics.component';
export { UserManagementComponent } from './DemoPages/UserManagement/user-management.component';
export { ContentManagementComponent } from './DemoPages/ContentManagement/content-management.component';
export { PreventiveCareComponent } from './DemoPages/PreventiveCare/preventive-care.component';
export { AuditLogsComponent } from './DemoPages/AuditLogs/audit-logs.component';

// User pages components
export { ForgotPasswordBoxedComponent } from './DemoPages/UserPages/forgot-password-boxed/forgot-password-boxed.component';
export { LoginBoxedComponent } from './DemoPages/UserPages/login-boxed/login-boxed.component';
export { RegisterBoxedComponent } from './DemoPages/UserPages/register-boxed/register-boxed.component';
