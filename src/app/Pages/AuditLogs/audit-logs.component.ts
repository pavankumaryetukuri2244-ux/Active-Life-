import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WebapiService } from '../../services/webapi.service';

interface AuditLog {
  id: number;
  logId: string;
  adminName: string;
  action: string;
  module: string;
  createdAt: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED';
}

interface AuditStats {
  totalLogs: number;
  todayActivity: number;
  failedActions: number;
  activeAdmins: number;
}

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  standalone: false,
  styles: [`
    .al-page-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 24px !important;
      font-weight: 700 !important;
      color: #111827 !important;
      letter-spacing: -0.02em !important;
      margin: 0 0 4px 0 !important;
    }

    .al-page-subtitle {
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 400 !important;
      color: #6B7280 !important;
      margin: 0 !important;
    }

    /* Export Button */
    .al-btn-export {
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      background: #059669 !important;
      color: #FFFFFF !important;
      border: none !important;
      border-radius: 10px !important;
      padding: 9px 18px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      box-shadow: 0 2px 6px rgba(5, 150, 105, 0.25) !important;
      transition: all 0.2s ease !important;
    }
    .al-btn-export:hover {
      background: #047857 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35) !important;
    }
    .al-btn-export:active {
      transform: translateY(0);
    }

    /* Stat Cards - Pastel Colored Boxes */
    .al-stat-card {
      border-radius: 16px !important;
      border: none !important;
      padding: 22px 24px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      transition: none !important;
      transform: none !important;
      height: 100% !important;
    }
    .al-stat-card:hover {
      transform: none !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    }

    .al-stat-card-blue {
      background: #F0F6FF !important;
    }
    .al-stat-card-green {
      background: #F0FDF4 !important;
    }
    .al-stat-card-red {
      background: #FEF2F2 !important;
    }
    .al-stat-card-purple {
      background: #FAF5FF !important;
    }

    .al-stat-label {
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      color: #64748B !important;
      margin-bottom: 8px !important;
    }

    .al-stat-value {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 28px !important;
      font-weight: 700 !important;
      line-height: 1.15 !important;
      margin: 0 !important;
      letter-spacing: -0.02em !important;
    }

    /* Filter Card */
    .al-filter-card {
      background: #FFFFFF !important;
      border: 1px solid #E5E7EB !important;
      border-radius: 16px !important;
      padding: 20px 24px !important;
      margin-bottom: 24px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    }

    .al-search-wrapper {
      position: relative !important;
      width: 100% !important;
    }

    .al-search-icon {
      position: absolute !important;
      left: 12px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      color: #94A3B8 !important;
      width: 15px !important;
      height: 15px !important;
      pointer-events: none !important;
    }

    .al-search-input {
      width: 100% !important;
      height: 38px !important;
      padding-left: 38px !important;
      padding-right: 14px !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 8px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13px !important;
      color: #111827 !important;
      background-color: #F3F4F6 !important;
      outline: none !important;
      transition: all 0.2s ease !important;
    }

    .al-search-input:focus {
      background-color: #FFFFFF !important;
      border-color: #CBD5E1 !important;
      box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.08) !important;
    }

    .al-search-input::placeholder {
      color: #94A3B8 !important;
      font-weight: 400 !important;
      font-size: 13px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }

    .al-select-dropdown {
      height: 38px !important;
      padding: 0 16px !important;
      border: 1px solid #E5E7EB !important;
      border-radius: 8px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 500 !important;
      color: #111827 !important;
      background-color: #FFFFFF !important;
      outline: none !important;
      cursor: pointer !important;
      transition: all 0.15s ease !important;
    }

    .al-select-dropdown:hover {
      background-color: #F8FAFC !important;
      border-color: #CBD5E1 !important;
    }

    .al-select-dropdown:focus {
      border-color: #3B82F6 !important;
    }

    /* Table Container */
    .al-table-card {
      background: #FFFFFF !important;
      border: 1px solid #E5E7EB !important;
      border-radius: 16px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      padding: 0 !important;
    }

    .al-table-responsive {
      width: 100% !important;
      overflow-x: auto !important;
      border-radius: 16px !important;
    }

    .al-table {
      width: 100% !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
      margin: 0 !important;
    }

    /* Headers */
    .al-table thead tr {
      background: #F8FAFC !important;
      border-bottom: 1px solid #E2E8F0 !important;
    }

    .al-table thead th {
      padding: 14px 20px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      letter-spacing: 0.04em !important;
      text-transform: uppercase !important;
      color: #64748B !important;
      border-top: none !important;
      border-bottom: 1px solid #E2E8F0 !important;
      white-space: nowrap !important;
    }

    .al-table thead th.col-id-head {
      padding-left: 28px !important;
      width: 100px;
      min-width: 100px;
    }

    .al-table thead th.col-admin-head {
      width: 180px;
      min-width: 170px;
    }

    .al-table thead th.col-action-head {
      min-width: 260px;
    }

    .al-table thead th.col-module-head {
      width: 180px;
      min-width: 160px;
    }

    .al-table thead th.col-timestamp-head {
      width: 180px;
      min-width: 170px;
    }

    .al-table thead th.col-ip-head {
      width: 140px;
      min-width: 130px;
    }

    .al-table thead th.col-status-head {
      width: 110px;
      min-width: 110px;
    }

    .al-table thead th.col-actions-head {
      padding-right: 28px !important;
      text-align: center !important;
      width: 70px;
      min-width: 70px;
    }

    /* Body Rows */
    .al-table tbody tr {
      background: #FFFFFF !important;
      border-bottom: 1px solid #F1F5F9 !important;
      transition: background-color 0.15s ease !important;
      height: 70px !important;
    }

    .al-table tbody tr:hover {
      background: #F8FAFC !important;
    }

    .al-table tbody tr:last-child td {
      border-bottom: none !important;
    }

    .al-table tbody td {
      padding: 16px 20px !important;
      vertical-align: middle !important;
      border-top: none !important;
      border-bottom: 1px solid #F1F5F9 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }

    /* Specific Columns */
    .al-table td.col-log-id {
      padding-left: 28px !important;
      font-size: 13.5px !important;
      font-weight: 600 !important;
      color: #111827 !important;
      white-space: nowrap !important;
    }

    .al-admin-name {
      font-size: 13.5px !important;
      font-weight: 600 !important;
      color: #111827 !important;
      line-height: 1.3 !important;
      white-space: nowrap !important;
    }

    .al-admin-code {
      font-size: 11.5px !important;
      font-weight: 400 !important;
      color: #9CA3AF !important;
      line-height: 1.2 !important;
      margin-top: 2px !important;
      white-space: nowrap !important;
    }

    .col-action-cell {
      max-width: 260px;
      width: 240px;
    }

    .al-action-text {
      font-size: 13.5px !important;
      font-weight: 400 !important;
      color: #334155 !important;
      line-height: 1.4 !important;
      display: block !important;
      max-width: 240px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      cursor: default;
    }

    /* Module Pill - Crisp white rounded pill with #0F172A text */
    .al-module-pill {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 20px !important;
      padding: 4px 14px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 12.5px !important;
      font-weight: 600 !important;
      color: #0F172A !important;
      white-space: nowrap !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03) !important;
    }

    .al-timestamp-text {
      font-size: 13px !important;
      font-weight: 400 !important;
      color: #475569 !important;
      white-space: nowrap !important;
    }

    .al-ip-text {
      font-size: 13px !important;
      font-weight: 400 !important;
      color: #475569 !important;
      white-space: nowrap !important;
    }

    /* Status Pills */
    .al-status-pill {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 12px !important;
      padding: 3px 12px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      letter-spacing: 0.1px !important;
      white-space: nowrap !important;
    }

    .al-status-success {
      background-color: #DCFCE7 !important;
      color: #16A34A !important;
    }

    .al-status-failed {
      background-color: #FEE2E2 !important;
      color: #DC2626 !important;
    }

    /* Actions Column & Dropdown Menu */
    .al-action-dropdown-wrap {
      position: relative !important;
      display: inline-block !important;
    }

    .al-btn-action {
      background: transparent !important;
      border: none !important;
      color: #0F172A !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 8px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: background-color 0.15s ease !important;
    }

    .al-btn-action:hover,
    .al-btn-action.active {
      background-color: #F1F5F9 !important;
      color: #0F172A !important;
    }

    .al-dropdown-menu {
      position: absolute !important;
      right: 0 !important;
      top: calc(100% + 4px) !important;
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 12px !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
      padding: 6px 0 !important;
      min-width: 170px !important;
      z-index: 1050 !important;
      animation: alDropdownFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    @keyframes alDropdownFadeIn {
      from {
        opacity: 0;
        transform: translateY(-4px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .al-dropdown-item {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      width: 100% !important;
      padding: 8px 16px !important;
      background: transparent !important;
      border: none !important;
      color: #334155 !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 500 !important;
      text-align: left !important;
      cursor: pointer !important;
      transition: background-color 0.15s ease, color 0.15s ease !important;
      white-space: nowrap !important;
    }

    .al-dropdown-item:hover {
      background-color: #F8FAFC !important;
      color: #0F172A !important;
    }

    .al-dropdown-item svg {
      color: #64748B !important;
      flex-shrink: 0 !important;
      transition: color 0.15s ease !important;
    }

    .al-dropdown-item:hover svg {
      color: #0F172A !important;
    }

    /* Pagination */
    .al-pagination-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 28px;
      border-top: 1px solid #F1F5F9;
      background: #FFFFFF;
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class AuditLogsComponent implements OnInit {

  // Action dropdown and details state
  openDropdownLogId: any = null;
  selectedLogDetails: any = null;
  showDetailsModal = false;
  showToast = false;
  toastMessage = '';
  private toastTimer: any;

  // Stat cards
  stats: AuditStats = {
    totalLogs: 0,
    todayActivity: 0,
    failedActions: 0,
    activeAdmins: 0
  };

  // Table data
  allLogs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  logsList: AuditLog[] = [];
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Filters
  searchQuery = '';
  selectedModule = 'All Modules';
  selectedStatus = 'All Status';
  adminName = '';
  fromDate = '';
  toDate = '';
  sortBy = 'createdAt';
  sortDirection = 'ASC';

  private destroy$ = new Subject<void>();

  modulesList: string[] = [
    'All Modules',
    'User Management',
    'Content Management',
    'Preventive Care',
    'Authentication',
    'System Settings',
    'Notifications'
  ];

  statusesList: string[] = ['All Status', 'SUCCESS', 'FAILED'];

  private auditLogsSubscription?: Subscription;

  constructor(private api: WebapiService) {}

  ngOnInit() {
    this.loadAuditLogs();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.auditLogsSubscription?.unsubscribe();
  }

  /**
   * Initial load — calls API once with size: 1000 to fetch all logs.
   * All subsequent search, module, and status filtering is handled in the frontend with 0 API calls.
   */
  loadAuditLogs() {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.auditLogsSubscription) {
      this.auditLogsSubscription.unsubscribe();
    }

    const body: any = {
      page: 0,
      size: 1000,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };

    this.auditLogsSubscription = this.api.GetAuditLogsFiltered(body).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.success && res.data) {
          this.stats = {
            totalLogs: res.data.totalLogs ?? this.stats.totalLogs,
            todayActivity: res.data.todayActivity ?? this.stats.todayActivity,
            failedActions: res.data.failedActions ?? this.stats.failedActions,
            activeAdmins: res.data.activeAdmins ?? this.stats.activeAdmins
          };
          const pageData = res.data.logs;
          const rawContent = pageData?.content ?? [];
          this.allLogs = [...rawContent];

          // Immediately apply frontend filters to slice and display
          this.applyFrontendFilters();
        }
      },
      error: (err: any) => {
        console.error('Audit logs load error:', err);
        this.errorMessage = 'Failed to load audit logs. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Pure frontend filtering — 0 API calls!
   * Filters the master logs list by:
   * 1. Module
   * 2. Status
   * 3. Search Query (Admin Name, Admin Code, Log ID, Action, IP Address)
   */
  applyFrontendFilters() {
    let list = [...this.allLogs];

    // 1. Filter by Module
    if (this.selectedModule && this.selectedModule !== 'All Modules') {
      const modNorm = this.selectedModule.toLowerCase().replace(/[\s_-]+/g, '');
      list = list.filter(log => {
        const m = (log.module || '').toLowerCase().replace(/[\s_-]+/g, '');
        return m.includes(modNorm) || modNorm.includes(m);
      });
    }

    // 2. Filter by Status ('SUCCESS' | 'FAILED')
    if (this.selectedStatus && this.selectedStatus !== 'All Status') {
      const statUpper = this.selectedStatus.toUpperCase();
      list = list.filter(log => {
        const s = (log.status || '').toUpperCase();
        if (statUpper === 'SUCCESS') {
          return s === 'SUCCESS' || s === 'COMPLETED' || s === 'OK';
        } else if (statUpper === 'FAILED') {
          return s === 'FAILED' || s === 'ERROR';
        }
        return s === statUpper;
      });
    }

    // 3. Search Query: Admin Name, Admin Code, Log ID, Action, IP Address
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter(log => {
        const adminNameMatch = (log.adminName || '').toLowerCase().includes(q);
        const adminCodeMatch = this.getAdminCode(log).toLowerCase().includes(q);
        
        // Log ID match (e.g. "AL001", "1")
        const idFormatted = (log.logId || ('AL' + (log.id < 10 ? '00' + log.id : (log.id < 100 ? '0' + log.id : log.id)))).toLowerCase();
        const logIdMatch = idFormatted.includes(q) || String(log.id).includes(q);

        const actionMatch = (log.action || '').toLowerCase().includes(q);
        const ipMatch = (log.ipAddress || '').toLowerCase().includes(q);

        return adminNameMatch || adminCodeMatch || logIdMatch || actionMatch || ipMatch;
      });
    }

    this.filteredLogs = list;
    this.totalElements = list.length;
    this.totalPages = Math.ceil(this.totalElements / this.pageSize) || 1;

    if (this.currentPage >= this.totalPages) {
      this.currentPage = 0;
    }

    this.updatePageSlice();
  }

  /** Slices the filtered logs array for the active page */
  updatePageSlice() {
    const start = this.currentPage * this.pageSize;
    this.logsList = this.filteredLogs.slice(start, start + this.pageSize);
  }

  onSearchClick() {
    this.currentPage = 0;
    this.applyFrontendFilters();
  }

  onSearchInput(event?: any) {
    this.currentPage = 0;
    this.applyFrontendFilters();
  }

  onSearchClear() {
    this.clearSearch();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.applyFrontendFilters();
  }

  onModuleChange(event?: any) {
    this.currentPage = 0;
    this.applyFrontendFilters();
  }

  onStatusChange(event?: any) {
    this.currentPage = 0;
    this.applyFrontendFilters();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.updatePageSlice();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  getAdminCode(log: any): string {
    if (log.adminCode) return log.adminCode;
    if (log.adminId) return log.adminId;
    const num = log.id || 1;
    return 'A' + (num < 10 ? '00' + num : (num < 100 ? '0' + num : num));
  }

  isSuccess(status: string): boolean {
    if (!status) return false;
    const s = status.toUpperCase();
    return s === 'SUCCESS' || s === 'COMPLETED' || s === 'OK';
  }

  getStatusText(status: string): string {
    if (!status) return 'Success';
    const s = status.toUpperCase();
    if (s === 'SUCCESS' || s === 'COMPLETED') return 'Success';
    if (s === 'FAILED' || s === 'ERROR') return 'Failed';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const pad = (n: number) => n.toString().padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      const seconds = pad(d.getSeconds());
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateStr;
    }
  }

  formatModule(module: string): string {
    if (!module) return 'User Management';
    const m = module.trim().toUpperCase().replace(/[\s_-]+/g, '_');
    switch (m) {
      case 'USER_MANAGEMENT':
      case 'USER':
      case 'USERS':
        return 'User Management';
      case 'CONTENT_MANAGEMENT':
      case 'CONTENT':
        return 'Content Management';
      case 'DOCTOR_MANAGEMENT':
      case 'DOCTOR':
      case 'DOCTORS':
        return 'Doctor Management';
      case 'AUTH':
      case 'AUTHENTICATION':
      case 'LOGIN':
        return 'Authentication';
      case 'SETTINGS':
      case 'SYSTEM_SETTINGS':
        return 'System Settings';
      case 'NOTIFICATIONS':
      case 'NOTIFICATION':
        return 'Notifications';
      default:
        return module
          .replace(/[_-]+/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
          .trim();
    }
  }

  formatAction(action: string): string {
    if (!action) return '-';
    let cleaned = action.trim();

    // Mapping known backend codes to concise user-friendly sentences
    const upper = cleaned.toUpperCase().replace(/[\s_-]+/g, '_');
    const knownMap: { [key: string]: string } = {
      'USER_UPDATE': 'Updated user profile',
      'USER_PROFILE_UPDATE': 'Updated user profile',
      'UPDATE_USER_PROFILE': 'Updated user profile',
      'USER_DELETE': 'Deleted user account',
      'USER_CREATE': 'Created new user',
      'USER_PASSWORD_RESET': 'Reset user password',
      'PASSWORD_RESET': 'Reset user password',
      'USER_DATA_EXPORT': 'Exported user data',
      'EXPORT_USER_DATA': 'Exported user data',
      'CONTENT_DELETE': 'Deleted wellness content',
      'DELETE_WELLNESS_CONTENT': 'Deleted wellness content',
      'CONTENT_CREATE': 'Created wellness content',
      'CONTENT_UPDATE': 'Updated wellness content',
      'DOCTOR_APPROVE': 'Approved doctor registration',
      'APPROVE_DOCTOR_REGISTRATION': 'Approved doctor registration',
      'DOCTOR_REGISTRATION_APPROVE': 'Approved doctor registration',
      'LOGIN_FAILED': 'Failed login attempt',
      'FAILED_LOGIN_ATTEMPT': 'Failed login attempt',
      'AUTH_FAILED': 'Failed login attempt',
      'SETTINGS_UPDATE': 'Updated system settings',
      'UPDATE_SYSTEM_SETTINGS': 'Updated system settings',
      'NOTIFICATION_SEND': 'Sent notification to all users',
      'SEND_NOTIFICATION': 'Sent notification to all users'
    };

    if (knownMap[upper]) {
      return knownMap[upper];
    }

    // Strip long SQL / Hibernate / DB exceptions
    if (cleaned.includes('could not execute statement') || cleaned.includes('Duplicate entry') || cleaned.includes('insert into') || cleaned.includes('Exception:')) {
      const parts = cleaned.split(':');
      cleaned = parts[0].trim();
    }
    if (cleaned.includes('\n')) {
      cleaned = cleaned.split('\n')[0].trim();
    }

    // If snake_case or SCREAMING_SNAKE_CASE, convert to readable sentence
    if (/^[A-Z0-9_]+$/.test(cleaned)) {
      cleaned = cleaned
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/^\w/, c => c.toUpperCase());
    }

    // Cap length cleanly if too long
    if (cleaned.length > 38) {
      cleaned = cleaned.substring(0, 35) + '...';
    }

    return cleaned;
  }

  exportLogs(): void {
    const logsToExport = (this.filteredLogs && this.filteredLogs.length > 0) ? this.filteredLogs : this.allLogs;
    if (!logsToExport || logsToExport.length === 0) {
      alert('No logs available to export.');
      return;
    }

    const headers = ['Log ID', 'Admin Name', 'Admin Code', 'Action', 'Module', 'Timestamp', 'IP Address', 'Status'];
    const rows = logsToExport.map(log => [
      log.logId || ('AL' + (log.id < 10 ? '00' + log.id : (log.id < 100 ? '0' + log.id : log.id))),
      `"${(log.adminName || 'Admin User').replace(/"/g, '""')}"`,
      this.getAdminCode(log),
      `"${(log.action || '').replace(/"/g, '""')}"`,
      `"${(log.module || '').replace(/"/g, '""')}"`,
      this.formatDate(log.createdAt),
      log.ipAddress || '192.168.1.1',
      this.getStatusText(log.status)
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- ACTIONS MENU HANDLERS ---
  @HostListener('document:click')
  onDocumentClick(): void {
    this.openDropdownLogId = null;
  }

  toggleDropdown(logId: any, event: Event): void {
    event.stopPropagation();
    this.openDropdownLogId = this.openDropdownLogId === logId ? null : logId;
  }

  viewDetails(log: any, event: Event): void {
    event.stopPropagation();
    this.openDropdownLogId = null;
    this.selectedLogDetails = log;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedLogDetails = null;
  }

  copyLogId(log: any, event: Event): void {
    event.stopPropagation();
    this.openDropdownLogId = null;
    const id = log.logId || ('AL' + (log.id < 10 ? '00' + log.id : (log.id < 100 ? '0' + log.id : log.id)));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(id).then(() => {
        this.showFeedbackToast(`Copied ${id} to clipboard!`);
      }).catch(() => {
        this.showFeedbackToast(`Log ID: ${id}`);
      });
    } else {
      this.showFeedbackToast(`Log ID: ${id}`);
    }
  }

  exportSingleEntry(log: any, event: Event): void {
    event.stopPropagation();
    this.openDropdownLogId = null;
    const id = log.logId || ('AL' + (log.id < 10 ? '00' + log.id : (log.id < 100 ? '0' + log.id : log.id)));
    const logData = {
      logId: id,
      adminName: log.adminName || 'Admin User',
      adminCode: this.getAdminCode(log),
      action: log.action || '',
      module: log.module || '',
      timestamp: this.formatDate(log.createdAt),
      ipAddress: log.ipAddress || '192.168.1.1',
      status: this.getStatusText(log.status)
    };
    const jsonStr = JSON.stringify(logData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_log_${id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showFeedbackToast(`Exported ${id} successfully!`);
  }

  private showFeedbackToast(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }
}
