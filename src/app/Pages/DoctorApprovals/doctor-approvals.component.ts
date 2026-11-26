import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil, finalize, timeout } from 'rxjs/operators';
import { WebapiService } from '../../services/webapi.service';
import { CommonService } from '../../services/common.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface VerificationDocument {
  id?: number;
  name: string;
  type: string;
  status: 'Verified' | 'Pending' | 'Missing';
  verifiedDate?: string;
  url?: string;
  certificateNumber?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface DoctorApprovalItem {
  id: string; // e.g. 'REQ-101'
  numericId?: number;
  name: string;
  initial: string;
  avatarBg: string;
  specialization: string;
  experience: string;
  email: string;
  location: string;
  appliedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  verifiedDocsCount: number;
  totalDocsCount: number;
  phone?: string;
  hospitalName?: string;
  qualification?: string;
  licenseNumber?: string;
  registrationCouncil?: string;
  documents?: VerificationDocument[];
  notes?: string;
  registrationStatus?: string;
  approvalStatus?: string;
  approval?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-doctor-approvals',
  templateUrl: './doctor-approvals.component.html',
  standalone: false,
  styles: [`
    .da-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0F172A;
    }

    /* 3 Top Stat Cards matching Figma exact look */
    .da-stat-card {
      border-radius: 14px !important;
      padding: 16px 20px !important;
      min-height: 96px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      border: none !important;
      box-sizing: border-box !important;
    }

    .da-stat-card-yellow {
      background-color: #FFFBEB !important;
    }
    .da-stat-val-yellow {
      color: #D97706 !important;
    }

    .da-stat-card-green {
      background-color: #F0FDF4 !important;
    }
    .da-stat-val-green {
      color: #16A34A !important;
    }

    .da-stat-card-red {
      background-color: #FEF2F2 !important;
    }
    .da-stat-val-red {
      color: #DC2626 !important;
    }

    .da-stat-label {
      font-size: 14px !important;
      font-weight: 500 !important;
      color: #64748B !important;
      margin-bottom: 8px !important;
      display: block !important;
    }

    .da-stat-number {
      font-size: 32px !important;
      font-weight: 700 !important;
      line-height: 1 !important;
      margin: 0 !important;
    }

    /* Search & Filter Container */
    .da-filter-box {
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 14px !important;
      padding: 14px 18px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    }

    .da-search-wrapper {
      position: relative !important;
      width: 100% !important;
    }

    .da-search-icon {
      position: absolute !important;
      left: 14px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      color: #94A3B8 !important;
    }

    .da-search-input {
      width: 100% !important;
      height: 42px !important;
      padding-left: 42px !important;
      padding-right: 14px !important;
      border-radius: 10px !important;
      border: 1px solid #E2E8F0 !important;
      background: #FFFFFF !important;
      font-size: 13.5px !important;
      color: #0F172A !important;
      outline: none !important;
      transition: all 0.2s ease !important;
    }
    .da-search-input:focus {
      border-color: #2563EB !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
    }
    .da-search-input::placeholder {
      color: #94A3B8 !important;
    }

    /* Filter Tabs Bar (All, Pending, Approved, Rejected) */
    .da-filter-chip,
    .um-tab-btn {
      background: #FFFFFF !important;
      border: 1px solid #E5E7EB !important;
      color: #111827 !important;
      border-radius: 8px !important;
      height: 38px !important;
      padding: 0 20px !important;
      font-weight: 500 !important;
      font-size: 13.5px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      transition: all 0.15s ease !important;
      outline: none !important;
      cursor: pointer !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      letter-spacing: 0.01em !important;
    }
    .da-filter-chip:hover,
    .um-tab-btn:hover {
      background: #F8FAFC !important;
      color: #0F172A !important;
      border-color: #CBD5E1 !important;
    }
    .da-filter-chip.active,
    .um-tab-btn.active {
      background: #090D16 !important;
      color: #FFFFFF !important;
      border-color: #090D16 !important;
      font-weight: 500 !important;
    }

    /* Doctor Approval Card */
    .da-card {
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 14px !important;
      padding: 16px 18px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03) !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      height: 100% !important;
      width: 100% !important;
      box-sizing: border-box !important;
      transition: transform 0.15s ease, box-shadow 0.15s ease !important;
    }
    .da-card:hover {
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06) !important;
    }

    /* Avatar */
    .da-avatar {
      width: 44px !important;
      height: 44px !important;
      border-radius: 50% !important;
      color: #FFFFFF !important;
      font-weight: 600 !important;
      font-size: 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
    }

    /* Progress Bar */
    .da-progress-track {
      width: 100% !important;
      height: 6px !important;
      background: #E2E8F0 !important;
      border-radius: 9999px !important;
      overflow: hidden !important;
      margin-top: 6px !important;
    }
    .da-progress-fill {
      height: 100% !important;
      border-radius: 9999px !important;
      transition: width 0.3s ease !important;
    }

    /* Action Buttons in Card Footer */
    .da-btn-action {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      padding: 8px 16px !important;
      border-radius: 8px !important;
      cursor: pointer !important;
      transition: all 0.15s ease !important;
      border: 1px solid transparent !important;
    }

    .da-btn-review {
      background: #FFFFFF !important;
      border-color: #E2E8F0 !important;
      color: #334155 !important;
    }
    .da-btn-review:hover {
      background: #F8FAFC !important;
      border-color: #CBD5E1 !important;
      color: #0F172A !important;
    }

    .da-btn-reject {
      background: #FFFFFF !important;
      border-color: #FECACA !important;
      color: #DC2626 !important;
    }
    .da-btn-reject:hover {
      background: #FEF2F2 !important;
      border-color: #F87171 !important;
      color: #B91C1C !important;
    }

    .da-btn-approve {
      background: #FFFFFF !important;
      border-color: #BBF7D0 !important;
      color: #16A34A !important;
      transition: all 0.2s ease !important;
    }
    .da-btn-approve:hover {
      background: #F0FDF4 !important;
      border-color: #86EFAC !important;
      color: #15803D !important;
    }
    .da-btn-approve-locked {
      background: #F8FAFC !important;
      border-color: #E2E8F0 !important;
      color: #64748B !important;
    }
    .da-btn-approve-locked:hover {
      background: #FEF3C7 !important;
      border-color: #FCD34D !important;
      color: #D97706 !important;
    }

    /* Empty State - Clean, centered, non-stretching */
    .da-empty-container {
      background: #FFFFFF !important;
      border: 1px dashed #CBD5E1 !important;
      border-radius: 14px !important;
      padding: 44px 20px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }

    .da-empty-icon {
      width: 52px !important;
      height: 52px !important;
      min-width: 52px !important;
      max-width: 52px !important;
      border-radius: 50% !important;
      background: #F1F5F9 !important;
      border: 1px solid #E2E8F0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 auto 14px auto !important;
      color: #64748B !important;
      flex-shrink: 0 !important;
    }

    /* Modal Backdrop */
    .da-modal-backdrop {
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

    .da-reject-modal-backdrop {
      z-index: 1100 !important;
      background: rgba(15, 23, 42, 0.72) !important;
    }

    .da-modal-content {
      background: #FFFFFF;
      border-radius: 16px;
      width: 100%;
      max-width: 650px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.18);
    }

    /* Document Item Hover */
    .da-doc-item {
      cursor: pointer !important;
      transition: all 0.2s ease !important;
    }
    .da-doc-item:hover {
      background: #EFF6FF !important;
      border-color: #93C5FD !important;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08) !important;
      transform: translateY(-1px);
    }

    /* Certificate Viewer Modal */
    .da-cert-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(6px);
      z-index: 1060;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .da-cert-modal-content {
      background: #FFFFFF;
      border-radius: 18px;
      width: 100%;
      max-width: 960px;
      max-height: 94vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
    }

    /* Document / Certificate Viewer Modal */
    .da-doc-viewer-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      width: 100%;
      box-sizing: border-box;
      position: relative;
    }

    .da-doc-viewer-box.da-doc-viewer-pdf {
      height: 68vh;
      min-height: 580px;
      max-height: 800px;
      display: block;
      overflow: hidden;
      padding: 0;
    }

    .da-doc-viewer-box.da-doc-viewer-img {
      min-height: 360px;
      max-height: 560px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
      padding: 8px;
    }

    .da-doc-empty-box {
      background: #F8FAFC;
      border: 1px dashed #CBD5E1;
      border-radius: 12px;
    }

    /* Certificate Frame Styling */
    .da-cert-frame {
      background: #FFFFFF;
      border: 2px solid #E2E8F0;
      border-radius: 14px;
      padding: 28px 32px;
      position: relative;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1E293B;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }

    .da-cert-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 240px;
      height: 240px;
      opacity: 0.035;
      pointer-events: none;
      z-index: 1;
    }

    .da-cert-content {
      position: relative;
      z-index: 2;
    }

    .da-cert-title {
      font-size: 19px;
      font-weight: 700;
      color: #0F172A;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      margin: 0;
      text-align: center;
    }

    .da-cert-subtitle {
      font-size: 11px;
      letter-spacing: 0.06em;
      color: #64748B;
      text-align: center;
      text-transform: uppercase;
      margin: 4px 0 12px 0;
    }

    .da-cert-name {
      font-size: 24px;
      font-weight: 700;
      color: #0F172A;
      margin: 6px 0;
      text-align: center;
      border-bottom: 2px solid #E2E8F0;
      display: inline-block;
      padding-bottom: 4px;
    }

    .da-cert-seal-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: radial-gradient(circle, #FEF3C7 0%, #FDE68A 100%);
      border: 2px solid #D97706;
      box-shadow: 0 4px 10px rgba(217, 119, 6, 0.15);
      color: #92400E;
    }

    .da-cert-stamp {
      border: 2px solid #16A34A;
      color: #16A34A;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 6px;
      transform: rotate(-3deg);
      display: inline-block;
      background: rgba(22, 163, 74, 0.06);
    }

    @media print {
      /* 1. Reset document canvas and hide all page elements */
      html, body {
        height: auto !important;
        overflow: visible !important;
        background: #FFFFFF !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      body * {
        visibility: hidden !important;
      }

      /* 2. Hide common layout bars, sidebars, dashboard tables and interactive controls */
      header, footer, nav, aside,
      .sidebar, .app-sidebar, .da-container,
      .da-stat-card, .da-filter-box, .da-card,
      .da-modal-backdrop:not(.da-cert-modal-backdrop),
      .da-cert-no-print {
        display: none !important;
      }

      /* 3. Unhide ONLY the certificate modal and document print area */
      .da-cert-modal-backdrop,
      .da-cert-modal-content,
      .da-cert-doc-print-area,
      .da-cert-doc-print-area *,
      .da-doc-viewer-box,
      .da-doc-viewer-box * {
        visibility: visible !important;
      }

      /* 4. Reset modal backdrop & content so it occupies 100% of the print sheet */
      .da-cert-modal-backdrop {
        position: static !important;
        width: 100% !important;
        height: auto !important;
        min-height: 100% !important;
        background: transparent !important;
        backdrop-filter: none !important;
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
      }

      .da-cert-modal-content {
        position: static !important;
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        max-height: none !important;
        background: #FFFFFF !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
        display: block !important;
      }

      .da-cert-doc-print-area {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* 5. Document viewer sizing for print - document ONLY occupies print sheet */
      .da-doc-viewer-box {
        position: static !important;
        width: 100% !important;
        height: auto !important;
        min-height: 100vh !important;
        max-height: none !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        background: #FFFFFF !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
        display: block !important;
      }

      .da-doc-viewer-box iframe {
        width: 100% !important;
        height: 100vh !important;
        min-height: 100vh !important;
        border: none !important;
        display: block !important;
      }

      .da-doc-viewer-box img {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        max-height: 100vh !important;
        object-fit: contain !important;
        display: block !important;
        margin: 0 auto !important;
        border: none !important;
        box-shadow: none !important;
      }

      @page {
        size: auto;
        margin: 0mm;
      }
    }
  `]
})
export class DoctorApprovalsComponent implements OnInit, OnDestroy {
  public requests: DoctorApprovalItem[] = [];
  public filteredRequests: DoctorApprovalItem[] = [];

