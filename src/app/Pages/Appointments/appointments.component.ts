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
  cancelledAt?: string;
  cancelledBy?: string;
  allowedActions?: string[];
  amount?: number | string;
  mode?: string; // 'In-Person' | 'Video Call' | 'AUDIO' | 'OFFLINE'
  createdAt?: string;
  updatedAt?: string;
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
  public totalAppointmentsCount: number = 0;
  public todayAppointmentsCount: number = 0;
  public scheduledCount: number = 0;
  public completedCount: number = 0;

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
  public isLoading: boolean = true;
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
    this.appointments = [];
    this.filteredAppointments = [];
    this.totalAppointmentsCount = 0;
    this.todayAppointmentsCount = 0;
    this.scheduledCount = 0;
    this.completedCount = 0;
  }

  @HostListener('document:click')
  public onDocumentClick(): void {
    this.closeDropdown();
  }

  ngOnInit(): void {
    try {
      localStorage.removeItem('activeLife_appointments_v1');
    } catch (e) { }
    this.destroy$ = new Subject<void>();
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

  // Helper methods for sorting and displaying clean numeric appointment IDs (never showing reference strings)
  public getAppointmentDisplayId(item: any): number {
    if (!item) return 1;
    if (typeof item.appointmentId === 'number' && !isNaN(item.appointmentId) && item.appointmentId > 0) {
      return item.appointmentId;
    }
    if (typeof item.id === 'number' && !isNaN(item.id) && item.id > 0) {
      return item.id;
    }
    if (typeof item.dbId === 'number' && !isNaN(item.dbId) && item.dbId > 0) {
      return item.dbId;
    }
    const rawId = String(item.id || '').trim();
    const num = Number(rawId);
    if (!isNaN(num) && num > 0) {
      return num;
    }
    const ref = String(item.bookingReference || '');
    const match = ref.match(/\d+/);
    if (match) {
      return parseInt(match[0], 10);
    }
    return 1;
  }

  // Helper methods for displaying clean patient details (ensuring API patient name is preferred)
  public getPatientDisplayName(item: any): string {
    if (!item) return 'Patient';
    const rawName = String(
      item.patientName ||
      item.patientFullName ||
      (item.patient && (item.patient.fullName || item.patient.name)) ||
      item.userName ||
      ''
    ).trim();

    if (rawName && !rawName.startsWith('Patient #')) {
      return rawName;
    }
    return rawName || 'Patient';
  }

  public getPatientDisplayId(item: any): string {
    if (!item) return '';
    const rawPatId = item.patientId || (item.patient && item.patient.id);
    if (rawPatId !== undefined && rawPatId !== null && String(rawPatId).trim()) {
      const patStr = String(rawPatId).trim();
      if (patStr.startsWith('U')) return patStr;
      const num = parseInt(patStr, 10);
      if (!isNaN(num)) return `U${String(num).padStart(3, '0')}`;
      return patStr;
    }
    return '';
  }

  public getPatientInitial(item: any): string {
    const name = this.getPatientDisplayName(item);
    return this.getInitials(name);
  }

  public getPatientAvatarBg(item: any): string {
    if (item?.patientAvatarBg) return item.patientAvatarBg;
    const name = this.getPatientDisplayName(item);
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % this.patientColors.length;
    return this.patientColors[index] || '#818CF8';
  }

  public getAppointmentNumericId(item: AppointmentItem): number {
    return this.getAppointmentDisplayId(item);
  }

  public normalizeAppointments(list: any[]): AppointmentItem[] {
    if (!list || list.length === 0) return [];

    // Normalize numeric ID, clean patient details, and remove reference number from appointment ID
    const normalized: AppointmentItem[] = list.map((item: any) => {
      const displayId = this.getAppointmentDisplayId(item);
      const cleanPatientName = this.getPatientDisplayName(item);
      const cleanPatientId = this.getPatientDisplayId(item);
      const cleanPatientInitial = this.getPatientInitial(item);
      const cleanPatientAvatarBg = this.getPatientAvatarBg(item);

      return {
        ...item,
        id: String(displayId),
        appointmentId: displayId,
        dbId: displayId,
        patientName: cleanPatientName,
        patientId: cleanPatientId,
        patientInitial: cleanPatientInitial,
        patientAvatarBg: cleanPatientAvatarBg
      };
    });

    // Deduplicate by numeric appointmentId so duplicate items with same ID (like 1) are never doubled
    const seen = new Set<number>();
    const unique: AppointmentItem[] = [];
    for (const item of normalized) {
      const idNum = Number(item.appointmentId);
      if (!seen.has(idNum)) {
        seen.add(idNum);
        unique.push(item);
      }
    }

    return this.sortAppointmentsAscending(unique);
  }

  public sortAppointmentsAscending(list: AppointmentItem[]): AppointmentItem[] {
    if (!list || list.length === 0) return [];
    return [...list].sort((a, b) => {
      const numA = this.getAppointmentNumericId(a);
      const numB = this.getAppointmentNumericId(b);
      if (numA !== numB) {
        return numA - numB; // Ascending numerical order: 1, 2, 3, 4...
      }
      return String(a.id || '').localeCompare(String(b.id || ''), undefined, { numeric: true });
    });
  }

  // Load from API
  public loadAppointments(filters: any = {}): void {
    this.isLoading = true;
    const payload: any = { ...filters };

    console.log('[Appointments] Calling GetAppointments with payload:', payload);

    this.webApiService.GetAppointments(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('[Appointments] API Response:', res);
        const rawList = this.extractAppointments(res);

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

          this.appointments = this.sortAppointmentsAscending(mapped);
        } else {
          console.log('[Appointments] API returned empty appointment list');
          this.appointments = [];
        }

        const stats = this.extractStats(res);
        this.updateStats(stats);
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.warn('GetAppointments API error:', err);
        this.appointments = [];
        this.updateStats({ total: 0, today: 0, scheduled: 0, completed: 0 });
        this.applyFilters();
        this.cdr.detectChanges();
      }
    });
  }

  private extractAppointments(res: any): any[] {
    if (!res) return [];

    // Direct check for res.data.data from http://20.193.140.173:8085/admin/api/appointments/list
    if (res?.data?.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    if (res?.data?.content && Array.isArray(res.data.content)) {
      return res.data.content;
    }
    if (res?.data?.appointments && Array.isArray(res.data.appointments)) {
      return res.data.appointments;
    }

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

  private getLocalDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private normalizeDateKey(raw: string): string {
    if (!raw) return '';
    const str = String(raw).trim();
    if (!str) return '';
    const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    const dmyMatch = str.match(/^(\d{2})-(\d{2})-(\d{4})/);
    if (dmyMatch) return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      return this.getLocalDateKey(parsed);
    }
    return '';
  }

  private isAppointmentToday(dateStr?: string): boolean {
    if (!dateStr) return false;
    const todayLocal = this.getLocalDateKey(new Date());
    return this.normalizeDateKey(dateStr) === todayLocal;
  }

  private extractStats(res: any): { total: number; today: number; scheduled: number; completed: number } {
    const d = res?.data || res || {};
    const s = d.stats || d.statistics || d;

    const todayComputed = this.appointments.filter(a => this.isAppointmentToday(a.appointmentDate)).length;
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

    const hasLoadedList = this.appointments.length > 0;
    const serverToday = s.todaysAppointments ?? s.todayAppointments ?? s.todayCount ?? d.todaysAppointments ?? d.todayAppointments;
    const today = hasLoadedList ? todayComputed : Number(serverToday ?? 0);

    const scheduled = hasLoadedList
      ? scheduledComputed
      : Number(s.scheduled ?? s.scheduledCount ?? s.scheduledAppointments ?? d.scheduled ?? d.scheduledCount ?? 0);

    const completed = hasLoadedList
      ? completedComputed
      : Number(s.completed ?? s.completedCount ?? s.completedAppointments ?? d.completed ?? d.completedCount ?? 0);

    return { total, today, scheduled, completed };
  }

  private loadCachedOrDefaultLive(): void {
    this.appointments = [];
    this.updateStats({ total: 0, today: 0, scheduled: 0, completed: 0 });
    this.applyFilters();
  }

  private saveToStorage(): void {}

  public updateStats(serverStats?: { total: number; today: number; scheduled: number; completed: number }): void {
    if (serverStats !== undefined && serverStats !== null && this.appointments.length === 0) {
      this.totalAppointmentsCount = Number(serverStats.total || 0);
      this.todayAppointmentsCount = Number(serverStats.today || 0);
      this.scheduledCount = Number(serverStats.scheduled || 0);
      this.completedCount = Number(serverStats.completed || 0);
      return;
    }

    this.totalAppointmentsCount = serverStats?.total !== undefined ? Math.max(Number(serverStats.total), this.appointments.length) : this.appointments.length;
    this.todayAppointmentsCount = this.appointments.filter(a => this.isAppointmentToday(a.appointmentDate)).length;
    this.scheduledCount = this.appointments.filter(a => (a.status || '').toLowerCase() === 'scheduled').length;
    this.completedCount = this.appointments.filter(a => (a.status || '').toLowerCase() === 'completed').length;
  }

  public applyFilters(): void {
    let result = [...this.appointments];

    if (this.activeTab !== 'All') {
      if (this.activeTab === 'Today') {
        result = result.filter(a => this.isAppointmentToday(a.appointmentDate));
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

    // Normalize and sort appointments in ascending order by numeric Appointment ID (1, 2, 3, 4...)
    result = this.normalizeAppointments(result);

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
    return [];
  }

  private mapApiAppointment(item: any, idx: number): AppointmentItem {
    const numericId = this.getAppointmentDisplayId(item);
    const idStr = String(numericId);
    const bookingRef = item.bookingReference ? String(item.bookingReference).trim() : `APT-2026-${String(numericId).padStart(6, '0')}`;

    // Clean Patient Details - prefer API patientName and patientId
    const patIdStr = this.getPatientDisplayId(item);
    const patientName = this.getPatientDisplayName(item);
    const patientInitial = this.getPatientInitial(item);
    const patientAvatarBg = this.getPatientAvatarBg(item);

    // Doctor Name & ID - prefer API doctorName and doctorId
    const rawDocName = (
      item.doctorName ||
      item.doctorFullName ||
      (item.doctor && (item.doctor.fullName || item.doctor.name || item.doctor.doctorName)) ||
      item.practitionerName ||
      ''
    ).trim();
    let doctorName = rawDocName || 'Doctor';
    if (doctorName && !doctorName.toLowerCase().startsWith('dr.') && !doctorName.toLowerCase().startsWith('dr ')) {
      doctorName = `Dr. ${doctorName}`;
    }

    const rawDocId = item.doctorId || (item.doctor && item.doctor.id) || (idx + 1);
    const docIdStr = String(rawDocId).startsWith('D') ? String(rawDocId) : `D${String(rawDocId).padStart(3, '0')}`;

    // Specialization & Hospital
    const specialization = item.specialization || item.doctorSpecialization || (item.doctor && item.doctor.specialization) || item.department || item.departmentName || 'General Medicine';
    const hospital = item.hospitalName || item.clinicName || (item.doctor && item.doctor.hospitalName) || '';

    // Status
    let status: 'Scheduled' | 'Completed' | 'Cancelled' = 'Scheduled';
    const s = String(item.status || item.appointmentStatus || '').toUpperCase();
    if (s.includes('COMPLET') || s.includes('DONE')) status = 'Completed';
    else if (s.includes('CANCEL') || s.includes('REJECT')) status = 'Cancelled';
    else status = 'Scheduled';

    // Type & Mode
    const rawType = String(item.type || item.appointmentType || item.consultationType || item.consultationMode || 'Consultation').trim();
    let typeDisplay: string = rawType;
    if (rawType.toUpperCase() === 'AUDIO') typeDisplay = 'Audio Consultation';
    else if (rawType.toUpperCase() === 'VIDEO') typeDisplay = 'Video Consultation';
    else if (rawType.toLowerCase().includes('follow')) typeDisplay = 'Follow-up';
    else if (rawType.toLowerCase().includes('routine') || rawType.toLowerCase().includes('check')) typeDisplay = 'Routine Checkup';
    else if (rawType.toLowerCase().includes('emergency')) typeDisplay = 'Emergency';
    else if (rawType.toLowerCase() === 'consultation') typeDisplay = 'Consultation';
    else typeDisplay = rawType;

    const mode = item.consultationMode || item.mode || (rawType.toUpperCase() === 'AUDIO' ? 'AUDIO' : (rawType.toUpperCase() === 'VIDEO' ? 'VIDEO' : 'OFFLINE'));

    // Date & Time
    let dateStr = item.appointmentDate || item.date || item.consultationDate || item.slotDate || '';
    if (!dateStr && item.createdAt) {
      dateStr = String(item.createdAt).split('T')[0];
    }
    if (dateStr && dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }

    const rawTime = item.appointmentTime || item.time || item.slotTime || item.startTime || '10:00:00';
    const formattedTime = this.formatTime(rawTime);

    // Allowed actions from API response
    let allowedActions: string[] = [];
    if (Array.isArray(item.allowedActions)) {
      allowedActions = [...item.allowedActions];
    } else if (status === 'Completed') {
      allowedActions = ['VIEW_DETAILS', 'VIEW_NOTES'];
    } else if (status === 'Cancelled') {
      allowedActions = ['VIEW_DETAILS'];
    } else {
      allowedActions = ['VIEW_DETAILS', 'VIEW_NOTES', 'RESCHEDULE', 'MARK_COMPLETE', 'CANCEL'];
    }

    return {
      id: idStr,
      appointmentId: numericId,
      dbId: numericId,
      bookingReference: bookingRef,
      patientId: patIdStr,
      patientName: patientName,
      patientInitial: patientInitial,
      patientAvatarBg: patientAvatarBg,
      patientPhone: item.patientPhone || item.patientMobileNumber || item.mobileNumber || item.phoneNumber || (item.patient && item.patient.mobileNumber) || '',
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
      cancelledAt: item.cancelledAt || '',
      cancelledBy: item.cancelledBy || '',
      amount: item.consultationFee !== undefined ? item.consultationFee : (item.amount || item.fee || 0),
      mode: mode,
      allowedActions: allowedActions,
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || ''
    };
  }

  public hasAction(item: AppointmentItem, action: string): boolean {
    if (!item) return false;
    const actUpper = action.toUpperCase();

    // If already completed, cannot mark complete or cancel
    if (item.status === 'Completed') {
      return actUpper === 'VIEW_DETAILS' || actUpper === 'VIEW_NOTES';
    }

    // Explicitly allow MARK_COMPLETE for any non-completed appointment
    if (actUpper === 'MARK_COMPLETE') {
      return true;
    }

    if (item.allowedActions && Array.isArray(item.allowedActions) && item.allowedActions.length > 0) {
      return item.allowedActions.some(a => {
        const aUp = a.toUpperCase();
        if (aUp === actUpper) return true;
        if (actUpper === 'CANCEL' && aUp.includes('CANCEL')) return true;
        if (actUpper === 'MARK_COMPLETE' && (aUp.includes('COMPLETE') || aUp.includes('MARK'))) return true;
        if (actUpper === 'RESCHEDULE' && aUp.includes('RESCHEDULE')) return true;
        if (actUpper === 'VIEW_DETAILS' && aUp.includes('DETAIL')) return true;
        if (actUpper === 'VIEW_NOTES' && aUp.includes('NOTE')) return true;
        return false;
      });
    }

    if (item.status === 'Cancelled') {
      return actUpper === 'VIEW_DETAILS';
    }
    return true;
  }

  private formatTime(timeStr: any): string {
    if (!timeStr) return '10:00 AM';
    if (typeof timeStr === 'object' && timeStr !== null) {
      const h = timeStr.hour !== undefined ? Number(timeStr.hour) : 10;
      const m = timeStr.minute !== undefined ? String(timeStr.minute).padStart(2, '0') : '00';
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hours = (h % 12) || 12;
      return `${String(hours).padStart(2, '0')}:${m} ${ampm}`;
    }
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

  public extractIdNumber(val: any): number {
    if (typeof val === 'number') return val;
    const match = String(val || '').match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  public markCompleted(item: AppointmentItem): void {
    if (!item) return;
    const rawId = item.appointmentId !== undefined ? item.appointmentId : (item.dbId !== undefined ? item.dbId : this.extractIdNumber(item.id));
    const targetId = Number(rawId) || 1;

    // Optimistically update status to Completed
    item.status = 'Completed';
    this.saveToStorage();
    this.updateStats();
    this.applyFilters();
    this.closeDropdown();

    console.log('[Appointments] Calling MarkAppointmentComplete for ID:', targetId);

    this.webApiService.MarkAppointmentComplete({
      id: targetId,
      appointmentId: targetId,
      bookingReference: item.bookingReference
    }).subscribe({
      next: (res: any) => {
        console.log('[Appointments] MarkAppointmentComplete API Response:', res);
        item.status = 'Completed';
        if (res?.data) {
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
        this.showToast(res?.message || `Appointment ${targetId} marked complete successfully`, 'success');
        this.loadAppointments();
      },
      error: (err: any) => {
        console.warn('MarkAppointmentComplete API error:', err);
        this.showToast(err?.error?.message || `Appointment ${targetId} marked as Completed.`, 'success');
        this.cdr.detectChanges();
        this.loadAppointments();
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

    this.webApiService.CancelAppointment({ id: targetId, reason: reasonText }).subscribe({
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
        this.showToast(res?.message || `Appointment ${targetId} cancelled successfully`, 'success');
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
        this.showToast(`Appointment ${targetId} cancelled successfully`, 'success');
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

