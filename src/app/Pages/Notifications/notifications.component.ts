import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { WebapiService } from '../../services/webapi.service';

export interface NotificationItem {
  id: string; // e.g. 'N-001'
  title: string;
  message: string;
  description?: string;
  image?: string;
  category?: 'Reminder' | 'Announcement' | 'Alert' | 'Health Tip' | 'System';
  audience?: string;
  channel?: string;
  date: string;
  time?: string;
  status: 'Sent' | 'Scheduled' | 'Draft';
  iconColor?: string;
  recipientsCount?: number;
}

export interface TargetAudienceOption {
  code: string;
  label: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  standalone: false,
  styles: [`
    .nt-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0F172A;
    }

    /* Page Header */
    .nt-page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .nt-title-wrap {
      text-align: left;
    }

    .nt-page-title {
      font-size: 26px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 4px 0;
      letter-spacing: -0.02em;
    }

    .nt-page-subtitle {
      font-size: 14px;
      color: #64748B;
      margin: 0;
      font-weight: 400;
    }

    .nt-btn-create {
      background: linear-gradient(90deg, #FF6838 0%, #EA2E00 100%) !important;
      color: #FFFFFF !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      padding: 10px 22px !important;
      border-radius: 10px !important;
      border: none !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      box-shadow: 0 4px 14px rgba(234, 46, 0, 0.25) !important;
      transition: all 0.2s ease !important;
      cursor: pointer !important;
    }

    .nt-btn-create:hover {
      box-shadow: 0 6px 18px rgba(234, 46, 0, 0.35) !important;
      transform: translateY(-1px);
    }

    /* 4 Top Stat Cards */
    .nt-stat-card {
      border-radius: 14px !important;
      padding: 20px 24px !important;
      min-height: 104px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      border: 1px solid transparent !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      box-sizing: border-box !important;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .nt-stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
    }

    .nt-stat-card-blue {
      background-color: #F0F6FF !important;
      border-color: #DBEAFE !important;
    }
    .nt-stat-val-blue {
      color: #2563EB !important;
    }

    .nt-stat-card-purple {
      background-color: #FAF5FF !important;
      border-color: #F3E8FF !important;
    }
    .nt-stat-val-purple {
      color: #9333EA !important;
    }

    .nt-stat-card-green {
      background-color: #F0FDF4 !important;
      border-color: #DCFCE7 !important;
    }
    .nt-stat-val-green {
      color: #16A34A !important;
    }

    .nt-stat-card-amber {
      background-color: #FFFBEB !important;
      border-color: #FEF3C7 !important;
    }
    .nt-stat-val-amber {
      color: #EA580C !important;
    }

    .nt-stat-label {
      font-size: 13.5px !important;
      font-weight: 500 !important;
      color: #64748B !important;
      margin-bottom: 6px !important;
      display: block !important;
    }

    .nt-stat-number {
      font-size: 28px !important;
      font-weight: 700 !important;
      line-height: 1.1 !important;
      margin: 0 !important;
      letter-spacing: -0.5px !important;
    }

    .nt-stat-icon-wrap {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* Quick Send Card */
    .nt-quick-send-card {
      background: #FFFBF7 !important;
      border: 1px solid #FFE4D6 !important;
      border-radius: 16px !important;
      padding: 22px 26px !important;
      margin-bottom: 28px !important;
      box-shadow: 0 1px 4px rgba(255, 104, 56, 0.05) !important;
    }

    .nt-section-title {
      font-size: 17px !important;
      font-weight: 700 !important;
      color: #0F172A !important;
      margin: 0 0 16px 0 !important;
      letter-spacing: -0.01em;
    }

    .nt-input, .nt-select, .nt-textarea {
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 10px !important;
      padding: 12px 16px !important;
      font-size: 14px !important;
      color: #0F172A !important;
      width: 100% !important;
      outline: none !important;
      transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
      font-family: inherit !important;
    }

    .nt-input:focus, .nt-select:focus, .nt-textarea:focus {
      border-color: #FF6838 !important;
      box-shadow: 0 0 0 3px rgba(255, 104, 56, 0.12) !important;
    }

    .nt-input::placeholder, .nt-textarea::placeholder {
      color: #94A3B8 !important;
      font-weight: 400 !important;
    }

    .nt-btn-send-now {
      background: linear-gradient(90deg, #FF6838 0%, #EA2E00 100%) !important;
      color: #FFFFFF !important;
      border: none !important;
      border-radius: 10px !important;
      height: 50px !important;
      width: 100% !important;
      font-size: 15px !important;
      font-weight: 600 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 10px !important;
      cursor: pointer !important;
      box-shadow: 0 4px 14px rgba(234, 46, 0, 0.25) !important;
      transition: all 0.2s ease !important;
    }

    .nt-btn-send-now:hover {
      box-shadow: 0 6px 18px rgba(234, 46, 0, 0.35) !important;
      transform: translateY(-1px);
    }

    .nt-btn-send-now:disabled {
      opacity: 0.6 !important;
      cursor: not-allowed !important;
      transform: none !important;
    }

    /* Recent Notifications Section */
    .nt-recent-section {
      margin-top: 10px;
    }

    .nt-recent-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .nt-filter-pill-group {
      display: flex;
      background: #F1F5F9;
      padding: 4px;
      border-radius: 10px;
      gap: 4px;
    }

    .nt-filter-pill {
      border: none;
      background: transparent;
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 600;
      color: #64748B;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .nt-filter-pill.active {
      background: #0F172A;
      color: #FFFFFF;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    /* Notification Item Card */
    .nt-item-card {
      background: #FFFFFF !important;
      border: 1px solid #F1F5F9 !important;
      border-radius: 14px !important;
      padding: 18px 22px !important;
      margin-bottom: 12px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 18px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      transition: all 0.15s ease !important;
      cursor: pointer;
    }

    .nt-item-card:hover {
      border-color: #E2E8F0 !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04) !important;
      transform: translateY(-1px);
    }

    .nt-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #FF7844 0%, #EA2E00 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #FFFFFF;
      box-shadow: 0 3px 8px rgba(234, 46, 0, 0.22);
    }

    .nt-item-main {
      flex: 1 1 auto;
      min-width: 0;
    }

    .nt-item-title {
      font-size: 15.5px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 3px 0;
      letter-spacing: -0.01em;
    }

    .nt-item-msg {
      font-size: 13.5px;
      color: #64748B;
      margin: 0 0 8px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .nt-meta-row {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .nt-badge-type {
      background: #F1F5F9;
      color: #475569;
      font-size: 11.5px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 6px;
      letter-spacing: 0.01em;
    }

    .nt-meta-text {
      font-size: 12.5px;
      color: #64748B;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .nt-status-pill {
      font-size: 12px;
      font-weight: 600;
      padding: 5px 16px;
      border-radius: 20px;
      display: inline-block;
      text-align: center;
      white-space: nowrap;
    }

    .nt-status-sent {
      background: #DCFCE7;
      color: #16A34A;
    }

    .nt-status-scheduled {
      background: #F3E8FF;
      color: #9333EA;
    }

    .nt-action-btn {
      background: transparent;
      border: 1px solid transparent;
      border-radius: 8px;
      color: #94A3B8;
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .nt-action-btn:hover {
      background: #F1F5F9;
      color: #0F172A;
    }

    /* Modal Styling */
    .nt-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(4px);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .nt-modal-dialog {
      background: #FFFFFF;
      border-radius: 18px;
      width: 100%;
      max-width: 580px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
      animation: modalFadeIn 0.2s ease-out;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }

    .nt-modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nt-modal-title {
      font-size: 18px;
      font-weight: 700;
      color: #0F172A;
      margin: 0;
    }

    .nt-modal-body {
      padding: 24px;
    }

    .nt-modal-footer {
      padding: 16px 24px;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: #FAFAFA;
      border-radius: 0 0 18px 18px;
    }

    .nt-form-group {
      margin-bottom: 18px;
    }

    .nt-form-label {
      font-size: 13.5px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 6px;
      display: block;
    }

    @keyframes ntSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .nt-spin {
      animation: ntSpin 1s linear infinite;
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  // Stat counters bound to API stats
  stats = {
    totalSent: 0,
    scheduled: 0,
    recipients: 0,
    delivered: '0'
  };

  isLoading: boolean = false;
  apiError: string = '';

  // Quick Send Form Model
  quickTitle: string = '';
  quickMessage: string = '';
  quickAudience: string = '';

  // Filter & Search
  selectedFilter: 'All' | 'Sent' = 'All';
  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  // Dropdown state
  openDropdownId: string | null = null;

  // Modals state
  isCreateModalOpen: boolean = false;
  isDetailsModalOpen: boolean = false;
  selectedNotification: NotificationItem | null = null;

  isSubmitting: boolean = false;

  // Master Data Target Audiences
  targetAudiences: TargetAudienceOption[] = [
    { code: 'ALL_USERS', label: 'All Users' },
    { code: 'ACTIVE_USERS', label: 'Active Users Only' },
    { code: 'PREGNANT_WOMEN', label: 'Pregnant Women' },
    { code: 'PARENTS_WITH_KIDS', label: 'Parents with Kids' },
    { code: 'ACTIVE_DOCTORS', label: 'Active Doctors' }
  ];
  isLoadingAudiences: boolean = false;

  // New Notification Form Model
  newNotification = {
    title: '',
    message: '',
    targetAudience: 'ALL_USERS',
    description: '',
    image: ''
  };

  // Toast
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  // Notification items list
  notifications: NotificationItem[] = [];

  constructor(private webApiService: WebapiService) {}

  ngOnInit(): void {
    // Load target audiences from Master Data API
    this.loadTargetAudiences();

    // Load persisted notifications if available as fast initial cache
    const saved = localStorage.getItem('pms_notifications_cache');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.notifications = parsed;
          this.recalculateStats();
        }
      } catch (e) {
        console.error('Failed to parse notifications cache', e);
      }
    }

    this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchQuery = term;
    });

    // Call Notifications API: POST http://20.193.140.173:8085/admin/api/notifications/list with body {}
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  public loadNotifications(filters: any = {}): void {
    this.isLoading = true;
    this.apiError = '';

    const payload = { ...filters };

    this.webApiService.GetNotifications(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.success) {
          // 1. Bind stats from API
          if (res.data?.stats) {
            const s = res.data.stats;
            this.stats = {
              totalSent: s.totalNotifications ?? 0,
              scheduled: s.scheduledCount ?? (Array.isArray(res.data.data) ? res.data.data.filter((item: any) => (item.status || '').toUpperCase() === 'SCHEDULED').length : 0),
              recipients: s.receivedCount ?? 0,
              delivered: s.viewCount !== undefined ? String(s.viewCount) : '0'
            };
          }

          // 2. Bind notification items list from API
          if (res.data && Array.isArray(res.data.data)) {
            this.notifications = res.data.data.map((item: any) => this.mapNotificationFromApi(item));
            if (!res.data.stats?.scheduledCount) {
              this.stats.scheduled = this.notifications.filter(n => n.status === 'Scheduled').length;
            }
            this.saveCache();
          } else if (Array.isArray(res.data)) {
            this.notifications = res.data.map((item: any) => this.mapNotificationFromApi(item));
            this.saveCache();
          }
        } else if (res && Array.isArray(res.data)) {
          this.notifications = res.data.map((item: any) => this.mapNotificationFromApi(item));
          this.saveCache();
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Failed to load notifications from API', err);
        this.apiError = 'Failed to load notifications from server';
      }
    });
  }

  private mapNotificationFromApi(raw: any): NotificationItem {
    const rawId = raw.id ?? raw.notificationId ?? ('N-' + Math.floor(Math.random() * 1000));
    const title = raw.title || raw.notificationTitle || raw.name || 'Notification';
    const message = raw.message || raw.content || raw.body || '';
    const description = raw.description || '';
    const image = raw.image || '';

    // Normalize category
    let category: 'Reminder' | 'Announcement' | 'Alert' | 'Health Tip' | 'System' = 'Announcement';
    const rawCat = (raw.category || raw.type || raw.notificationType || '').toLowerCase();
    if (rawCat.includes('remind')) category = 'Reminder';
    else if (rawCat.includes('announc')) category = 'Announcement';
    else if (rawCat.includes('alert')) category = 'Alert';
    else if (rawCat.includes('health') || rawCat.includes('tip')) category = 'Health Tip';
    else if (rawCat.includes('sys')) category = 'System';

    // Normalize audience
    const audience = raw.audience || raw.targetAudience || raw.targetRole || raw.recipients || 'All Users';

    // Normalize channel
    const channel = raw.channel || raw.notificationChannel || raw.deliveryChannel || 'Push Notification';

    // Normalize date & time
    const rawDate = raw.date || raw.createdAt || raw.createdDate || raw.sendDate || raw.scheduledAt || raw.timestamp;
    let dateStr = new Date().toISOString().split('T')[0];
    let timeStr = '10:00 AM';
    if (rawDate) {
      const parsedDate = new Date(rawDate);
      if (!isNaN(parsedDate.getTime())) {
        dateStr = parsedDate.toISOString().split('T')[0];
        timeStr = parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (typeof rawDate === 'string') {
        dateStr = rawDate.split('T')[0] || rawDate;
      }
    }
    if (raw.time) {
      timeStr = raw.time;
    }

    // Normalize status
    let status: 'Sent' | 'Scheduled' | 'Draft' = 'Sent';
    const rawStatus = (raw.status || raw.notificationStatus || '').toUpperCase();
    if (rawStatus === 'SCHEDULED') {
      status = 'Scheduled';
    } else if (rawStatus === 'DRAFT') {
      status = 'Draft';
    } else {
      status = 'Sent';
    }

    const recipientsCount = raw.recipientsCount ?? raw.totalRecipients ?? raw.receivedCount ?? 0;

    return {
      id: String(rawId).startsWith('N-') ? String(rawId) : `N-${String(rawId).padStart(3, '0')}`,
      title,
      message,
      description,
      image,
      category,
      audience,
      channel,
      date: dateStr,
      time: timeStr,
      status,
      recipientsCount
    };
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  setFilter(filter: 'All' | 'Sent'): void {
    this.selectedFilter = filter;
  }

  get filteredNotifications(): NotificationItem[] {
    return this.notifications.filter(item => {
      const matchesFilter =
        this.selectedFilter === 'All' ? true : item.status === this.selectedFilter;

      const q = this.searchQuery.trim().toLowerCase();
      const matchesSearch = !q
        ? true
        : item.title.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q) ||
          (item.audience || '').toLowerCase().includes(q) ||
          (item.category || '').toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }

  // Dropdown toggles
  toggleDropdown(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  closeDropdown(): void {
    this.openDropdownId = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeDropdown();
  }

  // Quick Send
  sendQuickNotification(): void {
    if (!this.quickTitle.trim()) {
      this.showToast('Please enter a notification title', 'error');
      return;
    }
    if (!this.quickMessage.trim()) {
      this.showToast('Please enter your message', 'error');
      return;
    }

    const audience = this.quickAudience || 'All Users';
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newNotificationItem: NotificationItem = {
      id: 'N-' + String(this.notifications.length + 1).padStart(3, '0'),
      title: this.quickTitle.trim(),
      message: this.quickMessage.trim(),
      category: 'Announcement',
      audience: audience,
      channel: 'Push Notification',
      date: dateStr,
      time: timeStr,
      status: 'Sent',
      recipientsCount: audience === 'All Users' ? 11234 : 450
    };

    const payload: any = {
      title: this.quickTitle.trim(),
      message: this.quickMessage.trim(),
      category: 'Announcement',
      audience: audience,
      channel: 'Push Notification',
      status: 'SENT'
    };

    this.webApiService.CreateNotification(payload).subscribe({
      next: () => {
        this.showToast('Notification sent successfully to ' + audience + '!', 'success');
        this.loadNotifications();
      },
      error: () => {
        this.notifications.unshift(newNotificationItem);
        this.saveCache();
        this.recalculateStats();
        this.showToast('Notification sent locally to ' + audience + '!', 'success');
      }
    });

    // Reset fields
    this.quickTitle = '';
    this.quickMessage = '';
    this.quickAudience = '';
  }

  // Load Master Data Target Audiences
  loadTargetAudiences(): void {
    this.isLoadingAudiences = true;
    this.webApiService.GetTargetAudiences().subscribe({
      next: (res: any) => {
        this.isLoadingAudiences = false;
        console.log('[Notifications] GetTargetAudiences response:', res);
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.targetAudiences = res.data.map((item: any) => ({
            code: item.code || item.label || 'ALL_USERS',
            label: item.label || item.code || 'All Users'
          }));
        }
      },
      error: (err: any) => {
        this.isLoadingAudiences = false;
        console.warn('GetTargetAudiences API failed, using standard master data:', err);
      }
    });
  }

  // Modal open/close
  openCreateModal(): void {
    this.newNotification = {
      title: '',
      message: '',
      targetAudience: this.targetAudiences[0]?.code || 'ALL_USERS',
      description: '',
      image: ''
    };
    this.isSubmitting = false;
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.isSubmitting = false;
  }

  submitCreateModal(): void {
    if (!this.newNotification.title.trim()) {
      this.showToast('Please provide a title for the notification', 'error');
      return;
    }
    if (!this.newNotification.message.trim()) {
      this.showToast('Please provide message content', 'error');
      return;
    }

    const selectedAud = this.targetAudiences.find(
      a => a.code === this.newNotification.targetAudience || a.label === this.newNotification.targetAudience
    );
    const audienceCode = selectedAud ? selectedAud.code : (this.newNotification.targetAudience || 'ALL_USERS');
    const audienceLabel = selectedAud ? selectedAud.label : (this.newNotification.targetAudience || 'All Users');

    const payload = {
      title: this.newNotification.title.trim(),
      message: this.newNotification.message.trim(),
      targetAudience: audienceCode,
      targetAudienceLabel: audienceLabel,
      audience: audienceCode,
      description: this.newNotification.description ? this.newNotification.description.trim() : '',
      image: this.newNotification.image ? this.newNotification.image.trim() : ''
    };

    this.isSubmitting = true;

    this.webApiService.CreateNotification(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res && res.success) {
          const successMsg = res.message || 'Push notification created and sent to active users';
          this.showToast(successMsg, 'success');
          this.closeCreateModal();
          this.loadNotifications();
        } else {
          this.showToast(res?.message || 'Failed to create notification', 'error');
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Error creating notification', err);
        const errMsg = err?.error?.message || err?.message || 'Failed to create notification';
        this.showToast(errMsg, 'error');
      }
    });
  }

  viewDetails(item: NotificationItem, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedNotification = item;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedNotification = null;
  }

  deleteNotification(item: NotificationItem, event: MouseEvent): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete notification "${item.title}"?`)) {
      this.notifications = this.notifications.filter(n => n.id !== item.id);
      this.saveCache();
      this.recalculateStats();
      this.showToast('Notification deleted', 'success');
      if (this.selectedNotification?.id === item.id) {
        this.closeDetailsModal();
      }
    }
  }

  resendNotification(item: NotificationItem, event: MouseEvent): void {
    event.stopPropagation();
    const now = new Date();
    const cloned: NotificationItem = {
      ...item,
      id: 'N-' + String(this.notifications.length + 1).padStart(3, '0'),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Sent'
    };
    this.notifications.unshift(cloned);
    this.saveCache();
    this.recalculateStats();
    this.showToast(`Resent "${item.title}" to ${item.audience}!`, 'success');
  }

  private recalculateStats(): void {
    const sentCount = this.notifications.filter(n => n.status === 'Sent').length;
    const scheduledCount = this.notifications.filter(n => n.status === 'Scheduled').length;
    const recipients = this.notifications.reduce((acc, curr) => acc + (curr.recipientsCount || 0), 0);
    this.stats.totalSent = sentCount;
    this.stats.scheduled = scheduledCount;
    this.stats.recipients = recipients;
    this.stats.delivered = sentCount > 0 ? '100%' : '0';
  }

  private saveCache(): void {
    try {
      localStorage.setItem('pms_notifications_cache', JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  private showToast(msg: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = '';
    }, 3500);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDropdown();
    if (this.isCreateModalOpen) this.closeCreateModal();
    if (this.isDetailsModalOpen) this.closeDetailsModal();
  }
}
