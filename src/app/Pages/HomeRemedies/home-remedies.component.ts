import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WebapiService } from '../../services/webapi.service';

export interface HomeRemedyItem {
  id: number;
  title: string;
  description: string;
  category: string;
  remedyContent: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeRemedyForm {
  id?: number | string;
  title: string;
  category: string;
  description: string;
  remedyContent: string;
}

@Component({
  selector: 'app-home-remedies',
  templateUrl: './home-remedies.component.html',
  standalone: false,
  styles: [`
    /* Header Container */
    .db-header-container {
      width: auto !important;
      margin-bottom: 0 !important;
    }

    .cm-page-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 700 !important;
      font-size: 28px !important;
      line-height: 34px !important;
      letter-spacing: -0.02em !important;
      color: #0F172A !important;
      margin: 0 0 6px 0 !important;
    }

    .cm-page-subtitle {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 400 !important;
      font-size: 14px !important;
      line-height: 20px !important;
      color: #64748B !important;
      margin: 0 !important;
    }

    /* Add Remedy Button (Gradient matching Content Management) */
    .cm-btn-upload {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      width: auto !important;
      min-width: 150px !important;
      height: 38px !important;
      background: linear-gradient(90deg, #00C950 0%, #009689 100%) !important;
      color: #FFFFFF !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 8px 16px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      box-shadow: 0 2px 6px rgba(0, 201, 80, 0.25) !important;
      transition: all 0.2s ease !important;
      white-space: nowrap !important;
    }
    .cm-btn-upload:hover {
      opacity: 0.95 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 201, 80, 0.35) !important;
    }

    /* Pastel Summary Stat Cards */
    .cm-stat-card {
      width: 100% !important;
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
    .cm-stat-card-blue   { background: #F0F6FF !important; }
    .cm-stat-card-green  { background: #F0FDF4 !important; }
    .cm-stat-card-amber  { background: #FFFBEB !important; }
    .cm-stat-card-purple { background: #FAF5FF !important; }

    .cm-stat-label {
      font-family: 'Inter', sans-serif !important;
      font-weight: 400 !important;
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
      margin: 0 !important;
    }
    .cm-stat-value-blue   { color: #2563EB !important; }
    .cm-stat-value-green  { color: #16A34A !important; }
    .cm-stat-value-amber  { color: #EA580C !important; }
    .cm-stat-value-purple { color: #9333EA !important; }

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
      width: 16px !important;
      height: 16px !important;
      pointer-events: none !important;
    }

    .cm-search-input {
      width: 100% !important;
      height: 38px !important;
      border-radius: 8px !important;
      border: 1px solid #E2E8F0 !important;
      background: #F3F4F6 !important;
      padding: 0 36px 0 38px !important;
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
      padding: 7px 16px !important;
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

    /* Cards */
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

    /* Table */
    .um-table-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      overflow: hidden;
    }
    .um-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Inter', sans-serif;
    }
    .um-table thead {
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
    }
    .um-table th {
      padding: 12px 18px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #475569;
      text-align: left;
    }
    .um-table td {
      padding: 14px 18px;
      font-size: 13.5px;
      border-bottom: 1px solid #F1F5F9;
      color: #1E293B;
      vertical-align: middle;
    }
    .um-table tr:hover td {
      background: #F8FAFC;
    }

    /* Modals & Toast */
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
      max-width: 720px !important;
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
      z-index: 9999;
      padding: 12px 18px;
      border-radius: 10px;
      font-family: 'Inter', sans-serif;
      font-size: 13.5px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15);
      animation: toastSlideUp 0.25s ease-out;
    }
    @keyframes toastSlideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .ha-toast-success {
      background: #0F172A;
      color: #FFFFFF;
      border-left: 4px solid #22C55E;
    }
    .ha-toast-error {
      background: #0F172A;
      color: #FFFFFF;
      border-left: 4px solid #EF4444;
    }

    .cm-modal-submit-btn {
      background: #0F172A !important;
      color: #FFFFFF !important;
      border-radius: 10px !important;
      height: 42px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      border: none !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      transition: background 0.2s ease !important;
    }
    .cm-modal-submit-btn:hover:not(:disabled) {
      background: #1E293B !important;
    }
    .cm-modal-submit-btn:disabled {
      opacity: 0.6 !important;
      cursor: not-allowed !important;
    }

    /* Content Table Styles */
    .ha-content-table {
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 12px !important;
      background: #FFFFFF !important;
      margin: 6px 0 !important;
      border: 1px solid #CBD5E1 !important;
    }
    .ha-content-table th {
      background: #F1F5F9 !important;
      color: #0F172A !important;
      font-weight: 600 !important;
      padding: 6px 10px !important;
      border: 1px solid #CBD5E1 !important;
      text-align: left !important;
      white-space: nowrap !important;
    }
    .ha-content-table td {
      padding: 6px 10px !important;
      border: 1px solid #E2E8F0 !important;
      color: #334155 !important;
      vertical-align: middle !important;
    }
    .ha-content-table tbody tr:nth-child(even) {
      background: #F8FAFC !important;
    }
  `]
})
export class HomeRemediesComponent implements OnInit, OnDestroy {
  public remedies: HomeRemedyItem[] = [];
  public filteredRemedies: HomeRemedyItem[] = [];
  public searchQuery: string = '';
  public activeTab: string = 'All';
  public selectedCategory: string = 'All';
  public selectedStatus: string = 'All';

