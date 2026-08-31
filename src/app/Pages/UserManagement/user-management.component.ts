import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WebapiService } from '../../services/webapi.service';

interface User {
  id: string;
  fullName: string | null;
  email: string | null;
  contact: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  familyMembersCount: number;
  created: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  blockedUsers: number;
}

// Avatar gradient palette
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
  'linear-gradient(135deg, #60A5FA 0%, #6366F1 100%)',
  'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
  'linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)',
  'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
  'linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)'
];

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  standalone: false
})
export class UserManagementComponent implements OnInit, OnDestroy {

  stats: UserStats = { totalUsers: 0, activeUsers: 0, inactiveUsers: 0, blockedUsers: 0 };

  usersList: User[] = [];
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Filters
  searchQuery = '';
  activeTab: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED' = 'ALL';
  sortBy = 'id';
  sortDirection = 'ASC';

  openDropdownId: string | null = null;

  private searchSubject = new Subject<string>();
  private usersSubscription?: Subscription;
  private destroy$ = new Subject<void>();

  constructor(private api: WebapiService) {
    // Close dropdown when clicking outside
    document.addEventListener('click', () => this.closeDropdown());
  }

  toggleDropdown(userId: string, event: Event) {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === userId ? null : userId;
  }

  closeDropdown() {
    this.openDropdownId = null;
  }

  onAction(action: string, user: User) {
    console.log(`Action: ${action} on User ID: ${user.id}`);
    if (action === 'inactive' || action === 'block' || action === 'blocked') {
      const apiAction = action === 'block' ? 'blocked' : action;
      this.isLoading = true;
      this.api.UpdateUserStatus(Number(user.id), apiAction).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.applyFilters();
          } else {
            this.errorMessage = res?.message || 'Failed to update user status.';
            this.isLoading = false;
          }
        },
        error: (err: any) => {
          console.error('Update status error:', err);
          this.errorMessage = 'Failed to update user status. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.usersSubscription?.unsubscribe();
  }

  loadUsers() {
    this.applyFilters(true);
  }

  private searchTimer: any;

  onSearchClick() {
    this.currentPage = 0;
    this.applyFilters(true);
  }

  onSearchInput(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.currentPage = 0;
      this.applyFilters(true);
    }, 350);
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.applyFilters(true);
  }

  /** Filter/search/paginate call - cancels any in-flight requests */
  applyFilters(showLoader = true) {
    if (showLoader) {
      this.isLoading = true;
    }
    this.errorMessage = '';

    // Cancel previous in-flight request if still running
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }

    const body: any = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      status: this.activeTab
    };

    if (this.searchQuery && this.searchQuery.trim()) {
      body['search'] = this.searchQuery.trim();
    }

    this.usersSubscription = this.api.GetUsersFiltered(body).subscribe({
      next: (res: any) => {
        this.handleResponse(res);
      },
      error: (err: any) => {
        console.error('Users filter error:', err);
        this.errorMessage = 'Failed to apply filters. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private handleResponse(res: any) {
    if (res?.success) {
      const d = res.data;
      this.stats = {
        totalUsers: d.statistics?.totalUsers ?? 0,
        activeUsers: d.statistics?.activeUsers ?? 0,
        inactiveUsers: d.statistics?.inactiveUsers ?? 0,
        blockedUsers: d.statistics?.blockedUsers ?? 0
      };
      const pageData = d.users;
      const rawContent = pageData?.content ?? [];
      this.usersList = [...rawContent].sort((a: any, b: any) => {
        const idA = Number(a.id) || 0;
        const idB = Number(b.id) || 0;
        return idA - idB;
      });
      this.totalElements = pageData?.totalElements ?? 0;
      this.totalPages = pageData?.totalPages ?? 0;
      this.currentPage = pageData?.pageable?.pageNumber ?? 0;
    }
    this.isLoading = false;
  }

  setTab(tab: 'ALL' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED') {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.currentPage = 0;
    this.applyFilters(true);
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.applyFilters(true);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  /** Generate avatar initials from fullName or contact */
  getInitials(user: User): string {
    if (user.fullName) {
      const parts = user.fullName.trim().split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    }
    return 'U';
  }

  /** Cycle avatar gradient by user index */
  getAvatarGradient(index: number): string {
    return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    return dateStr.split('T')[0];
  }

  formatUserId(id: string): string {
    const num = Number(id);
    if (isNaN(num)) return id;
    return 'U' + id.padStart(3, '0');
  }

  formatContact(contact: string): string {
    if (!contact) return '-';
    // strip leading country code digits if 12+ digits (e.g. 91XXXXXXXXXX → +91 XXXXX XXXXX)
    if (contact.length >= 12 && contact.startsWith('91')) {
      const num = contact.slice(2);
      return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
    }
    return contact;
  }

  getStatusStyle(status: string) {
    switch (status) {
      case 'ACTIVE':   return { bg: '#DCFCE7', color: '#16A34A', class: 'um-status-active' };
      case 'INACTIVE': return { bg: '#FEF3C7', color: '#D97706', class: 'um-status-inactive' };
      case 'BLOCKED':  return { bg: '#FEE2E2', color: '#DC2626', class: 'um-status-blocked' };
      default:         return { bg: '#F1F5F9', color: '#64748B', class: '' };
    }
  }
}
