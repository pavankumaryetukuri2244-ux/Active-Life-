import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { BaseChartDirective } from 'ng2-charts';

// Dashboard Components
import { AnalyticsComponent } from './Pages/Dashboards/analytics/analytics.component';
import { UserManagementComponent } from './Pages/UserManagement/user-management.component';
import { DoctorManagementComponent } from './Pages/DoctorManagement/doctor-management.component';
import { DoctorApprovalsComponent } from './Pages/DoctorApprovals/doctor-approvals.component';
import { AppointmentsComponent } from './Pages/Appointments/appointments.component';
import { ContentManagementComponent } from './Pages/ContentManagement/content.component';
import { NotificationsComponent } from './Pages/Notifications/notifications.component';
import { PreventiveCareComponent } from './Pages/PreventiveCare/preventive-care.component';
import { HealthAwarenessComponent } from './Pages/HealthAwareness/health-awareness.component';
import { HealthcareChampionsComponent } from './Pages/HealthcareChampions/healthcare-champions.component';
import { HomeRemediesComponent } from './Pages/HomeRemedies/home-remedies.component';
import { SupportGroupsComponent } from './Pages/SupportGroups/support-groups.component';
import { AuditLogsComponent } from './Pages/AuditLogs/audit-logs.component';
import { ReportsAnalyticsComponent } from './Pages/ReportsAnalytics/reports-analytics.component';

@NgModule({
  declarations: [
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
    ReportsAnalyticsComponent
  ],
  imports: [
    SharedModule,
    BaseChartDirective
  ],
  exports: [
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
    ReportsAnalyticsComponent
  ]
})
export class DashboardsModule { }
