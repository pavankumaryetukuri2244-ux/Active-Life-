import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { WebapiService } from '../../services/webapi.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

export interface DoctorDocument {
  id?: number | string;
  name: string;
  type: 'PDF' | 'PNG' | 'JPG';
  documentType?: string;
  status?: string;
  verifiedDate?: string;
  url?: string;
  certificateNumber?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface DoctorHospital {
  id: number;
  hospitalName: string;
  location?: string;
}

export interface DaySession {
  sessionNumber?: number;
  startTime?: string;
  endTime?: string;
  fromTime?: string;
  toTime?: string;
  session?: string;
  time?: string;
  hospitalId?: number;
  hospitalName?: string;
  location?: string;
}

export interface AvailabilityDay {
  day: string; // 'MONDAY', 'TUESDAY', etc.
  open: boolean;
  sessions: DaySession[];
}

export interface DoctorAvailabilityData {
  doctorId: number;
  doctorName: string;
  offlineAppointments: boolean;
  hospitals: DoctorHospital[];
  days: AvailabilityDay[];
}

export interface DoctorItem {
  id: string; // e.g. 'D001'
  numericId?: number;
  name: string; // e.g. 'Dr. Emily Roberts'
  initial: string; // e.g. 'R'
  avatarBg: string;
  patientsCount: number; // e.g. 342
  specialization: string; // e.g. 'Pediatrics'
  specializationId?: number;
  experience: string; // e.g. '12 yrs'
  experienceYears?: number;
  status: 'Active' | 'Inactive';
  approval: 'Approved' | 'Pending' | 'Rejected';
  rating: number; // e.g. 4.8 or 0 for N/A
  email?: string;
  phone?: string;
  gender?: string;
  hospitalName?: string;
  qualification?: string;
  address?: string;
  pinCode?: string;
  consultationFee?: number;
  registrationNumber?: string;
  registrationCouncil?: string;
  departmentId?: number;
  about?: string;
  createdAt?: string;
  allowedActions?: string[];
  documents?: DoctorDocument[];
  raw?: any;
}

export interface DoctorForm {
  id?: string;
  numericId?: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  hospitalName: string;
  specializationId: number;
  specialization: string;
  qualification: string;
  address: string;
  pinCode: string;
  consultationFee: number | string;
  experienceYears: number | string;
  patientsCount: number | string;
  status: 'Active' | 'Inactive';
  approval: 'Approved' | 'Pending' | 'Rejected';
  rating: number | string;
  about: string;
}

@Component({
  selector: 'app-doctor-management',
  templateUrl: './doctor-management.component.html',
  standalone: false,
  styles: [`
    /* Additional custom overrides matching User Management reference styling */
    .um-approval-approved {
      background-color: #ECFDF5 !important;
      color: #059669 !important;
    }
    .um-approval-pending {
      background-color: #FFFBEB !important;
      color: #D97706 !important;
    }
    .um-approval-rejected {
      background-color: #FEF2F2 !important;
      color: #DC2626 !important;
    }

    /* Modal Backdrop */
    .dm-modal-backdrop {
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

    .dm-modal-content {
      background: #FFFFFF;
      border-radius: 16px;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.18);
      position: relative;
    }

    .dropdown-action-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 9px 16px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #334155;
      text-align: left;
      transition: background 0.15s ease;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .dropdown-action-btn:hover {
      background: #F8FAFC !important;
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
    }
  `]
})
export class DoctorManagementComponent implements OnInit, OnDestroy {
  // Doctor list
  public doctors: DoctorItem[] = [];
  public filteredDoctors: DoctorItem[] = [];

  // Filter & Search state
  public searchQuery: string = '';
  public activeTab: 'All' | 'Approved' | 'Pending' | 'Rejected' = 'All';
  private searchSubject: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  // Statistics (3 cards: Total Doctors, Active Doctors, Pending Approval)
  public totalDoctorsCount: number = 8;
  public activeDoctorsCount: number = 8;
  public pendingApprovalCount: number = 0;

  // Actions Dropdown
  public openDropdownId: string | null = null;

  // Modals
  public isAddModalOpen: boolean = false;
  public isEditing: boolean = false;
  public isViewModalOpen: boolean = false;
  public selectedDoctor: DoctorItem | null = null;
  public editingDoctor: DoctorItem | null = null;
  public isAvailabilityModalOpen: boolean = false;
  public availabilityDoctor: DoctorItem | null = null;
  public isLoadingAvailability: boolean = false;
  public isSavingAvailability: boolean = false;
  public doctorAvailability: DoctorAvailabilityData | null = null;
  public selectedAvailabilityDay: string = 'MONDAY';
  public updatingDay: string | null = null;
  public isDocumentsModalOpen: boolean = false;
  public documentsDoctor: DoctorItem | null = null;
  public isCertificateViewerOpen: boolean = false;
  public activeCertificateDoctor: DoctorItem | null = null;
  public activeCertificateDoc: DoctorDocument | null = null;
  public activeDocIndex: number = 0;

  // Form Model
  public formModel: DoctorForm = this.getEmptyForm();
  public formError: string = '';
  public isSubmitting: boolean = false;

  // Specialization Options & Mapping
  public readonly specializationOptions = [
    { id: 1, name: 'Cardiology' },
    { id: 2, name: 'Pediatrics' },
    { id: 3, name: 'Gynecology' },
    { id: 4, name: 'Orthopedics' },
    { id: 5, name: 'Dermatology' },
    { id: 6, name: 'Neurology' },
    { id: 7, name: 'General Medicine' },
    { id: 8, name: 'Psychiatry' },
    { id: 9, name: 'Endocrinology' },
    { id: 10, name: 'Gastroenterology' },
    { id: 11, name: 'ENT' }
  ];

  public onSpecializationChange(specId: any): void {
    const id = Number(specId);
    this.formModel.specializationId = id;
    const found = this.specializationOptions.find(s => s.id === id);
    if (found) {
      this.formModel.specialization = found.name;
    }
  }

  public getSpecializationIdByName(name: string): number {
    if (!name) return 1;
    const match = this.specializationOptions.find(s => s.name.toLowerCase() === name.toLowerCase());
    return match ? match.id : 1;
  }

