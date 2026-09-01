import { Component, HostListener, OnInit, afterNextRender, ChangeDetectionStrategy } from '@angular/core';
import { ThemeOptions } from '../../../theme-options';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../ThemeOptions/store/config.service';
import { ConfigState } from '../../../ThemeOptions/store/config.state';
import { ActivatedRoute, Router } from '@angular/router';
import { WebapiService } from '../../../services/webapi.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: false,
  
  styles: [`
    /* Reset host sidebar background to light premium look */
    :host ::ng-deep .app-sidebar {
      background: #ffffff !important;
      border-right: 1px solid rgba(0, 0, 0, 0.06) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02) !important;
      transition: all 0.3s ease !important;
    }
    
    :host ::ng-deep .app-sidebar-content {
      background: #ffffff !important;
    }

    :host ::ng-deep .v-sidebar-menu,
    :host ::ng-deep .vsm-list {
      padding: 15px 0 0 0 !important;
      margin: 0 !important;
      width: 100% !important;
      overflow-x: hidden !important;
    }

    :host ::ng-deep .app-sidebar,
    :host ::ng-deep .app-sidebar-content,
    :host ::ng-deep .app-sidebar .scrollbar-container {
      overflow-x: hidden !important;
      padding-right: 0 !important;
    }

    :host ::ng-deep .app-header__logo {
      background: #ffffff !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
      padding: 1rem 1.5rem !important;
      height: 60px !important;
      display: flex !important;
      align-items: center !important;
    }

    .vsm-dropdown {
      max-height: 0 !important;
      overflow: hidden !important;
      opacity: 0 !important;
      transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease-in-out !important;
      position: relative !important;
    }
    
    .vsm-dropdown-show {
      max-height: 600px !important;
      opacity: 1 !important;
    }
    
    /* Arrow rotation - override existing transform */
    .vsm-item.has-sub .vsm-arrow {
      transition: transform 0.3s ease !important;
      transform: rotate(270deg) !important;  /* Point right */
    }
    
    .vsm-item.has-sub.vsm-open .vsm-arrow {
      transform: rotate(360deg) !important;  /* Point down */
    }
    
    /* ---- Sidebar item links: exact Figma specifications ---- */
    ::ng-deep .vsm-list .vsm-item,
    ::ng-deep .vsm-item {
      margin: 3px auto !important;
      width: 231px !important;
      height: 40px !important;
      box-sizing: border-box !important;
    }
    
    :host ::ng-deep .vsm-list .vsm-link {
      width: 231px !important;
      height: 40px !important;
      border-radius: 10px !important;
      gap: 12px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      padding: 10px 12px !important;
      padding-top: 10px !important;
      padding-right: 12px !important;
      padding-bottom: 10px !important;
      padding-left: 12px !important;
      box-sizing: border-box !important;
      color: #334155 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 500 !important;
      font-size: 14px !important;
      text-decoration: none !important;
      transition: all 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
    }

    :host ::ng-deep .vsm-list .vsm-icon {
      font-size: 1.15rem !important;
      color: #1e293b !important;
      transition: all 0.2s ease !important;
    }

    /* ---- Sidebar titles: exact Figma specifications ---- */
    :host ::ng-deep .vsm-list .vsm-title {
      color: #334155 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 500 !important;
      font-style: normal !important;
      font-size: 14px !important;
      line-height: 20px !important;
      height: 20px !important;
      letter-spacing: -0.15px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      display: inline-flex !important;
      align-items: center !important;
      transition: all 0.2s ease !important;
    }

    /* Exact Dashboard title dimensions from Figma: 72×20 */
    :host ::ng-deep .vsm-list .vsm-title.vsm-title-dashboard {
      width: 72px !important;
      height: 20px !important;
    }

    /* Exact Users title dimensions from Figma: 39×20 */
    :host ::ng-deep .vsm-list .vsm-title.vsm-title-users {
      width: 39px !important;
      height: 20px !important;
    }

    /* Active link item overrides - Gradient Blue-Purple style */
    :host ::ng-deep .vsm-list .vsm-item.vsm-active .vsm-link,
    :host ::ng-deep .vsm-list .vsm-link.active-item {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2) !important;
      color: #ffffff !important;
    }

    :host ::ng-deep .vsm-list .vsm-item.vsm-active .vsm-link .vsm-title,
    :host ::ng-deep .vsm-list .vsm-link.active-item .vsm-title {
      color: #ffffff !important;
      font-weight: 600 !important;
    }

    :host ::ng-deep .vsm-list .vsm-icon-svg {
      color: #64748b !important;
      width: 18px !important;
      height: 18px !important;
      min-width: 18px !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .vsm-list .vsm-item.vsm-active .vsm-link .vsm-icon-svg,
    :host ::ng-deep .vsm-list .vsm-link.active-item .vsm-icon-svg {
      color: #ffffff !important;
    }

    :host ::ng-deep .vsm-list .vsm-link:hover:not(.active-item) {
      background-color: #f1f5f9 !important;
      color: #0f172a !important;
    }

    :host ::ng-deep .vsm-list .vsm-link:hover:not(.active-item) .vsm-icon-svg {
      color: #0f172a !important;
    }

    /* Profile footer styling */
    .sidebar-profile-footer {
      border-top: 1px solid #EEF2F6 !important;
      background: #FFFFFF !important;
      height: 74px !important;
      padding: 16px 20px !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 10 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
    }

    .sidebar-user-avatar {
      width: 42px !important;
      height: 42px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #00D284 0%, #0084FF 100%) !important;
      color: #FFFFFF !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 16px !important;
      font-weight: 700 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
      box-shadow: 0 2px 6px rgba(0, 132, 255, 0.2) !important;
    }

    .sidebar-user-info {
      display: flex !important;
      flex-direction: column !important;
      margin-left: 12px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }

    .sidebar-user-name {
      font-size: 14px !important;
      font-weight: 700 !important;
      color: #0F172A !important;
      line-height: 1.2 !important;
      letter-spacing: -0.01em !important;
    }

    .sidebar-user-email {
      font-size: 12.5px !important;
      font-weight: 400 !important;
      color: #64748B !important;
      line-height: 1.2 !important;
      margin-top: 3px !important;
    }

    .sidebar-logout-btn {
      background: transparent !important;
      border: none !important;
      padding: 6px !important;
      color: #64748B !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 8px !important;
      transition: all 0.2s ease !important;
      outline: none !important;
    }

    .sidebar-logout-btn:hover {
      background: #F1F5F9 !important;
      color: #0F172A !important;
    }

    .sidebar-logout-btn svg {
      stroke: currentColor !important;
    }
  `]
})
export class SidebarComponent implements OnInit {
  public extraParameter: string | undefined;
  public openMenus: string[] = [];
  public activeSubItem: string = '';