  // Stats
  public totalRemediesCount: number = 0;
  public activeCount: number = 0;
  public inactiveCount: number = 0;
  public categoriesCount: number = 0;

  // Dropdown menu state
  public openDropdownId: number | null = null;
  public isTogglingId: number | null = null;

  // Master Data Categories from API
  public masterCategories: string[] = [];

  // Categories
  public categories: string[] = [
    'All',
    'Respiratory',
    'Immunity',
    'Pain Relief',
    'Heart Health',
    'Digestion'
  ];

  // Full medical master categories (same as other modules)
  public selectableCategories: string[] = [
    'Cardiology', 'Psychiatry', 'Endocrinology', 'Pediatrics', 'Oncology',
    'Neurology', 'Orthopedics', 'Dermatology', 'ENT', 'Gastroenterology',
    'Urology', 'Gynecology', 'Pulmonology', 'Nephrology', 'Rheumatology',
    'Ophthalmology', 'Dentistry', 'General Medicine', 'Surgery', 'Anesthesiology'
  ];

  public get allCategories(): string[] {
    // Prefer master categories from API; fall back to the full medical master list
    const list = this.masterCategories.length > 0
      ? this.masterCategories
      : this.selectableCategories;
    return list.filter(c => c !== 'All');
  }

  public get dynamicCategories(): string[] {
    const present = this.remedies
      .map(r => r.category ? r.category.trim() : '')
      .filter((c): c is string => c.length > 0 && c !== 'All');
    if (this.activeTab && this.activeTab !== 'All') {
      present.push(this.activeTab);
    }
    return Array.from(new Set(present)).sort();
  }

  private searchSubject: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  // Modals & CRUD
  public isCreateModalOpen: boolean = false;
  public isEditing: boolean = false;
  public formModel: HomeRemedyForm = this.getEmptyForm();
  public formError: string = '';
  public isLoading: boolean = false;
  public isSaving: boolean = false;

  // Table & Content Formatting state
  public showTableMenu: boolean = false;
  public showCustomTableModal: boolean = false;
  public customTableColumns: string = 'Ingredient, Quantity, Preparation Notes';
  public customTableRows: number = 2;
  public contentTab: 'write' | 'preview' = 'write';

  // Toast feedback
  public toastMessage: string = '';
  public toastType: 'success' | 'error' = 'success';
  private toastTimer: any = null;

