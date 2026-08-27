import { Component, HostListener, OnInit, afterNextRender, ChangeDetectionStrategy } from '@angular/core';
import { ThemeOptions } from '../../../theme-options';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../ThemeOptions/store/config.service';
import { ConfigState } from '../../../ThemeOptions/store/config.state';
import { ActivatedRoute, Router } from '@angular/router';

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
    
    /* Premium style overrides for sidebar links */
    ::ng-deep .vsm-list .vsm-item,
    ::ng-deep .vsm-item {
      margin: 2px 0px !important;
      height: auto !important;
    }
    
    :host ::ng-deep .vsm-list .vsm-link {
      color: #334155 !important;
      font-family: 'Poppins', sans-serif !important;
      font-weight: 500 !important;
      font-size: 0.88rem !important;
      text-decoration: none !important;
      transition: all 0.2s ease !important;
    }

    ::ng-deep .vsm-list .vsm-link,
    ::ng-deep .vsm-link {
      padding: 12px 24px !important;
      border-radius: 0px !important;
    }

    :host ::ng-deep .vsm-list .vsm-icon {
      font-size: 1.2rem !important;
      color: #1e293b !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .vsm-list .vsm-title {
      color: #334155 !important;
      font-family: 'Poppins', sans-serif !important;
      font-weight: 500 !important;
      font-size: 0.88rem !important;
      transition: all 0.2s ease !important;
    }

    /* Active link item overrides - Gradient Blue-Purple style */
    :host ::ng-deep .vsm-list .vsm-item.vsm-active .vsm-link,
    :host ::ng-deep .vsm-list .vsm-link.active-item {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2) !important;
    }

    :host ::ng-deep .vsm-list .vsm-item.vsm-active .vsm-link .vsm-title,
    :host ::ng-deep .vsm-list .vsm-link.active-item .vsm-title {
      color: #ffffff !important;
      font-weight: 600 !important;
    }

    :host ::ng-deep .vsm-list .vsm-icon-svg {
      color: #64748b !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .vsm-list .vsm-item.vsm-active .vsm-link .vsm-icon-svg,
    :host ::ng-deep .vsm-list .vsm-link.active-item .vsm-icon-svg {
      color: #ffffff !important;
    }

    :host ::ng-deep .vsm-list .vsm-link:hover:not(.active-item) {
      background-color: #f1f5f9 !important;
      border-radius: 10px !important;
    }
  `]
})
export class SidebarComponent implements OnInit {
  public extraParameter: string | undefined;
  public openMenus: string[] = [];
  public activeSubItem: string = '';

  public config$: Observable<ConfigState>;

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
    private router: Router
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
    // Get the extraParameter from the route to determine which menu should be open
    this.extraParameter = this.activatedRoute.snapshot.firstChild?.data['extraParameter'];

    // Initialize open menus based on current route
    if (this.extraParameter) {
      this.openMenus = [this.extraParameter];
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
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/pages/login-boxed']);
  }
}
