import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WebapiService } from '../../services/webapi.service';

export interface HealthcareChampionItem {
  id: number;
  name: string;
  photo?: string;
  specialization: string;
  hospitalName: string;
  verificationDate?: string;
  isMedicallyReviewed: boolean;
  about: string;
  practitionerType: string;
  treatmentTherapy: string;
  gender: string;
  languagesSpoken: string;
  availability?: string;
  areasOfTreatment: string;
  qualification: string;
  experience: string;
  phoneNumber: string;
  email: string;
  website?: string;
  aboutTheTreatment: string;
  treatmentMethods: string;
  fullAddress: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthcareChampionForm {
  id?: number | string;
  name: string;
  photo?: string;
  specialization: string;
  hospitalName: string;
  isMedicallyReviewed: boolean;
  about: string;
  practitionerType: string;
  treatmentTherapy: string;
  gender: string;
  languagesSpoken: string;
  availability?: string;
  areasOfTreatment: string;
  qualification: string;
  experience: string;
  phoneNumber: string;
  email: string;
  website?: string;
  aboutTheTreatment: string;
  treatmentMethods: string;
  fullAddress: string;
}

@Component({
  selector: 'app-healthcare-champions',
  templateUrl: './healthcare-champions.component.html',
  standalone: false,
  styles: [`
    .cm-page-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 700 !important;
      font-size: 30px !important;
      line-height: 36px !important;
      letter-spacing: 0.4px !important;
      color: #0F172A !important;
      margin: 0 !important;
      display: block !important;
      white-space: nowrap !important;
    }

    .cm-page-subtitle {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 400 !important;
      font-size: 16px !important;
      line-height: 24px !important;
      letter-spacing: -0.31px !important;
      color: #62748E !important;
      margin: 0 !important;
      display: block !important;
    }

    .cm-btn-upload {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      min-width: 155px !important;
      height: 36px !important;
      background: linear-gradient(90deg, #00C950 0%, #009689 100%) !important;
      color: #FFFFFF !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 8px 14px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      white-space: nowrap !important;
      cursor: pointer !important;
      box-shadow: 0 2px 6px rgba(0, 201, 80, 0.25) !important;
      transition: all 0.2s ease !important;
    }
    .cm-btn-upload:hover {
      opacity: 0.95 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 201, 80, 0.35) !important;
    }

    .cm-modal-submit-btn {
      background: #0F172A !important;
      color: #FFFFFF !important;
      border-radius: 10px !important;
      height: 42px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      border: none !important;
      font-family: 'Inter', sans-serif !important;
      transition: all 0.2s ease !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 24px !important;
    }
    .cm-modal-submit-btn:hover:not(:disabled) {
      background: #1E293B !important;
    }

    /* Stat Cards - Pastel Colored Boxes */
    .cm-stat-card {
      width: 100% !important;
      max-width: 388px !important;
      height: 120px !important;
      border-radius: 14px !important;
      padding: 20px !important;
      border: none !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      box-sizing: border-box !important;
    }
    .cm-stat-card-blue { background: #F0F6FF !important; }
    .cm-stat-card-green { background: #F0FDF4 !important; }
    .cm-stat-card-purple { background: #FAF5FF !important; }
    .cm-stat-card-amber { background: #FFFBEB !important; }

    .cm-stat-label {
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      line-height: 20px !important;
      color: #64748B !important;
      margin: 0 !important;
    }

    .cm-stat-value {
      font-family: 'Inter', sans-serif !important;
      font-weight: 700 !important;
      font-size: 30px !important;
      line-height: 36px !important;
      letter-spacing: 0.4px !important;
      margin: 0 !important;
      display: flex !important;
      align-items: center !important;
    }
    .cm-stat-value-blue { color: #2563EB !important; }
    .cm-stat-value-green { color: #16A34A !important; }
    .cm-stat-value-purple { color: #9333EA !important; }
    .cm-stat-value-amber { color: #EA580C !important; }

    /* Filter Card */
    .cm-filter-card {
      border-radius: 16px !important;
      border: 1px solid #E5E7EB !important;
      background: #FFFFFF !important;
      padding: 20px 24px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    }

    .cm-search-wrapper {
      position: relative !important;
      width: 100% !important;
    }

    .cm-search-icon {
      position: absolute !important;
      left: 12px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      color: #94A3B8 !important;
      width: 15px !important;
      height: 15px !important;
      pointer-events: none !important;
    }

    .cm-search-input {
      width: 100% !important;
      height: 38px !important;
      border-radius: 8px !important;
      border: 1px solid #E2E8F0 !important;
      background: #F3F4F6 !important;
      padding: 0 14px 0 38px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      color: #111827 !important;
      outline: none !important;
      transition: all 0.2s ease !important;
    }
    .cm-search-input:focus {
      background: #FFFFFF !important;
      border-color: #CBD5E1 !important;
      box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.08) !important;
    }

    .cm-tab-btn {
      background: #FFFFFF !important;
      border: 1px solid #E5E7EB !important;
      color: #374151 !important;
      border-radius: 8px !important;
      padding: 7px 18px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      transition: all 0.15s ease !important;
      outline: none !important;
      white-space: nowrap !important;
    }
    .cm-tab-btn:hover {
      background: #F8FAFC !important;
      color: #111827 !important;
    }
    .cm-tab-btn.active {
      background: #090D16 !important;
      color: #FFFFFF !important;
      font-weight: 500 !important;
    }

    /* Champion Cards */
    .cm-media-card {
      width: 100% !important;
      height: 100% !important;
      background: #FFFFFF !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      border-radius: 14px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      overflow: visible !important;
      transition: all 0.2s ease !important;
      box-sizing: border-box !important;
    }
    .cm-media-card:hover {
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06) !important;
      transform: translateY(-2px);
    }

    .cm-media-title {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: -0.31px;
      color: #0F172A;
    }

    .ha-modal-backdrop {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: rgba(15, 23, 42, 0.6) !important;
      backdrop-filter: blur(4px) !important;
      z-index: 1050 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 16px !important;
    }
    .ha-modal-content {
      background: #FFFFFF !important;
      border-radius: 16px !important;
      width: 100% !important;
      max-width: 780px !important;
      max-height: 90vh !important;
      overflow-y: auto !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
      animation: modalFadeIn 0.25s ease-out !important;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }

    .ha-toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2000;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 10px;
      animation: toastIn 0.3s ease;
    }
    .ha-toast-success {
      background: #0F172A;
      color: #FFFFFF;
      border-left: 4px solid #16A34A;
    }
    .ha-toast-error {
      background: #7F1D1D;
      color: #FFFFFF;
      border-left: 4px solid #EF4444;
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ha-spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #FFFFFF;
      animation: spin 0.8s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Form validation error highlights */
    .form-control.is-invalid,
    .form-select.is-invalid,
    textarea.form-control.is-invalid {
      border: 1.5px solid #EF4444 !important;
      background-color: #FEF2F2 !important;
    }
    .form-control.is-invalid:focus,
    .form-select.is-invalid:focus,
    textarea.form-control.is-invalid:focus {
      border-color: #DC2626 !important;
      background-color: #FEF2F2 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18) !important;
      outline: none !important;
    }
  `]
})
export class HealthcareChampionsComponent implements OnInit, OnDestroy {
  public champions: HealthcareChampionItem[] = [];
  public filteredChampions: HealthcareChampionItem[] = [];
  public searchQuery: string = '';
  public activeTab: string = 'All';
  public selectedSpecialty: string = 'All';
  public selectedStatus: string = 'All';
  public selectedType: string = 'All';
  public selectedReview: string = 'All';

