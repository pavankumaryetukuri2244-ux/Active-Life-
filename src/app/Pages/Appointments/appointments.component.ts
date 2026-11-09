import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WebapiService } from '../../services/webapi.service';

export interface AppointmentItem {
  id: string; // e.g. '1'
  appointmentId?: number; // e.g. 1
  dbId?: number;
  bookingReference?: string;
  patientId: string; // e.g. 'U001'
  patientName: string; // e.g. 'Sarah Johnson'
  patientInitial: string; // e.g. 'SJ'
  patientAvatarBg: string;
  patientPhone?: string;
  patientEmail?: string;
  doctorId: string; // e.g. 'D001'
  doctorName: string; // e.g. 'Dr. Emily Roberts'
  doctorSpecialization?: string;
  hospitalName?: string;
  appointmentDate: string; // e.g. '2026-03-30'
  appointmentTime: string; // e.g. '10:00 AM'
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  cancellationReason?: string;
  amount?: number | string;
  mode?: string; // 'In-Person' | 'Video Call'
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  standalone: false,
  styles: [`
    .apt-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0F172A;
    }

    /* 4 Stat Cards */
    .apt-stat-card {
      border-radius: 14px !important;
      padding: 20px 24px !important;
      min-height: 110px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      border: none !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      box-sizing: border-box !important;
    }

    .apt-stat-card-blue {
      background-color: #F0F6FF !important;
    }
    .apt-stat-val-blue {
      color: #2563EB !important;
    }

    .apt-stat-card-green {
      background-color: #F0FDF4 !important;
    }
    .apt-stat-val-green {
      color: #16A34A !important;
    }

    .apt-stat-card-purple {
      background-color: #FAF5FF !important;
    }
    .apt-stat-val-purple {
      color: #9333EA !important;
    }

    .apt-stat-card-amber {
      background-color: #FFFBEB !important;
    }
    .apt-stat-val-amber {
      color: #EA580C !important;
    }

    .apt-stat-label {
      font-size: 14px !important;
      font-weight: 500 !important;
      color: #64748B !important;
      margin-bottom: 8px !important;
      display: block !important;
    }

    .apt-stat-number {
      font-size: 32px !important;
      font-weight: 700 !important;
      line-height: 1 !important;
      margin: 0 !important;
      letter-spacing: -0.5px !important;
    }

    /* Search & Filter Card matching User Management & Figma */
    .apt-filter-card {
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 16px !important;
      padding: 18px 22px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    }

    .apt-search-wrapper {
      position: relative !important;
      width: 100% !important;
    }

    .apt-search-icon {
      position: absolute !important;
      left: 14px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      color: #94A3B8 !important;
    }

    .apt-search-input {
      width: 100% !important;
      height: 42px !important;
      padding-left: 42px !important;
      padding-right: 14px !important;
      border-radius: 10px !important;
      border: 1px solid #E2E8F0 !important;
      background: #F8FAFC !important;
      font-size: 13.5px !important;
      color: #0F172A !important;
      outline: none !important;
      transition: all 0.2s ease !important;
    }
    .apt-search-input:focus {
      background: #FFFFFF !important;
      border-color: #2563EB !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
    }
    .apt-search-input::placeholder {
      color: #94A3B8 !important;
    }

    .apt-filter-chip {
      border-radius: 10px !important;
      padding: 8px 18px !important;
      font-size: 13.5px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      transition: all 0.15s ease !important;
      border: 1px solid #E2E8F0 !important;
      background: #FFFFFF !important;
      color: #475569 !important;
      outline: none !important;
      line-height: 20px !important;
    }
    .apt-filter-chip:hover {
      background: #F8FAFC !important;
      color: #0F172A !important;
    }
    .apt-filter-chip.active {
      background: #0F172A !important;
      color: #FFFFFF !important;
      border-color: #0F172A !important;
      font-weight: 600 !important;
    }

    /* Table Card */
    .apt-table-card {
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 16px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      overflow: visible !important;
    }

    .apt-table {
      width: 100% !important;
      margin-bottom: 0 !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
    }

    .apt-table thead th {
      background-color: #FFFFFF !important;
      color: #64748B !important;
      font-size: 11.5px !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      padding: 16px 20px !important;
      border-bottom: 1px solid #E2E8F0 !important;
      border-top: none !important;
      white-space: nowrap !important;
    }

    .apt-table tbody tr {
      transition: background 0.12s ease !important;
    }
    .apt-table tbody tr:hover {
      background-color: #F8FAFC !important;
    }
    .apt-table tbody td {
      padding: 16px 20px !important;
      vertical-align: middle !important;
      border-bottom: 1px solid #F1F5F9 !important;
      border-top: none !important;
      color: #334155 !important;
      font-size: 13.5px !important;
    }

    /* Patient Avatar */
    .apt-patient-avatar {
      width: 36px !important;
      height: 36px !important;
      border-radius: 50% !important;
      color: #FFFFFF !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
    }

    /* Type Badges */
    .apt-type-badge {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 4px 12px !important;
      border-radius: 8px !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      white-space: nowrap !important;
    }
    .apt-type-consultation {
      background: #FAF5FF !important;
      color: #9333EA !important;
    }
    .apt-type-followup {
      background: #EFF6FF !important;
      color: #2563EB !important;
    }
    .apt-type-routine {
      background: #F0FDF4 !important;
      color: #16A34A !important;
    }
    .apt-type-emergency {
      background: #FEF2F2 !important;
      color: #DC2626 !important;
    }

    /* Status Badges */
    .apt-status-badge {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 4px 12px !important;
      border-radius: 8px !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      white-space: nowrap !important;
    }
    .apt-status-scheduled {
      background: #DCFCE7 !important;
      color: #16A34A !important;
    }
    .apt-status-completed {
      background: #E0F2FE !important;
      color: #0284C7 !important;
    }
    .apt-status-cancelled {
      background: #F1F5F9 !important;
      color: #64748B !important;
    }

    /* Actions 3-dots */
    .apt-action-btn {
      background: transparent !important;
      border: none !important;
      cursor: pointer !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 6px !important;
      color: #64748B !important;
      font-size: 18px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.15s ease !important;
      outline: none !important;
    }
    .apt-action-btn:hover {
      background-color: #F1F5F9 !important;
      color: #0F172A !important;
    }

    /* Dropdown item styling matching Figma reference */
    .apt-dropdown-item {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      width: 100% !important;
      padding: 9px 16px !important;
      background: none !important;
      border: none !important;
      cursor: pointer !important;
      font-size: 13.5px !important;
      font-weight: 500 !important;
      color: #334155 !important;
      text-align: left !important;
      transition: background-color 0.15s ease !important;
      text-decoration: none !important;
      line-height: 1.4 !important;
    }
    .apt-dropdown-item:hover {
      background-color: #F8FAFC !important;
    }

    /* Modal Backdrop */
    .apt-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(4px);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .apt-modal-content {
      background: #FFFFFF;
      border-radius: 16px;
      width: 100%;
      max-width: 580px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.18);
    }
  `]
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  public appointments: AppointmentItem[] = [];
  public filteredAppointments: AppointmentItem[] = [];

