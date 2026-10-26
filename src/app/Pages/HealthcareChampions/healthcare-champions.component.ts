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

  // Search debouncing
  private searchSubject: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  // Modals & Selection
  public isCreateModalOpen: boolean = false;
  public isEditing: boolean = false;

  // Form Model strictly matching SaveHealthcareChampionRequest
  public formModel: HealthcareChampionForm = this.getEmptyForm();
  public formError: string = '';
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
          experience: item.experience || '',
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

  public formatExperience(e?: string): string {
    if (!e || e.trim().toLowerCase() === 'string') return '';
    const trimmed = e.trim();
    if (/^\d+$/.test(trimmed)) return `${trimmed} Years Experience`;
    return trimmed;
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

  // Modals & CRUD
  public openCreateModal(): void {
    this.isEditing = false;
    this.formModel = this.getEmptyForm();
    this.formError = '';
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
      practitionerType: champion.practitionerType,
      treatmentTherapy: champion.treatmentTherapy,
      gender: champion.gender,
      languagesSpoken: champion.languagesSpoken,
      availability: champion.availability || '',
      areasOfTreatment: champion.areasOfTreatment,
      qualification: champion.qualification,
      experience: champion.experience,
      phoneNumber: champion.phoneNumber,
      email: champion.email,
      website: champion.website || '',
      aboutTheTreatment: champion.aboutTheTreatment,
      treatmentMethods: champion.treatmentMethods,
      fullAddress: champion.fullAddress
    };
    this.formError = '';
    this.isCreateModalOpen = true;
  }

  public closeModal(): void {
    this.isCreateModalOpen = false;
    this.formError = '';
    this.isSaving = false;
  }

  public saveChampion(): void {
    this.formError = '';

    if (!this.formModel.name || this.formModel.name.trim().length < 3) {
      this.formError = 'Please enter a valid practitioner name (minimum 3 characters).';
      return;
    }
    if (!this.formModel.specialization) {
      this.formError = 'Please select a specialization.';
      return;
    }
    if (!this.formModel.hospitalName || this.formModel.hospitalName.trim().length < 3) {
      this.formError = 'Please provide the hospital or clinic name (minimum 3 characters).';
      return;
    }

    // Phone validation strictly following backend pattern: ^\+91[6-9][0-9]{9}$
    let phone = this.formModel.phoneNumber ? this.formModel.phoneNumber.trim() : '';
    if (!phone.startsWith('+91')) {
      // Auto-prefix +91 if user entered 10 digits
      if (/^[6-9][0-9]{9}$/.test(phone)) {
        phone = '+91' + phone;
        this.formModel.phoneNumber = phone;
      }
    }
    const phoneRegex = /^\+91[6-9][0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      this.formError = 'Please enter a valid Indian phone number starting with +91 (e.g. +919876543210).';
      return;
    }

    this.isSaving = true;

    // Conforms strictly to SaveHealthcareChampionRequest with dynamic values only
    const requestBody: any = {
      name: this.formModel.name.trim(),
      photo: this.formModel.photo?.trim() || '',
      specialization: this.formModel.specialization.trim(),
      hospitalName: this.formModel.hospitalName.trim(),
      isMedicallyReviewed: Boolean(this.formModel.isMedicallyReviewed),
      about: this.formModel.about?.trim() || '',
      practitionerType: this.formModel.practitionerType?.trim() || '',
      treatmentTherapy: this.formModel.treatmentTherapy?.trim() || '',
      gender: this.formModel.gender?.trim() || 'Male',
      languagesSpoken: this.formModel.languagesSpoken?.trim() || '',
      availability: this.formModel.availability?.trim() || '',
      areasOfTreatment: this.formModel.areasOfTreatment?.trim() || '',
      qualification: this.formModel.qualification?.trim() || '',
      experience: this.formModel.experience?.trim() || '',
      phoneNumber: phone,
      email: this.formModel.email?.trim() || '',
      website: this.formModel.website?.trim() || '',
      aboutTheTreatment: this.formModel.aboutTheTreatment?.trim() || '',
      treatmentMethods: this.formModel.treatmentMethods?.trim() || '',
      fullAddress: this.formModel.fullAddress?.trim() || ''
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
          this.formError = res?.message || 'Failed to save champion profile.';
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        this.formError = err?.error?.message || err?.message || 'Failed to save healthcare champion. Please check inputs and try again.';
      }
    });
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
      photo: '',
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
