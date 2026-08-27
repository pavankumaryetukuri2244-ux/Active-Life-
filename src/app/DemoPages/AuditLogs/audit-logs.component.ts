import { Component, OnInit } from '@angular/core';
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
  standalone: false
})
export class AuditLogsComponent implements OnInit {

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

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }
}
