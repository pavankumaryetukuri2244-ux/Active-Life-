import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { BaseChartDirective } from 'ng2-charts';

// Dashboard Components
import { AnalyticsComponent } from './Pages/Dashboards/analytics/analytics.component';
import { UserManagementComponent } from './Pages/UserManagement/user-management.component';
import { ContentManagementComponent } from './Pages/ContentManagement/content.component';
import { PreventiveCareComponent } from './Pages/PreventiveCare/preventive-care.component';
import { AuditLogsComponent } from './Pages/AuditLogs/audit-logs.component';

@NgModule({
  declarations: [
    AnalyticsComponent,
    UserManagementComponent,
    ContentManagementComponent,
    PreventiveCareComponent,
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
    AuditLogsComponent
  ]
})
export class DashboardsModule { }
