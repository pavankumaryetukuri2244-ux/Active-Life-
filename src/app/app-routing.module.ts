import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseLayoutComponent } from './Layout/base-layout/base-layout.component';
import { PagesLayoutComponent } from './Layout/pages-layout/pages-layout.component';

// Import all components from barrel file
import {
  AnalyticsComponent,
  UserManagementComponent,
  DoctorManagementComponent,
  DoctorApprovalsComponent,
  AppointmentsComponent,
  ContentManagementComponent,
  NotificationsComponent,
  PreventiveCareComponent,
  HealthAwarenessComponent,
  HealthcareChampionsComponent,
  HomeRemediesComponent,
  SupportGroupsComponent,
  AuditLogsComponent,
  ReportsAnalyticsComponent,
  ForgotPasswordBoxedComponent,
  LoginBoxedComponent
} from './components.barrel';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Dashboards
      { path: '', redirectTo: '/dashboards/analytics', pathMatch: 'full' },
      { path: 'dashboards/analytics', component: AnalyticsComponent, data: { extraParameter: 'dashboardsMenu' } },
      { path: 'dashboards/users', component: UserManagementComponent, data: { extraParameter: 'usersMenu' } },
      { path: 'dashboards/doctors', component: DoctorManagementComponent, data: { extraParameter: 'doctorsMenu' } },
      { path: 'doctors', redirectTo: '/dashboards/doctors', pathMatch: 'full' },
      { path: 'dashboards/doctor-approvals', component: DoctorApprovalsComponent, data: { extraParameter: 'doctorApprovalsMenu' } },
      { path: 'dashboards/doctor approvals', redirectTo: '/dashboards/doctor-approvals', pathMatch: 'full' },
      { path: 'dashboards/doctor%20approvals', redirectTo: '/dashboards/doctor-approvals', pathMatch: 'full' },
      { path: 'doctor-approvals', redirectTo: '/dashboards/doctor-approvals', pathMatch: 'full' },
      { path: 'doctor approvals', redirectTo: '/dashboards/doctor-approvals', pathMatch: 'full' },
      { path: 'doctor%20approvals', redirectTo: '/dashboards/doctor-approvals', pathMatch: 'full' },
      { path: 'dashboards/appointments', component: AppointmentsComponent, data: { extraParameter: 'appointmentsMenu' } },
      { path: 'appointments', redirectTo: '/dashboards/appointments', pathMatch: 'full' },
      { path: 'dashboards/content', component: ContentManagementComponent, data: { extraParameter: 'contentMenu' } },
      { path: 'dashboards/notifications', component: NotificationsComponent, data: { extraParameter: 'notificationsMenu' } },
      { path: 'notifications', redirectTo: '/dashboards/notifications', pathMatch: 'full' },
      { path: 'dashboards/preventive-care', component: PreventiveCareComponent, data: { extraParameter: 'preventiveCareMenu' } },
      { path: 'dashboards/health-awareness', component: HealthAwarenessComponent, data: { extraParameter: 'healthAwarenessMenu' } },
      { path: 'dashboards/healthcare-champions', component: HealthcareChampionsComponent, data: { extraParameter: 'healthcareChampionsMenu' } },
      { path: 'dashboards/home-remedies', component: HomeRemediesComponent, data: { extraParameter: 'homeRemediesMenu' } },
      { path: 'dashboards/support-groups', component: SupportGroupsComponent, data: { extraParameter: 'supportGroupsMenu' } },
      { path: 'dashboards/reports-analytics', component: ReportsAnalyticsComponent, data: { extraParameter: 'analyticsMenu' } },
      { path: 'reports-analytics', redirectTo: '/dashboards/reports-analytics', pathMatch: 'full' },
      { path: 'analytics', redirectTo: '/dashboards/reports-analytics', pathMatch: 'full' },
      { path: 'dashboards/audit-logs', component: AuditLogsComponent, data: { extraParameter: 'auditLogsMenu' } }
    ]
  },
  {
    path: '',
    component: PagesLayoutComponent,
    children: [
      // User Pages
      { path: 'pages/login-boxed', component: LoginBoxedComponent, data: { extraParameter: '' } },
      { path: 'pages/forgot-password-boxed', component: ForgotPasswordBoxedComponent, data: { extraParameter: '' } },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