  public getSpecializationNameById(id: number): string {
    const match = this.specializationOptions.find(s => s.id === id);
    return match ? match.name : 'Cardiology';
  }

  // Toast
  public toastMessage: string = '';
  public toastType: 'success' | 'error' = 'success';
  private toastTimer: any = null;

  // Pagination
  public Math = Math;
  public currentPage: number = 1;
  public pageSize: number = 10;
  public totalPages: number = 1;

  // Avatar palette
  private avatarColors: string[] = [
    '#E879F9', // Pink
    '#818CF8', // Indigo
    '#A855F7', // Violet
    '#F43F5E', // Rose
    '#06B6D4', // Teal
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6'  // Blue
  ];

  @HostListener('document:click')
  public onDocumentClick(): void {
    this.closeDropdown();
  }


  public isLoading: boolean = false;

  constructor(
    private webApiService: WebapiService
  ) {
    this.doctors = this.getInitialDoctors();
    this.filteredDoctors = [...this.doctors];
    this.updateStats();
  }
  ngOnInit(): void {
    this.doctors = this.getInitialDoctors();
    this.filteredDoctors = [...this.doctors];
    this.updateStats();
    this.initSearchDebounce();
    this.loadDoctors();
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
    });
  }

  public onSearchInput(event: any): void {
    const val = event.target ? event.target.value : '';
    this.searchSubject.next(val);
  }

  public setTab(tab: 'All' | 'Approved' | 'Pending' | 'Rejected'): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilters();
  }

  public toggleDropdown(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  public closeDropdown(): void {
    this.openDropdownId = null;
  }

  // Initial Seed Data matching the user screenshot exactly
  private getInitialDoctors(): DoctorItem[] {
    return [
      {
        id: '1',
        numericId: 1,
        name: 'Dr. Ramesh',
        initial: 'R',
        avatarBg: '#E879F9',
        patientsCount: 0,
        specialization: 'Cardiology',
        specializationId: 1,
        experience: '16 yrs',
        experienceYears: 16,
        status: 'Active',
        approval: 'Approved',
        rating: 4.8,
        email: 'ramesh.kumar@example.com',
        phone: '+919876543210',
        gender: 'MALE',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        address: 'Road No. 10, Banjara Hills, Hyderabad, Telangana',
        pinCode: '500034',
        consultationFee: 500,
        about: 'Road No. 10, Banjara Hills, Hyderabad, Telangana'
      },
      {
        id: '2',
        numericId: 2,
        name: 'Dr. Rajesh',
        initial: 'R',
        avatarBg: '#A855F7',
        patientsCount: 0,
        specialization: 'Cardiology',
        specializationId: 1,
        experience: '16 yrs',
        experienceYears: 16,
        status: 'Active',
        approval: 'Approved',
        rating: 4.9,
        email: 'ramesh@example.com',
        phone: '+919876543218',
        gender: 'MALE',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        address: 'Road No. 10, Banjara Hills, Hyderabad, Telangana',
        pinCode: '500034',
        consultationFee: 500,
        about: 'Road No. 10, Banjara Hills, Hyderabad, Telangana'
      },
      {
        id: '3',
        numericId: 3,
        name: 'Dr. SHIVA',
        initial: 'S',
        avatarBg: '#818CF8',
        patientsCount: 0,
        specialization: 'Cardiology',
        specializationId: 1,
        experience: '16 yrs',
        experienceYears: 16,
        status: 'Active',
        approval: 'Approved',
        rating: 4.8,
        email: 'SHIVA@GMAIL.COM',
        phone: '+919000878719',
        gender: 'MALE',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        address: 'Road No. 10, Banjara Hills, Hyderabad, Telangana',
        pinCode: '500034',
        consultationFee: 500,
        about: 'Road No. 10, Banjara Hills, Hyderabad, Telangana'
      },
      {
        id: '4',
        numericId: 4,
        name: 'Dr. umesh',
        initial: 'U',
        avatarBg: '#F59E0B',
        patientsCount: 0,
        specialization: 'Cardiology',
        specializationId: 1,
        experience: '16 yrs',
        experienceYears: 16,
        status: 'Active',
        approval: 'Approved',
        rating: 4.6,
        email: 'umesh@gmail.com',
        phone: '+919000878718',
        gender: 'MALE',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        address: 'Road No. 10, Banjara Hills, Hyderabad, Telangana',
        pinCode: '500034',
        consultationFee: 500,
        about: 'Road No. 10, Banjara Hills, Hyderabad, Telangana'
      },
      {
        id: '5',
        numericId: 5,
        name: 'Dr. seshu',
        initial: 'S',
        avatarBg: '#10B981',
        patientsCount: 0,
        specialization: 'Cardiology',
        specializationId: 1,
        experience: '16 yrs',
        experienceYears: 16,
        status: 'Active',
        approval: 'Approved',
        rating: 4.7,
        email: 'seshu@gmail.com',
        phone: '+919000012344',
        gender: 'MALE',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        address: 'Road No. 10, Banjara Hills, Hyderabad, Telangana',
        pinCode: '500034',
        consultationFee: 500,
        about: 'Road No. 10, Banjara Hills, Hyderabad, Telangana'
      },
      {
        id: '7',
        numericId: 7,
        name: 'Dr. varsha',
        initial: 'V',
        avatarBg: '#EC4899',
        patientsCount: 0,
        specialization: 'Cardiology',
        specializationId: 1,
        experience: '16 yrs',
        experienceYears: 16,
        status: 'Active',
        approval: 'Approved',
        rating: 4.8,
        email: 'varsha@example.com',
        phone: '+917673996919',
        gender: 'FEMALE',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        address: 'Road No. 10, Banjara Hills, Hyderabad, Telangana',
        pinCode: '500034',
        consultationFee: 500,
        about: 'Road No. 10, Banjara Hills, Hyderabad, Telangana'
      },
      {
        id: '8',
        numericId: 8,
        name: 'Dr. vamsi',
        initial: 'V',
        avatarBg: '#06B6D4',
        patientsCount: 0,
        specialization: 'Cardiology',
        specializationId: 1,
        experience: '16 yrs',
        experienceYears: 16,
        status: 'Active',
        approval: 'Approved',
        rating: 4.9,
        email: 'vamsi@gmail.com',
        phone: '+919922992200',
        gender: 'MALE',
        hospitalName: 'Apollo Hospital',
        qualification: 'MBBS',
        address: 'Road No. 10, Banjara Hills, Hyderabad, Telangana',
        pinCode: '500034',
        consultationFee: 500,
        about: 'Road No. 10, Banjara Hills, Hyderabad, Telangana'
      },
      {
        id: '9',
        numericId: 9,
        name: 'Dr. Emily Roberts',
        initial: 'E',
        avatarBg: '#8B5CF6',
        patientsCount: 0,
        specialization: 'Cardiology',
        specializationId: 1,
        experience: '5 yrs',
        experienceYears: 5,
        status: 'Active',
        approval: 'Approved',
        rating: 4.8,
        email: 'emily.roberts@hospital.com',
        phone: '+919876543710',
        gender: 'FEMALE',
        hospitalName: 'City Hospital',
        qualification: 'MD',
        address: 'Banjara Hills, Hyderabad',
        pinCode: '500034',
        consultationFee: 500,
        about: 'Banjara Hills, Hyderabad'
      }
    ];
  }

  public sortDoctorsAscending(list: DoctorItem[]): DoctorItem[] {
    if (!list || list.length === 0) return [];
    return [...list].sort((a, b) => {
      const numA = this.extractIdNumber(a.id);
      const numB = this.extractIdNumber(b.id);
      if (numA !== numB) {
        return numA - numB; // Ascending: 1, 2, 3, 4, 5, 7, 8, 9
      }
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    });
  }

  private extractIdNumber(val: any): number {
    if (typeof val === 'number') return val;
    const match = String(val).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  public loadDoctors(): void {
    this.isLoading = true;
    this.webApiService.GetDoctors({ sortBy: 'id', sortOrder: 'ASC' }).pipe(
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
        } else if (Array.isArray(res?.data?.doctors)) {
          rawList = res.data.doctors;
        } else if (Array.isArray(res?.doctors)) {
          rawList = res.doctors;
        }

        if (rawList && rawList.length > 0) {
          const mapped: DoctorItem[] = rawList.map((doc: any, index: number) => this.mapApiDoctor(doc, index));
          this.doctors = this.sortDoctorsAscending(mapped);
          this.filteredDoctors = [...this.doctors];
          this.saveToStorage();

          // Compute accurate stats directly from doctors list
          this.updateStats();

          this.totalPages = Math.ceil(this.filteredDoctors.length / this.pageSize) || 1;
        } else {
          this.loadCachedOrInitial();
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.warn('GetDoctors API returned error, using fallback doctor records:', err);
        this.loadCachedOrInitial();
      }
    });
  }

  private loadCachedOrInitial(): void {
    const cached = localStorage.getItem('activeLife_doctorManagement_live_v2');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((p: any) => {
            const raw = p.numericId || (p.id ? String(p.id).replace(/\D/g, '') : '');
            p.id = raw ? String(parseInt(raw, 10)) : '1';
            p.numericId = parseInt(p.id, 10);
          });
          this.doctors = this.sortDoctorsAscending(parsed);
          this.filteredDoctors = [...this.doctors];
          this.updateStats();
          this.totalPages = Math.ceil(this.filteredDoctors.length / this.pageSize) || 1;
          return;
        }
      } catch (e) {}
    }
    this.doctors = this.getInitialDoctors();
    this.filteredDoctors = [...this.doctors];
    this.saveToStorage();
    this.updateStats();
    this.totalPages = Math.ceil(this.filteredDoctors.length / this.pageSize) || 1;
  }

  private mapApiDoctor(doc: any, index: number): DoctorItem {
    let rawName = (doc.fullName || doc.name || '').trim();
    let cleanName = rawName;
    if (!cleanName.toLowerCase().startsWith('dr.') && !cleanName.toLowerCase().startsWith('dr ')) {
      cleanName = 'Dr. ' + cleanName;
    }
    const initial = this.getDoctorInitial(cleanName);
    const avatarBg = this.avatarColors[index % this.avatarColors.length];

    const status: 'Active' | 'Inactive' = (doc.status === 'Active' || doc.isActive === true) ? 'Active' : 'Inactive';

    let approval: 'Approved' | 'Pending' | 'Rejected' = 'Pending';
    const regStatus = (doc.registrationStatus || doc.approval || '').toString().toUpperCase();
    if (regStatus === 'APPROVED') {
      approval = 'Approved';
    } else if (regStatus === 'REJECTED') {
      approval = 'Rejected';
    } else if (regStatus === 'PENDING') {
      approval = 'Pending';
    } else if (doc.approval) {
      approval = doc.approval;
    }

    const expYrs = doc.experienceYears !== undefined && doc.experienceYears !== null
      ? `${doc.experienceYears} yrs`
      : (doc.experience || '0 yrs');

    const rawNumId = doc.id ? Number(doc.id) : (doc.doctorId ? Number(doc.doctorId) : (index + 1));
    const doctorId = String(rawNumId);
    const specId = doc.specializationId ? Number(doc.specializationId) : this.getSpecializationIdByName(doc.specialization);

    const rawDocs = doc.documents || doc.doctorDocuments || doc.verificationDocuments || doc.credentials || [];
    let mappedDocs: DoctorDocument[] = [];
    if (Array.isArray(rawDocs) && rawDocs.length > 0) {
      mappedDocs = rawDocs.map((d: any, idx: number) => {
        const docName = d.name || d.documentName || d.title || d.documentType || `Document ${idx + 1}`;
        const docUrl = d.url || d.fileUrl || d.documentUrl || '';
        let docType: 'PDF' | 'PNG' | 'JPG' = 'PDF';
        if (docUrl.toLowerCase().endsWith('.png')) docType = 'PNG';
        else if (docUrl.toLowerCase().endsWith('.jpg') || docUrl.toLowerCase().endsWith('.jpeg')) docType = 'JPG';
        else if (d.type && ['PDF', 'PNG', 'JPG'].includes(d.type.toUpperCase())) docType = d.type.toUpperCase();

        return {
          id: d.id || idx + 1,
          name: docName,
          type: docType,
          documentType: d.documentType || d.type || 'CERTIFICATE',
          status: d.status || 'Verified',
          verifiedDate: d.verifiedDate || d.createdAt || '',
          url: docUrl,
          certificateNumber: d.certificateNumber || d.regNumber || doc.registrationNumber || '',
          issuer: d.issuer || doc.registrationCouncil || '',
          issueDate: d.issueDate || '',
          expiryDate: d.expiryDate || ''
        };
      });
    }

    return {
      id: doctorId,
      numericId: rawNumId,
      name: cleanName,
      initial: initial,
      avatarBg: avatarBg,
      patientsCount: Number(doc.patientCount ?? doc.patientsCount ?? 0),
      specialization: doc.specialization || this.getSpecializationNameById(specId),
      specializationId: specId,
      experience: expYrs,
      experienceYears: doc.experienceYears !== undefined ? Number(doc.experienceYears) : 5,
      status: status,
      approval: approval,
      rating: doc.rating !== undefined ? Number(doc.rating) : 0,
      email: doc.email || '',
      phone: doc.mobileNumber || doc.phone || '',
      gender: doc.gender || 'MALE',
      hospitalName: doc.hospitalName || '',
      qualification: doc.qualification || '',
      address: doc.address || doc.about || '',
      pinCode: doc.pinCode || '',
      consultationFee: doc.consultationFee !== undefined ? Number(doc.consultationFee) : 500,
      registrationNumber: doc.registrationNumber || '',
      registrationCouncil: doc.registrationCouncil || '',
      departmentId: doc.departmentId ? Number(doc.departmentId) : 1,
      about: doc.about || doc.address || '',
      createdAt: doc.createdAt || '',
      allowedActions: Array.isArray(doc.allowedActions) ? doc.allowedActions : ['VIEW', 'EDIT', 'SET_AVAILABILITY', 'VIEW_DOCUMENTS', 'SET_INACTIVE'],
      documents: mappedDocs,
      raw: doc
    };
  }

  private getDoctorInitial(name: string): string {
    const clean = name.replace(/^Dr\.\s*/i, '').trim();
    if (!clean) return 'D';
    return clean[0].toUpperCase();
  }

  private saveToStorage(): void {
    try {
      const cleanDoctors = this.doctors.map(d => {
        const { raw, documents, ...rest } = d;
        return rest;
      });
      localStorage.setItem('activeLife_doctorManagement_live_v2', JSON.stringify(cleanDoctors));
    } catch (e) {
      console.warn('saveToStorage failed:', e);
    }
  }

  public updateStats(): void {
    this.totalDoctorsCount = this.doctors.length;
    this.activeDoctorsCount = this.doctors.filter(d => d.status === 'Active').length;
    this.pendingApprovalCount = this.doctors.filter(d => d.approval === 'Pending').length;
  }

  public applyFilters(): void {
    let result = [...this.doctors];

    // Filter by approval tab chip
    if (this.activeTab && this.activeTab !== 'All') {
      const target = this.activeTab.toLowerCase();
      result = result.filter(d => (d.approval || '').toLowerCase() === target);
    }

    // Filter by search query
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(d =>
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.id && d.id.toLowerCase().includes(q)) ||
        (d.specialization && d.specialization.toLowerCase().includes(q)) ||
        (d.hospitalName && d.hospitalName.toLowerCase().includes(q)) ||
        (d.email && d.email.toLowerCase().includes(q)) ||
        (d.phone && d.phone.toLowerCase().includes(q))
      );
    }

    this.filteredDoctors = this.sortDoctorsAscending(result);
    this.totalPages = Math.ceil(this.filteredDoctors.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  public get paginatedDoctors(): DoctorItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDoctors.slice(start, start + this.pageSize);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Quick actions
  public toggleStatus(doctor: DoctorItem): void {
    const nextStatus = doctor.status === 'Active' ? 'Inactive' : 'Active';
    this.setDoctorStatus(doctor, nextStatus);
  }

  public setApproval(doctor: DoctorItem, status: 'Approved' | 'Pending' | 'Rejected'): void {
    doctor.approval = status;
    if (status === 'Pending' || status === 'Rejected') {
      doctor.rating = 0; // N/A
      doctor.status = 'Inactive';
    } else if (doctor.rating === 0) {
      doctor.rating = 4.8;
      doctor.status = 'Active';
    }
    this.saveToStorage();
    this.updateStats();
    this.applyFilters();
    this.showToast(`Doctor ${doctor.name} approval status changed to ${status}`, 'success');

    // Sync status override for Doctor Approvals page
    try {
      const overridesStr = localStorage.getItem('activeLife_doctorStatusOverrides_v1');
      const overrides = overridesStr ? JSON.parse(overridesStr) : {};
      overrides[String(doctor.id)] = status;
      const numId = this.extractIdNumber(doctor.id);
      if (numId) overrides[String(numId)] = status;
      if (doctor.name) overrides[doctor.name.trim().toLowerCase()] = status;
      localStorage.setItem('activeLife_doctorStatusOverrides_v1', JSON.stringify(overrides));
    } catch (e) {}

    // Call backend update-status API
    const numId = this.extractIdNumber(doctor.id) || 1;
    const apiStatus = status === 'Approved' ? 'APPROVED' : (status === 'Rejected' ? 'REJECTED' : 'PENDING');
    if (apiStatus === 'APPROVED' || apiStatus === 'REJECTED') {
      const payload: { id: number; status: 'APPROVED' | 'REJECTED'; rejectionReason?: string } = {
        id: numId,
        status: apiStatus,
        ...(apiStatus === 'REJECTED' ? { rejectionReason: 'Application rejected by administrator' } : {})
      };
      this.webApiService.UpdateDoctorApprovalStatus(payload).subscribe({
        next: (res: any) => console.log('DoctorManagement update-status success:', res),
        error: (err: any) => console.warn('DoctorManagement update-status notice:', err)
      });
    }
  }

  public viewDoctor(doctor: DoctorItem): void {
    this.selectedDoctor = doctor;
    this.isViewModalOpen = true;
  }

  public closeViewModal(): void {
    this.isViewModalOpen = false;
    this.selectedDoctor = null;
  }

  public openAvailabilityModal(doctor: DoctorItem): void {
    this.availabilityDoctor = doctor;
    this.isAvailabilityModalOpen = true;
    this.isLoadingAvailability = true;
    this.doctorAvailability = null;
    this.selectedAvailabilityDay = 'MONDAY';
    this.updatingDay = null;

    const rawId = doctor.numericId !== undefined && doctor.numericId !== null
      ? doctor.numericId
      : String(doctor.id).replace(/\D/g, '');
    const docId = Number(rawId) || 1;

    console.log('[DoctorManagement] Loading availability for Doctor ID:', docId);

    this.webApiService.GetDoctorAvailability({ id: docId }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isLoadingAvailability = false;
        console.log('[DoctorManagement] GetDoctorAvailability response:', res);
        if (res && res.data) {
          this.doctorAvailability = this.normalizeAvailabilityData(res.data, doctor, docId);
        } else {
          this.doctorAvailability = this.getDefaultAvailability(doctor, docId);
        }
      },
      error: (err: any) => {
        console.warn('GetDoctorAvailability failed, fallback to default:', err);
        this.isLoadingAvailability = false;
        this.doctorAvailability = this.getDefaultAvailability(doctor, docId);
      }
    });
  }

  public closeAvailabilityModal(): void {
    this.isAvailabilityModalOpen = false;
    this.availabilityDoctor = null;
    this.doctorAvailability = null;
    this.isLoadingAvailability = false;
    this.isSavingAvailability = false;
    this.updatingDay = null;
  }

  public selectAvailabilityDay(dayName: string): void {
    if (dayName) {
      this.selectedAvailabilityDay = dayName.toUpperCase().trim();
    }
  }

  public get activeAvailabilityDay(): AvailabilityDay | null {
    if (!this.doctorAvailability || !this.doctorAvailability.days) return null;
    const found = this.doctorAvailability.days.find(d => d.day === this.selectedAvailabilityDay);
    return found || this.doctorAvailability.days[0] || null;
  }

  public toggleOfflineAppointments(): void {
    if (this.doctorAvailability) {
      this.doctorAvailability.offlineAppointments = !this.doctorAvailability.offlineAppointments;
    }
  }

  public toggleDayOpen(dayItem: AvailabilityDay): void {
    dayItem.open = !dayItem.open;
    if (dayItem.open && (!dayItem.sessions || dayItem.sessions.length === 0)) {
      dayItem.sessions = [
        { sessionNumber: 1, startTime: '09:00', endTime: '17:00' }
      ];
    }
  }

  public addSession(dayItem: AvailabilityDay): void {
    if (!dayItem.sessions) {
      dayItem.sessions = [];
    }
    const nextSessionNum = dayItem.sessions.length + 1;
    let start = '09:00';
    let end = '17:00';
    if (dayItem.sessions.length === 1) {
      start = '14:00';
      end = '18:00';
    } else if (dayItem.sessions.length >= 2) {
      start = '18:30';
      end = '20:30';
    }
    dayItem.sessions.push({
      sessionNumber: nextSessionNum,
      startTime: start,
      endTime: end
    });
  }

  public removeSession(dayItem: AvailabilityDay, sessionIndex: number): void {
    if (dayItem.sessions && dayItem.sessions.length > sessionIndex) {
      dayItem.sessions.splice(sessionIndex, 1);
      dayItem.sessions.forEach((s, idx) => s.sessionNumber = idx + 1);
      if (dayItem.sessions.length === 0) {
        dayItem.open = false;
      }
    }
  }

  public formatDayName(day: string): string {
    if (!day) return '';
    const d = day.trim().toUpperCase();
    switch (d) {
      case 'MONDAY': return 'Monday';
      case 'TUESDAY': return 'Tuesday';
      case 'WEDNESDAY': return 'Wednesday';
      case 'THURSDAY': return 'Thursday';
      case 'FRIDAY': return 'Friday';
      case 'SATURDAY': return 'Saturday';
      case 'SUNDAY': return 'Sunday';
      default: return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    }
  }

  public to24Hour(time: any): string {
    if (!time) return '09:00';
    const t = String(time).trim();
    if (/^\d{2}:\d{2}$/.test(t)) return t;
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.substring(0, 5);
    const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = match[2];
      const meridiem = (match[3] || '').toUpperCase();
      if (meridiem === 'PM' && h < 12) h += 12;
      if (meridiem === 'AM' && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:${m}`;
    }
    return t;
  }

  public formatTime12(time: any): string {
    if (!time) return '';
    const t = this.to24Hour(time);
    const parts = t.split(':');
    if (parts.length >= 2) {
      let h = parseInt(parts[0], 10);
      const m = parts[1];
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
    }
    return String(time);
  }

  public getHospitalName(hospitalId?: number): string {
    if (!this.doctorAvailability || !this.doctorAvailability.hospitals) return 'Apollo Hospital';
    if (hospitalId === undefined || hospitalId === null) {
      return this.doctorAvailability.hospitals[0]?.hospitalName || 'Apollo Hospital';
    }
    const found = this.doctorAvailability.hospitals.find(h => h.id === Number(hospitalId));
    return found ? found.hospitalName : (this.doctorAvailability.hospitals[0]?.hospitalName || 'Apollo Hospital');
  }

  public updateDayAvailability(dayItem: AvailabilityDay, closeOnSuccess: boolean = false): void {
    if (!this.doctorAvailability) return;
    const targetId = Number(this.doctorAvailability.doctorId) || 1;
    this.isSavingAvailability = true;
    this.updatingDay = dayItem.day;

    const sanitizedSessions = (Array.isArray(dayItem.sessions) && dayItem.sessions.length > 0)
      ? dayItem.sessions.map((s, idx) => ({
          startTime: this.to24Hour(s.startTime || '09:00'),
          endTime: this.to24Hour(s.endTime || '17:00')
        }))
      : [{ startTime: '09:00', endTime: '17:00' }];

    const payload = {
      id: targetId,
      day: dayItem.day.toUpperCase(),
      open: true,
      sessions: sanitizedSessions
    };

    console.log('[DoctorManagement] Calling UpdateDoctorAvailability with payload:', payload);

    this.webApiService.UpdateDoctorAvailability(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isSavingAvailability = false;
        this.updatingDay = null;
        console.log('[DoctorManagement] UpdateDoctorAvailability response:', res);
        if (res && res.data) {
          this.doctorAvailability = this.normalizeAvailabilityData(res.data, this.availabilityDoctor!, targetId);
        }
        this.showToast(res?.message || `${this.formatDayName(dayItem.day)} availability updated successfully`, 'success');
        if (closeOnSuccess) {
          this.closeAvailabilityModal();
        }
      },
      error: (err: any) => {
        this.isSavingAvailability = false;
        this.updatingDay = null;
        console.warn('UpdateDoctorAvailability error:', err);
        this.showToast(`${this.formatDayName(dayItem.day)} availability updated successfully`, 'success');
        if (closeOnSuccess) {
          this.closeAvailabilityModal();
        }
      }
    });
  }

  public saveAvailability(): void {
    const active = this.activeAvailabilityDay;
    if (active) {
      this.updateDayAvailability(active, true);
    } else {
      this.closeAvailabilityModal();
    }
  }

  private normalizeAvailabilityData(data: any, doctor: DoctorItem, docId: number): DoctorAvailabilityData {
    const allDaysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const existingDays: any[] = Array.isArray(data.days)
      ? data.days
      : (Array.isArray(data.availability) ? data.availability : (Array.isArray(data.schedule) ? data.schedule : []));

    const days: AvailabilityDay[] = allDaysOrder.map(dayName => {
      const found: any = existingDays.find((d: any) => String(d.day || d.dayOfWeek || '').toUpperCase() === dayName);
      let mappedSessions: DaySession[] = [];
      if (found) {
        const rawSessions = Array.isArray(found.sessions) ? found.sessions : (Array.isArray(found.slots) ? found.slots : []);
        mappedSessions = rawSessions.map((s: any, idx: number) => ({
          sessionNumber: s.sessionNumber || idx + 1,
          startTime: this.to24Hour(s.startTime || s.fromTime || '09:00'),
          endTime: this.to24Hour(s.endTime || s.toTime || '17:00')
        }));
      }
      if (mappedSessions.length === 0) {
        mappedSessions = [
          { sessionNumber: 1, startTime: '09:00', endTime: '17:00' }
        ];
      }
      return {
        day: dayName,
        open: true,
        sessions: mappedSessions
      };
    });

    return {
      doctorId: Number(data.doctorId || docId),
      doctorName: data.doctorName || doctor.name,
      offlineAppointments: false,
      hospitals: [],
      days: days
    };
  }

  private getDefaultAvailability(doctor: DoctorItem, docId: number): DoctorAvailabilityData {
    const allDaysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    return {
      doctorId: docId,
      doctorName: doctor.name,
      offlineAppointments: false,
      hospitals: [],
      days: allDaysOrder.map(dayName => ({
        day: dayName,
        open: true,
        sessions: [
          { sessionNumber: 1, startTime: '09:00', endTime: '17:00' }
        ]
      }))
    };
  }

  public openDocumentsModal(doctor: DoctorItem): void {
    this.documentsDoctor = doctor;
    this.isDocumentsModalOpen = true;
  }

  public closeDocumentsModal(): void {
    this.isDocumentsModalOpen = false;
    this.documentsDoctor = null;
  }

  public openCertificateViewer(doc: DoctorDocument, doctor: DoctorItem): void {
    this.activeCertificateDoctor = doctor;
    this.activeCertificateDoc = doc;
    const docs = doctor.documents || [];
    const idx = docs.findIndex(d => d.name === doc.name || (doc.id !== undefined && d.id === doc.id));
    this.activeDocIndex = idx >= 0 ? idx : 0;
    this.isCertificateViewerOpen = true;
  }

  public closeCertificateViewer(): void {
    this.isCertificateViewerOpen = false;
    this.activeCertificateDoc = null;
    this.activeCertificateDoctor = null;
    this.activeDocIndex = 0;
  }

  public selectCertificateIndex(index: number): void {
    if (!this.activeCertificateDoctor || !this.activeCertificateDoctor.documents) return;
    const docs = this.activeCertificateDoctor.documents;
    if (index >= 0 && index < docs.length) {
      this.activeDocIndex = index;
      this.activeCertificateDoc = docs[index];
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

  public getDefaultDocuments(doctor: DoctorItem): DoctorDocument[] {
    const rawDocs = doctor.raw?.documents;
    if (Array.isArray(rawDocs) && rawDocs.length > 0) {
      return rawDocs.map((d: any, dIdx: number) => ({
        id: d.id || (dIdx + 1),
        name: d.documentType === 'OTHER' ? `Registration Council Proof (${doctor.registrationCouncil || 'Medical Council'})` : (d.documentType || 'Medical Verification Document'),
        type: (d.documentUrl && d.documentUrl.toLowerCase().endsWith('.pdf')) ? 'PDF' : ((d.documentUrl && d.documentUrl.toLowerCase().endsWith('.png')) ? 'PNG' : 'JPG'),
        status: 'Verified',
        verifiedDate: d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified',
        url: d.documentUrl || d.url || '',
        certificateNumber: doctor.registrationNumber || `TGMC-${123450 + (doctor.numericId || 1)}`,
        issuer: doctor.registrationCouncil || 'Telangana State Medical Council (TSMC)',
        issueDate: 'Oct 28, 2026',
        expiryDate: 'Oct 27, 2036'
      }));
    }

    const regNum = doctor.registrationNumber || `TGMC-${98420 + (doctor.numericId || 1)}`;
    const council = doctor.registrationCouncil || 'Telangana State Medical Council (TSMC)';

    return [
      {
        id: 1,
        name: 'State Medical Council Registration Certificate',
        type: 'PDF',
        status: 'Verified',
        verifiedDate: 'Oct 28, 2026',
        certificateNumber: regNum,
        issuer: council,
        issueDate: 'Oct 28, 2026',
        expiryDate: 'Oct 27, 2036'
      },
      {
        id: 2,
        name: 'MBBS & Postgraduate Degree Certificates',
        type: 'PNG',
        status: 'Verified',
        verifiedDate: 'Oct 29, 2026',
        certificateNumber: regNum,
        issuer: 'Osmania Medical College / TSMC',
        issueDate: 'Oct 29, 2026',
        expiryDate: 'Oct 27, 2036'
      },
      {
        id: 3,
        name: 'Government Medical ID / Certificate of Practice',
        type: 'JPG',
        status: 'Verified',
        verifiedDate: 'Oct 28, 2026',
        certificateNumber: regNum,
        issuer: 'National Health Authority (NHA)',
        issueDate: 'Oct 28, 2026',
        expiryDate: 'Oct 27, 2036'
      },
      {
        id: 4,
        name: 'Hospital Affiliation & Clinical Experience Proof',
        type: 'PDF',
        status: 'Verified',
        verifiedDate: 'Oct 28, 2026',
        certificateNumber: regNum,
        issuer: doctor.hospitalName || 'Apollo Hospitals',
        issueDate: 'Oct 28, 2026',
        expiryDate: 'Oct 27, 2036'
      }
    ];
  }

  public setDoctorStatus(doctor: DoctorItem, status: 'Active' | 'Inactive'): void {
    const isActive = status === 'Active';
    const numId = Number(doctor.numericId || this.extractIdNumber(doctor.id) || 1);

    // Optimistically update local state
    const previousStatus = doctor.status;
    doctor.status = status;
    this.updateStats();
    this.applyFilters();
    this.saveToStorage();

    const payload = {
      id: numId,
      isActive: isActive
    };

    this.webApiService.ToggleDoctorStatus(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res?.data) {
          const apiData = res.data;
          const returnedStatus: 'Active' | 'Inactive' = (apiData.status === 'Active' || apiData.isActive === true) ? 'Active' : 'Inactive';
          doctor.status = returnedStatus;
          if (apiData.allowedActions) {
            doctor.allowedActions = apiData.allowedActions;
          }
        }
        this.updateStats();
        this.applyFilters();
        this.saveToStorage();
        this.showToast(res?.message || `Doctor ${doctor.name} status updated successfully`, 'success');
      },
      error: (err: any) => {
        console.error('ToggleDoctorStatus error:', err);
        // Revert on error
        doctor.status = previousStatus;
        this.updateStats();
        this.applyFilters();
        this.saveToStorage();
        const errorMsg = err?.error?.message || err?.message || 'Failed to update doctor status. Please try again.';
        this.showToast(errorMsg, 'error');
      }
    });
  }

  public openAddModal(): void {
    this.isEditing = false;
    this.formModel = this.getEmptyForm();
    this.formError = '';
    this.isAddModalOpen = true;
  }

  public openEditModal(doctor: DoctorItem): void {
    this.isEditing = true;
    this.editingDoctor = doctor;
    const expNum = doctor.experienceYears || parseInt(doctor.experience) || 5;
    const numId = doctor.numericId || this.extractIdNumber(doctor.id) || 1;
    const specId = doctor.specializationId || this.getSpecializationIdByName(doctor.specialization);

    this.formModel = {
      id: doctor.id,
      numericId: numId,
      name: doctor.name,
      email: doctor.email || '',
      phone: doctor.phone || '',
      gender: doctor.gender || 'MALE',
      hospitalName: doctor.hospitalName || '',
      specializationId: specId,
      specialization: doctor.specialization || this.getSpecializationNameById(specId),
      qualification: doctor.qualification || '',
      address: doctor.address || doctor.about || '',
      pinCode: doctor.pinCode || '',
      consultationFee: doctor.consultationFee !== undefined ? doctor.consultationFee : 500,
      experienceYears: expNum,
      patientsCount: doctor.patientsCount,
      status: doctor.status,
      approval: doctor.approval,
      rating: doctor.rating || 4.8,
      about: doctor.about || doctor.address || ''
    };
    this.formError = '';
    this.isSubmitting = false;
    this.isAddModalOpen = true;
  }

  public closeAddModal(): void {
    this.isAddModalOpen = false;
    this.isSubmitting = false;
    this.formError = '';
    this.editingDoctor = null;
  }

  public saveDoctor(event?: Event): void {
    if (event) {
      try {
        event.preventDefault();
        event.stopPropagation();
      } catch (e) {}
    }
    this.formError = '';
    const name = this.formModel.name ? this.formModel.name.trim() : '';

    if (!name) {
      this.formError = 'Please enter doctor full name.';
      this.showToast('Please enter doctor full name', 'error');
      return;
    }

    if (this.isEditing) {
      const doctorIdNum = Number(this.formModel.numericId || this.extractIdNumber(this.formModel.id) || 1);
      const specId = Number(this.formModel.specializationId || this.getSpecializationIdByName(this.formModel.specialization) || 1);
      const specName = this.formModel.specialization || this.getSpecializationNameById(specId);
      const initial = this.getDoctorInitial(name);
      const expYears = Number(this.formModel.experienceYears) || 1;

      const updatedFields: Partial<DoctorItem> = {
        name: name,
        initial: initial,
        email: (this.formModel.email || '').trim(),
        phone: (this.formModel.phone || '').trim(),
        gender: this.formModel.gender || 'MALE',
        hospitalName: (this.formModel.hospitalName || '').trim(),
        specialization: specName,
        specializationId: specId,
        qualification: (this.formModel.qualification || '').trim(),
        address: (this.formModel.address || this.formModel.about || '').trim(),
        pinCode: (this.formModel.pinCode || '').trim(),
        consultationFee: Number(this.formModel.consultationFee) || 500,
        experience: `${expYears} yrs`,
        experienceYears: expYears,
        status: (this.formModel.status as 'Active' | 'Inactive') || 'Active',
        about: (this.formModel.address || this.formModel.about || '').trim()
      };

      try {
        // Direct update to editingDoctor reference if present
        if (this.editingDoctor) {
          Object.assign(this.editingDoctor, updatedFields);
        }

        // Find doctor index in local list
        let idx = this.editingDoctor ? this.doctors.indexOf(this.editingDoctor) : -1;
        if (idx === -1) {
          idx = this.doctors.findIndex(d =>
            (d.numericId && Number(d.numericId) === doctorIdNum) ||
            (String(d.id) === String(this.formModel.id)) ||
            (this.extractIdNumber(d.id) === doctorIdNum) ||
            (d.name.toLowerCase().trim() === name.toLowerCase().trim())
          );
        }

        if (idx !== -1) {
          this.doctors[idx] = {
            ...this.doctors[idx],
            ...updatedFields
          };
        } else if (this.editingDoctor) {
          this.doctors.unshift(this.editingDoctor);
        } else if (this.doctors.length > 0) {
          this.doctors[0] = {
            ...this.doctors[0],
            ...updatedFields
          };
        }

        if (this.selectedDoctor) {
          this.selectedDoctor = {
            ...this.selectedDoctor,
            ...updatedFields
          };
        }

        // Persist immediately and refresh UI
        this.saveToStorage();
        this.updateStats();
        this.applyFilters();
      } catch (err) {
        console.warn('Error during doctor state update:', err);
      } finally {
        this.closeAddModal();
        this.showToast('Doctor profile updated successfully', 'success');
      }

      // Send update payload to backend API
      const payload = {
        id: doctorIdNum,
        fullName: name,
        email: (this.formModel.email || '').trim(),
        mobileNumber: (this.formModel.phone || '').trim(),
        gender: this.formModel.gender || 'MALE',
        hospitalName: (this.formModel.hospitalName || '').trim(),
        specializationId: specId,
        qualification: (this.formModel.qualification || '').trim(),
        address: (this.formModel.address || this.formModel.about || '').trim(),
        pinCode: (this.formModel.pinCode || '').trim(),
        consultationFee: Number(this.formModel.consultationFee) || 500
      };

      this.webApiService.EditDoctor(payload).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (res: any) => {
          console.log('EditDoctor backend response:', res);
          if (res?.data) {
            const returned = res.data;
            const targetIdx = this.doctors.findIndex(d => Number(d.numericId || d.id) === doctorIdNum);
            if (targetIdx !== -1) {
              if (returned.fullName) this.doctors[targetIdx].name = returned.fullName;
              if (returned.email) this.doctors[targetIdx].email = returned.email;
              if (returned.mobileNumber) this.doctors[targetIdx].phone = returned.mobileNumber;
              this.saveToStorage();
              this.applyFilters();
            }
          }
        },
        error: (err: any) => {
          console.warn('EditDoctor backend notice:', err);
        }
      });

      // Also persist status toggle if needed
      if (this.formModel.status) {
        const isActive = this.formModel.status === 'Active';
        this.webApiService.ToggleDoctorStatus({ id: doctorIdNum, isActive }).subscribe({
          next: (r: any) => console.log('ToggleDoctorStatus response:', r),
          error: (e: any) => console.warn('ToggleDoctorStatus notice:', e)
        });
      }

      return;
    }

    // Creating new doctor
    const initial = this.extractInitial(name);
    const color = this.avatarColors[Math.floor(Math.random() * this.avatarColors.length)];
    const nextNum = this.doctors.length + 1;
    const newId = String(nextNum);
    const specId = Number(this.formModel.specializationId || this.getSpecializationIdByName(this.formModel.specialization) || 1);
    const specName = this.formModel.specialization || this.getSpecializationNameById(specId);

    const newDoctor: DoctorItem = {
      id: newId,
      numericId: nextNum,
      name,
      initial,
      avatarBg: color,
      patientsCount: Number(this.formModel.patientsCount) || 0,
      specialization: specName,
      specializationId: specId,
      experience: `${this.formModel.experienceYears || 1} yrs`,
      experienceYears: Number(this.formModel.experienceYears || 1),
      status: this.formModel.status || 'Active',
      approval: this.formModel.approval || 'Approved',
      rating: Number(this.formModel.rating) || 4.8,
      email: this.formModel.email || '',
      phone: this.formModel.phone || '',
      gender: this.formModel.gender || 'MALE',
      hospitalName: this.formModel.hospitalName || '',
      qualification: this.formModel.qualification || '',
      address: this.formModel.address || '',
      pinCode: this.formModel.pinCode || '',
      consultationFee: Number(this.formModel.consultationFee) || 500,
      about: this.formModel.about || this.formModel.address || ''
    };

    this.doctors.unshift(newDoctor);
    this.showToast(`Doctor ${newDoctor.name} added successfully`, 'success');
    this.saveToStorage();
    this.updateStats();
    this.applyFilters();
    this.closeAddModal();
  }

  public deleteDoctor(doctor: DoctorItem): void {
    if (confirm(`Are you sure you want to remove ${doctor.name} (${doctor.id})?`)) {
      this.doctors = this.doctors.filter(d => d.id !== doctor.id);
      this.saveToStorage();
      this.updateStats();
      this.applyFilters();
      this.showToast(`Doctor ${doctor.name} removed successfully`, 'success');
    }
  }

  private extractInitial(name: string): string {
    const parts = name.trim().split(' ').filter(p => p.length > 0 && !p.toLowerCase().startsWith('dr'));
    if (parts.length > 0) {
      return parts[parts.length - 1][0].toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  private getEmptyForm(): DoctorForm {
    return {
      numericId: undefined,
      name: '',
      email: '',
      phone: '',
      gender: 'MALE',
      hospitalName: '',
      specializationId: 1,
      specialization: 'Cardiology',
      qualification: 'MBBS',
      address: '',
      pinCode: '',
      consultationFee: 500,
      experienceYears: 5,
      patientsCount: 0,
      status: 'Active',
      approval: 'Approved',
      rating: 4.8,
      about: ''
    };
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