  constructor(
    private webApiService: WebapiService,
    private sanitizer: DomSanitizer
  ) {}

  @HostListener('document:click')
  public onDocumentClick(): void {
    this.closeDropdown();
  }

  ngOnInit(): void {
    this.initSearchDebounce();
    this.loadMasterCategories();
    this.loadRemedies();
  }

  public loadMasterCategories(): void {
    this.webApiService.GetHomeRemedyCategories({}).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res && res.success && Array.isArray(res.data)) {
          this.masterCategories = res.data;
        } else if (Array.isArray(res?.data?.data)) {
          this.masterCategories = res.data.data;
        } else if (Array.isArray(res)) {
          this.masterCategories = res;
        }
        if (this.masterCategories.length > 0 && !this.formModel.category) {
          this.formModel.category = this.masterCategories[0];
        }
        this.updateCategories();
      },
      error: () => {
        if (this.masterCategories.length === 0) {
          this.masterCategories = ['Respiratory', 'Immunity', 'Pain Relief', 'Heart Health', 'Digestion'];
        }
        this.updateCategories();
      }
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
    this.showTableMenu = false;
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

  public onSearchClick(): void {
    this.applyFilters();
  }

  public clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
    this.applyFilters();
  }

  public loadRemedies(): void {
    this.isLoading = true;

    // Purge old mock data from localStorage
    const localData = localStorage.getItem('activeLife_homeRemedies');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.some(p => typeof p.id === 'string' && String(p.id).startsWith('HR-'))) {
          localStorage.removeItem('activeLife_homeRemedies');
        }
      } catch (e) {
        localStorage.removeItem('activeLife_homeRemedies');
      }
    }

    // Call backend API http://20.193.140.173:8085/admin/api/home-remedies/list
    this.webApiService.GetHomeRemedies({}).pipe(
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
        } else if (Array.isArray(res)) {
          rawList = res;
        }

        this.remedies = rawList.map((item: any) => ({
          id: Number(item.id),
          title: item.title || '',
          description: item.description || '',
          category: item.category || 'General Wellness',
          remedyContent: item.remedyContent || item.description || '',
          isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || ''
        }));

        this.saveToStorage();
        this.updateStats(res?.data?.totalElements);
        this.updateCategories();
        this.applyFilters();
      },
      error: () => {
        this.isLoading = false;
        const cached = localStorage.getItem('activeLife_homeRemedies');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0].id === 'number') {
              this.remedies = parsed;
              this.updateStats();
              this.updateCategories();
              this.applyFilters();
              return;
            }
          } catch (e) {}
        }
        this.remedies = [];
        this.updateStats();
        this.applyFilters();
      }
    });
  }

  public applyFilters(): void {
    let result = [...this.remedies];

    // 1. Search Query
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(r =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.category && r.category.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.remedyContent && r.remedyContent.toLowerCase().includes(q))
      );
    }

    // 2. Category Tab Filter (matching Content Management activeTab)
    const activeCategory = this.activeTab || this.selectedCategory;
    if (activeCategory && activeCategory !== 'All') {
      const target = activeCategory.toLowerCase();
      result = result.filter(r => {
        const cat = (r.category || '').toLowerCase();
        return cat === target || cat.includes(target) || target.includes(cat);
      });
    }

    // 3. Status Filter
    if (this.selectedStatus === 'Active') {
      result = result.filter(r => r.isActive);
    } else if (this.selectedStatus === 'Inactive') {
      result = result.filter(r => !r.isActive);
    }

    this.filteredRemedies = result;
  }

  public setTab(cat: string): void {
    this.activeTab = cat;
    this.selectedCategory = cat;
    this.applyFilters();
  }

  public selectCategory(cat: string): void {
    this.setTab(cat);
  }

  public selectStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  public resetAllFilters(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
    this.activeTab = 'All';
    this.selectedCategory = 'All';
    this.selectedStatus = 'All';
    this.applyFilters();
  }

  public updateStats(totalElements?: number): void {
    this.totalRemediesCount = totalElements !== undefined ? totalElements : this.remedies.length;
    this.activeCount = this.remedies.filter(r => r.isActive).length;
    this.inactiveCount = this.remedies.filter(r => !r.isActive).length;
    const catSet = new Set(this.remedies.map(r => r.category).filter(c => c && c.trim()));
    this.categoriesCount = catSet.size;
  }

  public updateCategories(): void {
    const present = Array.from(new Set(this.remedies.map(r => r.category).filter(c => c && c.trim())));
    const base = this.masterCategories.length > 0
      ? this.masterCategories
      : ['Respiratory', 'Immunity', 'Pain Relief', 'Heart Health', 'Digestion'];
    const merged = Array.from(new Set(['All', ...base, ...present]));
    this.categories = merged;
  }

  private saveToStorage(): void {
    localStorage.setItem('activeLife_homeRemedies', JSON.stringify(this.remedies));
  }

  // Modals & CRUD
  public openCreateModal(): void {
    this.isEditing = false;
    this.formModel = this.getEmptyForm();
    this.formError = '';
    this.showTableMenu = false;
    this.showCustomTableModal = false;
    this.contentTab = 'write';
    this.isCreateModalOpen = true;
  }

  public openEditModal(remedy: HomeRemedyItem): void {
    this.isEditing = true;
    this.formModel = {
      id: remedy.id,
      title: remedy.title,
      category: remedy.category,
      description: remedy.description,
      remedyContent: remedy.remedyContent
    };
    this.formError = '';
    this.showTableMenu = false;
    this.showCustomTableModal = false;
    this.contentTab = 'write';
    this.isCreateModalOpen = true;
  }

  public closeModal(): void {
    this.isCreateModalOpen = false;
    this.formError = '';
    this.isSaving = false;
    this.showTableMenu = false;
    this.showCustomTableModal = false;
    this.contentTab = 'write';
  }

  public saveRemedy(): void {
    this.formError = '';

    if (!this.formModel.title || this.formModel.title.trim().length < 2) {
      this.formError = 'Please enter a valid remedy title.';
      return;
    }
    if (!this.formModel.category || !this.formModel.category.trim()) {
      this.formError = 'Please select or enter a category.';
      return;
    }
    if (!this.formModel.description || this.formModel.description.trim().length < 3) {
      this.formError = 'Please provide a description.';
      return;
    }
    if (!this.formModel.remedyContent || !this.formModel.remedyContent.trim()) {
      this.formError = 'Please provide remedy content.';
      return;
    }

    this.isSaving = true;

    const requestBody: any = {
      title: this.formModel.title.trim(),
      description: this.formModel.description.trim(),
      category: this.formModel.category.trim(),
      remedyContent: this.formModel.remedyContent.trim()
    };

    if (this.isEditing && this.formModel.id !== undefined && this.formModel.id !== null && this.formModel.id !== '') {
      requestBody.id = String(this.formModel.id);
    }

    const apiCall$ = this.isEditing
      ? this.webApiService.UpdateHomeRemedy(requestBody)
      : this.webApiService.CreateHomeRemedy(requestBody);

    apiCall$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res && res.success) {
          const msg = res?.message || (this.isEditing ? 'Home remedy updated successfully' : 'Home remedy created successfully');
          this.showToast(msg, 'success');
          this.closeModal();

          if (res?.data && res.data.id !== undefined) {
            const item: HomeRemedyItem = {
              id: Number(res.data.id),
              title: res.data.title || requestBody.title,
              category: res.data.category || requestBody.category,
              description: res.data.description || requestBody.description,
              remedyContent: res.data.remedyContent || requestBody.remedyContent,
              isActive: res.data.isActive !== undefined ? Boolean(res.data.isActive) : true,
              createdAt: res.data.createdAt || new Date().toISOString(),
              updatedAt: res.data.updatedAt || new Date().toISOString()
            };

            const existingIdx = this.remedies.findIndex(r => Number(r.id) === Number(item.id));
            if (existingIdx !== -1) {
              this.remedies[existingIdx] = item;
            } else {
              this.remedies.unshift(item);
            }
            this.saveToStorage();
            this.updateStats();
            this.updateCategories();
            this.applyFilters();
          } else {
            this.loadRemedies();
          }
        } else {
          this.formError = res?.message || 'Failed to save home remedy.';
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        this.formError = err?.error?.message || err?.message || 'Failed to save home remedy. Please try again.';
      }
    });
  }

  public toggleStatus(remedy: HomeRemedyItem): void {
    if (this.isTogglingId === remedy.id) return;
    this.isTogglingId = remedy.id;

    const previousStatus = remedy.isActive;
    const nextStatus = !previousStatus;

    // Optimistically update
    remedy.isActive = nextStatus;
    this.updateStats();
    this.applyFilters();

    this.webApiService.ToggleHomeRemedyStatus(remedy.id, nextStatus).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isTogglingId = null;
        if (res && res.success) {
          const finalActive = res.data?.isActive !== undefined ? Boolean(res.data.isActive) : nextStatus;
          remedy.isActive = finalActive;
          if (res.data?.updatedAt) remedy.updatedAt = res.data.updatedAt;
          this.saveToStorage();
          this.updateStats();
          this.applyFilters();
          this.showToast(res?.message || 'Home remedy status updated successfully', 'success');
        } else {
          remedy.isActive = previousStatus;
          this.updateStats();
          this.applyFilters();
          this.showToast(res?.message || 'Failed to update remedy status', 'error');
        }
      },
      error: (err: any) => {
        this.isTogglingId = null;
        remedy.isActive = previousStatus;
        this.updateStats();
        this.applyFilters();
        this.showToast(err?.error?.message || 'Failed to update remedy status', 'error');
      }
    });
  }

  public getCategoryBg(cat: string): string {
    const map: Record<string, string> = {
      'Heart Health': '#EFF6FF',
      'Immunity': '#ECFDF5',
      'Digestive Health': '#FFFBEB',
      'Digestion': '#FFFBEB',
      'Respiratory': '#FEF2F2',
      'Skin Care': '#FFF7ED',
      'Pain Relief': '#F5F3FF',
      'General Wellness': '#F1F5F9'
    };
    return map[cat] || '#F1F5F9';
  }

  public getCategoryColor(cat: string): string {
    const map: Record<string, string> = {
      'Heart Health': '#2563EB',
      'Immunity': '#059669',
      'Digestive Health': '#D97706',
      'Digestion': '#D97706',
      'Respiratory': '#DC2626',
      'Skin Care': '#EA580C',
      'Pain Relief': '#7C3AED',
      'General Wellness': '#334155'
    };
    return map[cat] || '#334155';
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

  // ==========================================
  // Table Insertion & Remedy Content Formatting
  // ==========================================
  public toggleTableMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showTableMenu = !this.showTableMenu;
  }

  public insertTableTemplate(type: 'ingredients' | 'steps' | 'schedule'): void {
    let template = '';
    if (type === 'ingredients') {
      template = '\n| Ingredient | Quantity | Preparation Notes |\n| :--- | :--- | :--- |\n| Garlic Cloves | 2-3 raw cloves | Crush and take in the morning |\n| Raw Honey | 1 tablespoon | Mix with warm water |\n';
    } else if (type === 'steps') {
      template = '\n| Step | Action | Timing / Duration |\n| :--- | :--- | :--- |\n| Step 1 | Wash and crush the fresh herbs | 2 mins |\n| Step 2 | Steep in boiling water | 10 mins |\n| Step 3 | Strain and serve warm | Immediate |\n';
    } else if (type === 'schedule') {
      template = '\n| Time of Day | Dosage | Instructions |\n| :--- | :--- | :--- |\n| Morning | 1 cup | Take on an empty stomach |\n| Evening | 1 cup | 30 minutes before bed |\n';
    }
    this.appendContent(template);
    this.showTableMenu = false;
  }

  public openCustomTableModal(): void {
    this.showTableMenu = false;
    this.showCustomTableModal = true;
  }

  public closeCustomTableModal(): void {
    this.showCustomTableModal = false;
  }

  public insertCustomTable(): void {
    const cols = (this.customTableColumns || '')
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);
    if (cols.length === 0) return;

    const headerRow = '| ' + cols.join(' | ') + ' |';
    const dividerRow = '| ' + cols.map(() => ':---').join(' | ') + ' |';
    let dataRows = '';
    const rowsCount = Math.max(1, Math.min(this.customTableRows || 2, 20));
    for (let i = 1; i <= rowsCount; i++) {
      dataRows += '| ' + cols.map((col) => `Sample ${col}`).join(' | ') + ' |\n';
    }

    const customTemplate = `\n${headerRow}\n${dividerRow}\n${dataRows}`;
    this.appendContent(customTemplate);
    this.showCustomTableModal = false;
    this.showTableMenu = false;
  }

  public appendContent(text: string): void {
    if (!this.formModel.remedyContent || !this.formModel.remedyContent.trim()) {
      this.formModel.remedyContent = text.trim();
    } else {
      this.formModel.remedyContent = this.formModel.remedyContent.trimEnd() + '\n' + text.trim();
    }
  }

  public renderRemedyContent(raw: string): SafeHtml {
    if (!raw) return '';

    // If already raw HTML table
    if (raw.includes('<table') && raw.includes('</table>')) {
      return this.sanitizer.bypassSecurityTrustHtml(raw);
    }

    const lines = raw.split(/\r?\n/);
    let inTable = false;
    let tableHtml = '';
    let resultHtml = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if line looks like markdown table row: has >= 2 pipes
      if (line.includes('|') && line.split('|').length >= 3) {
        // Is separator row like | :--- | ---: | or |---|---|?
        const isSeparator = /^\|?(\s*:?-{2,}:?\s*\|)+\s*:?-{2,}:?\s*\|?$/.test(line);
        if (isSeparator) {
          continue;
        }

        const rawCells = line.split('|');
        if (line.startsWith('|')) rawCells.shift();
        if (line.endsWith('|')) rawCells.pop();
        const cells = rawCells.map(c => c.trim());

        if (!inTable) {
          inTable = true;
          tableHtml = '<div class="table-responsive my-2"><table class="table table-bordered table-sm ha-content-table mb-0"><thead><tr>';
          cells.forEach(c => {
            tableHtml += `<th>${this.escapeAndFormat(c)}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>';
          cells.forEach(c => {
            tableHtml += `<td>${this.escapeAndFormat(c)}</td>`;
          });
          tableHtml += '</tr>';
        }
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += '</tbody></table></div>';
          resultHtml += tableHtml;
          tableHtml = '';
        }
        if (line.length > 0) {
          resultHtml += `<div class="mb-1">${this.escapeAndFormat(line)}</div>`;
        }
      }
    }

    if (inTable) {
      tableHtml += '</tbody></table></div>';
      resultHtml += tableHtml;
    }

    return this.sanitizer.bypassSecurityTrustHtml(resultHtml);
  }

  private escapeAndFormat(text: string): string {
    if (!text) return '';
    let s = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return s;
  }

  private getEmptyForm(): HomeRemedyForm {
    return {
      title: '',
      category: (this.masterCategories && this.masterCategories.length > 0) ? this.masterCategories[0] : 'Heart Health',
      description: '',
      remedyContent: ''
    };
  }
}