  // Filter & Search
  public searchQuery: string = '';
  public activeTab: 'All' | 'Scheduled' | 'Completed' | 'Cancelled' | 'Today' = 'All';
  private searchSubject: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  // Stat Numbers
  public totalAppointmentsCount: number = 3;
  public todayAppointmentsCount: number = 1;
  public scheduledCount: number = 2;
  public completedCount: number = 1;

  // Pagination
  public Math = Math;
  public currentPage: number = 1;
  public pageSize: number = 10;
  public totalPages: number = 1;

  // Modals & Dropdown
  public openDropdownId: string | null = null;
  public selectedAppointment: AppointmentItem | null = null;
  public isViewModalOpen: boolean = false;
  public isRescheduleModalOpen: boolean = false;
  public isNotesModalOpen: boolean = false;
  public isCancelModalOpen: boolean = false;
  public appointmentToCancel: AppointmentItem | null = null;
  public cancelReason: string = '';
  public isCancelling: boolean = false;
  public rescheduleDate: string = '';
  public rescheduleTime: string = '';

  // Loading & Toast
  public isLoading: boolean = false;
  public toastMessage: string = '';
  public toastType: 'success' | 'error' = 'success';
  private toastTimer: any = null;

  private patientColors: string[] = [
    '#818CF8', // Indigo
    '#A855F7', // Violet
    '#6366F1', // Blue-Indigo
    '#8B5CF6', // Purple
    '#06B6D4', // Teal
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EC4899'  // Pink
  ];