  public config$: Observable<ConfigState>;

  public isLoggingOut: boolean = false;
  public adminName: string = 'Admin User';
  public adminEmail: string = 'admin@healthfamily.com';
  public adminInitial: string = 'A';

  public menuStructure: any[] = [
    {
      type: 'link',
      title: 'Dashboard',
      route: '/dashboards/analytics',
      icon: 'pe-7s-keypad',
      activeMenu: 'dashboardsMenu'
    },
    {
      type: 'link',
      title: 'Users',
      route: '/dashboards/users',
      icon: 'pe-7s-users',
      activeMenu: 'usersMenu'
    },
    {
      type: 'link',
      title: 'Content',
      route: '/dashboards/content',
      icon: 'pe-7s-note2',
      activeMenu: 'contentMenu'
    },
    {
      type: 'link',
      title: 'Preventive Care',
      route: '/dashboards/preventive-care',
      icon: 'pe-7s-like',
      activeMenu: 'preventiveCareMenu'
    },
    {
      type: 'link',
      title: 'Audit Logs',
      route: '/dashboards/audit-logs',
      icon: 'pe-7s-search',
      activeMenu: 'auditLogsMenu'
    }
  ];

  constructor(
    public globals: ThemeOptions,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private router: Router,
    private webApiService: WebapiService
  ) {
    this.config$ = this.configService.config$;

    afterNextRender(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar.set(true);
      }
    });
  }

  private newInnerWidth = 0;
  private innerWidth = 0;
  activeId = 'dashboardsMenu';

  toggleSidebar() {
    this.globals.toggleSidebar.set(!this.globals.toggleSidebar());
    if (this.globals.toggleSidebar()) {
      this.globals.sidebarHover.set(false);
    }
  }

  onSidebarMouseEnter() {
    // Disable hover-to-expand behavior per user request
  }

  onSidebarMouseLeave() {
    // Disable hover-to-expand behavior per user request
  }

  ngOnInit() {
    this.loadAdminProfile();

    // Get the extraParameter from the route to determine which menu should be open
    this.extraParameter = this.activatedRoute.snapshot.firstChild?.data['extraParameter'];

    // Initialize open menus based on current route
    if (this.extraParameter) {
      this.openMenus = [this.extraParameter];
    }
  }

  loadAdminProfile(): void {
    try {
      const profileStr = localStorage.getItem('adminProfile');
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        this.adminName = profile.name || profile.username || profile.email || 'Admin User';
        this.adminEmail = profile.email || 'admin@healthfamily.com';
        this.adminInitial = (this.adminName.charAt(0) || 'A').toUpperCase();
      }
    } catch (e) {
      // fallback defaults
    }
  }

  toggleSubmenu(menuId: string) {
    if (this.globals.toggleSidebar()) {
      this.globals.toggleSidebar.set(false);
    }
    // Toggle submenu: close if open, open if closed (and close all others)
    const index = this.openMenus.indexOf(menuId);
    if (index > -1) {
      this.openMenus.splice(index, 1);
    } else {
      this.openMenus = [menuId]; // Close others and open this one
    }
  }

  selectSubItem(title: string) {
    this.activeSubItem = title;
    this.onNavigate();
  }

  selectDashboard() {
    this.activeSubItem = '';
    this.onNavigate();
  }

  onNavigate() {
    if (this.globals.toggleSidebar()) {
      this.globals.toggleSidebar.set(false);
    }
    if (window.innerWidth < 1200) {
      this.globals.toggleSidebarMobile.set(true);
      this.globals.sidebarHover.set(false);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.newInnerWidth = (event.target as Window).innerWidth;
    this.globals.toggleSidebar.set(this.newInnerWidth < 1200);
  }

  logout(): void {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;

    const token = localStorage.getItem('accessToken') || '';

    if (token) {
      this.webApiService.Logout(token).subscribe({
        next: (response: any) => {
          console.log('Logout response:', response);
          this.cleanupAndRedirect();
        },
        error: (error: any) => {
          console.warn('Logout error, clearing session anyway:', error);
          this.cleanupAndRedirect();
        }
      });
    } else {
      this.cleanupAndRedirect();
    }
  }

  private cleanupAndRedirect(): void {
    this.isLoggingOut = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('adminProfile');
    this.router.navigate(['/pages/login-boxed']);
  }
}
