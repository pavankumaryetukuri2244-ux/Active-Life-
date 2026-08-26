import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { BaseChartDirective } from 'ng2-charts';

// Dashboard Components
import { AnalyticsComponent } from './DemoPages/Dashboards/analytics/analytics.component';
import { UserManagementComponent } from './DemoPages/UserManagement/user-management.component';
import { ContentManagementComponent } from './DemoPages/ContentManagement/content-management.component';
import { PreventiveCareComponent } from './DemoPages/PreventiveCare/preventive-care.component';
import { AuditLogsComponent } from './DemoPages/AuditLogs/audit-logs.component';

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