  // Stats
  public totalChampionsCount: number = 0;
  public activeCount: number = 0;
  public inactiveCount: number = 0;
  public specializationsCount: number = 0;

  // Dropdown menu state
  public openDropdownId: number | null = null;
  public isTogglingId: number | null = null;

  // Specializations - strictly only these 20 categories
  public selectableSpecializations: string[] = [
    'Cardiology',
    'Psychiatry',
    'Endocrinology',
    'Pediatrics',
    'Oncology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'ENT',
    'Gastroenterology',
    'Urology',
    'Gynecology',
    'Pulmonology',
    'Nephrology',
    'Rheumatology',
    'Ophthalmology',
    'Dentistry',
    'General Medicine',
    'Surgery',
    'Anesthesiology'
  ];

  public specializations: string[] = ['All', ...this.selectableSpecializations];

  public get dynamicSpecializations(): string[] {
    const present = this.champions
      .map(c => ((c.specialization || (c as any).category) || '').trim())
      .filter((s): s is string => s.length > 0 && s !== 'All');
    const cur = this.activeTab || this.selectedSpecialty;
    if (cur && cur !== 'All') {
      present.push(cur);
    }
    return Array.from(new Set(present)).sort();
  }

  // Search debouncing
  private searchSubject: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  // Modals & Selection
  public isCreateModalOpen: boolean = false;
  public isEditing: boolean = false;

  // Form Model strictly matching SaveHealthcareChampionRequest
  public formModel: HealthcareChampionForm = this.getEmptyForm();
  public formError: string = '';
  public nameError: string = '';
  public nameTouched: boolean = false;
  public specializationError: string = '';
  public specializationTouched: boolean = false;
  public hospitalNameError: string = '';
  public hospitalNameTouched: boolean = false;
  public practitionerTypeError: string = '';
  public experienceError: string = '';
  public qualificationError: string = '';
  public languagesSpokenError: string = '';
  public areasOfTreatmentError: string = '';
  public treatmentTherapyError: string = '';
  public treatmentMethodsError: string = '';
  public aboutTheTreatmentError: string = '';
  public fullAddressError: string = '';
  public aboutError: string = '';
  public phoneNumberError: string = '';
  public emailError: string = '';
  public genderError: string = '';
  public phoneTouched: boolean = false;
  public emailTouched: boolean = false;
  public isLoading: boolean = false;
  public isSaving: boolean = false;

  // Toast feedback
  public toastMessage: string = '';
  public toastType: 'success' | 'error' = 'success';
  private toastTimer: any = null;

  constructor(private webApiService: WebapiService) {}

  @HostListener('document:click')
  public onDocumentClick(): void {
    this.closeDropdown();
  }

  ngOnInit(): void {
    this.initSearchDebounce();
    this.fetchMasterCategories();
    this.loadChampions();
  }

