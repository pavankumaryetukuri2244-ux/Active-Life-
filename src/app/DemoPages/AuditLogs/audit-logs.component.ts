import { Component, OnInit, HostListener } from '@angular/core';
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
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      height: 100% !important;
    }
    .al-stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05) !important;
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
      left: 16px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      color: #9CA3AF !important;
      pointer-events: none !important;
    }

    .al-search-input {
      width: 100% !important;
      height: 44px !important;
      padding-left: 46px !important;
      padding-right: 16px !important;
      border: 1px solid #E5E7EB !important;
      border-radius: 12px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      color: #111827 !important;
      background-color: #FFFFFF !important;
      outline: none !important;
      transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
    }

    .al-search-input:focus {
      border-color: #3B82F6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }

    .al-search-input::placeholder {
      color: #9CA3AF !important;
    }

    .al-select-dropdown {
      height: 42px !important;
      padding: 0 16px !important;
      border: 1px solid #E5E7EB !important;
      border-radius: 10px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 500 !important;
      color: #374151 !important;
      background-color: #FFFFFF !important;
      outline: none !important;
      cursor: pointer !important;
      transition: border-color 0.15s ease !important;
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
      min-width: 250px;
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
      max-width: 300px;
      width: 280px;
    }

    .al-action-text {
      font-size: 13.5px !important;
      font-weight: 400 !important;
      color: #475569 !important;
      line-height: 1.4 !important;
      display: block !important;
      max-width: 280px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      cursor: default;
    }

    /* Module Pill */
    .al-module-pill {
      display: inline-flex !important;
      align-items: center !important;
      background: #F8FAFC !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 8px !important;
      padding: 4px 12px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      color: #334155 !important;
      white-space: nowrap !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02) !important;
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
  selectedModule = '';
  selectedStatus = '';
  sortBy = 'createdAt';
  sortDirection = 'DESC';

  // Filter timer (debounce search)
  private filterTimer: any;

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

  constructor(private api: WebapiService) {}

  ngOnInit() {
    this.loadAuditLogs();
  }

  /** Initial load — empty body to get all logs + stats */
  loadAuditLogs() {
    this.isLoading = true;
    this.errorMessage = '';
    this.api.GetAuditLogs().subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.stats = {
            totalLogs: res.data.totalLogs ?? 0,
            todayActivity: res.data.todayActivity ?? 0,
            failedActions: res.data.failedActions ?? 0,
            activeAdmins: res.data.activeAdmins ?? 0
          };
          const pageData = res.data.logs;
          this.logsList = pageData?.content ?? [];
          this.totalElements = pageData?.totalElements ?? 0;
          this.totalPages = pageData?.totalPages ?? 0;
          this.currentPage = pageData?.pageable?.pageNumber ?? 0;
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Audit logs API error:', err);
        this.errorMessage = 'Failed to load audit logs. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /** Filter/search/paginate call */
  applyFilters(showLoader = true) {
    if (showLoader) {
      this.isLoading = true;
    }
    this.errorMessage = '';

    const body: any = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };

    if (this.searchQuery.trim()) body['search'] = this.searchQuery.trim();
    if (this.selectedModule && this.selectedModule !== 'All Modules') body['module'] = this.selectedModule;
    if (this.selectedStatus && this.selectedStatus !== 'All Status') body['status'] = this.selectedStatus;

    this.api.GetAuditLogsFiltered(body).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.stats = {
            totalLogs: res.data.totalLogs ?? this.stats.totalLogs,
            todayActivity: res.data.todayActivity ?? this.stats.todayActivity,
            failedActions: res.data.failedActions ?? this.stats.failedActions,
            activeAdmins: res.data.activeAdmins ?? this.stats.activeAdmins
          };
          const pageData = res.data.logs;
          this.logsList = pageData?.content ?? [];
          this.totalElements = pageData?.totalElements ?? 0;
          this.totalPages = pageData?.totalPages ?? 0;
          this.currentPage = pageData?.pageable?.pageNumber ?? 0;
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Audit logs filter error:', err);
        this.errorMessage = 'Failed to apply filters. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.currentPage = 0;
    clearTimeout(this.filterTimer);
    this.filterTimer = setTimeout(() => this.applyFilters(false), 400);
  }

  onModuleChange(event: any) {
    this.selectedModule = event.target.value;
    this.currentPage = 0;
    this.applyFilters(false);
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    this.currentPage = 0;
    this.applyFilters(false);
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.applyFilters(false);
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

  formatAction(action: string): string {
    if (!action) return '-';
    let cleaned = action.trim();
    if (cleaned.includes('could not execute statement') || cleaned.includes('Duplicate entry') || cleaned.includes('insert into')) {
      const parts = cleaned.split(':');
      if (parts.length > 0 && parts[0].trim()) {
        return parts[0].trim();
      }
    }
    if (cleaned.includes('\n')) {
      cleaned = cleaned.split('\n')[0].trim();
    }
    return cleaned;
  }

  exportLogs(): void {
    if (!this.logsList || this.logsList.length === 0) {
      alert('No logs available to export.');
      return;
    }

    const headers = ['Log ID', 'Admin Name', 'Admin Code', 'Action', 'Module', 'Timestamp', 'IP Address', 'Status'];
    const rows = this.logsList.map(log => [
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
