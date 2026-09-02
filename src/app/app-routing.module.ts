import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseLayoutComponent } from './Layout/base-layout/base-layout.component';
import { PagesLayoutComponent } from './Layout/pages-layout/pages-layout.component';

// Import all components from barrel file
import {
  AnalyticsComponent,
  UserManagementComponent,
  ContentManagementComponent,
  PreventiveCareComponent,
  AuditLogsComponent,
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
      { path: 'dashboards/content', component: ContentManagementComponent, data: { extraParameter: 'contentMenu' } },
      { path: 'dashboards/preventive-care', component: PreventiveCareComponent, data: { extraParameter: 'preventiveCareMenu' } },
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
