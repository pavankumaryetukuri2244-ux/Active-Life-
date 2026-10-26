import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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

    /* Point-wise Description Container inside Cards */
    .ha-card-desc-container {
      font-size: 13px;
      line-height: 1.55;
      color: #475569;
      margin-bottom: 12px;
      max-height: 140px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #CBD5E1 transparent;
      padding-right: 4px;
    }
    .ha-card-desc-container::-webkit-scrollbar {
      width: 5px;
    }
    .ha-card-desc-container::-webkit-scrollbar-track {
      background: transparent;
    }
    .ha-card-desc-container::-webkit-scrollbar-thumb {
      background: #CBD5E1;
      border-radius: 4px;
    }
    .ha-card-desc-container::-webkit-scrollbar-thumb:hover {
      background: #94A3B8;
    }
    .ha-card-desc-container {
      font-size: 13.5px;
      line-height: 1.6;
      color: #1E293B;
      max-height: 120px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .ha-points-wrapper {
      font-size: 13.5px;
      line-height: 1.6;
      color: #1E293B;
    }
    .ha-point-intro, .ha-desc-para {
      font-size: 13.5px;
      color: #1E293B;
      margin-bottom: 6px;
      font-weight: 400;
      line-height: 1.6;
    }
    .ha-points-list, .ha-desc-list, .ha-card-desc-container ul, .ha-points-wrapper ul {
      margin: 4px 0 6px 0 !important;
      padding-left: 20px !important;
      color: #1E293B !important;
      list-style-type: disc !important;
    }
    .ha-card-desc-container ol, .ha-points-wrapper ol {
      margin: 4px 0 6px 0 !important;
      padding-left: 20px !important;
      color: #1E293B !important;
      list-style-type: decimal !important;
    }
    .ha-point-item, .ha-desc-item, .ha-card-desc-container li, .ha-points-wrapper li {
      font-size: 13.5px !important;
      line-height: 1.6 !important;
      color: #1E293B !important;
      margin-bottom: 4px !important;
    }
    .ha-point-item::marker, .ha-desc-item::marker, .ha-card-desc-container li::marker, .ha-points-wrapper li::marker {
      color: #1E293B !important;
      font-size: 12px !important;
    }
    .ha-content-table {
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 12.5px !important;
      background: #FFFFFF !important;
      margin: 8px 0 !important;
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
      color: #1E293B !important;
      vertical-align: middle !important;
    }
    .ha-content-table tbody tr:nth-child(even) {
      background: #F8FAFC !important;
    }
    .ha-visual-editor {
      min-height: 150px;
      max-height: 280px;
      overflow-y: auto;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13.5px !important;
      line-height: 1.6 !important;
      color: #1E293B !important;
      background: #FFFFFF !important;
      border: 1px solid #CBD5E1 !important;
      border-radius: 8px !important;
      padding: 10px 14px !important;
      outline: none !important;
      word-break: break-word !important;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
    }
    .ha-visual-editor:focus {
      border-color: #2563EB !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
    }
    .ha-visual-editor:empty:before {
      content: attr(data-placeholder) !important;
      color: #94A3B8 !important;
      pointer-events: none !important;
      display: block !important;
    }
    .ha-card-desc-container p, .ha-points-wrapper p, .ha-visual-editor p {
      margin-bottom: 6px;
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

  public get dynamicCategories(): string[] {
    const present = this.articles
      .map(a => a.category ? a.category.trim() : '')
      .filter((c): c is string => c.length > 0 && c !== 'All');
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      present.push(this.selectedCategory);
    }
    return Array.from(new Set(present)).sort();
  }

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

  // Table & Description State
  @ViewChild('descEditor') descEditorRef!: ElementRef<HTMLDivElement>;
  public showTableMenu: boolean = false;
  public showCustomTableModal: boolean = false;
  public customTableColumns: string = 'Metric, Normal Range, Clinical Advice';
  public customTableRows: number = 2;

  constructor(
    private webApiService: WebapiService,
    private sanitizer: DomSanitizer
  ) {}

  @HostListener('document:click')
  public onDocumentClick(): void {
    this.closeDropdown();
    this.showTableMenu = false;
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
    this.showTableMenu = false;
    this.showCustomTableModal = false;
    this.isCreateModalOpen = true;
    setTimeout(() => {
      if (this.descEditorRef?.nativeElement) {
        this.descEditorRef.nativeElement.innerHTML = '';
        this.descEditorRef.nativeElement.focus();
      }
    }, 50);
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
    this.showTableMenu = false;
    this.showCustomTableModal = false;
    this.isCreateModalOpen = true;
    setTimeout(() => {
      if (this.descEditorRef?.nativeElement) {
        this.descEditorRef.nativeElement.innerHTML = article.description || '';
      }
    }, 50);
  }

  public closeModal(): void {
    this.isCreateModalOpen = false;
    this.formError = '';
    this.isSaving = false;
    this.showTableMenu = false;
    this.showCustomTableModal = false;
    if (this.descEditorRef?.nativeElement) {
      this.descEditorRef.nativeElement.innerHTML = '';
    }
  }

  public onEditorInput(): void {
    if (this.descEditorRef?.nativeElement) {
      this.formModel.description = this.descEditorRef.nativeElement.innerHTML;
    }
  }

  public saveArticle(): void {
    this.formError = '';
    if (this.descEditorRef?.nativeElement) {
      this.formModel.description = this.descEditorRef.nativeElement.innerHTML;
    }
    const title = this.formModel.title ? this.formModel.title.trim() : '';
    const category = this.formModel.category ? this.formModel.category.trim() : '';
    const descriptionHtml = this.formModel.description ? this.formModel.description.trim() : '';
    const plainText = this.descEditorRef?.nativeElement ? (this.descEditorRef.nativeElement.innerText || '').trim() : '';

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
    if (!plainText && !descriptionHtml.includes('<table') && !descriptionHtml.includes('<img')) {
      this.formError = 'Please enter an article description.';
      return;
    }

    this.isSaving = true;

    // Use strictly the required keys for the request body
    const requestBody: any = {
      title: title,
      category: category,
      description: descriptionHtml
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

  public insertList(type: 'bullet' | 'number'): void {
    if (this.descEditorRef?.nativeElement) {
      this.descEditorRef.nativeElement.focus();
      if (type === 'bullet') {
        document.execCommand('insertUnorderedList', false);
      } else {
        document.execCommand('insertOrderedList', false);
      }
      this.onEditorInput();
    }
  }

  public insertHtmlAtCursor(html: string): void {
    if (this.descEditorRef?.nativeElement) {
      this.descEditorRef.nativeElement.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (this.descEditorRef.nativeElement.contains(range.commonAncestorContainer)) {
          range.deleteContents();
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          const frag = document.createDocumentFragment();
          let node: ChildNode | null;
          let lastNode: ChildNode | null = null;
          while ((node = tempDiv.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          if (lastNode) {
            range.setStartAfter(lastNode);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          this.onEditorInput();
          return;
        }
      }
      this.descEditorRef.nativeElement.innerHTML += html;
      this.onEditorInput();
    }
  }

  public toggleTableMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showTableMenu = !this.showTableMenu;
  }

  public insertTableTemplate(type: 'metrics' | 'guidelines' | 'schedule'): void {
    let template = '';
    if (type === 'metrics') {
      template = '<div class="table-responsive my-2"><table class="table table-bordered table-sm ha-content-table mb-2"><thead><tr><th>Health Metric</th><th>Normal Range</th><th>Advisory / Action</th></tr></thead><tbody><tr><td>Blood Pressure</td><td>120/80 mmHg</td><td>Check weekly if hypertensive</td></tr><tr><td>Fasting Blood Sugar</td><td>70-100 mg/dL</td><td>Maintain low glycemic diet</td></tr><tr><td>Total Cholesterol</td><td>&lt; 200 mg/dL</td><td>Exercise and reduce saturated fat</td></tr></tbody></table></div><p><br></p>';
    } else if (type === 'guidelines') {
      template = '<div class="table-responsive my-2"><table class="table table-bordered table-sm ha-content-table mb-2"><thead><tr><th>Clinical Area</th><th>Recommended Do\'s</th><th>Key Don\'ts</th></tr></thead><tbody><tr><td>Diet &amp; Hydration</td><td>Drink 2-3L water daily</td><td>Avoid excessive sodium</td></tr><tr><td>Physical Activity</td><td>30 mins brisk walking</td><td>Avoid prolonged sedentary hours</td></tr></tbody></table></div><p><br></p>';
    } else if (type === 'schedule') {
      template = '<div class="table-responsive my-2"><table class="table table-bordered table-sm ha-content-table mb-2"><thead><tr><th>Time of Day</th><th>Recommended Action</th><th>Notes &amp; Precautions</th></tr></thead><tbody><tr><td>Morning</td><td>Morning walk &amp; light breakfast</td><td>Take prescribed vitamins</td></tr><tr><td>Afternoon</td><td>Balanced meal &amp; hydration</td><td>Take brief stretch breaks</td></tr><tr><td>Evening</td><td>Light dinner &amp; relaxation</td><td>Sleep 7-8 hours uninterrupted</td></tr></tbody></table></div><p><br></p>';
    }
    this.insertHtmlAtCursor(template);
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

    let headerThs = cols.map(c => `<th>${c}</th>`).join('');
    let rowsHtml = '';
    const rowsCount = Math.max(1, Math.min(this.customTableRows || 2, 15));
    for (let r = 1; r <= rowsCount; r++) {
      let tds = cols.map(c => `<td>Sample ${c}</td>`).join('');
      rowsHtml += `<tr>${tds}</tr>`;
    }

    const tableHtml = `<div class="table-responsive my-2"><table class="table table-bordered table-sm ha-content-table mb-2"><thead><tr>${headerThs}</tr></thead><tbody>${rowsHtml}</tbody></table></div><p><br></p>`;
    this.insertHtmlAtCursor(tableHtml);
    this.showCustomTableModal = false;
    this.showTableMenu = false;
  }

  public onEditorPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');

    // If rich HTML is available from another website (with colored spans, formatting, styles)
    if (html) {
      event.preventDefault();
      const fragmentMatch = html.match(/<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/i);
      let cleanHtml = fragmentMatch ? fragmentMatch[1] : html;

      cleanHtml = cleanHtml.replace(/<!DOCTYPE[\s\S]*?>/gi, '')
                           .replace(/<html[\s\S]*?>/gi, '')
                           .replace(/<\/html>/gi, '')
                           .replace(/<head[\s\S]*?<\/head>/gi, '')
                           .replace(/<body[\s\S]*?>/gi, '')
                           .replace(/<\/body>/gi, '')
                           .replace(/<meta[\s\S]*?>/gi, '')
                           .replace(/<style[\s\S]*?<\/style>/gi, '')
                           .replace(/<script[\s\S]*?<\/script>/gi, '')
                           .replace(/<!--[\s\S]*?-->/g, '')
                           .trim();

      this.insertHtmlAtCursor(cleanHtml);
      return;
    }

    // If the copied text is plain text containing literal HTML tags like <div><p><span>
    if (text && /<[a-z][\s\S]*>/i.test(text)) {
      event.preventDefault();
      this.insertHtmlAtCursor(text);
      return;
    }
  }

  public renderDescription(raw: string): SafeHtml {
    if (!raw) return '';

    // If it contains HTML tags (spans with colors, p, div, tables, lists, etc.), bypass security
    const hasHtml = /<[a-z][\s\S]*>/i.test(raw);
    if (hasHtml) {
      let processed = raw;
      if (/[•°✓✔▪▫·–—]/.test(processed)) {
        processed = processed.replace(/<(?:p|div)[^>]*>\s*[•°✓✔▪▫·–—]\s*(.*?)<\/(?:p|div)>/gi, '<li class="ha-desc-item mb-1">$1</li>');
        processed = processed.replace(/(<li class="ha-desc-item mb-1">[\s\S]*?<\/li>\s*)+/gi, (match) => {
          return `<ul class="ha-desc-list mb-1">${match}</ul>`;
        });
      }
      return this.sanitizer.bypassSecurityTrustHtml(processed);
    }

    const lines = raw.split(/\r?\n/);
    let inTable = false;
    let tableHtml = '';
    let resultHtml = '';
    let inList = false;
    let listType: 'ul' | 'ol' = 'ul';

    const formatInline = (text: string): string => {
      if (!text) return '';
      let s = text;
      if (!/<[a-z][\s\S]*>/i.test(s)) {
        s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return s;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if line looks like markdown table row (has pipes)
      if (line.includes('|') && line.split('|').length >= 3) {
        if (inList) {
          resultHtml += `</${listType}>`;
          inList = false;
        }

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
            tableHtml += `<th>${formatInline(c)}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>';
          cells.forEach(c => {
            tableHtml += `<td>${formatInline(c)}</td>`;
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

        if (!line) {
          if (inList) {
            resultHtml += `</${listType}>`;
            inList = false;
          }
          continue;
        }

        const isUnordered = /^(?:[•°✓✔▪▫·–—]\s*|[\-\*]\s+)/.test(line);
        const isOrdered = /^\d+[\.\)]\s*/.test(line);

        if (isUnordered) {
          if (!inList || listType !== 'ul') {
            if (inList) resultHtml += `</${listType}>`;
            inList = true;
            listType = 'ul';
            resultHtml += '<ul class="ha-desc-list mb-1">';
          }
          const cleanText = line.replace(/^(?:[•°✓✔▪▫·–—]\s*|[\-\*]\s+)/, '');
          resultHtml += `<li class="ha-desc-item mb-1">${formatInline(cleanText)}</li>`;
        } else if (isOrdered) {
          if (!inList || listType !== 'ol') {
            if (inList) resultHtml += `</${listType}>`;
            inList = true;
            listType = 'ol';
            resultHtml += '<ol class="ha-desc-list mb-1">';
          }
          const cleanText = line.replace(/^\d+[\.\)]\s*/, '');
          resultHtml += `<li class="ha-desc-item mb-1">${formatInline(cleanText)}</li>`;
        } else {
          if (inList) {
            resultHtml += `</${listType}>`;
            inList = false;
          }
          resultHtml += `<div class="ha-desc-para mb-1">${formatInline(line)}</div>`;
        }
      }
    }

    if (inTable) {
      tableHtml += '</tbody></table></div>';
      resultHtml += tableHtml;
    }
    if (inList) {
      resultHtml += `</${listType}>`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(resultHtml);
  }

  private getEmptyForm(): HealthAwarenessForm {
    return {
      title: '',
      category: 'Urology',
      description: ''
    };
  }
}