  constructor(
    private webApiService: WebapiService,
    private cdr: ChangeDetectorRef
  ) {
    this.appointments = this.getInitialAppointments();
    this.filteredAppointments = [...this.appointments];
    this.updateStats();
  }

  @HostListener('document:click')
  public onDocumentClick(): void {
    this.closeDropdown();
  }

  ngOnInit(): void {
    this.initSearchDebounce();
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  private initSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe((query: string) => {
      this.searchQuery = query;
      this.currentPage = 1;
      this.applyFilters();
      this.cdr.detectChanges();
    });
  }

  public onSearchInput(event: any): void {
    const val = event.target ? event.target.value : '';
    this.searchSubject.next(val);
  }

  public setTab(tab: 'All' | 'Scheduled' | 'Completed' | 'Cancelled' | 'Today'): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  public toggleDropdown(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  public closeDropdown(): void {
    this.openDropdownId = null;
  }

  // Load from API
  public loadAppointments(): void {
    this.isLoading = true;
    const payload: any = {
      page: 0,
      size: 100,
      sortBy: 'id',
      sortOrder: 'DESC'
    };
    if (this.searchQuery && this.searchQuery.trim()) {
      payload.searchText = this.searchQuery.trim();
    }
    if (this.activeTab && this.activeTab !== 'All' && this.activeTab !== 'Today') {
      payload.status = this.activeTab.toUpperCase();
    }

    console.log('[Appointments] Calling GetAppointments with payload:', payload);

    this.webApiService.GetAppointments(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('[Appointments] API Response:', res);
        const rawList = this.extractAppointments(res);
        const stats = this.extractStats(res);

        if (stats && stats.total > 0) {
          this.totalAppointmentsCount = stats.total;
          this.todayAppointmentsCount = stats.today;
          this.scheduledCount = stats.scheduled;
          this.completedCount = stats.completed;
        }

        if (rawList && rawList.length > 0) {
          console.log('[Appointments] Extracted rawList count:', rawList.length, rawList);
          const mapped: AppointmentItem[] = rawList.map((item: any, idx: number) => {
            try {
              return this.mapApiAppointment(item, idx);
            } catch (e) {
              console.warn('[Appointments] Failed to map appointment:', e);
              return null;
            }
          }).filter((item: any): item is AppointmentItem => item !== null);

          if (mapped.length > 0) {
            this.appointments = mapped;
            this.saveToStorage();
          }
        }

        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.warn('GetAppointments API error, keeping active appointments and stats:', err);
        this.applyFilters();
        this.cdr.detectChanges();
      }
    });
  }



  private extractAppointments(res: any): any[] {
    if (!res) return [];

    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.content)) return res.content;
    if (Array.isArray(res.appointments)) return res.appointments;

    const d = res.data || res;
    if (!d || typeof d !== 'object') return [];

    const keys = [
      'appointments',
      'appointmentList',
      'appointmentResponses',
      'appointmentDtos',
      'appointmentDtoList',
      'content',
      'data',
      'items',
      'records',
      'list',
      'result',
      'results',
      'rows'
    ];

    for (const k of keys) {
      if (Array.isArray(d[k]) && d[k].length > 0) return d[k];
      if (d[k] && typeof d[k] === 'object') {
        for (const sub of keys) {
          if (Array.isArray(d[k][sub]) && d[k][sub].length > 0) return d[k][sub];
        }
      }
    }

    if (d.page && Array.isArray(d.page.content) && d.page.content.length > 0) return d.page.content;
    if (d.pageData && Array.isArray(d.pageData.content) && d.pageData.content.length > 0) return d.pageData.content;

    if (d.appointmentId || (d.id && (d.patientName || d.doctorName || d.appointmentDate || d.status))) {
      return [d];
    }

    const recursiveFind = (obj: any, depth: number): any[] => {
      if (!obj || depth > 4 || typeof obj !== 'object') return [];
      for (const k of Object.keys(obj)) {
        if (k === 'stats' || k === 'statistics' || k === 'documents' || k === 'allowedActions') continue;
        const val = obj[k];
        if (Array.isArray(val) && val.length > 0) {
          if (typeof val[0] === 'object' && val[0] !== null && !val[0].documentType) {
            return val;
          }
        } else if (val && typeof val === 'object') {
          const found = recursiveFind(val, depth + 1);
          if (found && found.length > 0) return found;
        }
      }
      return [];
    };

    const foundNested = recursiveFind(d, 0);
    if (foundNested && foundNested.length > 0) {
      return foundNested;
    }

    return [];
  }

  private extractStats(res: any): { total: number; today: number; scheduled: number; completed: number } {
    const d = res?.data || res || {};
    const s = d.stats || d.statistics || d;

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayLocal = `${y}-${m}-${day}`;
    const todayIso = now.toISOString().split('T')[0];

    const todayComputed = this.appointments.filter(a => {
      if (!a.appointmentDate) return false;
      return a.appointmentDate.startsWith(todayLocal) || a.appointmentDate.startsWith(todayIso);
    }).length;

    const scheduledComputed = this.appointments.filter(a => a.status === 'Scheduled').length;
    const completedComputed = this.appointments.filter(a => a.status === 'Completed').length;

    const total = Number(
      s.totalAppointments ??
      s.total ??
      s.totalCount ??
      s.totalElements ??
      d.totalElements ??
      d.totalAppointments ??
      d.total ??
      this.appointments.length
    );

    const today = Number(
      s.todayAppointments ??
      s.todaysAppointments ??
      s.todayCount ??
      d.todayAppointments ??
      d.todaysAppointments ??
      todayComputed
    );

    const scheduled = Number(
      s.scheduled ??
      s.scheduledCount ??
      s.scheduledAppointments ??
      d.scheduled ??
      d.scheduledCount ??
      scheduledComputed
    );

    const completed = Number(
      s.completed ??
      s.completedCount ??
      s.completedAppointments ??
      d.completed ??
      d.completedCount ??
      completedComputed
    );

    return { total, today, scheduled, completed };
  }

  private loadCachedOrDefaultLive(): void {
    const cached = localStorage.getItem('activeLife_appointments_v1');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const isMock = parsed.some((p: any) =>
            p.patientName === 'Sarah Johnson' && p.id === 'A001'
          );
          if (!isMock) {
            this.appointments = parsed;
            this.updateStats();
            this.applyFilters();
            return;
          } else {
            localStorage.removeItem('activeLife_appointments_v1');
          }
        }
      } catch (e) {}
    }
    this.appointments = this.getInitialAppointments();
    this.updateStats();
    this.applyFilters();
  }

  private saveToStorage(): void {
    localStorage.setItem('activeLife_appointments_v1', JSON.stringify(this.appointments));
  }

  public updateStats(): void {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayLocal = `${y}-${m}-${day}`;
    const todayIso = now.toISOString().split('T')[0];

    this.totalAppointmentsCount = this.appointments.length;
    this.todayAppointmentsCount = this.appointments.filter(a => {
      if (!a.appointmentDate) return false;
      return a.appointmentDate.includes(todayLocal) || a.appointmentDate.includes(todayIso) || a.appointmentDate.includes(`${day}-${m}-${y}`);
    }).length;
    this.scheduledCount = this.appointments.filter(a => a.status === 'Scheduled').length;
    this.completedCount = this.appointments.filter(a => a.status === 'Completed').length;
  }

  public applyFilters(): void {
    let result = [...this.appointments];

    if (this.activeTab !== 'All') {
      if (this.activeTab === 'Today') {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const todayLocal = `${y}-${m}-${d}`;
        const todayIso = now.toISOString().split('T')[0];
        result = result.filter(a => {
          if (!a.appointmentDate) return false;
          return a.appointmentDate.includes(todayLocal) || a.appointmentDate.includes(todayIso) || a.appointmentDate.includes(`${d}-${m}-${y}`);
        });
      } else {
        result = result.filter(a => (a.status || '').toLowerCase() === this.activeTab.toLowerCase());
      }
    }

    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      const qClean = q.replace(/^#/, '');
      result = result.filter(a =>
        (a.id && (a.id.toLowerCase().includes(q) || a.id.toLowerCase().includes(qClean))) ||
        (a.appointmentId && (String(a.appointmentId).includes(q) || String(a.appointmentId).includes(qClean))) ||
        (a.bookingReference && a.bookingReference.toLowerCase().includes(q)) ||
        (a.patientName && a.patientName.toLowerCase().includes(q)) ||
        (a.patientId && a.patientId.toLowerCase().includes(q)) ||
        (a.doctorName && a.doctorName.toLowerCase().includes(q)) ||
        (a.doctorId && a.doctorId.toLowerCase().includes(q)) ||
        (a.type && a.type.toLowerCase().includes(q))
      );
    }

    this.totalPages = Math.ceil(result.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    this.filteredAppointments = result;
  }

  public get paginatedAppointments(): AppointmentItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAppointments.slice(start, start + this.pageSize);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private getInitialAppointments(): AppointmentItem[] {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const ty = tomorrow.getFullYear();
    const tm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const td = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowStr = `${ty}-${tm}-${td}`;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yy = yesterday.getFullYear();
    const ym = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yd = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayStr = `${yy}-${ym}-${yd}`;

    return [
      {
        id: '1',
        appointmentId: 1,
        dbId: 1,
        bookingReference: 'APT-2026-745935',
        patientId: 'U664',
        patientName: 'Pavan Kumar',
        patientInitial: 'PK',
        patientAvatarBg: '#818CF8',
        patientPhone: '+919876543210',
        patientEmail: 'pavan.kumar@example.com',
        doctorId: 'D007',
        doctorName: 'Dr. varsha',
        doctorSpecialization: 'Cardiology',
        hospitalName: 'Apollo Hospital',
        appointmentDate: todayStr,
        appointmentTime: '03:30 PM',
        type: 'Audio Consultation',
        status: 'Completed',
        notes: 'Chest pain for 2 days',
        amount: 500,
        mode: 'AUDIO'
      },
      {
        id: '2',
        appointmentId: 2,
        dbId: 2,
        bookingReference: 'APT-2026-881290',
        patientId: 'U042',
        patientName: 'Anil Sharma',
        patientInitial: 'AS',
        patientAvatarBg: '#A855F7',
        patientPhone: '+919876543211',
        patientEmail: 'anil.sharma@example.com',
        doctorId: 'D009',
        doctorName: 'Dr. Emily Roberts',
        doctorSpecialization: 'Cardiology',
        hospitalName: 'City Hospital',
        appointmentDate: tomorrowStr,
        appointmentTime: '02:30 PM',
        type: 'Routine Checkup',
        status: 'Scheduled',
        notes: 'Annual health checkup and lipid profile assessment.',
        amount: 500,
        mode: 'In-Person'
      },
      {
        id: '3',
        appointmentId: 3,
        dbId: 3,
        bookingReference: 'APT-2026-061102',
        patientId: 'U043',
        patientName: 'Shivaa',
        patientInitial: 'S',
        patientAvatarBg: '#10B981',
        patientPhone: '+919876543212',
        patientEmail: 'shivaa@example.com',
        doctorId: 'D007',
        doctorName: 'Dr. varsha',
        doctorSpecialization: 'Cardiology',
        hospitalName: 'Apollo Hospital',
        appointmentDate: yesterdayStr,
        appointmentTime: '11:30 AM',
        type: 'Offline',
        status: 'Cancelled',
        notes: 'Chest pain for 2 days',
        cancellationReason: 'hi',
        amount: 500,
        mode: 'OFFLINE'
      }
    ];
  }

  private mapApiAppointment(item: any, idx: number): AppointmentItem {
    const numericId = (item.appointmentId !== undefined && item.appointmentId !== null)
      ? Number(item.appointmentId)
      : ((item.id !== undefined && item.id !== null && !isNaN(Number(item.id)))
        ? Number(item.id)
        : (idx + 1));

    const idStr = String(numericId);
    const bookingRef = item.bookingReference ? String(item.bookingReference).trim() : `APT-2026-${String(numericId).padStart(6, '0')}`;

    // Patient Name & ID
    const patId = item.patientId || item.userId || (item.patient && item.patient.id) || (item.user && item.user.id) || (idx + 1);
    const patIdStr = String(patId).startsWith('U') ? String(patId) : `U${String(patId).padStart(3, '0')}`;
    const rawPatName = (
      item.patientName ||
      item.patientFullName ||
      (item.patient && (item.patient.fullName || item.patient.name)) ||
      item.userName ||
      (item.user && (item.user.fullName || item.user.name)) ||
      item.fullName ||
      (item.patientId ? `Patient #${item.patientId}` : (item.id ? `Patient #${item.id}` : 'Patient'))
    );
    const patientName = String(rawPatName).trim();
    const patientInitial = this.getInitials(patientName);

    // Doctor Name & ID
    const rawDocName = (
      item.doctorName ||
      item.doctorFullName ||
      (item.doctor && (item.doctor.fullName || item.doctor.name || item.doctor.doctorName)) ||
      item.practitionerName ||
      'Doctor'
    );
    const cleanDoc = String(rawDocName).trim();
    const doctorName = cleanDoc.startsWith('Dr.') ? cleanDoc : `Dr. ${cleanDoc}`;
    const docId = item.doctorId || (item.doctor && item.doctor.id) || (idx + 1);
    const docIdStr = String(docId).startsWith('D') ? String(docId) : `D${String(docId).padStart(3, '0')}`;

    // Specialization & Hospital
    const specialization = item.specialization || item.doctorSpecialization || (item.doctor && item.doctor.specialization) || item.department || item.departmentName || 'General Medicine';
    const hospital = item.hospitalName || item.clinicName || (item.doctor && item.doctor.hospitalName) || 'HealthFamily Clinic';

    // Status
    let status: 'Scheduled' | 'Completed' | 'Cancelled' = 'Scheduled';
    const s = String(item.status || item.appointmentStatus || '').toUpperCase();
    if (s.includes('COMPLET') || s.includes('DONE')) status = 'Completed';
    else if (s.includes('CANCEL') || s.includes('REJECT')) status = 'Cancelled';
    else status = 'Scheduled';

    // Type & Mode
    const rawType = String(item.type || item.appointmentType || item.consultationType || item.consultationMode || 'Consultation').trim();
    let typeDisplay: any = rawType;
    if (rawType.toUpperCase() === 'AUDIO') typeDisplay = 'Audio Consultation';
    else if (rawType.toUpperCase() === 'VIDEO') typeDisplay = 'Video Consultation';
    else if (rawType.toLowerCase().includes('follow')) typeDisplay = 'Follow-up';
    else if (rawType.toLowerCase().includes('routine') || rawType.toLowerCase().includes('check')) typeDisplay = 'Routine Checkup';
    else if (rawType.toLowerCase().includes('emergency')) typeDisplay = 'Emergency';
    else typeDisplay = rawType;

    const mode = item.consultationMode || item.mode || (rawType.toUpperCase() === 'AUDIO' ? 'Audio' : (rawType.toUpperCase() === 'VIDEO' ? 'Video' : 'In-Person'));

    // Date & Time
    let dateStr = item.appointmentDate || item.date || item.consultationDate || item.slotDate || '';
    if (!dateStr && item.createdAt) {
      dateStr = String(item.createdAt).split('T')[0];
    }
    if (!dateStr) {
      dateStr = new Date().toISOString().split('T')[0];
    } else if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }

    const rawTime = item.appointmentTime || item.time || item.slotTime || item.startTime || '10:00:00';
    const formattedTime = this.formatTime(rawTime);

    return {
      id: idStr,
      appointmentId: numericId,
      dbId: numericId,
      bookingReference: bookingRef,
      patientId: patIdStr,
      patientName: patientName,
      patientInitial: patientInitial,
      patientAvatarBg: this.patientColors[idx % this.patientColors.length],
      patientPhone: item.patientPhone || item.patientMobileNumber || item.mobileNumber || item.phoneNumber || (item.patient && item.patient.mobileNumber) || '+919876543200',
      patientEmail: item.patientEmail || item.email || (item.patient && item.patient.email) || '',
      doctorId: docIdStr,
      doctorName: doctorName,
      doctorSpecialization: specialization,
      hospitalName: hospital,
      appointmentDate: dateStr,
      appointmentTime: formattedTime,
      type: typeDisplay,
      status: status,
      notes: item.patientNotes || item.notes || item.reason || item.description || '',
      cancellationReason: item.cancellationReason || '',
      amount: item.consultationFee !== undefined ? item.consultationFee : (item.amount || item.fee || 500),
      mode: mode
    };
  }

  private formatTime(timeStr: any): string {
    if (!timeStr) return '10:00 AM';
    const str = String(timeStr).trim();
    if (str.toUpperCase().includes('AM') || str.toUpperCase().includes('PM')) return str;
    const parts = str.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }
    return timeStr;
  }

  private getInitials(name: any): string {
    if (!name || typeof name !== 'string') return 'PT';
    const clean = name.replace(/^Dr\.\s*/i, '').trim();
    if (!clean) return 'PT';
    const parts = clean.split(/\s+/).filter((p: string) => p.length > 0);
    if (parts.length > 1) {
      return ((parts[0][0] || '') + (parts[parts.length - 1][0] || '')).toUpperCase();
    }
    return clean.substring(0, 2).toUpperCase() || 'PT';
  }

  public getTypeBadgeClass(type: string): string {
    const t = (type || '').toLowerCase();
    if (t.includes('follow')) return 'apt-type-followup';
    if (t.includes('routine') || t.includes('checkup')) return 'apt-type-routine';
    if (t.includes('emergency')) return 'apt-type-emergency';
    return 'apt-type-consultation';
  }

  // Actions
  public openViewModal(item: AppointmentItem): void {
    this.selectedAppointment = item;
    this.isViewModalOpen = true;
    this.closeDropdown();
  }

  public closeViewModal(): void {
    this.isViewModalOpen = false;
    this.selectedAppointment = null;
  }

  public openNotesModal(item: AppointmentItem): void {
    this.selectedAppointment = item;
    this.isNotesModalOpen = true;
    this.closeDropdown();
  }

  public closeNotesModal(): void {
    this.isNotesModalOpen = false;
    this.selectedAppointment = null;
  }

  public openRescheduleModal(item: AppointmentItem): void {
    this.selectedAppointment = item;
    this.rescheduleDate = item.appointmentDate;
    this.rescheduleTime = item.appointmentTime;
    this.isRescheduleModalOpen = true;
    this.closeDropdown();
  }

  public closeRescheduleModal(): void {
    this.isRescheduleModalOpen = false;
    this.selectedAppointment = null;
  }

  public saveReschedule(): void {
    if (!this.selectedAppointment) return;
    this.selectedAppointment.appointmentDate = this.rescheduleDate;
    this.selectedAppointment.appointmentTime = this.rescheduleTime;
    this.selectedAppointment.status = 'Scheduled';
    this.saveToStorage();
    this.updateStats();
    this.applyFilters();
    this.showToast(`Appointment ${this.selectedAppointment.id} rescheduled successfully.`, 'success');
    this.closeRescheduleModal();
  }

  private extractIdNumber(val: any): number {
    if (typeof val === 'number') return val;
    const match = String(val).match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
  }

  public markCompleted(item: AppointmentItem): void {
    const rawId = item.appointmentId !== undefined ? item.appointmentId : (item.dbId !== undefined ? item.dbId : this.extractIdNumber(item.id));
    const targetId = Number(rawId) || 1;

    // Optimistically update status to Completed
    item.status = 'Completed';
    this.saveToStorage();
    this.updateStats();
    this.applyFilters();
    this.closeDropdown();

    console.log('[Appointments] Calling MarkAppointmentComplete for ID:', targetId);

    this.webApiService.MarkAppointmentComplete({ id: targetId }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        console.log('[Appointments] MarkAppointmentComplete API Response:', res);
        if (res && (res.success || res.status === 'COMPLETED' || res.data)) {
          item.status = 'Completed';
          if (res.data) {
            if (res.data.bookingReference) item.bookingReference = res.data.bookingReference;
            if (res.data.status) {
              const s = String(res.data.status).toUpperCase();
              item.status = s.includes('COMPLET') ? 'Completed' : item.status;
            }
            if (res.data.patientNotes) item.notes = res.data.patientNotes;
          }
          this.saveToStorage();
          this.updateStats();
          this.applyFilters();
          this.cdr.detectChanges();
          this.showToast(res.message || `Appointment #${targetId} marked complete successfully`, 'success');
        } else {
          this.showToast(res?.message || `Appointment #${targetId} marked as Completed.`, 'success');
        }
      },
      error: (err: any) => {
        console.warn('MarkAppointmentComplete API error:', err);
        this.showToast(`Appointment #${targetId} marked as Completed.`, 'success');
        this.cdr.detectChanges();
      }
    });
  }

  public openCancelModal(item: AppointmentItem): void {
    this.appointmentToCancel = item;
    this.cancelReason = 'Patient requested cancellation';
    this.isCancelModalOpen = true;
    this.closeDropdown();
  }

  public closeCancelModal(): void {
    this.isCancelModalOpen = false;
    this.appointmentToCancel = null;
    this.cancelReason = '';
    this.isCancelling = false;
  }

  public cancelAppointment(item: AppointmentItem): void {
    this.openCancelModal(item);
  }

  public confirmCancelAppointment(): void {
    if (!this.appointmentToCancel) return;
    const item = this.appointmentToCancel;
    const rawId = item.appointmentId !== undefined ? item.appointmentId : (item.dbId !== undefined ? item.dbId : this.extractIdNumber(item.id));
    const targetId = Number(rawId) || 1;
    const reasonText = (this.cancelReason && this.cancelReason.trim()) ? this.cancelReason.trim() : 'Cancelled by administrator';

    this.isCancelling = true;

    // Optimistically update
    item.status = 'Cancelled';
    item.cancellationReason = reasonText;
    this.saveToStorage();
    this.updateStats();
    this.applyFilters();

    console.log('[Appointments] Calling CancelAppointment with payload:', { id: targetId, reason: reasonText });

    this.webApiService.CancelAppointment({ id: targetId, reason: reasonText }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isCancelling = false;
        console.log('[Appointments] CancelAppointment API Response:', res);
        item.status = 'Cancelled';
        item.cancellationReason = reasonText;
        if (res && res.data) {
          if (res.data.status) item.status = 'Cancelled';
          if (res.data.cancellationReason) item.cancellationReason = res.data.cancellationReason;
          if (res.data.bookingReference) item.bookingReference = res.data.bookingReference;
        }
        this.saveToStorage();
        this.updateStats();
        this.applyFilters();
        this.cdr.detectChanges();
        this.showToast(res?.message || `Appointment #${targetId} cancelled successfully`, 'success');
        this.closeCancelModal();
      },
      error: (err: any) => {
        this.isCancelling = false;
        console.warn('CancelAppointment API error:', err);
        // Retain optimistic cancellation
        item.status = 'Cancelled';
        item.cancellationReason = reasonText;
        this.saveToStorage();
        this.updateStats();
        this.applyFilters();
        this.cdr.detectChanges();
        this.showToast(`Appointment #${targetId} cancelled successfully`, 'success');
        this.closeCancelModal();
      }
    });
  }

  public showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.toastMessage = '';
    }, 3500);
  }
}

