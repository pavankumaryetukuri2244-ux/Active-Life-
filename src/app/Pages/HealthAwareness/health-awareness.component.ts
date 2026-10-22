import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WebapiService } from '../../services/webapi.service';

export interface HealthAwarenessItem {
  id: number;
  title: string;
  category: string;
  description: string;
  publishedDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthAwarenessForm {
  id?: number | string;
  title: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-health-awareness',
  templateUrl: './health-awareness.component.html',
  standalone: false,
  styles: [`
    .cm-page-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 700 !important;
      font-style: normal !important;
      font-size: 30px !important;
      line-height: 36px !important;
      letter-spacing: 0.4px !important;
      color: #0F172A !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
      white-space: nowrap !important;
    }

    .cm-page-subtitle {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 400 !important;
      font-style: normal !important;
      font-size: 16px !important;
      line-height: 24px !important;
      letter-spacing: -0.31px !important;
      color: #62748E !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
      white-space: normal !important;
    }

    /* Upload/Create Button (Exact Specs from Content Management: gradient #00C950 -> #009689, radius 8px) */
    .cm-btn-upload {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      width: auto !important;
      min-width: 148px !important;
      height: 36px !important;
      background: linear-gradient(90deg, #00C950 0%, #009689 100%) !important;
      color: #FFFFFF !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 8px 14px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      font-style: normal !important;
      line-height: 20px !important;
      letter-spacing: -0.15px !important;
      white-space: nowrap !important;
      cursor: pointer !important;
      box-shadow: 0 2px 6px rgba(0, 201, 80, 0.25) !important;
      transition: all 0.2s ease !important;
      box-sizing: border-box !important;
    }
    .cm-btn-upload:hover {
      opacity: 0.95 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 201, 80, 0.35) !important;
    }

    /* Modal Submit Button matching Content Management */
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
      width: 100% !important;

      span {
        color: #FFFFFF !important;
        font-weight: 600 !important;
        font-size: 14px !important;
      }

      &:hover:not(:disabled) {
        background: #1E293B !important;
        color: #FFFFFF !important;
      }
    }

    /* Stat Cards - Pastel Colored Boxes from Content Management */
    .cm-stat-card {
      width: 100% !important;
      max-width: 388px !important;
      height: 120px !important;
      border-radius: 14px !important;
      padding: 20px !important;
      gap: 24px !important;
      border: none !important;
      transition: none !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      box-sizing: border-box !important;
    }

    .cm-stat-card-blue {
      background: #F0F6FF !important;
    }
    .cm-stat-card-green {
      background: #F0FDF4 !important;
    }
    .cm-stat-card-purple {
      background: #FAF5FF !important;
    }
    .cm-stat-card-amber {
      background: #FFFBEB !important;
    }

    .cm-stat-label {
      height: 20px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 400 !important;
      font-size: 14px !important;
      line-height: 20px !important;
      letter-spacing: -0.15px !important;
      color: #64748B !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
      white-space: nowrap !important;
    }

    .cm-stat-value {
      height: 36px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 700 !important;
      font-size: 30px !important;
      line-height: 36px !important;
      letter-spacing: 0.4px !important;
      margin: 0 !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      white-space: nowrap !important;
    }

    .cm-stat-value-blue {
      color: #2563EB !important;
    }
    .cm-stat-value-green {
      color: #16A34A !important;
    }
    .cm-stat-value-purple {
      color: #9333EA !important;
    }
    .cm-stat-value-amber {
      color: #EA580C !important;
    }

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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
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

    .cm-search-input::placeholder {
      color: #94A3B8 !important;
      font-weight: 400 !important;
      font-size: 13px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
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

    /* Content Cards matching content.component.html */
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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: -0.31px;
      color: #0F172A;
    }

    /* Modal Backdrop & Dialog */
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
      max-width: 620px !important;
      max-height: 90vh !important;
      overflow-y: auto !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
      animation: modalFadeIn 0.25s ease-out !important;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }

    /* Toast Notification */
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
export class HealthAwarenessComponent implements OnInit, OnDestroy {
  public articles: HealthAwarenessItem[] = [];
  public filteredArticles: HealthAwarenessItem[] = [];
  public searchQuery: string = '';
  public selectedCategory: string = 'All';
  public selectedStatus: string = 'All';

  // Stats
  public totalContentCount: number = 0;
  public activeCount: number = 0;
  public inactiveCount: number = 0;
  public categoriesCount: number = 0;

  // Dropdown menu state
  public openDropdownId: number | null = null;

  // Categories list - strictly only these 20 categories
  public selectableCategories: string[] = [
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

  public categories: string[] = ['All', ...this.selectableCategories];

  // Search debouncing
  private searchSubject: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  // Modals & Selection
  public isCreateModalOpen: boolean = false;
  public isEditing: boolean = false;

  // Form Model strictly matching the create/update request body
  public formModel: HealthAwarenessForm = this.getEmptyForm();
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
    this.loadArticles();
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

  private fetchMasterCategories(): void {
    this.webApiService.GetMedicalCategories({}).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const fetchedCats = res.data.map((c: string) => c.trim()).filter((c: string) => c.length > 0);
          this.selectableCategories = fetchedCats;
          this.updateCategories();
        }
      },
      error: () => {
        // Keep standard list
      }
    });
  }

  public loadArticles(): void {
    this.isLoading = true;

    // Call backend API http://20.193.140.173:8085/admin/api/health-content/list with payload {}
    this.webApiService.GetHealthAwareness({}).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        let rawList: any[] = [];

        // Response format: { success: true, message: "...", data: { data: [...], totalElements: 6 } }
        if (res?.data?.data && Array.isArray(res.data.data)) {
          rawList = res.data.data;
        } else if (Array.isArray(res?.data)) {
          rawList = res.data;
        } else if (res?.data?.content && Array.isArray(res.data.content)) {
          rawList = res.data.content;
        } else if (res?.data?.articles && Array.isArray(res.data.articles)) {
          rawList = res.data.articles;
        } else if (Array.isArray(res)) {
          rawList = res;
        }

        // Map strictly to HealthAwarenessItem model
        this.articles = rawList.map((item: any) => ({
          id: Number(item.id),
          title: item.title || '',
          category: item.category || 'General Medicine',
          description: item.description || '',
          publishedDate: item.publishedDate || item.createdAt || '',
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
        // Attempt to read previously cached real API items
        const cached = localStorage.getItem('activeLife_healthAwareness');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0].id === 'number') {
              this.articles = parsed;
              this.updateStats();
              this.updateCategories();
              this.applyFilters();
              return;
            }
          } catch (e) {}
        }
        // ONLY DISPLAY API DATA - NO MOCK DATA
        this.articles = [];
        this.updateStats();
        this.applyFilters();
      }
    });
  }

  public applyFilters(): void {
    let result = [...this.articles];

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(a =>
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q))
      );
    }

    if (this.selectedCategory !== 'All') {
      result = result.filter(a => a.category === this.selectedCategory);
    }

    if (this.selectedStatus === 'Active') {
      result = result.filter(a => a.isActive);
    } else if (this.selectedStatus === 'Inactive') {
      result = result.filter(a => !a.isActive);
    }

    this.filteredArticles = result;
  }

  public selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  public selectStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  public resetAllFilters(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
    this.selectedCategory = 'All';
    this.selectedStatus = 'All';
    this.applyFilters();
  }

  public updateStats(totalElements?: number): void {
    this.totalContentCount = totalElements !== undefined ? totalElements : this.articles.length;
    this.activeCount = this.articles.filter(a => a.isActive).length;
    this.inactiveCount = this.articles.filter(a => !a.isActive).length;
    const catSet = new Set(this.articles.map(a => a.category).filter(c => c && c.trim()));
    this.categoriesCount = catSet.size;
  }

  public updateCategories(): void {
    this.categories = ['All', ...this.selectableCategories];
  }

  private saveToStorage(): void {
    localStorage.setItem('activeLife_healthAwareness', JSON.stringify(this.articles));
  }

  // Modals & CRUD
  public openCreateModal(): void {
    this.isEditing = false;
    this.formModel = this.getEmptyForm();
    this.formError = '';
    this.isCreateModalOpen = true;
  }

  public openEditModal(article: HealthAwarenessItem): void {
    this.isEditing = true;
    this.formModel = {
      id: String(article.id),
      title: article.title,
      category: article.category,
      description: article.description
    };
    this.formError = '';
    this.isCreateModalOpen = true;
  }

  public closeModal(): void {
    this.isCreateModalOpen = false;
    this.formError = '';
    this.isSaving = false;
  }

  public saveArticle(): void {
    this.formError = '';
    const title = this.formModel.title ? this.formModel.title.trim() : '';
    const category = this.formModel.category ? this.formModel.category.trim() : '';
    const description = this.formModel.description ? this.formModel.description.trim() : '';

    if (!title) {
      this.formError = 'Please provide an article title.';
      return;
    }
    if (title.length < 5) {
      this.formError = 'Title must be at least 5 characters long.';
      return;
    }
    if (!category) {
      this.formError = 'Please select a category.';
      return;
    }
    if (!description) {
      this.formError = 'Please enter an article description.';
      return;
    }

    this.isSaving = true;

    // Use strictly the required keys for the request body
    const requestBody: any = {
      title: title,
      category: category,
      description: description
    };

    if (this.isEditing && this.formModel.id !== undefined && this.formModel.id !== null && this.formModel.id !== '') {
      requestBody.id = String(this.formModel.id);
    }

    this.webApiService.CreateHealthAwareness(requestBody).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res && res.success) {
          const msg = res?.message || (this.isEditing ? 'Health content updated successfully' : 'Health content created successfully');
          this.showToast(msg, 'success');
          this.closeModal();

          if (res?.data && res.data.id) {
            const item: HealthAwarenessItem = {
              id: Number(res.data.id),
              title: res.data.title || requestBody.title,
              category: res.data.category || requestBody.category,
              description: res.data.description || requestBody.description,
              publishedDate: res.data.publishedDate || res.data.createdAt || new Date().toISOString(),
              isActive: res.data.isActive !== undefined ? Boolean(res.data.isActive) : true,
              createdAt: res.data.createdAt || new Date().toISOString(),
              updatedAt: res.data.updatedAt || new Date().toISOString()
            };

            const existingIdx = this.articles.findIndex(a => a.id === item.id);
            if (existingIdx !== -1) {
              this.articles[existingIdx] = item;
            } else {
              this.articles.unshift(item);
            }
            this.saveToStorage();
            this.updateStats();
            this.updateCategories();
            this.applyFilters();
          } else {
            this.loadArticles();
          }
        } else {
          this.formError = res?.message || 'Failed to save health content.';
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        this.formError = err?.error?.message || err?.message || 'Failed to save health awareness content. Please check input and try again.';
      }
    });
  }

  public toggleStatus(article: HealthAwarenessItem): void {
    const nextStatus = !article.isActive;
    this.webApiService.ToggleHealthAwarenessStatus(article.id, nextStatus).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          article.isActive = res.data?.isActive !== undefined ? Boolean(res.data.isActive) : nextStatus;
          this.saveToStorage();
          this.updateStats();
          this.applyFilters();
          this.showToast(res?.message || 'Article status updated successfully', 'success');
        } else {
          this.showToast(res?.message || 'Failed to update article status', 'error');
        }
      },
      error: (err: any) => {
        this.showToast(err?.error?.message || 'Failed to update article status', 'error');
      }
    });
  }

  public getCategoryBg(cat: string): string {
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
    return map[cat] || '#F1F5F9';
  }

  public getCategoryColor(cat: string): string {
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

  private getEmptyForm(): HealthAwarenessForm {
    return {
      title: '',
      category: 'Urology',
      description: ''
    };
  }
}