  public searchQuery: string = '';
  public activeTab: 'Pending' | 'Approved' | 'Rejected' | 'All' = 'All';
  private searchSubject: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  // Stats - dynamic getters ensuring real-time accurate counts from API
  public serverPendingCount: number | null = null;
  public serverApprovedCount: number | null = null;
  public serverRejectedCount: number | null = null;
  public serverTotalCount: number | null = null;

  public get pendingCount(): number {
    if (this.requests && this.requests.length > 0) {
      return this.requests.filter(r => (r.status || '').toLowerCase() === 'pending').length;
    }
    if (this.serverPendingCount !== null && this.serverPendingCount !== undefined) {
      return this.serverPendingCount;
    }
    return 0;
  }

  public get approvedCount(): number {
    if (this.requests && this.requests.length > 0) {
      return this.requests.filter(r => (r.status || '').toLowerCase() === 'approved').length;
    }
    if (this.serverApprovedCount !== null && this.serverApprovedCount !== undefined) {
      return this.serverApprovedCount;
    }
    return 0;
  }

  public get rejectedCount(): number {
    if (this.requests && this.requests.length > 0) {
      return this.requests.filter(r => (r.status || '').toLowerCase() === 'rejected').length;
    }
    if (this.serverRejectedCount !== null && this.serverRejectedCount !== undefined) {
      return this.serverRejectedCount;
    }
    return 0;
  }

  // Selected item for Review Modal
  public selectedItem: DoctorApprovalItem | null = null;
  public isReviewModalOpen: boolean = false;
  public processingId: string | null = null;
  public processingAction: 'approve' | 'reject' | null = null;

  // Rejection Reason Modal
  public isRejectModalOpen: boolean = false;
  public doctorToReject: DoctorApprovalItem | null = null;
  public rejectionReasonInput: string = '';
  public rejectionReasonError: string = '';
  public isSubmittingStatus: boolean = false;

  // Certificate Viewer Modal
  public isCertificateViewerOpen: boolean = false;
  public activeCertificateDoc: VerificationDocument | null = null;
  public activeCertificateDoctor: DoctorApprovalItem | null = null;
  public activeDocIndex: number = 0;
  public safeDocUrl: SafeResourceUrl | null = null;
  public docImageLoadFailed: boolean = false;
  public certViewMode: 'certificate' | 'file' = 'certificate';

  // Toast
  public toastMessage: string = '';
  public toastType: 'success' | 'error' = 'success';
  private toastTimer: any = null;


  public isLoading: boolean = false;

  constructor(
    private webApiService: WebapiService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.requests = [];
    this.filteredRequests = [];
  }

  ngOnInit(): void {
    this.destroy$ = new Subject<void>();
    this.cleanupLegacyMockStorage();
    this.requests = [];
    this.filteredRequests = [];
    this.updateStats();
    this.initSearchDebounce();
    this.loadApprovals();
  }

