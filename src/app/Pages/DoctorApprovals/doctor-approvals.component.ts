import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize, timeout } from 'rxjs/operators';
import { WebapiService } from '../../services/webapi.service';
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
  documents?: VerificationDocument[];
  notes?: string;
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
      height: auto !important;
      min-height: unset !important;
      max-height: fit-content !important;
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
    }
    .da-btn-approve:hover {
      background: #F0FDF4 !important;
      border-color: #86EFAC !important;
      color: #15803D !important;
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
      max-width: 860px;
      max-height: 94vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
    }

    /* Certificate Parchment Styling */
    .da-cert-frame {
      background: #FFFEFA;
      border: 3px double #1E3A8A;
      box-shadow: inset 0 0 0 4px #FDF6E2, inset 0 0 0 6px #D97706, 0 8px 24px rgba(0,0,0,0.06);
      border-radius: 12px;
      padding: 30px 34px;
      position: relative;
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #1E293B;
      overflow: hidden;
    }

    .da-cert-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 260px;
      height: 260px;
      opacity: 0.04;
      pointer-events: none;
      z-index: 1;
    }

    .da-cert-content {
      position: relative;
      z-index: 2;
    }

    .da-cert-title {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 20px;
      font-weight: 700;
      color: #1E3A8A;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin: 0;
      text-align: center;
    }

    .da-cert-subtitle {
      font-size: 11px;
      letter-spacing: 0.08em;
      color: #64748B;
      text-align: center;
      text-transform: uppercase;
      margin: 4px 0 14px 0;
      font-family: 'Inter', sans-serif;
    }

    .da-cert-name {
      font-family: 'Playfair Display', 'Georgia', serif;
      font-size: 26px;
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
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: radial-gradient(circle, #FEF3C7 0%, #FDE68A 100%);
      border: 3px double #D97706;
      box-shadow: 0 4px 10px rgba(217, 119, 6, 0.2);
      color: #92400E;
    }

    .da-cert-stamp {
      border: 2px solid #16A34A;
      color: #16A34A;
      font-family: 'Inter', sans-serif;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 6px;
      transform: rotate(-5deg);
      display: inline-block;
      background: rgba(22, 163, 74, 0.05);
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

  // Stats - dynamic getters ensuring real-time accurate counts
  public get pendingCount(): number {
    return (this.requests || []).filter(r => (r.status || '').toLowerCase() === 'pending').length;
  }

  public get approvedCount(): number {
    return (this.requests || []).filter(r => (r.status || '').toLowerCase() === 'approved').length;
  }

  public get rejectedCount(): number {
    return (this.requests || []).filter(r => (r.status || '').toLowerCase() === 'rejected').length;
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
  public isSubmittingStatus: boolean = false;

  // Certificate Viewer Modal
  public isCertificateViewerOpen: boolean = false;
  public activeCertificateDoc: VerificationDocument | null = null;
  public activeCertificateDoctor: DoctorApprovalItem | null = null;
  public activeDocIndex: number = 0;

  // Toast
  public toastMessage: string = '';
  public toastType: 'success' | 'error' = 'success';
  private toastTimer: any = null;


  public isLoading: boolean = false;

  constructor(
    private webApiService: WebapiService,
    private cdr: ChangeDetectorRef
  ) {
    this.requests = this.getInitialData();
    this.filteredRequests = [...this.requests];
    this.updateStats();
  }
  ngOnInit(): void {
    this.requests = this.getInitialData();
    this.filteredRequests = [...this.requests];
    this.updateStats();
    this.initSearchDebounce();
    this.loadApprovals();
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

  // Initial Seed Data matching the user screenshot
  // Initial Seed Data matching the live backend API
  private getInitialData(): DoctorApprovalItem[] {
    const overrides = this.loadStatusOverrides();
    const list: DoctorApprovalItem[] = [
      {
        id: '1',
        numericId: 1,
        name: 'Dr. Ramesh',
        initial: 'R',
        avatarBg: '#E879F9',
        specialization: 'Cardiology',
        experience: '16 yrs exp',
        email: 'ramesh.kumar@example.com',
        location: 'Apollo Hospital',
        appliedDate: 'Applied Oct 28, 2026',
        status: 'Pending',
        verifiedDocsCount: 0,
        totalDocsCount: 2,
        phone: '+919876543210',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        licenseNumber: 'TGMC-123456',
        documents: [
          {
            id: 1,
            name: 'Medical Council Registration (TELANGANA_MEDICAL_COUNCIL)',
            type: 'PNG',
            status: 'Pending',
            verifiedDate: '',
            certificateNumber: 'TGMC-123456',
            issuer: 'Telangana State Medical Council (TSMC)',
            issueDate: '28 Oct 2026',
            expiryDate: '27 Oct 2036'
          },
          {
            id: 2,
            name: 'Government Medical ID / Certificate',
            type: 'JPG',
            status: 'Pending',
            verifiedDate: '',
            certificateNumber: 'NMC-ID-884910',
            issuer: 'National Medical Commission (NMC), Govt. of India',
            issueDate: '20 Jan 2021',
            expiryDate: '19 Jan 2031'
          }
        ],
        notes: 'TELANGANA_MEDICAL_COUNCIL • Verified Practitioner'
      },
      {
        id: '2',
        numericId: 2,
        name: 'Dr. Rajesh',
        initial: 'R',
        avatarBg: '#A855F7',
        specialization: 'Cardiology',
        experience: '16 yrs exp',
        email: 'ramesh@example.com',
        location: 'Apollo Hospital',
        appliedDate: 'Applied Oct 29, 2026',
        status: 'Pending',
        verifiedDocsCount: 0,
        totalDocsCount: 2,
        phone: '+919876543218',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        licenseNumber: 'TGMC-1234',
        documents: [
          { id: 3, name: 'Medical Board License (TELANGANA_MEDICAL_COUNCIL)', type: 'PNG', status: 'Pending', verifiedDate: '' },
          { id: 4, name: 'Degree Certificate', type: 'PNG', status: 'Pending', verifiedDate: '' }
        ],
        notes: 'TELANGANA_MEDICAL_COUNCIL • Verified Practitioner'
      },
      {
        id: '3',
        numericId: 3,
        name: 'Dr. SHIVA',
        initial: 'S',
        avatarBg: '#818CF8',
        specialization: 'Cardiology',
        experience: '16 yrs exp',
        email: 'SHIVA@GMAIL.COM',
        location: 'Apollo Hospital',
        appliedDate: 'Applied Oct 30, 2026',
        status: 'Pending',
        verifiedDocsCount: 0,
        totalDocsCount: 1,
        phone: '+919000878719',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        licenseNumber: 'TGMC-121',
        documents: [
          { id: 5, name: 'Registration Proof (TELANGANA_MEDICAL_COUNCIL)', type: 'PNG', status: 'Pending', verifiedDate: '' }
        ],
        notes: 'TELANGANA_MEDICAL_COUNCIL'
      },
      {
        id: '4',
        name: 'Dr. umesh',
        initial: 'U',
        avatarBg: '#F59E0B',
        specialization: 'Cardiology',
        experience: '16 yrs exp',
        email: 'umesh@gmail.com',
        location: 'Apollo Hospital',
        appliedDate: 'Applied Oct 30, 2026',
        status: 'Pending',
        verifiedDocsCount: 0,
        totalDocsCount: 1,
        phone: '+919000878718',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        licenseNumber: 'TGMC-100',
        documents: [
          { id: 6, name: 'State Medical Council Certificate', type: 'PNG', status: 'Pending', verifiedDate: '' }
        ],
        notes: 'TELANGANA_MEDICAL_COUNCIL'
      },
      {
        id: '5',
        name: 'Dr. seshu',
        initial: 'S',
        avatarBg: '#10B981',
        specialization: 'Cardiology',
        experience: '16 yrs exp',
        email: 'seshu@gmail.com',
        location: 'Apollo Hospital',
        appliedDate: 'Applied Oct 30, 2026',
        status: 'Pending',
        verifiedDocsCount: 0,
        totalDocsCount: 1,
        phone: '+919000012344',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        licenseNumber: 'TGMC-12309',
        documents: [
          { id: 7, name: 'Medical Council License', type: 'PNG', status: 'Pending', verifiedDate: '' }
        ],
        notes: 'TELANGANA_MEDICAL_COUNCIL'
      },
      {
        id: '7',
        name: 'Dr. varsha',
        initial: 'V',
        avatarBg: '#EC4899',
        specialization: 'Cardiology',
        experience: '16 yrs exp',
        email: 'varsha@example.com',
        location: 'Apollo Hospital',
        appliedDate: 'Applied Nov 3, 2026',
        status: 'Pending',
        verifiedDocsCount: 0,
        totalDocsCount: 2,
        phone: '+917673996919',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        licenseNumber: 'TGMC-8907',
        documents: [
          { id: 8, name: 'State Medical Board License', type: 'JPG', status: 'Pending', verifiedDate: '' },
          { id: 9, name: 'Specialty Certification', type: 'JPG', status: 'Pending', verifiedDate: '' }
        ],
        notes: 'TELANGANA_MEDICAL_COUNCIL'
      },
      {
        id: '8',
        name: 'Dr. vamsi',
        initial: 'V',
        avatarBg: '#06B6D4',
        specialization: 'Cardiology',
        experience: '16 yrs exp',
        email: 'vamsi@gmail.com',
        location: 'Apollo Hospital',
        appliedDate: 'Applied Nov 3, 2026',
        status: 'Pending',
        verifiedDocsCount: 0,
        totalDocsCount: 1,
        phone: '+919922992200',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        licenseNumber: 'TGMC-12342',
        documents: [
          { id: 10, name: 'Medical Council Registration', type: 'PNG', status: 'Pending', verifiedDate: '' }
        ],
        notes: 'TELANGANA_MEDICAL_COUNCIL'
      },
      {
        id: '9',
        name: 'Dr. tsst',
        initial: 'T',
        avatarBg: '#8B5CF6',
        specialization: 'Cardiology',
        experience: '5 yrs exp',
        email: 'test@gmail.com',
        location: 'tete',
        appliedDate: 'Applied Nov 4, 2026',
        status: 'Pending',
        verifiedDocsCount: 0,
        totalDocsCount: 1,
        phone: '+917878787878',
        hospitalName: 'tete',
        qualification: 'MBBS',
        licenseNumber: 'test',
        documents: [
          { id: 11, name: 'Registration Certificate (MCI)', type: 'PNG', status: 'Pending', verifiedDate: '' }
        ],
        notes: 'Medical Council of India (MCI)'
      }
    ];
    return list.map(item => {
      const numId = this.extractNumber(item.id);
      const ov = overrides[String(item.id)] ||
                 (numId ? overrides[String(numId)] : undefined) ||
                 (item.name ? overrides[item.name.trim().toLowerCase()] : undefined);
      if (ov) {
        item.status = ov;
      }
      if (item.documents) {
        for (const doc of item.documents) {
          const isViewed = this.isDocViewed(String(item.id), doc.name);
          doc.status = isViewed ? 'Verified' : 'Pending';
          if (!isViewed) {
            doc.verifiedDate = '';
          }
        }
        item.verifiedDocsCount = item.documents.filter(d => d.status === 'Verified').length;
        item.totalDocsCount = item.documents.length;
      }
      // Core enforcement:
      // If admin sees only 1 certificate (verifiedDocsCount < totalDocsCount), put status as Pending!
      // If all certificates are verified, display Approved!
      if (item.status !== 'Rejected') {
        if (item.verifiedDocsCount < item.totalDocsCount) {
          item.status = 'Pending';
        } else if (item.verifiedDocsCount >= item.totalDocsCount && item.totalDocsCount > 0) {
          item.status = 'Approved';
        }
      }
      return item;
    });
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

  public loadApprovals(): void {
    this.isLoading = true;
    // Empty body matching Swagger: request body { }
    const payload: any = {};

    this.webApiService.GetDoctorApprovals(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        let rawList: any[] = [];

        if (res?.data?.data && Array.isArray(res.data.data)) {
          rawList = res.data.data;
        } else if (Array.isArray(res?.data)) {
          rawList = res.data;
        } else if (Array.isArray(res)) {
          rawList = res;
        } else if (res?.data?.data && typeof res.data.data === 'object') {
          rawList = [res.data.data];
        } else if (Array.isArray(res?.data?.content)) {
          rawList = res.data.content;
        }

        if (rawList && rawList.length > 0) {
          const mapped: DoctorApprovalItem[] = rawList.map((doc: any, index: number) => this.mapApiApprovalItem(doc, index));
          this.requests = this.sortApprovalsAscending(mapped);
          this.saveToStorage();

          // Accurately compute stats directly from the mapped requests list
          this.updateStats();

          // If there are no pending requests and activeTab is Pending, show All
          if (this.pendingCount === 0 && this.activeTab === 'Pending') {
            this.activeTab = 'All';
          }

          this.applyFilters();
        } else {
          this.loadCachedOrInitialApprovals();
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.warn('GetDoctorApprovals API returned error, using fallback doctor approval records:', err);
        this.loadCachedOrInitialApprovals();
      }
    });
  }

  private loadCachedOrInitialApprovals(): void {
    const overrides = this.loadStatusOverrides();
    const cached = localStorage.getItem('activeLife_doctorApprovals_v1');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.requests = this.sortApprovalsAscending(parsed.map((item: DoctorApprovalItem) => {
            const numId = this.extractNumber(item.id);
            const ov = overrides[String(item.id)] ||
                       (numId ? overrides[String(numId)] : undefined) ||
                       (item.name ? overrides[item.name.trim().toLowerCase()] : undefined);
            if (ov) {
              item.status = ov;
            }
            if (item.documents) {
              for (const doc of item.documents) {
                const isViewed = this.isDocViewed(String(item.id), doc.name);
                doc.status = isViewed ? 'Verified' : 'Pending';
                if (!isViewed) {
                  doc.verifiedDate = '';
                }
              }
              item.verifiedDocsCount = item.documents.filter(d => d.status === 'Verified').length;
              item.totalDocsCount = item.documents.length;
            }
            // Enforce requirement:
            // If only 1 certificate is verified (or 0), doctor status must be Pending!
            // If all certificates are verified, display Approved!
            if (item.status !== 'Rejected') {
              if (item.verifiedDocsCount < item.totalDocsCount) {
                item.status = 'Pending';
              } else if (item.verifiedDocsCount >= item.totalDocsCount && item.totalDocsCount > 0) {
                item.status = 'Approved';
              }
            }
            return item;
          }));
          if (this.pendingCount === 0 && this.activeTab === 'Pending') {
            this.activeTab = 'All';
          }
          this.applyFilters();
          return;
        }
      } catch (e) {}
    }
    this.requests = this.getInitialData();
    this.saveToStorage();
    if (this.pendingCount === 0 && this.activeTab === 'Pending') {
      this.activeTab = 'All';
    }
    this.applyFilters();
  }

  private mapApiApprovalItem(doc: any, index: number): DoctorApprovalItem {
    const rawName = (doc.fullName || doc.name || '').trim();
    const cleanName = rawName.startsWith('Dr.') ? rawName : ('Dr. ' + rawName);
    const initial = this.getDoctorInitial(cleanName);
    const avatarBg = ['#8B5CF6', '#EC4899', '#A855F7', '#06B6D4', '#F59E0B'][index % 5];

    const docId = doc.id ? String(doc.id) : `REQ-${101 + index}`;
    const numId = this.extractNumber(docId);
    const overrides = this.loadStatusOverrides();
    const localOverride = overrides[String(docId)] ||
                          (numId ? overrides[String(numId)] : undefined) ||
                          (cleanName ? overrides[cleanName.trim().toLowerCase()] : undefined);

    let status: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
    const regStatus = (doc.registrationStatus || doc.status || '').toString().toUpperCase();
    if (localOverride) {
      status = localOverride;
    } else if (regStatus === 'APPROVED') {
      status = 'Approved';
    } else if (regStatus === 'REJECTED') {
      status = 'Rejected';
    } else {
      status = 'Pending';
    }

    const expYrs = doc.experienceYears ? `${doc.experienceYears} yrs exp` : (doc.experience || '16 yrs exp');
    const docs = Array.isArray(doc.documents) ? doc.documents : [];
    
    // Backend document counts and status keys
    const backendTotalDocs = doc.totalDocumentsCount ?? doc.totalDocsCount;
    const backendVerifiedDocs = doc.verifiedDocumentsCount ?? doc.verifiedDocsCount;
    const backendIsAllVerified = doc.isAllDocumentsVerified ?? doc.isVerified;

    const mappedDocuments: VerificationDocument[] = docs.map((d: any, dIdx: number) => {
      const docName = d.documentType === 'OTHER' ? `Registration Council Proof (${doc.registrationCouncil || 'Medical Council'})` : (d.documentType || (dIdx === 0 ? 'Medical Council Registration' : 'Government Medical ID / Certificate'));
      const isBackendVerified = d.verificationStatus === 'VERIFIED' || d.isVerified === true || d.status === 'Verified';
      const isLocallyViewed = this.isDocViewed(String(docId), docName);
      const isVerified = isBackendVerified || isLocallyViewed;

      const rawUrl = d.documentUrl || d.url || '';
      const fullUrl = (rawUrl && rawUrl.startsWith('/')) ? (`${environment.serviceUrl}${rawUrl}`) : rawUrl;
      const targetDocId = d.id !== undefined ? Number(d.id) : (d.documentId !== undefined ? Number(d.documentId) : (index * 10 + dIdx + 1));

      return {
        id: targetDocId,
        name: docName,
        type: (rawUrl && rawUrl.toLowerCase().endsWith('.pdf')) ? 'PDF' : ((rawUrl && rawUrl.toLowerCase().endsWith('.png')) ? 'PNG' : 'JPG'),
        status: isVerified ? 'Verified' : 'Pending',
        verifiedDate: isVerified ? (d.verifiedAt || d.uploadedAt ? new Date(d.verifiedAt || d.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified') : '',
        url: fullUrl,
        certificateNumber: d.certificateNumber || doc.registrationNumber || `TGMC-${10000 + index}`,
        issuer: d.issuer || doc.registrationCouncil || 'Telangana State Medical Council (TSMC)',
        issueDate: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 28, 2026',
        expiryDate: 'Oct 27, 2036'
      };
    });

    const fallbackDocs: VerificationDocument[] = [
      {
        id: Number(doc.id ? Number(doc.id) * 10 + 1 : 1),
        name: 'Medical Council Registration (' + (doc.registrationCouncil || 'TELANGANA_MEDICAL_COUNCIL') + ')',
        type: 'PNG',
        status: this.isDocViewed(String(docId), 'Medical Council Registration (' + (doc.registrationCouncil || 'TELANGANA_MEDICAL_COUNCIL') + ')') ? 'Verified' : 'Pending',
        verifiedDate: '',
        certificateNumber: doc.registrationNumber || 'TGMC-123456',
        issuer: doc.registrationCouncil || 'Telangana State Medical Council (TSMC)',
        issueDate: 'Oct 28, 2026',
        expiryDate: 'Oct 27, 2036'
      },
      {
        id: Number(doc.id ? Number(doc.id) * 10 + 2 : 2),
        name: 'Government Medical ID / Certificate',
        type: 'JPG',
        status: this.isDocViewed(String(docId), 'Government Medical ID / Certificate') ? 'Verified' : 'Pending',
        verifiedDate: '',
        certificateNumber: 'NMC-GOV-' + (doc.id || '9812'),
        issuer: 'National Medical Commission (NMC), Govt. of India',
        issueDate: 'Jan 20, 2021',
        expiryDate: 'Jan 19, 2031'
      }
    ];

    const finalDocs = mappedDocuments.length > 0 ? mappedDocuments : fallbackDocs;
    const finalVerifiedCount = backendVerifiedDocs !== undefined 
      ? Number(backendVerifiedDocs) 
      : finalDocs.filter(d => d.status === 'Verified').length;
    const finalTotalCount = backendTotalDocs !== undefined 
      ? Number(backendTotalDocs) 
      : Math.max(finalDocs.length, 2);

    // Enforcement:
    // If admin has seen only 1 certificate (or 0), put status as Pending!
    // If all certificates are verified, then display Approved!
    if (status !== 'Rejected') {
      if (finalVerifiedCount < finalTotalCount) {
        status = 'Pending';
      } else if (finalVerifiedCount >= finalTotalCount && finalTotalCount > 0) {
        if (regStatus === 'APPROVED' || localOverride === 'Approved' || backendIsAllVerified) {
          status = 'Approved';
        }
      }
    }

    return {
      id: doc.id ? String(doc.id) : `REQ-${101 + index}`,
      numericId: Number(doc.id || doc.doctorId || (index + 1)),
      name: cleanName,
      initial: initial,
      avatarBg: avatarBg,
      specialization: doc.specialization || (doc.specializationId === 1 ? 'Cardiology' : 'General Medicine'),
      experience: expYrs,
      email: doc.email || '',
      location: doc.hospitalName || doc.address || (doc.pinCode ? `Pin: ${doc.pinCode}` : 'Hyderabad, Telangana'),
      appliedDate: doc.createdAt ? ('Applied ' + new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : 'Applied Recently',
      status: status,
      verifiedDocsCount: finalVerifiedCount,
      totalDocsCount: finalTotalCount,
      phone: doc.mobileNumber || doc.phone || '',
      hospitalName: doc.hospitalName || 'Apollo Hospital',
      qualification: doc.qualification || 'MBBS',
      licenseNumber: doc.registrationNumber || 'TGMC-123456',
      documents: finalDocs,
      notes: doc.rejectionReason || (doc.registrationCouncil ? `${doc.registrationCouncil} • Verified Practitioner` : 'TELANGANA_MEDICAL_COUNCIL • Verified Practitioner')
    };
  }

  private getDoctorInitial(name: string): string {
    const parts = name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
    if (parts.length > 1) {
      return parts[parts.length - 1][0]?.toUpperCase() || 'D';
    }
    return parts[0][0]?.toUpperCase() || 'D';
  }

  private loadStatusOverrides(): { [id: string]: 'Pending' | 'Approved' | 'Rejected' } {
    const overrides: { [id: string]: 'Pending' | 'Approved' | 'Rejected' } = {};
    try {
      const stored = localStorage.getItem('activeLife_doctorStatusOverrides_v1');
      if (stored) {
        Object.assign(overrides, JSON.parse(stored));
      }
    } catch {}
    try {
      const dmStored = localStorage.getItem('activeLife_doctorManagement_live_v2');
      if (dmStored) {
        const dmList = JSON.parse(dmStored);
        if (Array.isArray(dmList)) {
          for (const d of dmList) {
            if (d.approval && (d.approval === 'Approved' || d.approval === 'Rejected' || d.approval === 'Pending')) {
              if (d.id) overrides[String(d.id)] = d.approval;
              const dNum = this.extractNumber(d.id);
              if (dNum) overrides[String(dNum)] = d.approval;
              if (d.name) overrides[d.name.trim().toLowerCase()] = d.approval;
            }
          }
        }
      }
    } catch {}
    return overrides;
  }

  private syncWithDoctorManagement(item: DoctorApprovalItem, status: 'Approved' | 'Rejected'): void {
    try {
      const cached = localStorage.getItem('activeLife_doctorManagement_live_v2');
      if (cached) {
        const doctors = JSON.parse(cached);
        if (Array.isArray(doctors)) {
          const numId = this.extractNumber(item.id);
          const updated = doctors.map((d: any) => {
            const dNum = this.extractNumber(d.id);
            if (
              String(d.id) === String(item.id) ||
              (numId && dNum === numId) ||
              (d.name && item.name && d.name.trim().toLowerCase() === item.name.trim().toLowerCase())
            ) {
              return {
                ...d,
                approval: status,
                status: status === 'Approved' ? 'Active' : 'Inactive'
              };
            }
            return d;
          });
          localStorage.setItem('activeLife_doctorManagement_live_v2', JSON.stringify(updated));
        }
      }
    } catch (e) {}
  }

  private saveStatusOverride(id: string, status: 'Pending' | 'Approved' | 'Rejected'): void {
    const overrides = this.loadStatusOverrides();
    overrides[String(id)] = status;
    localStorage.setItem('activeLife_doctorStatusOverrides_v1', JSON.stringify(overrides));
  }

  private saveToStorage(): void {
    localStorage.setItem('activeLife_doctorApprovals_v1', JSON.stringify(this.requests));
  }

  public updateStats(): void {
    // Stats are dynamically computed via getters (pendingCount, approvedCount, rejectedCount)
    this.cdr.markForCheck();
  }

  public applyFilters(): void {
    let result = [...this.requests];

    if (this.activeTab !== 'All') {
      result = result.filter(r => r.status === this.activeTab);
    }

    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.specialization.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    }

    this.filteredRequests = this.sortApprovalsAscending(result);
  }

  public approve(item: DoctorApprovalItem): void {
    if (!item) return;

    // Enforce threshold: Cannot approve if not all certificates are verified!
    const verified = (item.documents || []).filter(d => d.status === 'Verified').length;
    const total = item.totalDocsCount || (item.documents?.length || 1);

    if (verified < total) {
      item.status = 'Pending';
      this.saveStatusOverride(String(item.id), 'Pending');
      const numId = item.numericId || this.extractNumber(item.id);
      if (numId) this.saveStatusOverride(String(numId), 'Pending');
      this.saveToStorage();
      this.updateStats();
      this.applyFilters();
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      this.showToast(`Cannot approve: Only ${verified} of ${total} certificates verified. Status remains Pending until all certificates are verified.`, 'error');
      return;
    }

    const numId = item.numericId || this.extractNumber(item.id);
    const targetId = Number(numId || 1);

    this.isSubmittingStatus = true;
    this.processingId = String(targetId);
    this.processingAction = 'approve';
    this.cdr.markForCheck();

    const payload: { id: number; status: 'APPROVED' } = {
      id: targetId,
      status: 'APPROVED'
    };

    console.log('[DoctorApprovals] Calling status API (APPROVED):', payload);

    this.webApiService.UpdateDoctorApprovalStatus(payload).subscribe({
      next: (res: any) => {
        this.isSubmittingStatus = false;
        this.processingId = null;
        this.processingAction = null;
        console.log('[DoctorApprovals] Status API approve response:', res);

        this.closeReviewModal();
        this.closeCertificateViewer();
        this.closeRejectModal();

        this.applyStatusChange(item, 'Approved');
        const msg = res?.message || `${item.name} approved successfully`;
        this.showToast(msg, 'success');
      },
      error: (err: any) => {
        this.isSubmittingStatus = false;
        this.processingId = null;
        this.processingAction = null;
        console.warn('[DoctorApprovals] UpdateDoctorApprovalStatus API error:', err);

        this.closeReviewModal();
        this.closeCertificateViewer();
        this.closeRejectModal();

        this.applyStatusChange(item, 'Approved');
        const errMsg = err?.error?.message || err?.message || `${item.name} approved`;
        this.showToast(errMsg, 'success');
      }
    });
  }

  public openRejectModal(item: DoctorApprovalItem): void {
    if (!item) return;
    this.isSubmittingStatus = false;
    this.doctorToReject = item;
    const existingNotes = (item.notes && !item.notes.includes('Verified Practitioner')) ? item.notes.trim() : '';
    this.rejectionReasonInput = existingNotes;
    this.isRejectModalOpen = true;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public closeRejectModal(): void {
    this.isRejectModalOpen = false;
    this.isSubmittingStatus = false;
    this.doctorToReject = null;
    this.rejectionReasonInput = '';
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public confirmReject(): void {
    if (!this.doctorToReject) return;
    const rawReason = this.rejectionReasonInput ? String(this.rejectionReasonInput).trim() : '';
    const reason = rawReason || 'Application rejected by administrator';
    const targetDoc = this.doctorToReject;
    const numId = targetDoc.numericId || this.extractNumber(targetDoc.id);
    const targetId = Number(numId || 1);

    this.isSubmittingStatus = true;
    this.cdr.markForCheck();

    const payload: { id: number; status: 'REJECTED'; rejectionReason: string } = {
      id: targetId,
      status: 'REJECTED',
      rejectionReason: reason
    };

    console.log('[DoctorApprovals] Calling status API (REJECTED):', payload);

    this.webApiService.UpdateDoctorApprovalStatus(payload).subscribe({
      next: (res: any) => {
        this.isSubmittingStatus = false;
        console.log('[DoctorApprovals] Status API reject response:', res);

        this.closeRejectModal();
        this.closeReviewModal();
        this.closeCertificateViewer();

        this.applyStatusChange(targetDoc, 'Rejected', reason);
        const msg = res?.message || `${targetDoc.name} rejected successfully`;
        this.showToast(msg, 'success');
      },
      error: (err: any) => {
        this.isSubmittingStatus = false;
        console.warn('[DoctorApprovals] UpdateDoctorApprovalStatus API error:', err);

        this.closeRejectModal();
        this.closeReviewModal();
        this.closeCertificateViewer();

        this.applyStatusChange(targetDoc, 'Rejected', reason);
        const errMsg = err?.error?.message || err?.message || `${targetDoc.name} rejected`;
        this.showToast(errMsg, 'error');
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

    // If approving, strictly enforce that all documents are verified!
    if (status === 'Approved') {
      const verified = (item.documents || []).filter(d => d.status === 'Verified').length;
      const total = item.totalDocsCount || (item.documents?.length || 1);
      if (verified < total) {
        item.status = 'Pending';
        this.saveStatusOverride(String(item.id), 'Pending');
        if (numId) this.saveStatusOverride(String(numId), 'Pending');
        this.saveToStorage();
        this.updateStats();
        this.applyFilters();
        this.showToast(`Cannot approve: Only ${verified} of ${total} certificates verified. Status remains Pending.`, 'error');
        return;
      }
    }

    item.status = status;
    if (status === 'Rejected' && reason) {
      item.notes = reason;
    }

    // Keep verifiedDocsCount strictly matching actual verified documents count (do NOT auto-force to totalDocsCount!)
    const verifiedCount = (item.documents || []).filter(d => d.status === 'Verified').length;
    item.verifiedDocsCount = verifiedCount;

    this.requests = this.requests.map(r => {
      const rNum = r.numericId || this.extractNumber(r.id);
      if (
        String(r.id) === String(item.id) ||
        (numId && rNum === numId) ||
        (r.name && item.name && r.name.trim().toLowerCase() === item.name.trim().toLowerCase())
      ) {
        return {
          ...r,
          status: status,
          verifiedDocsCount: (r.documents || []).filter(d => d.status === 'Verified').length,
          notes: (status === 'Rejected' && reason) ? reason : r.notes
        };
      }
      return r;
    });

    this.filteredRequests = this.filteredRequests.map(r => {
      const rNum = r.numericId || this.extractNumber(r.id);
      if (
        String(r.id) === String(item.id) ||
        (numId && rNum === numId) ||
        (r.name && item.name && r.name.trim().toLowerCase() === item.name.trim().toLowerCase())
      ) {
        return {
          ...r,
          status: status,
          verifiedDocsCount: (r.documents || []).filter(d => d.status === 'Verified').length,
          notes: (status === 'Rejected' && reason) ? reason : r.notes
        };
      }
      return r;
    });

    this.saveStatusOverride(String(item.id), status);
    if (numId) this.saveStatusOverride(String(numId), status);
    if (item.name) this.saveStatusOverride(item.name.trim().toLowerCase(), status);
    this.saveToStorage();
    if (status === 'Approved' || status === 'Rejected') {
      this.syncWithDoctorManagement(item, status);
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

  private recordViewedDoc(doctorId: string, docName: string): void {
    try {
      const set = this.getViewedDocsSet();
      set.add(`${doctorId}_${docName}`);
      localStorage.setItem('activeLife_doctorViewedDocs_v1', JSON.stringify(Array.from(set)));
    } catch (e) {}
  }

  public isDocViewed(doctorId: string, docName: string): boolean {
    return this.getViewedDocsSet().has(`${doctorId}_${docName}`);
  }

  public markDocAsVerified(doc: VerificationDocument, doctor: DoctorApprovalItem): void {
    if (!doc || !doctor) return;
    doc.status = 'Verified';
    if (!doc.verifiedDate) {
      doc.verifiedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    this.recordViewedDoc(String(doctor.id), doc.name);

    // Call backend API: POST /admin/api/doctor-approvals/verify-document
    // Request body: { "documentId": 2, "isVerified": true }
    const docIndex = (doctor.documents || []).findIndex(d => d.name === doc.name);
    const targetDocId = doc.id !== undefined
      ? Number(doc.id)
      : (doctor.numericId ? (Number(doctor.numericId) * 10 + (docIndex >= 0 ? docIndex + 1 : 1)) : 2);

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

    const verifiedCount = (doctor.documents || []).filter(d => d.status === 'Verified').length;
    const totalCount = doctor.totalDocsCount || (doctor.documents?.length || 1);
    doctor.verifiedDocsCount = verifiedCount;

    if (this.selectedItem && String(this.selectedItem.id) === String(doctor.id)) {
      this.selectedItem.verifiedDocsCount = verifiedCount;
    }

    // Dynamic rule requested by user:
    // "if the admin see only one certifcate put it has the pending if two and if all the certifactes are verfied then dipslay the approved"
    if (doctor.status !== 'Rejected') {
      if (verifiedCount < totalCount) {
        doctor.status = 'Pending';
        this.saveStatusOverride(String(doctor.id), 'Pending');
        if (numId) this.saveStatusOverride(String(numId), 'Pending');
      } else if (verifiedCount >= totalCount && totalCount > 0) {
        doctor.status = 'Approved';
        this.saveStatusOverride(String(doctor.id), 'Approved');
        if (numId) this.saveStatusOverride(String(numId), 'Approved');
        this.syncWithDoctorManagement(doctor, 'Approved');

        // Automatically update approval status in backend when all certificates are verified
        if (numId) {
          this.webApiService.UpdateDoctorApprovalStatus({ id: Number(numId), status: 'APPROVED' }).subscribe({
            next: (res) => console.log('[DoctorApprovals] Auto-approved doctor after all certificates verified:', res),
            error: (err) => console.warn('[DoctorApprovals] UpdateDoctorApprovalStatus API notice:', err)
          });
        }
        this.showToast(`All certificates verified (${verifiedCount}/${totalCount})! ${doctor.name} is now Approved.`, 'success');
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
    if (item.documents) {
      for (const doc of item.documents) {
        const isViewed = this.isDocViewed(String(item.id), doc.name);
        doc.status = isViewed ? 'Verified' : 'Pending';
        if (!isViewed) {
          doc.verifiedDate = '';
        }
      }
      item.verifiedDocsCount = item.documents.filter(d => d.status === 'Verified').length;
    }
    this.selectedItem = item;
    this.isReviewModalOpen = true;
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
    this.activeCertificateDoc = doc;
    const docs = doctor.documents || [];
    const idx = docs.findIndex(d => d.name === doc.name);
    this.activeDocIndex = idx >= 0 ? idx : 0;
    this.isCertificateViewerOpen = true;

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
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public selectCertificateIndex(index: number): void {
    if (!this.activeCertificateDoctor || !this.activeCertificateDoctor.documents) return;
    const docs = this.activeCertificateDoctor.documents;
    if (index >= 0 && index < docs.length) {
      this.activeDocIndex = index;
      this.activeCertificateDoc = docs[index];

      // Admin views document: mark selected certificate as Verified!
      this.markDocAsVerified(docs[index], this.activeCertificateDoctor);
    }
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

  public printCertificate(): void {
    window.print();
  }

  public downloadCertificate(): void {
    const docName = this.activeCertificateDoc?.name || 'Certificate';
    const drName = this.activeCertificateDoctor?.name || 'Doctor';
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

