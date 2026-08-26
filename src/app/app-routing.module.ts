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
  StandardComponent,
  DropdownsComponent,
  CardsComponent,
  ListGroupsComponent,
  TimelineComponent,
  IconsComponent,
  AccordionsComponent,
  TabsComponent,
  CarouselComponent,
  ModalsComponent,
  PaginationComponent,
  ProgressBarComponent,
  TooltipsPopoversComponent,
  ControlsComponent,
  LayoutComponent,
  RegularComponent,
  TablesMainComponent,
  ChartBoxes3Component,
  ForgotPasswordBoxedComponent,
  LoginBoxedComponent,
  RegisterBoxedComponent,
  ChartjsComponent
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
      { path: 'dashboards/audit-logs', component: AuditLogsComponent, data: { extraParameter: 'auditLogsMenu' } },

      // Elements
      { path: 'elements/buttons-standard', component: StandardComponent, data: { extraParameter: 'elementsMenu' } },
      { path: 'elements/dropdowns', component: DropdownsComponent, data: { extraParameter: 'elementsMenu' } },
      { path: 'elements/icons', component: IconsComponent, data: { extraParameter: 'elementsMenu' } },
      { path: 'elements/cards', component: CardsComponent, data: { extraParameter: 'elementsMenu' } },
      { path: 'elements/list-group', component: ListGroupsComponent, data: { extraParameter: 'elementsMenu' } },
      { path: 'elements/timeline', component: TimelineComponent, data: { extraParameter: 'elementsMenu' } },

      // Components
      { path: 'components/tabs', component: TabsComponent, data: { extraParameter: 'componentsMenu' } },
      { path: 'components/accordions', component: AccordionsComponent, data: { extraParameter: 'componentsMenu' } },
      { path: 'components/carousel', component: CarouselComponent, data: { extraParameter: 'componentsMenu' } },
      { path: 'components/modals', component: ModalsComponent, data: { extraParameter: 'componentsMenu' } },
      { path: 'components/pagination', component: PaginationComponent, data: { extraParameter: 'componentsMenu' } },
      { path: 'components/progress-bar', component: ProgressBarComponent, data: { extraParameter: 'componentsMenu' } },
      { path: 'components/tooltips-popovers', component: TooltipsPopoversComponent, data: { extraParameter: 'componentsMenu' } },

      // Charts
      { path: 'charts/chartjs', component: ChartjsComponent, data: { extraParameter: 'chartsMenu' } },

      // Forms
      { path: 'forms/controls', component: ControlsComponent, data: { extraParameter: 'formsMenu' } },
      { path: 'forms/layouts', component: LayoutComponent, data: { extraParameter: 'formsMenu' } },

      // Tables
      { path: 'tables/regular', component: RegularComponent, data: { extraParameter: 'tablesMenu' } },
      { path: 'tables/bootstrap', component: TablesMainComponent, data: { extraParameter: 'tablesMenu' } },

      // Widgets
      { path: 'widgets/chart-boxes-3', component: ChartBoxes3Component, data: { extraParameter: 'widgetsMenu' } }
    ]
  },
  {
    path: '',
    component: PagesLayoutComponent,
    children: [
      // User Pages
      { path: 'pages/login-boxed', component: LoginBoxedComponent, data: { extraParameter: '' } },
      { path: 'pages/register-boxed', component: RegisterBoxedComponent, data: { extraParameter: '' } },
      { path: 'pages/forgot-password-boxed', component: ForgotPasswordBoxedComponent, data: { extraParameter: '' } },
    ]
  },
  {
    // Documentation section — lazy-loaded so it stays out of the initial bundle
    path: 'docs',
    loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
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