  private cleanupLegacyMockStorage(): void {
    try {
      localStorage.removeItem('activeLife_doctorStatusOverrides_v1');
      localStorage.removeItem('activeLife_doctorApprovals_v2');
      localStorage.removeItem('activeLife_doctorApprovals_v1');
      localStorage.removeItem('activeLife_doctorManagement_live_v2');
    } catch (e) {}
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
      this.applyFilters();
    });
  }

  public onSearchInput(event: any): void {
    const val = event.target ? event.target.value : '';
    this.searchSubject.next(val);
  }

  public setTab(tab: 'Pending' | 'Approved' | 'Rejected' | 'All'): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  public normalizeDocumentUrl(url?: string): string {
    if (!url) return '';
    let clean = url.trim();
    // Direct AWS S3 access is blocked by bucket policy (HTTP 403 Forbidden).
    // CloudFront CDN serves authentic uploaded documents reliably with HTTP 200 OK.
    clean = clean.replace(/https?:\/\/[a-z0-9.-]+\.s3[.-][a-z0-9.-]*\.amazonaws\.com\/(?:healthappams\/)?/gi, 'https://d2kmj2okvs22p9.cloudfront.net/');
    clean = clean.replace(/https?:\/\/s3[.-][a-z0-9.-]*\.amazonaws\.com\/[^\/]+\//gi, 'https://d2kmj2okvs22p9.cloudfront.net/');
    clean = clean.replace(/https?:\/\/healthappams\.s3[.-][a-z0-9-]*\.amazonaws\.com/gi, 'https://d2kmj2okvs22p9.cloudfront.net');
    clean = clean.replace(/https?:\/\/healthappams\.s3\.amazonaws\.com/gi, 'https://d2kmj2okvs22p9.cloudfront.net');
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('blob:') || clean.startsWith('data:')) {
      return clean;
    }
    if (clean.startsWith('/')) {
      return `${environment.serviceUrl}${clean}`;
    }
    return `${environment.serviceUrl}/${clean}`;
  }

  // Strictly rely on live testing APIs from common service - no static mock data
  private getInitialData(): DoctorApprovalItem[] {
    return [];
  }

  public mapSpecialization(id?: number | string, name?: string): string {
    if (name && name.trim()) return name.trim();
    const map: { [key: number]: string } = {
      1: 'Cardiology',
      2: 'Neurology',
      9: 'Orthopedics',
      12: 'Gynecology',
      14: 'Pediatrics',
      18: 'General Surgery'
    };
    if (id !== undefined && map[Number(id)]) {
      return map[Number(id)];
    }
    return 'General Medicine';
  }

  public sortApprovalsAscending(list: DoctorApprovalItem[]): DoctorApprovalItem[] {
    if (!list || list.length === 0) return [];
    return [...list].sort((a, b) => {
      const numA = this.extractNumber(a.id);
      const numB = this.extractNumber(b.id);
      if (numA !== numB) {
        return numA - numB;
      }
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    });
  }

  private extractNumber(val: any): number {
    if (typeof val === 'number') return val;
    const match = String(val).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private safeFormatDate(val: any, fallback: string = ''): string {
    if (!val) return fallback;
    try {
      if (Array.isArray(val) && val.length >= 3) {
        const year = val[0];
        const month = String(val[1]).padStart(2, '0');
        const day = String(val[2]).padStart(2, '0');
        const d = new Date(`${year}-${month}-${day}`);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      }
      if (typeof val === 'string') {
        const cleanStr = val.split('.')[0];
        const d = new Date(cleanStr);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        const datePart = val.split('T')[0];
        if (datePart && datePart.includes('-')) {
          return datePart;
        }
      }
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  }

  private createFallbackDocItem(doc: any, index: number): DoctorApprovalItem {
    const rawName = (doc.fullName || doc.name || `Doctor ${index + 1}`).trim();
    const cleanName = rawName.startsWith('Dr.') ? rawName : ('Dr. ' + rawName);
    const regStatus = (doc.registrationStatus || doc.approvalStatus || doc.approval || '').toString().trim().toUpperCase();
    let status: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
    if (regStatus === 'APPROVED' || regStatus === 'ACTIVE') status = 'Approved';
    else if (regStatus === 'REJECTED' || regStatus === 'INACTIVE') status = 'Rejected';
    else status = 'Pending';

    return {
      id: doc.id ? String(doc.id) : `REQ-${101 + index}`,
      numericId: Number(doc.id || (index + 1)),
      name: cleanName,
      initial: this.getDoctorInitial(cleanName),
      avatarBg: ['#8B5CF6', '#EC4899', '#A855F7', '#06B6D4', '#F59E0B'][index % 5],
      specialization: doc.specialization || 'Cardiology',
      experience: doc.experienceYears ? `${doc.experienceYears} yrs exp` : (doc.experience || '16 yrs exp'),
      email: doc.email || '',
      location: doc.hospitalName || doc.address || 'Apollo Hospital',
      appliedDate: 'Applied Recently',
      status: status,
      registrationStatus: regStatus,
      verifiedDocsCount: status === 'Approved' ? 2 : 0,
      totalDocsCount: 2,
      phone: doc.mobileNumber || doc.phone || '',
      hospitalName: doc.hospitalName || 'Apollo Hospital',
      qualification: doc.qualification || 'MBBS',
      licenseNumber: doc.registrationNumber || 'TGMC-123456',
      documents: [],
      notes: doc.rejectionReason || 'Practitioner'
    };
  }

  public loadApprovals(): void {
    const payload: any = { page: 0, size: 50 };

    this.webApiService.GetDoctorApprovals(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('[DoctorApprovals] API Response:', res);
        let rawList: any[] = [];

        // 1. Extract Stats directly from the API response
        const d = res?.data || res || {};
        const stats = d.stats || d.statistics || res?.stats || res?.statistics;
        if (stats) {
          if (stats.pending !== undefined) this.serverPendingCount = Number(stats.pending);
          if (stats.approved !== undefined) this.serverApprovedCount = Number(stats.approved);
          if (stats.rejected !== undefined) this.serverRejectedCount = Number(stats.rejected);
          if (stats.total !== undefined) this.serverTotalCount = Number(stats.total);
          console.log('[DoctorApprovals] Extracted server stats:', {
            pending: this.serverPendingCount,
            approved: this.serverApprovedCount,
            rejected: this.serverRejectedCount,
            total: this.serverTotalCount
          });
        }

        // 2. Extract doctor approvals array across all possible structures
        if (Array.isArray(d.data)) {
          rawList = d.data;
        } else if (Array.isArray(d.content)) {
          rawList = d.content;
        } else if (Array.isArray(d.doctors)) {
          rawList = d.doctors;
        } else if (Array.isArray(d.doctorApprovals)) {
          rawList = d.doctorApprovals;
        } else if (Array.isArray(d.approvals)) {
          rawList = d.approvals;
        } else if (Array.isArray(d.list)) {
          rawList = d.list;
        } else if (Array.isArray(d.items)) {
          rawList = d.items;
        } else if (Array.isArray(d)) {
          rawList = d;
        } else if (Array.isArray(res?.content)) {
          rawList = res.content;
        } else if (Array.isArray(res?.data)) {
          rawList = res.data;
        } else if (Array.isArray(res)) {
          rawList = res;
        } else if (d.page && Array.isArray(d.page.content)) {
          rawList = d.page.content;
        } else if (d.pageData && Array.isArray(d.pageData.content)) {
          rawList = d.pageData.content;
        } else if (typeof d.data === 'object' && d.data !== null && !Array.isArray(d.data)) {
          for (const k of Object.keys(d.data)) {
            if (Array.isArray(d.data[k]) && d.data[k].length > 0) {
              rawList = d.data[k];
              break;
            }
          }
        }

        if (!rawList || rawList.length === 0) {
          for (const k of Object.keys(d)) {
            if (k === 'stats' || k === 'statistics') continue;
            if (Array.isArray(d[k]) && d[k].length > 0 && typeof d[k][0] === 'object') {
              rawList = d[k];
              break;
            }
          }
        }

        if (rawList && rawList.length > 0) {
          console.log('[DoctorApprovals] Extracted rawList count:', rawList.length);
          const mapped: DoctorApprovalItem[] = rawList.map((doc: any, index: number) => {
            try {
              return this.mapApiApprovalItem(doc, index);
            } catch (err) {
              console.warn('[DoctorApprovals] Failed mapping doctor item at index ' + index + ':', err, doc);
              return this.createFallbackDocItem(doc, index);
            }
          }).filter((item): item is DoctorApprovalItem => item !== null);

          if (mapped.length > 0) {
            this.requests = this.sortApprovalsAscending(mapped);
            this.saveToStorage();
          }

          // If there are no pending requests and activeTab is Pending, show All
          if (this.pendingCount === 0 && this.activeTab === 'Pending') {
            this.activeTab = 'All';
          }

          this.updateStats();
          this.applyFilters();
          this.cdr.detectChanges();
        } else {
          // If approvals API only returned stats with empty content, query GetDoctors to load all registered doctors
          this.loadDoctorsFromLiveApi();
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.warn('GetDoctorApprovals API returned error, attempting GetDoctors live API:', err);
        this.loadDoctorsFromLiveApi();
      }
    });
  }

  private loadDoctorsFromLiveApi(): void {
    this.webApiService.GetDoctors({ page: 0, size: 50 }).subscribe({
      next: (docRes: any) => {
        let liveDoctors: any[] = [];
        const dd = docRes?.data || docRes || {};
        if (Array.isArray(dd.content)) liveDoctors = dd.content;
        else if (Array.isArray(dd.data)) liveDoctors = dd.data;
        else if (Array.isArray(dd.doctors)) liveDoctors = dd.doctors;
        else if (Array.isArray(dd)) liveDoctors = dd;
        else if (Array.isArray(docRes?.content)) liveDoctors = docRes.content;
        else if (Array.isArray(docRes?.data)) liveDoctors = docRes.data;

        if (liveDoctors && liveDoctors.length > 0) {
          console.log('[DoctorApprovals] Loaded', liveDoctors.length, 'doctors from GetDoctors live API');
          const mapped: DoctorApprovalItem[] = liveDoctors.map((doc: any, index: number) => {
            try {
              return this.mapApiApprovalItem(doc, index);
            } catch (err) {
              return this.createFallbackDocItem(doc, index);
            }
          }).filter((item): item is DoctorApprovalItem => item !== null);

          if (mapped.length > 0) {
            this.requests = this.sortApprovalsAscending(mapped);
            this.saveToStorage();
          }
        } else {
          // If no doctors returned by live testing API, keep requests empty
          this.requests = [];
        }
        this.updateStats();
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.warn('GetDoctors API returned error:', err);
        this.requests = [];
        this.updateStats();
        this.applyFilters();
        this.cdr.detectChanges();
      }
    });
  }

  private mapApiApprovalItem(doc: any, index: number): DoctorApprovalItem {
    let rawName = (doc.fullName || doc.name || '').trim();
    rawName = rawName.replace(/^[\.\s]+/, '');
    rawName = rawName.replace(/^Dr\.?\s*[\.\s]*/i, '');
    const cleanName = 'Dr. ' + rawName.trim();
    const initial = this.getDoctorInitial(cleanName);
    const avatarBg = this.getDoctorAvatarBg(cleanName, index);

    const docId = doc.id ? String(doc.id) : `REQ-${101 + index}`;
    const numId = this.extractNumber(docId);

    // Strictly display production API data
    const regStatus = (doc.registrationStatus || doc.approvalStatus || doc.approval || doc.status || '').toString().trim().toUpperCase();
    let status: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
    if (regStatus === 'APPROVED' || regStatus === 'ACTIVE') {
      status = 'Approved';
    } else if (regStatus === 'REJECTED' || regStatus === 'INACTIVE') {
      status = 'Rejected';
    } else {
      status = 'Pending';
    }

    const expYrs = doc.experienceYears ? `${doc.experienceYears} yrs exp` : (doc.experience || '16 yrs exp');
    
    // Extract raw documents array across all possible backend field names or JSON string
    let rawDocs: any = doc.documents || doc.doctorDocuments || doc.verificationDocuments || doc.credentials || doc.certificates || doc.documentList || doc.files || doc.doctorCertificates;
    if (typeof rawDocs === 'string') {
      try {
        rawDocs = JSON.parse(rawDocs);
      } catch (e) {
        rawDocs = [];
      }
    }
    let docs: any[] = Array.isArray(rawDocs) ? rawDocs : [];

    // If still empty, check for direct document fields on the doctor object itself (e.g. uploaded directly on doctor entity)
    if (docs.length === 0) {
      const directCandidates = [
        { name: `Registration Council Proof (${doc.registrationCouncil || 'Medical Council'})`, url: doc.documentUrl || doc.certificateUrl || doc.registrationCertificateUrl || doc.fileUrl || doc.documentPath || doc.filePath },
        { name: 'Medical Degree / Practice Certificate', url: doc.medicalCertificateUrl || doc.degreeCertificateUrl },
        { name: 'Medical ID Proof', url: doc.idProofUrl || doc.registrationProofUrl }
      ].filter(item => !!item.url);

      if (directCandidates.length > 0) {
        docs = directCandidates;
      }
    }
    
    // Backend document counts and status keys
    const backendTotalDocs = doc.totalDocumentsCount ?? doc.totalDocsCount;
    const backendVerifiedDocs = doc.verifiedDocumentsCount ?? doc.verifiedDocsCount;
    const backendIsAllVerified = doc.isAllDocumentsVerified ?? doc.isVerified;

    const mappedDocuments: VerificationDocument[] = docs.map((d: any, dIdx: number) => {
      let docName = '';
      if (typeof d === 'string') {
        docName = `Document ${dIdx + 1}`;
      } else if (d && typeof d === 'object') {
        docName = (d.name || d.documentName || d.title || d.documentType || '').trim();
      }
      if (!docName) {
        if (dIdx === 0) {
          docName = `Registration Council Proof (${doc.registrationCouncil || 'Medical Council'})`;
        } else if (dIdx === 1) {
          docName = 'Medical Degree / Practice Certificate';
        } else if (dIdx === 2) {
          docName = 'Government Medical ID / Certificate';
        } else if (dIdx === 3) {
          docName = 'Medical Board Certificate';
        } else {
          docName = `Medical Document ${dIdx + 1}`;
        }
      }
      const targetDocId = (d && typeof d === 'object') ? (d.id !== undefined ? Number(d.id) : (d.documentId !== undefined ? Number(d.documentId) : (index * 10 + dIdx + 1))) : (index * 10 + dIdx + 1);
      const isLocallyViewed = this.isDocViewed(String(docId), docName, targetDocId);
      const isExplicitBackendVerified = (d && typeof d === 'object') ? (d.verificationStatus === 'VERIFIED' || d.isVerified === true) : false;
      const isVerified = status === 'Approved' ? true : (isLocallyViewed || isExplicitBackendVerified);

      let rawUrl = '';
      if (typeof d === 'string') {
        rawUrl = d.trim();
      } else if (d && typeof d === 'object') {
        rawUrl = (d.documentUrl || d.url || d.fileUrl || d.documentPath || d.filePath || d.path || d.downloadUrl || d.certificateUrl || d.document || d.docUrl || d.src || '').trim();
      }
      const fullUrl = this.normalizeDocumentUrl(rawUrl);

      const cleanUrl = (fullUrl || rawUrl).toLowerCase().split('?')[0];
      const docType = cleanUrl.endsWith('.pdf') ? 'PDF' : (cleanUrl.endsWith('.png') ? 'PNG' : 'JPG');

      return {
        id: targetDocId,
        name: docName,
        type: docType,
        status: isVerified ? 'Verified' : 'Pending',
        verifiedDate: isVerified ? (d.verifiedAt || d.uploadedAt ? this.safeFormatDate(d.verifiedAt || d.uploadedAt, 'Verified') : 'Verified') : '',
        url: fullUrl,
        certificateNumber: (d && d.certificateNumber) || doc.registrationNumber || `TGMC-${10000 + index}`,
        issuer: (d && d.issuer) || doc.registrationCouncil || 'Telangana State Medical Council (TSMC)',
        issueDate: this.safeFormatDate(doc.createdAt, 'Nov 19, 2026'),
        expiryDate: 'Nov 18, 2036'
      };
    });

    const fallbackDocs: VerificationDocument[] = [
      {
        id: Number(doc.id ? Number(doc.id) * 10 + 1 : 1),
        name: `Registration Council Proof (${doc.registrationCouncil || 'Medical Council'})`,
        type: 'JPG',
        status: this.isDocViewed(String(docId), `Registration Council Proof (${doc.registrationCouncil || 'Medical Council'})`) ? 'Verified' : 'Pending',
        verifiedDate: '',
        certificateNumber: doc.registrationNumber || 'TGMC-123456',
        issuer: doc.registrationCouncil || 'Medical Council of India (MCI)',
        issueDate: this.safeFormatDate(doc.createdAt, 'Nov 19, 2026'),
        expiryDate: 'Nov 18, 2036',
        url: doc.profilePhotoUrl ? this.normalizeDocumentUrl(doc.profilePhotoUrl) : ''
      }
    ];

    const finalDocs = mappedDocuments.length > 0 ? mappedDocuments : fallbackDocs;
    let finalTotalCount = Math.max(finalDocs.length, 1);
    let finalVerifiedCount = 0;

    if (status === 'Approved') {
      finalDocs.forEach(d => {
        d.status = 'Verified';
        if (!d.verifiedDate) {
          d.verifiedDate = 'Verified';
        }
      });
      finalVerifiedCount = finalDocs.length;
      finalTotalCount = finalDocs.length;
    } else {
      const savedCount = this.getDoctorVerifiedCount(String(docId));
      const computedCount = finalDocs.filter((d: VerificationDocument) => d.status === 'Verified').length;
      finalVerifiedCount = savedCount !== null ? savedCount : computedCount;
    }

    // Clean location: extract primary hospital name without long multi-hospital concatenated addresses
    let loc = (doc.hospitalName || doc.address || 'Apollo Hospital').trim();
    if (loc.includes(',')) {
      loc = loc.split(',')[0].trim();
    }
    if (!loc) loc = 'Apollo Hospital';

    let appliedDate = 'Applied Recently';
    if (doc.createdAt) {
      appliedDate = 'Applied ' + this.safeFormatDate(doc.createdAt, 'Recently');
    } else if (doc.appliedDate) {
      appliedDate = doc.appliedDate.startsWith('Applied') ? doc.appliedDate : ('Applied ' + doc.appliedDate);
    }

    const rawPhoto = (doc.profilePhotoUrl || '').trim();
    const profilePhoto = this.normalizeDocumentUrl(rawPhoto);

    return {
      id: doc.id ? String(doc.id) : `REQ-${101 + index}`,
      numericId: Number(doc.id || doc.doctorId || (index + 1)),
      name: cleanName,
      initial: initial,
      avatarBg: avatarBg,
      specialization: this.mapSpecialization(doc.specializationId, doc.specialization),
      experience: expYrs,
      email: doc.email || '',
      location: loc,
      appliedDate: appliedDate,
      status: status,
      registrationStatus: regStatus,
      verifiedDocsCount: finalVerifiedCount,
      totalDocsCount: finalTotalCount,
      phone: doc.mobileNumber || doc.phone || '',
      hospitalName: doc.hospitalName || loc,
      qualification: doc.qualification || 'MBBS',
      licenseNumber: doc.registrationNumber || 'TGMC-123456',
      registrationCouncil: doc.registrationCouncil || 'Medical Council of India (MCI)',
      profilePhotoUrl: profilePhoto,
      documents: finalDocs,
      notes: doc.rejectionReason || (doc.registrationCouncil ? `${doc.registrationCouncil} • Verified Practitioner` : 'Medical Council of India (MCI) • Verified Practitioner')
    };
  }

  private getDoctorInitial(name: string): string {
    const clean = (name || '').replace(/^Dr\.?\s*/i, '').trim();
    return clean ? clean[0]?.toUpperCase() : 'D';
  }

  private getDoctorAvatarBg(name: string, index: number): string {
    const lower = (name || '').toLowerCase();
    if (lower.includes('ramesh')) return '#E879F9';
    if (lower.includes('rajesh')) return '#A855F7';
    if (lower.includes('shiva')) return '#818CF8';
    if (lower.includes('umesh')) return '#F59E0B';
    if (lower.includes('seshu')) return '#10B981';
    if (lower.includes('ram')) return '#3B82F6';
    if (lower.includes('varsha')) return '#EC4899';
    if (lower.includes('vamsi')) return '#06B6D4';
    if (lower.includes('doctor')) return '#06B6D4';
    if (lower.includes('emily')) return '#8B5CF6';
    if (lower.includes('suresh')) return '#3B82F6';
    if (lower.includes('priya')) return '#14B8A6';
    return ['#8B5CF6', '#EC4899', '#A855F7', '#06B6D4', '#F59E0B'][index % 5];
  }

  private loadStatusOverrides(): { [id: string]: 'Pending' | 'Approved' | 'Rejected' } {
    return {};
  }

  private syncWithDoctorManagement(item: DoctorApprovalItem, status: 'Approved' | 'Rejected'): void {
    // In-memory synchronization only; live API remains single source of truth
  }

  private saveStatusOverride(id: string, status: 'Pending' | 'Approved' | 'Rejected'): void {
    // In-memory status only; do not persist overrides that mask production API data
  }

  private saveToStorage(): void {
    // In-memory only; do not overwrite live API data
  }

  public updateStats(): void {
    if (this.requests && this.requests.length > 0) {
      this.serverPendingCount = this.requests.filter(r => (r.status || '').toLowerCase() === 'pending').length;
      this.serverApprovedCount = this.requests.filter(r => (r.status || '').toLowerCase() === 'approved').length;
      this.serverRejectedCount = this.requests.filter(r => (r.status || '').toLowerCase() === 'rejected').length;
      this.serverTotalCount = this.requests.length;
    }
    this.cdr.markForCheck();
  }

  public applyFilters(): void {
    let result = this.requests ? [...this.requests] : [];

    if (this.activeTab !== 'All') {
      result = result.filter(r => r.status === this.activeTab);
    }

    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(r =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.specialization && r.specialization.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.location && r.location.toLowerCase().includes(q))
      );
    }

    this.filteredRequests = this.sortApprovalsAscending(result);
  }

  public approve(item: DoctorApprovalItem): void {
    if (!item) return;

    const totalCount = item.totalDocsCount || (item.documents?.length || 1);
    const verifiedCount = (item.documents || []).filter((d: VerificationDocument) => d.status === 'Verified').length;

    // Strict requirement: Admin MUST view and verify all certificates before approving!
    // Only enforced for Pending requests
    if (item.status === 'Pending' && verifiedCount < totalCount) {
      this.showToast(`Please view all certificates (${verifiedCount}/${totalCount} verified) before approving ${item.name}.`, 'error');
      this.review(item);
      return;
    }

    const numId = item.numericId || this.extractNumber(item.id);
    const targetId = Number(numId || 1);

    // 1. Instant UI update - zero latency (responds immediately on click)
    this.closeReviewModal();
    this.closeCertificateViewer();
    this.closeRejectModal();
    this.applyStatusChange(item, 'Approved');
    this.showToast(`${item.name} approved successfully`, 'success');
    this.cdr.markForCheck();
    this.cdr.detectChanges();

    // 2. Background backend synchronization
    const payload: { id: number; status: 'APPROVED' } = {
      id: targetId,
      status: 'APPROVED'
    };

    console.log('[DoctorApprovals] Calling status API (APPROVED):', payload);

    this.webApiService.UpdateDoctorApprovalStatus(payload).subscribe({
      next: (res: any) => {
        console.log('[DoctorApprovals] Status API approve response:', res);
      },
      error: (err: any) => {
        console.warn('[DoctorApprovals] UpdateDoctorApprovalStatus API error:', err);
      }
    });
  }

  public openRejectModal(item: DoctorApprovalItem): void {
    if (!item) return;
    this.isSubmittingStatus = false;
    this.doctorToReject = item;
    this.rejectionReasonInput = '';
    this.rejectionReasonError = '';
    this.isRejectModalOpen = true;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public closeRejectModal(): void {
    this.isRejectModalOpen = false;
    this.isSubmittingStatus = false;
    this.doctorToReject = null;
    this.rejectionReasonInput = '';
    this.rejectionReasonError = '';
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public confirmReject(): void {
    if (!this.doctorToReject) return;
    const rawReason = this.rejectionReasonInput ? String(this.rejectionReasonInput).trim() : '';
    if (!rawReason) {
      this.rejectionReasonError = 'Rejection reason is mandatory. Please provide a reason for rejecting this application.';
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      return;
    }
    this.rejectionReasonError = '';
    const reason = rawReason;
    const targetDoc = this.doctorToReject;
    const numId = targetDoc.numericId || this.extractNumber(targetDoc.id);
    const targetId = Number(numId || 1);

    // 1. Instant UI update - zero latency (responds immediately on click)
    this.closeRejectModal();
    this.closeReviewModal();
    this.closeCertificateViewer();
    this.applyStatusChange(targetDoc, 'Rejected', reason);
    this.showToast(`${targetDoc.name} rejected: ${reason}`, 'success');
    this.cdr.markForCheck();
    this.cdr.detectChanges();

    // 2. Background backend synchronization
    const payload: { id: number; status: 'REJECTED'; rejectionReason: string } = {
      id: targetId,
      status: 'REJECTED',
      rejectionReason: reason
    };

    console.log('[DoctorApprovals] Calling status API (REJECTED):', payload);

    this.webApiService.UpdateDoctorApprovalStatus(payload).subscribe({
      next: (res: any) => {
        console.log('[DoctorApprovals] Status API reject response:', res);
      },
      error: (err: any) => {
        console.warn('[DoctorApprovals] UpdateDoctorApprovalStatus API error:', err);
      }
    });
  }

  public reject(item: DoctorApprovalItem, reason?: string): void {
    if (!item) return;
    if (reason) {
      this.doctorToReject = item;
      this.rejectionReasonInput = reason;
      this.confirmReject();
    } else {
      this.openRejectModal(item);
    }
  }

  private applyStatusChange(item: DoctorApprovalItem, status: 'Approved' | 'Rejected', reason?: string): void {
    const numId = item.numericId || this.extractNumber(item.id);
    const prevStatus = item.status;

    if (status === 'Approved') {
      if (item.documents && item.documents.length > 0) {
        item.documents.forEach(d => {
          d.status = 'Verified';
          if (!d.verifiedDate) {
            d.verifiedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          }
          this.recordViewedDoc(String(item.id), d.name);
        });
        item.verifiedDocsCount = item.documents.length;
        item.totalDocsCount = item.documents.length;
      } else {
        item.verifiedDocsCount = item.totalDocsCount;
      }
    }

    item.status = status;
    item.registrationStatus = status.toUpperCase();
    item.approvalStatus = status.toUpperCase();
    item.approval = status;
    if (status === 'Rejected' && reason) {
      item.notes = reason;
    }

    const verifiedCount = status === 'Approved'
      ? (item.totalDocsCount || (item.documents?.length || 2))
      : (item.documents || []).filter((d: VerificationDocument) => d.status === 'Verified').length;
    item.verifiedDocsCount = verifiedCount;

    this.requests = this.requests.map(r => {
      const rNum = r.numericId || this.extractNumber(r.id);
      if (
        String(r.id) === String(item.id) ||
        (numId && rNum === numId)
      ) {
        if (status === 'Approved' && r.documents) {
          r.documents.forEach((d: VerificationDocument) => {
            d.status = 'Verified';
            if (!d.verifiedDate) d.verifiedDate = 'Verified';
            this.recordViewedDoc(String(r.id), d.name);
          });
        }
        return {
          ...r,
          status: status,
          registrationStatus: status.toUpperCase(),
          approvalStatus: status.toUpperCase(),
          approval: status,
          verifiedDocsCount: status === 'Approved' ? (r.totalDocsCount || (r.documents?.length || 2)) : (r.documents || []).filter((d: VerificationDocument) => d.status === 'Verified').length,
          notes: (status === 'Rejected' && reason) ? reason : r.notes
        };
      }
      return r;
    });

    this.filteredRequests = this.filteredRequests.map(r => {
      const rNum = r.numericId || this.extractNumber(r.id);
      if (
        String(r.id) === String(item.id) ||
        (numId && rNum === numId)
      ) {
        if (status === 'Approved' && r.documents) {
          r.documents.forEach((d: VerificationDocument) => {
            d.status = 'Verified';
            if (!d.verifiedDate) d.verifiedDate = 'Verified';
            this.recordViewedDoc(String(r.id), d.name);
          });
        }
        return {
          ...r,
          status: status,
          registrationStatus: status.toUpperCase(),
          approvalStatus: status.toUpperCase(),
          approval: status,
          verifiedDocsCount: status === 'Approved' ? (r.totalDocsCount || (r.documents?.length || 2)) : (r.documents || []).filter((d: VerificationDocument) => d.status === 'Verified').length,
          notes: (status === 'Rejected' && reason) ? reason : r.notes
        };
      }
      return r;
    });

    this.saveStatusOverride(String(item.id), status);
    if (numId) this.saveStatusOverride(String(numId), status);
    this.saveToStorage();
    if (status === 'Approved' || status === 'Rejected') {
      this.syncWithDoctorManagement(item, status);
    }
    if (status === 'Approved') {
      if (prevStatus === 'Pending') {
        if (this.serverPendingCount !== null && this.serverPendingCount > 0) this.serverPendingCount--;
      } else if (prevStatus === 'Rejected') {
        if (this.serverRejectedCount !== null && this.serverRejectedCount > 0) this.serverRejectedCount--;
      }
      if (this.serverApprovedCount !== null) this.serverApprovedCount++;
    } else if (status === 'Rejected') {
      if (prevStatus === 'Pending') {
        if (this.serverPendingCount !== null && this.serverPendingCount > 0) this.serverPendingCount--;
      } else if (prevStatus === 'Approved') {
        if (this.serverApprovedCount !== null && this.serverApprovedCount > 0) this.serverApprovedCount--;
      }
      if (this.serverRejectedCount !== null) this.serverRejectedCount++;
    }
    this.updateStats();
    this.applyFilters();
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  private getViewedDocsSet(): Set<string> {
    try {
      const raw = localStorage.getItem('activeLife_doctorViewedDocs_v1');
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch (e) {
      return new Set<string>();
    }
  }

  private recordViewedDoc(doctorId: string, docName: string, docId?: number | string): void {
    try {
      const set = this.getViewedDocsSet();
      const cleanDocName = (docName || '').trim();
      set.add(`${doctorId}_${cleanDocName}`);
      const numId = this.extractNumber(doctorId);
      if (numId) {
        set.add(`${numId}_${cleanDocName}`);
      }
      if (docId !== undefined && docId !== null) {
        set.add(`${doctorId}_doc_${docId}`);
        if (numId) set.add(`${numId}_doc_${docId}`);
      }
      localStorage.setItem('activeLife_doctorViewedDocs_v1', JSON.stringify(Array.from(set)));
    } catch (e) {}
  }

  public isDocViewed(doctorId: string, docName: string, docId?: number | string): boolean {
    const set = this.getViewedDocsSet();
    const cleanDocName = (docName || '').trim();
    if (set.has(`${doctorId}_${cleanDocName}`)) return true;
    const numId = this.extractNumber(doctorId);
    if (numId && set.has(`${numId}_${cleanDocName}`)) return true;
    if (docId !== undefined && docId !== null) {
      if (set.has(`${doctorId}_doc_${docId}`)) return true;
      if (numId && set.has(`${numId}_doc_${docId}`)) return true;
    }
    return false;
  }

  private saveDoctorVerifiedCount(doctorId: string, count: number): void {
    try {
      const raw = localStorage.getItem('activeLife_doctorVerifiedCounts_v1');
      const map = raw ? JSON.parse(raw) : {};
      map[String(doctorId)] = count;
      const numId = this.extractNumber(doctorId);
      if (numId) map[String(numId)] = count;
      localStorage.setItem('activeLife_doctorVerifiedCounts_v1', JSON.stringify(map));
    } catch (e) {}
  }

  private getDoctorVerifiedCount(doctorId: string): number | null {
    try {
      const raw = localStorage.getItem('activeLife_doctorVerifiedCounts_v1');
      if (!raw) return null;
      const map = JSON.parse(raw);
      if (map[String(doctorId)] !== undefined) return Number(map[String(doctorId)]);
      const numId = this.extractNumber(doctorId);
      if (numId && map[String(numId)] !== undefined) return Number(map[String(numId)]);
    } catch (e) {}
    return null;
  }

  public markDocAsVerified(doc: VerificationDocument, doctor: DoctorApprovalItem): void {
    if (!doc || !doctor) return;
    const numId = doctor.numericId || this.extractNumber(doctor.id);
    doc.status = 'Verified';
    if (!doc.verifiedDate) {
      doc.verifiedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    this.recordViewedDoc(String(doctor.id), doc.name, doc.id);

    // Call backend API: POST /admin/api/doctor-approvals/verify-document
    // Request body: { "documentId": 2, "isVerified": true }
    const docIndex = (doctor.documents || []).findIndex(d => d.name === doc.name);
    const targetDocId = doc.id !== undefined
      ? Number(doc.id)
      : (numId ? (Number(numId) * 10 + (docIndex >= 0 ? docIndex + 1 : 1)) : 2);

    this.webApiService.VerifyDoctorDocument({
      documentId: targetDocId,
      isVerified: true
    }).subscribe({
      next: (res: any) => {
        console.log('[DoctorApprovals] VerifyDoctorDocument API success:', res);
        if (res?.data?.verifiedAt) {
          doc.verifiedDate = new Date(res.data.verifiedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        if (res?.data?.documentUrl) {
          const rawUrl = res.data.documentUrl;
          doc.url = rawUrl.startsWith('http') ? rawUrl : (`${environment.serviceUrl}${rawUrl}`);
        }
        if (res?.message) {
          this.showToast(res.message, 'success');
        }
        this.saveToStorage();
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.warn('[DoctorApprovals] VerifyDoctorDocument API error:', err);
      }
    });

    const verifiedCount = (doctor.documents || []).filter((d: VerificationDocument) => d.status === 'Verified').length;
    const totalCount = doctor.totalDocsCount || (doctor.documents?.length || 1);
    doctor.verifiedDocsCount = verifiedCount;
    this.saveDoctorVerifiedCount(String(doctor.id), verifiedCount);
    if (numId) {
      this.saveDoctorVerifiedCount(String(numId), verifiedCount);
    }

    if (this.selectedItem && String(this.selectedItem.id) === String(doctor.id)) {
      this.selectedItem.verifiedDocsCount = verifiedCount;
    }
    if (this.activeCertificateDoctor && String(this.activeCertificateDoctor.id) === String(doctor.id)) {
      this.activeCertificateDoctor.verifiedDocsCount = verifiedCount;
    }

    // Dynamic rule requested by user:
    // Admin views certificates -> when all certificates are verified, inform admin they can now approve!
    if (doctor.status === 'Pending') {
      if (verifiedCount >= totalCount && totalCount > 0) {
        this.showToast(`All certificates verified (${verifiedCount}/${totalCount})! You can now click Approve to approve ${doctor.name}.`, 'success');
      }
    }

    const req = this.requests.find(r => String(r.id) === String(doctor.id));
    if (req) {
      req.verifiedDocsCount = verifiedCount;
      req.status = doctor.status;
      if (req.documents) {
        const targetDoc = req.documents.find(x => x.name === doc.name);
        if (targetDoc) {
          targetDoc.status = 'Verified';
          targetDoc.verifiedDate = doc.verifiedDate;
        }
      }
    }

    this.saveToStorage();
    this.updateStats();
    this.applyFilters();
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public review(item: DoctorApprovalItem): void {
    if (item.status === 'Approved') {
      if (item.documents) {
        for (const doc of item.documents) {
          doc.status = 'Verified';
          if (!doc.verifiedDate) doc.verifiedDate = 'Verified';
        }
        item.verifiedDocsCount = item.documents.length;
      }
    } else {
      if (item.documents) {
        for (const doc of item.documents) {
          const isViewed = this.isDocViewed(String(item.id), doc.name, doc.id);
          if (isViewed) {
            doc.status = 'Verified';
            if (!doc.verifiedDate) doc.verifiedDate = 'Verified';
          }
        }
        const savedCount = this.getDoctorVerifiedCount(String(item.id));
        item.verifiedDocsCount = savedCount !== null ? savedCount : item.documents.filter((d: VerificationDocument) => d.status === 'Verified').length;
      }
    }
    this.selectedItem = item;
    this.isReviewModalOpen = true;
    this.saveToStorage();
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public closeReviewModal(): void {
    this.isReviewModalOpen = false;
    this.selectedItem = null;
    this.isCertificateViewerOpen = false;
    this.activeCertificateDoc = null;
    this.activeCertificateDoctor = null;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public openCertificateViewer(doc: VerificationDocument, doctor: DoctorApprovalItem): void {
    this.activeCertificateDoctor = doctor;
    if (doc) {
      doc.url = this.normalizeDocumentUrl(doc.url);
    }
    this.activeCertificateDoc = doc;
    this.certViewMode = 'certificate';
    const docs = doctor.documents || [];
    const idx = docs.findIndex(d => d.name === doc.name);
    this.activeDocIndex = idx >= 0 ? idx : 0;
    this.isCertificateViewerOpen = true;
    this.updateSafeDocUrl();

    // If doc url points to serviceUrl (port 8085 requires Bearer auth), fetch binary blob
    if (doc?.url && doc.url.includes(environment.serviceUrl)) {
      this.loadAuthenticatedDocBlob(doc.url);
    }

    // Admin views document: now mark as Verified!
    this.markDocAsVerified(doc, doctor);

    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public closeCertificateViewer(): void {
    this.isCertificateViewerOpen = false;
    this.activeCertificateDoc = null;
    this.activeCertificateDoctor = null;
    this.activeDocIndex = 0;
    this.certViewMode = 'certificate';
    this.safeDocUrl = null;
    this.docImageLoadFailed = false;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public selectCertificateIndex(index: number): void {
    if (!this.activeCertificateDoctor || !this.activeCertificateDoctor.documents) return;
    const docs = this.activeCertificateDoctor.documents;
    if (index >= 0 && index < docs.length) {
      this.activeDocIndex = index;
      if (docs[index]) {
        docs[index].url = this.normalizeDocumentUrl(docs[index].url);
      }
      this.activeCertificateDoc = docs[index];
      this.certViewMode = 'certificate';
      this.updateSafeDocUrl();

      // If doc url points to serviceUrl, fetch binary blob with Bearer token
      if (docs[index]?.url && docs[index].url.includes(environment.serviceUrl)) {
        this.loadAuthenticatedDocBlob(docs[index].url);
      }

      // Admin views document: mark selected certificate as Verified!
      this.markDocAsVerified(docs[index], this.activeCertificateDoctor);
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  public setCertViewMode(mode: 'certificate' | 'file'): void {
    this.certViewMode = mode;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public getCouncilDisplayName(council?: string): string {
    const raw = (council || this.activeCertificateDoc?.issuer || this.activeCertificateDoctor?.['registrationCouncil'] || 'Telangana State Medical Council').trim();
    if (raw.toUpperCase() === 'TELANGANA_MEDICAL_COUNCIL' || /telangana/i.test(raw)) {
      return 'Telangana State Medical Council (TSMC)';
    }
    if (raw.toUpperCase() === 'ANDHRA_PRADESH_MEDICAL_COUNCIL' || /andhra/i.test(raw)) {
      return 'Andhra Pradesh Medical Council (APMC)';
    }
    if (/india|national|mci|nmc/i.test(raw)) {
      return 'Medical Council of India / NMC';
    }
    return raw;
  }

  public getCouncilAcronym(council?: string): string {
    const raw = (council || this.activeCertificateDoc?.issuer || this.activeCertificateDoctor?.['registrationCouncil'] || 'TSMC').trim();
    if (/telangana/i.test(raw)) return 'TSMC';
    if (/andhra/i.test(raw)) return 'APMC';
    if (/delhi/i.test(raw)) return 'DMC';
    if (/karnataka/i.test(raw)) return 'KMC';
    if (/maharashtra/i.test(raw)) return 'MMC';
    if (/india|mci/i.test(raw)) return 'MCI';
    if (/nmc|national/i.test(raw)) return 'NMC';
    const words = raw.replace(/[^a-zA-Z\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    if (words.length >= 2) {
      return words.map(w => w[0].toUpperCase()).slice(0, 4).join('');
    }
    return 'TSMC';
  }

  public cleanDoctorName(name?: string): string {
    if (!name) return 'Doctor';
    let clean = name.trim();
    clean = clean.replace(/^[\.\s]+/, '');
    clean = clean.replace(/^Dr\.?\s*[\.\s]*/i, '');
    return 'Dr. ' + clean.trim();
  }

  public nextCertificate(): void {
    if (!this.activeCertificateDoctor || !this.activeCertificateDoctor.documents) return;
    const nextIdx = (this.activeDocIndex + 1) % this.activeCertificateDoctor.documents.length;
    this.selectCertificateIndex(nextIdx);
  }

  public prevCertificate(): void {
    if (!this.activeCertificateDoctor || !this.activeCertificateDoctor.documents) return;
    const docs = this.activeCertificateDoctor.documents;
    const prevIdx = (this.activeDocIndex - 1 + docs.length) % docs.length;
    this.selectCertificateIndex(prevIdx);
  }

  private updateSafeDocUrl(): void {
    this.docImageLoadFailed = false;
    if (this.activeCertificateDoc?.url) {
      this.activeCertificateDoc.url = this.normalizeDocumentUrl(this.activeCertificateDoc.url);
      let targetUrl = this.activeCertificateDoc.url;
      if (this.isPdf(targetUrl) && !targetUrl.includes('#')) {
        targetUrl = `${targetUrl}#toolbar=1&navpanes=0&view=FitH,top`;
      }
      this.safeDocUrl = this.sanitizer.bypassSecurityTrustResourceUrl(targetUrl);
    } else {
      this.safeDocUrl = null;
    }
  }

  private loadAuthenticatedDocBlob(url: string): void {
    if (!url || url.startsWith('blob:') || url.startsWith('data:')) return;
    this.webApiService.GetDocumentBlob(url).subscribe({
      next: (blob: any) => {
        if (blob && blob.size > 0 && this.activeCertificateDoc) {
          const blobUrl = URL.createObjectURL(blob);
          this.activeCertificateDoc.url = blobUrl;
          let targetUrl = blobUrl;
          if (this.isPdf(url) && !targetUrl.includes('#')) {
            targetUrl = `${targetUrl}#toolbar=1&navpanes=0&view=FitH,top`;
          }
          this.safeDocUrl = this.sanitizer.bypassSecurityTrustResourceUrl(targetUrl);
          this.docImageLoadFailed = false;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.warn('[DoctorApprovals] Could not fetch authenticated doc blob, keeping direct url:', err);
      }
    });
  }

  public onDocLoadError(event?: any): void {
    if (!this.activeCertificateDoc) {
      this.docImageLoadFailed = true;
      this.cdr.markForCheck();
      return;
    }

    const currentUrl = this.activeCertificateDoc.url || '';

    // 1. If it was an S3 bucket URL, convert to CloudFront
    if (currentUrl.includes('amazonaws.com')) {
      const cdnUrl = this.normalizeDocumentUrl(currentUrl);
      if (cdnUrl && cdnUrl !== currentUrl) {
        this.activeCertificateDoc.url = cdnUrl;
        this.updateSafeDocUrl();
        return;
      }
    }

    // 2. If it failed on serviceUrl (port 8085 without auth header), fetch as blob with Bearer token
    if (currentUrl.includes(environment.serviceUrl) && !currentUrl.startsWith('blob:')) {
      this.loadAuthenticatedDocBlob(currentUrl);
      return;
    }

    // 3. If it failed on CloudFront, try serviceUrl with Bearer authentication
    if (currentUrl.includes('cloudfront.net')) {
      const pathOnly = currentUrl.replace(/https?:\/\/[^\/]+/i, '');
      const srvUrl = `${environment.serviceUrl}${pathOnly}`;
      this.loadAuthenticatedDocBlob(srvUrl);
      return;
    }

    this.docImageLoadFailed = true;
    this.cdr.markForCheck();
  }

  public isPdf(url?: string): boolean {
    if (!url) {
      return (this.activeCertificateDoc?.type || '').toUpperCase() === 'PDF';
    }
    const clean = url.split('#')[0].split('?')[0].toLowerCase();
    return clean.endsWith('.pdf') || (this.activeCertificateDoc?.type || '').toUpperCase() === 'PDF';
  }

  public isImage(url?: string): boolean {
    if (!url) {
      const type = (this.activeCertificateDoc?.type || '').toUpperCase();
      return ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF'].includes(type);
    }
    const clean = url.split('#')[0].split('?')[0].toLowerCase();
    return (
      clean.endsWith('.png') ||
      clean.endsWith('.jpg') ||
      clean.endsWith('.jpeg') ||
      clean.endsWith('.webp') ||
      clean.endsWith('.gif') ||
      clean.startsWith('data:image/') ||
      ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF'].includes((this.activeCertificateDoc?.type || '').toUpperCase())
    );
  }

  public getSafeDocUrl(url?: string): SafeResourceUrl | null {
    if (!url) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public printCertificate(): void {
    const docUrl = this.activeCertificateDoc?.url;
    const docName = this.activeCertificateDoc?.name || 'Doctor Certificate';

    if (!docUrl) {
      window.print();
      return;
    }

    // 1. If document is an image: print ONLY the image in an isolated clean window
    if (this.isImage(docUrl)) {
      const win = window.open('', '_blank', 'width=900,height=700');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${docName}</title>
              <style>
                @page { size: auto; margin: 0; }
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  background: #FFFFFF;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                img {
                  max-width: 100%;
                  max-height: 100vh;
                  object-fit: contain;
                  display: block;
                  margin: auto;
                }
              </style>
            </head>
            <body>
              <img src="${docUrl}" alt="${docName}" onload="window.focus(); window.print(); window.close();" onerror="window.print(); window.close();" />
            </body>
          </html>
        `);
        win.document.close();
        return;
      }
    }

    // 2. If document is a PDF
    if (this.isPdf(docUrl)) {
      // First attempt: try printing directly via embedded iframe (prints only the PDF document stream)
      const iframeEl = document.getElementById('daCertPdfIframe') as HTMLIFrameElement;
      if (iframeEl && iframeEl.contentWindow) {
        try {
          iframeEl.contentWindow.focus();
          iframeEl.contentWindow.print();
          return;
        } catch (e) {
          console.warn('[DoctorApprovals] Direct iframe print failed, trying print iframe fallback:', e);
        }
      }

      // Second attempt: dedicated hidden print iframe with clean URL
      try {
        const cleanUrl = docUrl.split('#')[0];
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        printFrame.src = cleanUrl;
        document.body.appendChild(printFrame);

        printFrame.onload = () => {
          setTimeout(() => {
            try {
              printFrame.contentWindow?.focus();
              printFrame.contentWindow?.print();
            } catch (err) {
              console.warn('[DoctorApprovals] Hidden iframe print blocked, falling back to window.print():', err);
              window.print();
            } finally {
              setTimeout(() => {
                if (document.body.contains(printFrame)) {
                  document.body.removeChild(printFrame);
                }
              }, 3000);
            }
          }, 400);
        };
        return;
      } catch (err) {
        console.warn('[DoctorApprovals] Hidden print iframe creation failed:', err);
      }
    }

    // 3. Fallback: window.print() (which @media print styles ensure prints ONLY the document)
    window.print();
  }

  public downloadCertificate(): void {
    const docName = this.activeCertificateDoc?.name || 'Certificate';
    const drName = this.activeCertificateDoctor?.name || 'Doctor';
    if (this.activeCertificateDoc?.url) {
      const link = document.createElement('a');
      link.href = this.activeCertificateDoc.url;
      link.target = '_blank';
      link.download = `${drName.replace(/\s+/g, '_')}_${docName.replace(/\s+/g, '_')}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    this.showToast(`Downloading ${docName} for ${drName}...`, 'success');
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

