import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { BaseChartDirective } from 'ng2-charts';

// Dashboard Components
import { AnalyticsComponent } from './Pages/Dashboards/analytics/analytics.component';
import { UserManagementComponent } from './Pages/UserManagement/user-management.component';
import { ContentManagementComponent } from './Pages/ContentManagement/content.component';
import { PreventiveCareComponent } from './Pages/PreventiveCare/preventive-care.component';
import { HealthAwarenessComponent } from './Pages/HealthAwareness/health-awareness.component';
import { HealthcareChampionsComponent } from './Pages/HealthcareChampions/healthcare-champions.component';
import { HomeRemediesComponent } from './Pages/HomeRemedies/home-remedies.component';
import { SupportGroupsComponent } from './Pages/SupportGroups/support-groups.component';
import { AuditLogsComponent } from './Pages/AuditLogs/audit-logs.component';

@NgModule({
  declarations: [
    AnalyticsComponent,
    UserManagementComponent,
    ContentManagementComponent,
    PreventiveCareComponent,
    HealthAwarenessComponent,
    HealthcareChampionsComponent,
    HomeRemediesComponent,
    SupportGroupsComponent,
    AuditLogsComponent
  ],
  imports: [
    SharedModule,
    BaseChartDirective
  ],
  exports: [
    AnalyticsComponent,
    UserManagementComponent,
    ContentManagementComponent,
    PreventiveCareComponent,
    HealthAwarenessComponent,
    HealthcareChampionsComponent,
    HomeRemediesComponent,
    SupportGroupsComponent,
    AuditLogsComponent
  ]
})
export class DashboardsModule { }