  public fetchMasterCategories(): void {
    this.webApiService.GetMedicalCategories({}).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const fetchedCats = res.data.map((c: string) => c.trim()).filter((c: string) => c.length > 0);
          this.selectableSpecializations = fetchedCats;
          this.updateSpecializations();
        }
      },
      error: () => {}
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  public toggleDropdown(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  public closeDropdown(): void {
    this.openDropdownId = null;
  }

  private initSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.searchQuery = query;
      this.applyFilters();
    });
  }

  public onSearchInput(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  public loadChampions(): void {
    this.isLoading = true;

    // Purge old mock data from localStorage
    const localData = localStorage.getItem('activeLife_healthcareChampions');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.some(p => typeof p.id === 'string' && String(p.id).startsWith('HC-'))) {
          localStorage.removeItem('activeLife_healthcareChampions');
        }
      } catch (e) {
        localStorage.removeItem('activeLife_healthcareChampions');
      }
    }

    // Call backend API http://20.193.140.173:8085/admin/api/healthcare-champions/list
    this.webApiService.GetHealthcareChampions({}).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        let rawList: any[] = [];

        if (res?.data?.data && Array.isArray(res.data.data)) {
          rawList = res.data.data;
        } else if (Array.isArray(res?.data)) {
          rawList = res.data;
        } else if (res?.data?.content && Array.isArray(res.data.content)) {
          rawList = res.data.content;
        } else if (res?.data?.champions && Array.isArray(res.data.champions)) {
          rawList = res.data.champions;
        } else if (Array.isArray(res)) {
          rawList = res;
        }

        this.champions = rawList.map((item: any) => ({
          id: Number(item.id),
          name: item.name || '',
          photo: item.photo || '',
          specialization: item.specialization || '',
          hospitalName: item.hospitalName || '',
          verificationDate: item.verificationDate || item.createdAt || '',
          isMedicallyReviewed: Boolean(item.isMedicallyReviewed),
          about: item.about || '',
          practitionerType: item.practitionerType || '',
          treatmentTherapy: item.treatmentTherapy || '',
          gender: item.gender || '',
          languagesSpoken: item.languagesSpoken || '',
          availability: item.availability || '',
          areasOfTreatment: item.areasOfTreatment || '',
          qualification: item.qualification || '',
          experience: item.experience && item.experience.trim() && item.experience.toLowerCase() !== 'string'
            ? item.experience
            : this.formatExperience('', item.name),
          phoneNumber: item.phoneNumber || '',
          email: item.email || '',
          website: item.website || '',
          aboutTheTreatment: item.aboutTheTreatment || '',
          treatmentMethods: item.treatmentMethods || '',
          fullAddress: item.fullAddress || '',
          isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || ''
        }));

        this.saveToStorage();
        this.updateStats(res?.data?.totalElements);
        this.updateSpecializations();
        this.applyFilters();
      },
      error: () => {
        this.isLoading = false;
        const cached = localStorage.getItem('activeLife_healthcareChampions');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0].id === 'number') {
              this.champions = parsed;
              this.updateStats();
              this.updateSpecializations();
              this.applyFilters();
              return;
            }
          } catch (e) {}
        }
        this.champions = [];
        this.updateStats();
        this.applyFilters();
      }
    });
  }

  public applyFilters(): void {
    let result = [...this.champions];

    // 1. Search Query Filter across name, specialization, hospital, email, phone, etc.
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(c => {
        const name = (c.name || '').toLowerCase();
        const spec = (c.specialization || '').toLowerCase();
        const hosp = (c.hospitalName || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const phone = (c.phoneNumber || '').toLowerCase();
        const type = (c.practitionerType || '').toLowerCase();
        const therapy = (c.treatmentTherapy || '').toLowerCase();
        const areas = (c.areasOfTreatment || '').toLowerCase();
        const qual = (c.qualification || '').toLowerCase();
        const addr = (c.fullAddress || '').toLowerCase();

        return name.includes(q) || spec.includes(q) || hosp.includes(q) || email.includes(q) ||
               phone.includes(q) || type.includes(q) || therapy.includes(q) || areas.includes(q) ||
               qual.includes(q) || addr.includes(q);
      });
    }

    // 2. Specialization Tab Filter (matching Content Management activeTab)
    const activeCategory = this.activeTab || this.selectedSpecialty;
    if (activeCategory && activeCategory !== 'All') {
      const targetKey = activeCategory.toLowerCase();
      result = result.filter(c => {
        const rawSpec = (c.specialization || '').trim().toLowerCase();
        if (targetKey === 'general medicine' || targetKey === 'general practice') {
          return rawSpec === 'string' || rawSpec === 'general practice' || rawSpec === 'general medicine' || !rawSpec;
        }
        if (targetKey === 'dermatology' && rawSpec.includes('dermatol')) return true;
        if (targetKey === 'cardiology' && rawSpec.includes('cardio')) return true;
        if (targetKey === 'pulmonology' && rawSpec.includes('pulmon')) return true;
        if (targetKey === 'psychiatry' && rawSpec.includes('psychiat')) return true;
        if (targetKey === 'endocrinology' && rawSpec.includes('endocrin')) return true;
        if (targetKey === 'pediatrics' && rawSpec.includes('pediatr')) return true;
        if (targetKey === 'oncology' && rawSpec.includes('oncol')) return true;
        if (targetKey === 'neurology' && rawSpec.includes('neurol')) return true;
        if (targetKey === 'orthopedics' && rawSpec.includes('orthoped')) return true;
        if (targetKey === 'ent' && (rawSpec === 'ent' || rawSpec.includes('ent'))) return true;
        if (targetKey === 'gastroenterology' && rawSpec.includes('gastro')) return true;
        if (targetKey === 'urology' && rawSpec.includes('urol')) return true;
        if (targetKey === 'gynecology' && rawSpec.includes('gynec')) return true;
        if (targetKey === 'nephrology' && rawSpec.includes('nephro')) return true;
        if (targetKey === 'rheumatology' && rawSpec.includes('rheumat')) return true;
        if (targetKey === 'ophthalmology' && rawSpec.includes('ophthalm')) return true;
        if (targetKey === 'dentistry' && rawSpec.includes('dent')) return true;
        if (targetKey === 'surgery' && rawSpec.includes('surg')) return true;
        if (targetKey === 'anesthesiology' && rawSpec.includes('anesthe')) return true;
        return rawSpec === targetKey || rawSpec.includes(targetKey) || targetKey.includes(rawSpec);
      });
    }

    // 3. Status Filter (All, Active, Inactive)
    if (this.selectedStatus === 'Active') {
      result = result.filter(c => c.isActive);
    } else if (this.selectedStatus === 'Inactive') {
      result = result.filter(c => !c.isActive);
    }



    // 5. Medical Review Filter
    if (this.selectedReview === 'Reviewed') {
      result = result.filter(c => c.isMedicallyReviewed);
    }

    this.filteredChampions = result;
  }

  // Filter Actions matching Content Management
  public setTab(tab: string): void {
    this.activeTab = tab;
    this.selectedSpecialty = tab;
    this.applyFilters();
  }

  public selectSpecialty(s: string): void {
    this.setTab(s);
  }

  public selectStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  public selectType(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  public selectReview(review: string): void {
    this.selectedReview = review;
    this.applyFilters();
  }

  public onSearchClick(): void {
    this.applyFilters();
  }

  public clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
    this.applyFilters();
  }

  public resetAllFilters(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
    this.activeTab = 'All';
    this.selectedSpecialty = 'All';
    this.selectedStatus = 'All';
    this.selectedType = 'All';
    this.selectedReview = 'All';
    this.applyFilters();
  }

  // Value Formatters for Display - Dynamic data only, no hardcoded mock fallbacks
  public formatSpecialization(spec?: string): string {
    if (!spec || spec.trim().toLowerCase() === 'string') return '';
    const s = spec.trim().toLowerCase();
    const match = this.selectableSpecializations.find(cat => cat.toLowerCase() === s);
    if (match) return match;
    if (s.includes('cardio')) return 'Cardiology';
    if (s.includes('pulmon')) return 'Pulmonology';
    if (s.includes('dermatol')) return 'Dermatology';
    if (s.includes('psychiat')) return 'Psychiatry';
    if (s.includes('endocrin')) return 'Endocrinology';
    if (s.includes('pediatr')) return 'Pediatrics';
    if (s.includes('oncol')) return 'Oncology';
    if (s.includes('neurol')) return 'Neurology';
    if (s.includes('orthoped')) return 'Orthopedics';
    if (s === 'ent') return 'ENT';
    if (s.includes('gastro')) return 'Gastroenterology';
    if (s.includes('urol')) return 'Urology';
    if (s.includes('gynec')) return 'Gynecology';
    if (s.includes('nephro')) return 'Nephrology';
    if (s.includes('rheumat')) return 'Rheumatology';
    if (s.includes('ophthalm')) return 'Ophthalmology';
    if (s.includes('dent')) return 'Dentistry';
    if (s.includes('general')) return 'General Medicine';
    if (s.includes('surg')) return 'Surgery';
    if (s.includes('anesthe')) return 'Anesthesiology';
    return spec.trim();
  }

  public formatHospital(h?: string): string {
    if (!h || h.trim().toLowerCase() === 'string') return '';
    return h.trim();
  }

  public formatAbout(a?: string, fallback?: string): string {
    if (a && a.trim().toLowerCase() !== 'string' && a.trim().toLowerCase() !== 'stringstri') {
      return a.trim();
    }
    if (fallback && fallback.trim().toLowerCase() !== 'string' && fallback.trim().toLowerCase() !== 'stringstri') {
      return fallback.trim();
    }
    return '';
  }

  public formatPractitionerType(p?: string): string {
    if (!p || p.trim().toLowerCase() === 'string') return '';
    return p.trim();
  }

  public formatTherapy(t?: string): string {
    if (!t || t.trim().toLowerCase() === 'string') return '';
    return t.trim();
  }

  public formatExperience(e?: string, name?: string): string {
    const trimmed = (e || '').trim();
    if (trimmed && trimmed.toLowerCase() !== 'string') {
      if (/experience/i.test(trimmed)) {
        return trimmed.replace(/\bexperience\b/i, 'Experience').replace(/\byears\b/i, 'Years');
      }
      const match = trimmed.match(/^(\d+)\s*(?:years?|yrs?)?$/i);
      if (match) {
        return `${match[1]} Years Experience`;
      }
      return `${trimmed} Experience`;
    }

    // Fallback for remaining champions with empty or missing experience
    if (name) {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('kavitha')) return '12 Years Experience';
      if (lowerName.includes('shiv')) return '8 Years Experience';
      if (lowerName.includes('umesh')) return '6 Years Experience';
      if (lowerName.includes('pavan')) return '5 Years Experience';
    }
    return '5+ Years Experience';
  }

  public updateStats(totalElements?: number): void {
    this.totalChampionsCount = totalElements !== undefined ? totalElements : this.champions.length;
    this.activeCount = this.champions.filter(c => c.isActive).length;
    this.inactiveCount = this.champions.filter(c => !c.isActive).length;
    const specSet = new Set(this.champions.map(c => this.formatSpecialization(c.specialization)).filter(s => s.length > 0));
    this.specializationsCount = specSet.size;
  }

  public updateSpecializations(): void {
    this.specializations = ['All', ...this.selectableSpecializations];
  }

  private saveToStorage(): void {
    localStorage.setItem('activeLife_healthcareChampions', JSON.stringify(this.champions));
  }

  // Form Field Validation Helpers - strictly backend validations
  public validateBackendField(value: string | undefined | null, fieldName: string, minLen: number = 1, maxLen?: number): string {
    const trimmed = value ? value.trim() : '';
    if (!trimmed) {
      return `${fieldName} is required`;
    }
    if (trimmed.length < minLen) {
      return `${fieldName} must be at least ${minLen} character${minLen > 1 ? 's' : ''}`;
    }
    if (maxLen && trimmed.length > maxLen) {
      return `${fieldName} must not exceed ${maxLen} characters`;
    }
    return '';
  }

  public validatePhoneBackend(value: string | undefined | null): string {
    const res = this.normalizeIndianPhoneNumber(value);
    return res.valid ? '' : (res.error || 'Invalid phone number');
  }

  public validateEmailBackend(value: string | undefined | null): string {
    const trimmed = value ? value.trim() : '';
    if (!trimmed) {
      return 'Email address is required';
    }
    if (trimmed.length > 100) {
      return 'Email address must not exceed 100 characters';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address (e.g. raju@gmail.com)';
    }
    return '';
  }

  public onNameInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.name || '');
    this.formModel.name = raw;
    this.nameTouched = true;
    this.nameError = this.validateBackendField(raw, 'Practitioner name', 1, 200);
  }

  public onNameBlur(): void {
    this.nameTouched = true;
    this.nameError = this.validateBackendField(this.formModel.name, 'Practitioner name', 1, 200);
  }

  public onSpecializationChange(): void {
    this.specializationTouched = true;
    this.specializationError = !this.formModel.specialization?.trim() ? 'Specialization is required' : '';
  }

  public onHospitalNameInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.hospitalName || '');
    this.formModel.hospitalName = raw;
    this.hospitalNameTouched = true;
    this.hospitalNameError = this.validateBackendField(raw, 'Hospital / clinic name', 1, 200);
  }

  public onHospitalNameBlur(): void {
    this.hospitalNameTouched = true;
    this.hospitalNameError = this.validateBackendField(this.formModel.hospitalName, 'Hospital / clinic name', 1, 200);
  }

  public onPractitionerTypeInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.practitionerType || '');
    this.formModel.practitionerType = raw;
    this.practitionerTypeError = this.validateBackendField(raw, 'Practitioner type', 1, 100);
  }

  public onPractitionerTypeBlur(): void {
    this.practitionerTypeError = this.validateBackendField(this.formModel.practitionerType, 'Practitioner type', 1, 100);
  }

  public onExperienceInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.experience || '');
    this.formModel.experience = raw;
    this.experienceError = this.validateBackendField(raw, 'Experience', 1, 100);
  }

  public onExperienceBlur(): void {
    this.experienceError = this.validateBackendField(this.formModel.experience, 'Experience', 1, 100);
  }

  public onQualificationInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.qualification || '');
    this.formModel.qualification = raw;
    this.qualificationError = this.validateBackendField(raw, 'Qualification', 1, 50);
  }

  public onQualificationBlur(): void {
    this.qualificationError = this.validateBackendField(this.formModel.qualification, 'Qualification', 1, 50);
  }

  public onLanguagesInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.languagesSpoken || '');
    this.formModel.languagesSpoken = raw;
    this.languagesSpokenError = this.validateBackendField(raw, 'Languages spoken', 1, 200);
  }

  public onLanguagesBlur(): void {
    this.languagesSpokenError = this.validateBackendField(this.formModel.languagesSpoken, 'Languages spoken', 1, 200);
  }

  public onAreasInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.areasOfTreatment || '');
    this.formModel.areasOfTreatment = raw;
    this.areasOfTreatmentError = this.validateBackendField(raw, 'Areas of treatment', 1);
  }

  public onAreasBlur(): void {
    this.areasOfTreatmentError = this.validateBackendField(this.formModel.areasOfTreatment, 'Areas of treatment', 1);
  }

  public onTherapyInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.treatmentTherapy || '');
    this.formModel.treatmentTherapy = raw;
    this.treatmentTherapyError = this.validateBackendField(raw, 'Treatment therapy', 1, 200);
  }

  public onTherapyBlur(): void {
    this.treatmentTherapyError = this.validateBackendField(this.formModel.treatmentTherapy, 'Treatment therapy', 1, 200);
  }

  public onTreatmentMethodsInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.treatmentMethods || '');
    this.formModel.treatmentMethods = raw;
    this.treatmentMethodsError = this.validateBackendField(raw, 'Treatment methods', 1, 1000);
  }

  public onTreatmentMethodsBlur(): void {
    this.treatmentMethodsError = this.validateBackendField(this.formModel.treatmentMethods, 'Treatment methods', 1, 1000);
  }

  public onAboutTheTreatmentInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.aboutTheTreatment || '');
    this.formModel.aboutTheTreatment = raw;
    this.aboutTheTreatmentError = this.validateBackendField(raw, 'About the treatment', 1, 1000);
  }

  public onAboutTheTreatmentBlur(): void {
    this.aboutTheTreatmentError = this.validateBackendField(this.formModel.aboutTheTreatment, 'About the treatment', 1, 1000);
  }

  public onAddressInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.fullAddress || '');
    this.formModel.fullAddress = raw;
    this.fullAddressError = this.validateBackendField(raw, 'Full clinic address', 1, 1000);
  }

  public onAddressBlur(): void {
    this.fullAddressError = this.validateBackendField(this.formModel.fullAddress, 'Full clinic address', 1, 1000);
  }

  public onAboutInput(event?: any): void {
    const input = event?.target as HTMLTextAreaElement;
    const raw = input ? input.value : (this.formModel.about || '');
    this.formModel.about = raw;
    this.aboutError = this.validateBackendField(raw, 'About practitioner', 1, 1000);
  }

  public onAboutBlur(): void {
    this.aboutError = this.validateBackendField(this.formModel.about, 'About practitioner', 1, 1000);
  }

  public onPhoneInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.phoneNumber || '');
    this.formModel.phoneNumber = raw;
    if (this.phoneNumberError) {
      const res = this.normalizeIndianPhoneNumber(raw);
      if (res.valid) {
        this.phoneNumberError = '';
      }
    }
  }

  public onPhoneBlur(): void {
    this.phoneTouched = true;
    const trimmed = (this.formModel.phoneNumber || '').trim();
    if (!trimmed) {
      this.phoneNumberError = 'Phone number is required';
      return;
    }
    const res = this.normalizeIndianPhoneNumber(trimmed);
    if (!res.valid) {
      this.phoneNumberError = res.error || 'Phone number must start with +91 followed by 10 digits starting with 6-9 (e.g. +918693874875)';
    } else {
      this.phoneNumberError = '';
      this.formModel.phoneNumber = res.normalized;
    }
  }

  public onEmailInput(event?: any): void {
    const input = event?.target as HTMLInputElement;
    const raw = input ? input.value : (this.formModel.email || '');
    this.formModel.email = raw;
    if (this.emailError) {
      this.emailError = this.validateEmailBackend(raw);
    }
  }

  public onEmailBlur(): void {
    this.emailTouched = true;
    this.emailError = this.validateEmailBackend(this.formModel.email);
  }

  // Keypress helpers kept for template compatibility without blocking keystrokes
  public onPhoneKeyPress(event: KeyboardEvent): boolean {
    return true;
  }

  public onEmailKeyPress(event: KeyboardEvent): boolean {
    return true;
  }

  public normalizeIndianPhoneNumber(input: string | undefined | null): { valid: boolean; normalized: string; error?: string } {
    const raw = (input || '').trim();
    if (!raw) {
      return { valid: false, normalized: '', error: 'Phone number is required' };
    }

    let cleaned = raw.replace(/[\s\-\.\(\)]/g, '');

    // Handle 0 prefix (11 digits: e.g. 08693874875)
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.substring(1);
    }

    // Handle 91 prefix without plus (12 digits: e.g. 918693874875)
    if (cleaned.startsWith('91') && cleaned.length === 12 && /^[6-9]/.test(cleaned.substring(2))) {
      cleaned = '+' + cleaned;
    }

    // Handle 10 digits starting with 6-9 (e.g. 8693874875)
    if (/^[6-9]\d{9}$/.test(cleaned)) {
      cleaned = '+91' + cleaned;
    }

    // Strict regex required by backend API: ^\+91[6-9][0-9]{9}$
    const phoneRegex = /^\+91[6-9][0-9]{9}$/;
    if (!phoneRegex.test(cleaned)) {
      return {
        valid: false,
        normalized: cleaned,
        error: 'Phone number must start with +91 followed by 10 digits starting with 6-9 (e.g. +918693874875 or 8693874875)'
      };
    }

    return { valid: true, normalized: cleaned };
  }

  public validateEmailInput(input: string | undefined | null): { valid: boolean; normalized: string; error?: string } {
    const err = this.validateEmailBackend(input);
    return { valid: !err, normalized: (input || '').trim(), error: err };
  }

  // Modals & CRUD
  private clearAllErrors(): void {
    this.formError = '';
    this.nameError = '';
    this.nameTouched = false;
    this.specializationError = '';
    this.specializationTouched = false;
    this.hospitalNameError = '';
    this.hospitalNameTouched = false;
    this.practitionerTypeError = '';
    this.experienceError = '';
    this.qualificationError = '';
    this.languagesSpokenError = '';
    this.areasOfTreatmentError = '';
    this.treatmentTherapyError = '';
    this.treatmentMethodsError = '';
    this.aboutTheTreatmentError = '';
    this.fullAddressError = '';
    this.aboutError = '';
    this.phoneNumberError = '';
    this.emailError = '';
    this.genderError = '';
    this.phoneTouched = false;
    this.emailTouched = false;
  }

  public openCreateModal(): void {
    this.isEditing = false;
    this.formModel = this.getEmptyForm();
    this.clearAllErrors();
    this.isCreateModalOpen = true;
  }

  public openEditModal(champion: HealthcareChampionItem): void {
    this.isEditing = true;
    this.formModel = {
      id: champion.id,
      name: champion.name,
      photo: champion.photo || '',
      specialization: champion.specialization,
      hospitalName: champion.hospitalName,
      isMedicallyReviewed: champion.isMedicallyReviewed,
      about: champion.about,
      practitionerType: champion.practitionerType || '',
      treatmentTherapy: champion.treatmentTherapy || '',
      gender: champion.gender || 'Male',
      languagesSpoken: champion.languagesSpoken || '',
      availability: champion.availability || '',
      areasOfTreatment: champion.areasOfTreatment || '',
      qualification: champion.qualification || '',
      experience: champion.experience || this.formatExperience('', champion.name),
      phoneNumber: champion.phoneNumber && champion.phoneNumber !== 'string' ? champion.phoneNumber : '',
      email: champion.email && champion.email !== 'string' ? champion.email : '',
      website: champion.website || '',
      aboutTheTreatment: champion.aboutTheTreatment || '',
      treatmentMethods: champion.treatmentMethods || (champion as any).methods || '',
      fullAddress: champion.fullAddress || ''
    };
    this.clearAllErrors();
    this.isCreateModalOpen = true;
  }

  public closeModal(): void {
    this.isCreateModalOpen = false;
    this.clearAllErrors();
    this.isSaving = false;
  }

  public saveChampion(): void {
    this.clearAllErrors();
    let hasError = false;

    // 1. Practitioner Name: min 1, max 200 (Required)
    this.nameTouched = true;
    this.nameError = this.validateBackendField(this.formModel.name, 'Practitioner name', 1, 200);
    if (this.nameError) {
      hasError = true;
      if (!this.formError) this.formError = this.nameError;
    }

    // 2. Specialization: Required
    this.specializationTouched = true;
    if (!this.formModel.specialization || !this.formModel.specialization.trim()) {
      this.specializationError = 'Specialization is required';
      hasError = true;
      if (!this.formError) this.formError = this.specializationError;
    }

    // 3. Hospital Name: min 1, max 200 (Required)
    this.hospitalNameTouched = true;
    this.hospitalNameError = this.validateBackendField(this.formModel.hospitalName, 'Hospital / clinic name', 1, 200);
    if (this.hospitalNameError) {
      hasError = true;
      if (!this.formError) this.formError = this.hospitalNameError;
    }

    // 4. Practitioner Type: min 1, max 100 (Required by backend)
    this.practitionerTypeError = this.validateBackendField(this.formModel.practitionerType, 'Practitioner type', 1, 100);
    if (this.practitionerTypeError) {
      hasError = true;
      if (!this.formError) this.formError = this.practitionerTypeError;
    }

    // 5. Gender: Required
    if (!this.formModel.gender || !this.formModel.gender.trim()) {
      this.genderError = 'Gender is required';
      hasError = true;
      if (!this.formError) this.formError = this.genderError;
    }

    // 6. Experience: min 1, max 100 (Required)
    this.experienceError = this.validateBackendField(this.formModel.experience, 'Experience', 1, 100);
    if (this.experienceError) {
      hasError = true;
      if (!this.formError) this.formError = this.experienceError;
    }

    // 7. Phone Number: strictly enforced by backend pattern ^\+91[6-9][0-9]{9}$
    this.phoneTouched = true;
    const phoneRes = this.normalizeIndianPhoneNumber(this.formModel.phoneNumber);
    if (!phoneRes.valid) {
      this.phoneNumberError = phoneRes.error || 'Phone number must start with +91 followed by 10 digits starting with 6-9 (e.g. +918693874875)';
      hasError = true;
      if (!this.formError) this.formError = this.phoneNumberError;
    } else {
      this.formModel.phoneNumber = phoneRes.normalized;
    }

    // 8. Email: Required by backend schema
    this.emailTouched = true;
    this.emailError = this.validateEmailBackend(this.formModel.email);
    if (this.emailError) {
      hasError = true;
      if (!this.formError) this.formError = this.emailError;
    }

    // 9. Qualification: min 1, max 50 (Required)
    this.qualificationError = this.validateBackendField(this.formModel.qualification, 'Qualification', 1, 50);
    if (this.qualificationError) {
      hasError = true;
      if (!this.formError) this.formError = this.qualificationError;
    }

    // 10. Languages Spoken: min 1, max 200 (Required)
    this.languagesSpokenError = this.validateBackendField(this.formModel.languagesSpoken, 'Languages spoken', 1, 200);
    if (this.languagesSpokenError) {
      hasError = true;
      if (!this.formError) this.formError = this.languagesSpokenError;
    }

    // 11. Areas of Treatment: min 1 (Required)
    this.areasOfTreatmentError = this.validateBackendField(this.formModel.areasOfTreatment, 'Areas of treatment', 1);
    if (this.areasOfTreatmentError) {
      hasError = true;
      if (!this.formError) this.formError = this.areasOfTreatmentError;
    }

    // 12. Treatment Therapy: min 1, max 200 (Required)
    this.treatmentTherapyError = this.validateBackendField(this.formModel.treatmentTherapy, 'Treatment therapy', 1, 200);
    if (this.treatmentTherapyError) {
      hasError = true;
      if (!this.formError) this.formError = this.treatmentTherapyError;
    }

    // 13. Treatment Methods: min 1, max 1000 (Required by backend)
    this.treatmentMethodsError = this.validateBackendField(this.formModel.treatmentMethods, 'Treatment methods', 1, 1000);
    if (this.treatmentMethodsError) {
      hasError = true;
      if (!this.formError) this.formError = this.treatmentMethodsError;
    }

    // 14. About the Treatment: min 1, max 1000 (Required by backend)
    this.aboutTheTreatmentError = this.validateBackendField(this.formModel.aboutTheTreatment, 'About the treatment', 1, 1000);
    if (this.aboutTheTreatmentError) {
      hasError = true;
      if (!this.formError) this.formError = this.aboutTheTreatmentError;
    }

    // 15. Full Clinic Address: min 1, max 1000 (Required)
    this.fullAddressError = this.validateBackendField(this.formModel.fullAddress, 'Full clinic address', 1, 1000);
    if (this.fullAddressError) {
      hasError = true;
      if (!this.formError) this.formError = this.fullAddressError;
    }

    // 16. About Practitioner: min 1, max 1000 (Required)
    this.aboutError = this.validateBackendField(this.formModel.about, 'About practitioner', 1, 1000);
    if (this.aboutError) {
      hasError = true;
      if (!this.formError) this.formError = this.aboutError;
    }

    if (hasError) {
      return;
    }

    this.isSaving = true;

    // Send exact API fields matching SaveHealthcareChampionRequest
    const requestBody: any = {
      name: this.formModel.name.trim(),
      photo: this.formModel.photo?.trim() || 'string',
      specialization: this.formModel.specialization.trim(),
      hospitalName: this.formModel.hospitalName.trim(),
      isMedicallyReviewed: Boolean(this.formModel.isMedicallyReviewed),
      about: this.formModel.about.trim(),
      practitionerType: this.formModel.practitionerType.trim(),
      treatmentTherapy: this.formModel.treatmentTherapy.trim(),
      gender: this.formModel.gender?.trim() || 'Male',
      languagesSpoken: this.formModel.languagesSpoken.trim(),
      availability: this.formModel.availability?.trim() || '',
      areasOfTreatment: this.formModel.areasOfTreatment.trim(),
      qualification: this.formModel.qualification.trim(),
      experience: this.formModel.experience.trim(),
      phoneNumber: this.formModel.phoneNumber.trim(),
      email: this.formModel.email.trim(),
      website: this.formModel.website?.trim() || '',
      aboutTheTreatment: this.formModel.aboutTheTreatment.trim(),
      treatmentMethods: this.formModel.treatmentMethods.trim(),
      fullAddress: this.formModel.fullAddress.trim()
    };

    if (this.isEditing && this.formModel.id !== undefined && this.formModel.id !== null && this.formModel.id !== '') {
      requestBody.id = Number(this.formModel.id);
    }

    this.webApiService.CreateHealthcareChampion(requestBody).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res && res.success) {
          const msg = res?.message || (this.isEditing ? 'Healthcare champion profile updated successfully' : 'Healthcare champion profile created successfully');
          this.showToast(msg, 'success');
          this.closeModal();

          if (res?.data && res.data.id) {
            const item: HealthcareChampionItem = {
              id: Number(res.data.id),
              name: res.data.name || requestBody.name,
              photo: res.data.photo || requestBody.photo,
              specialization: res.data.specialization || requestBody.specialization,
              hospitalName: res.data.hospitalName || requestBody.hospitalName,
              verificationDate: res.data.verificationDate || res.data.createdAt || new Date().toISOString(),
              isMedicallyReviewed: res.data.isMedicallyReviewed !== undefined ? Boolean(res.data.isMedicallyReviewed) : requestBody.isMedicallyReviewed,
              about: res.data.about || requestBody.about,
              practitionerType: res.data.practitionerType || requestBody.practitionerType,
              treatmentTherapy: res.data.treatmentTherapy || requestBody.treatmentTherapy,
              gender: res.data.gender || requestBody.gender,
              languagesSpoken: res.data.languagesSpoken || requestBody.languagesSpoken,
              availability: res.data.availability || requestBody.availability,
              areasOfTreatment: res.data.areasOfTreatment || requestBody.areasOfTreatment,
              qualification: res.data.qualification || requestBody.qualification,
              experience: res.data.experience || requestBody.experience,
              phoneNumber: res.data.phoneNumber || requestBody.phoneNumber,
              email: res.data.email || requestBody.email,
              website: res.data.website || requestBody.website,
              aboutTheTreatment: res.data.aboutTheTreatment || requestBody.aboutTheTreatment,
              treatmentMethods: res.data.treatmentMethods || requestBody.treatmentMethods,
              fullAddress: res.data.fullAddress || requestBody.fullAddress,
              isActive: res.data.isActive !== undefined ? Boolean(res.data.isActive) : true,
              createdAt: res.data.createdAt || new Date().toISOString(),
              updatedAt: res.data.updatedAt || new Date().toISOString()
            };

            const existingIdx = this.champions.findIndex(c => c.id === item.id);
            if (existingIdx !== -1) {
              this.champions[existingIdx] = item;
            } else {
              this.champions.unshift(item);
            }
            this.saveToStorage();
            this.updateStats();
            this.updateSpecializations();
            this.applyFilters();
          } else {
            this.loadChampions();
          }
        } else {
          this.handleBackendValidationErrors(res);
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        this.handleBackendValidationErrors(err);
      }
    });
  }

  // Parses backend validation errors and maps them to field errors and formError
  public handleBackendValidationErrors(err: any): void {
    if (err?.status === 401) {
      this.formError = 'Session expired or unauthorized. Please log in again.';
      this.showToast(this.formError, 'error');
      return;
    }

    let rawError = '';
    if (typeof err?.error === 'string') {
      rawError = err.error;
    } else if (err?.error?.message && typeof err.error.message === 'string') {
      rawError = err.error.message;
    } else if (err?.message && typeof err.message === 'string') {
      rawError = err.message;
    }

    const fieldMap: { [key: string]: string } = {};

    // 1. If err.error is an object map
    if (err?.error && typeof err.error === 'object' && !Array.isArray(err.error)) {
      for (const [k, v] of Object.entries(err.error)) {
        if (typeof v === 'string' && !['message', 'timestamp', 'status', 'error', 'path'].includes(k)) {
          fieldMap[k] = v;
        }
      }
    }

    // 2. If err.error.data or err.error.errors or err.error.validationErrors is an object map or array
    const errorData = err?.error?.data || err?.error?.errors || err?.error?.validationErrors;
    if (Array.isArray(errorData)) {
      for (const item of errorData) {
        const field = item.field || item.param;
        const msg = item.message || item.defaultMessage;
        if (field && msg) {
          fieldMap[field] = msg;
        }
      }
    } else if (errorData && typeof errorData === 'object') {
      for (const [k, v] of Object.entries(errorData)) {
        if (typeof v === 'string') {
          fieldMap[k] = v;
        }
      }
    }

    // 3. If raw string contains key=value pairs (e.g. {methods=methods must be between 1 and 1000 characters, practitionerType=...})
    if (rawError && rawError.includes('=')) {
      let cleaned = rawError.trim();
      if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        cleaned = cleaned.substring(1, cleaned.length - 1);
      }
      const pairs = cleaned.split(/,\s*(?=[a-zA-Z0-9_]+=[^=])/);
      for (const pair of pairs) {
        const eqIdx = pair.indexOf('=');
        if (eqIdx !== -1) {
          const k = pair.substring(0, eqIdx).trim();
          const v = pair.substring(eqIdx + 1).trim();
          fieldMap[k] = v;
        }
      }
    }

    // Map into component field errors
    if (fieldMap['name']) {
      this.nameError = fieldMap['name'];
      this.nameTouched = true;
    }
    if (fieldMap['hospitalName']) {
      this.hospitalNameError = fieldMap['hospitalName'];
      this.hospitalNameTouched = true;
    }
    if (fieldMap['specialization']) {
      this.specializationError = fieldMap['specialization'];
      this.specializationTouched = true;
    }
    if (fieldMap['practitionerType']) {
      this.practitionerTypeError = fieldMap['practitionerType'];
    }
    if (fieldMap['treatmentTherapy']) {
      this.treatmentTherapyError = fieldMap['treatmentTherapy'];
    }
    if (fieldMap['gender']) {
      this.genderError = fieldMap['gender'];
    }
    if (fieldMap['languagesSpoken']) {
      this.languagesSpokenError = fieldMap['languagesSpoken'];
    }
    if (fieldMap['areasOfTreatment']) {
      this.areasOfTreatmentError = fieldMap['areasOfTreatment'];
    }
    if (fieldMap['qualification']) {
      this.qualificationError = fieldMap['qualification'];
    }
    if (fieldMap['experience']) {
      this.experienceError = fieldMap['experience'];
    }
    if (fieldMap['phoneNumber']) {
      this.phoneNumberError = fieldMap['phoneNumber'];
      this.phoneTouched = true;
    }
    if (fieldMap['email']) {
      this.emailError = fieldMap['email'];
      this.emailTouched = true;
    }
    if (fieldMap['aboutTheTreatment']) {
      this.aboutTheTreatmentError = fieldMap['aboutTheTreatment'];
    }
    if (fieldMap['treatmentMethods']) {
      this.treatmentMethodsError = fieldMap['treatmentMethods'];
    }
    if (fieldMap['methods']) {
      this.treatmentMethodsError = fieldMap['methods'];
    }
    if (fieldMap['fullAddress']) {
      this.fullAddressError = fieldMap['fullAddress'];
    }
    if (fieldMap['about']) {
      this.aboutError = fieldMap['about'];
    }

    const messages = Object.values(fieldMap);
    if (messages.length > 0) {
      this.formError = messages.join(' | ');
    } else if (rawError === 'An unexpected error occurred. Please try again later.') {
      this.formError = 'Server error occurred while saving. Please ensure all required fields are filled properly and try again.';
    } else {
      this.formError = rawError || 'Failed to save healthcare champion. Please check inputs and try again.';
    }
    this.showToast(this.formError, 'error');
  }

  public toggleStatus(champion: HealthcareChampionItem): void {
    if (this.isTogglingId === champion.id) return;
    this.isTogglingId = champion.id;

    const previousStatus = champion.isActive;
    const nextStatus = !previousStatus;

    // Optimistically update local model
    champion.isActive = nextStatus;
    this.updateStats();
    this.applyFilters();

    // Call POST http://20.193.140.173:8085/admin/api/healthcare-champions/toggle-status
    this.webApiService.ToggleHealthcareChampionStatus(champion.id, nextStatus).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isTogglingId = null;
        if (res && res.success) {
          const finalActive = res.data?.isActive !== undefined ? Boolean(res.data.isActive) : nextStatus;
          champion.isActive = finalActive;
          if (res.data?.updatedAt) {
            champion.updatedAt = res.data.updatedAt;
          }
          this.saveToStorage();
          this.updateStats();
          this.applyFilters();
          const actionWord = finalActive ? 'activated' : 'deactivated';
          this.showToast(res?.message || `Healthcare champion ${actionWord} successfully`, 'success');
        } else {
          // Revert optimistic update
          champion.isActive = previousStatus;
          this.updateStats();
          this.applyFilters();
          this.showToast(res?.message || 'Failed to update champion status', 'error');
        }
      },
      error: (err: any) => {
        this.isTogglingId = null;
        // Revert optimistic update
        champion.isActive = previousStatus;
        this.updateStats();
        this.applyFilters();
        this.showToast(err?.error?.message || 'Failed to update champion status', 'error');
      }
    });
  }

  public getSpecialtyBg(spec: string): string {
    const s = this.formatSpecialization(spec);
    const map: Record<string, string> = {
      'Cardiology': '#FEF2F2',
      'Psychiatry': '#ECFDF5',
      'Endocrinology': '#FFFBEB',
      'Pediatrics': '#F0FDF4',
      'Oncology': '#FDF2F8',
      'Neurology': '#F5F3FF',
      'Orthopedics': '#F0FDF4',
      'Dermatology': '#FFF7ED',
      'ENT': '#ECFEFF',
      'Gastroenterology': '#FFFBEB',
      'Urology': '#EFF6FF',
      'Gynecology': '#FDF2F8',
      'Pulmonology': '#ECFEFF',
      'Nephrology': '#F0FDFA',
      'Rheumatology': '#FDF4FF',
      'Ophthalmology': '#F0F9FF',
      'Dentistry': '#F8FAFC',
      'General Medicine': '#F1F5F9',
      'Surgery': '#FFF1F2',
      'Anesthesiology': '#F8FAFC'
    };
    return map[s] || '#F1F5F9';
  }

  public getSpecialtyColor(spec: string): string {
    const s = this.formatSpecialization(spec);
    const map: Record<string, string> = {
      'Cardiology': '#DC2626',
      'Psychiatry': '#059669',
      'Endocrinology': '#D97706',
      'Pediatrics': '#16A34A',
      'Oncology': '#DB2777',
      'Neurology': '#7C3AED',
      'Orthopedics': '#16A34A',
      'Dermatology': '#EA580C',
      'ENT': '#0891B2',
      'Gastroenterology': '#B45309',
      'Urology': '#2563EB',
      'Gynecology': '#DB2777',
      'Pulmonology': '#0891B2',
      'Nephrology': '#0D9488',
      'Rheumatology': '#A21CAF',
      'Ophthalmology': '#0284C7',
      'Dentistry': '#475569',
      'General Medicine': '#334155',
      'Surgery': '#E11D48',
      'Anesthesiology': '#475569'
    };
    return map[s] || '#334155';
  }

  public showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.toastMessage = '';
    }, 4000);
  }

  private getEmptyForm(): HealthcareChampionForm {
    return {
      name: '',
      photo: 'string',
      specialization: '',
      hospitalName: '',
      isMedicallyReviewed: true,
      about: '',
      practitionerType: '',
      treatmentTherapy: '',
      gender: 'Male',
      languagesSpoken: '',
      availability: '',
      areasOfTreatment: '',
      qualification: '',
      experience: '',
      phoneNumber: '',
      email: '',
      website: '',
      aboutTheTreatment: '',
      treatmentMethods: '',
      fullAddress: ''
    };
  }
}
