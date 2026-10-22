import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WebapiService } from '../../services/webapi.service';

export interface SupportGroupItem {
  id: number;
  groupName: string;
  category: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupportGroupForm {
  id?: number | string;
  groupName: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-support-groups',
  templateUrl: './support-groups.component.html',
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

    /* Add Support Group Button (Gradient matching other modules) */
    .cm-btn-upload {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      width: auto !important;
      min-width: 160px !important;
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
      max-width: 600px !important;
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
  `]
})
export class SupportGroupsComponent implements OnInit, OnDestroy {
  public groups: SupportGroupItem[] = [];
  public filteredGroups: SupportGroupItem[] = [];
  public searchQuery: string = '';
  public activeTab: string = 'All';
  public selectedCategory: string = 'All';
  public selectedStatus: string = 'All';

  // Stats
  public totalGroupsCount: number = 0;
  public activeCount: number = 0;
  public inactiveCount: number = 0;
  public categoriesCount: number = 0;

  // Master Medical Categories (Used by Health Content, Healthcare Champions, and Support Groups)
  public masterCategories: string[] = [];
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

  // Categories list - strictly only these 20 categories
  public categories: string[] = ['All', ...this.selectableCategories];

  // Loading & Action States
  public isLoading: boolean = false;
  public isSaving: boolean = false;
  public isTogglingId: number | null = null;
  public openDropdownId: number | null = null;

  // Modals
  public isCreateModalOpen: boolean = false;
  public isEditing: boolean = false;
  public formModel: SupportGroupForm = this.getEmptyForm();
  public formError: string = '';

  // Toast
  public toastMessage: string = '';
  public toastType: 'success' | 'error' = 'success';
  private toastTimer: any = null;

  private searchSubject: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private webApiService: WebapiService) {}

  ngOnInit(): void {
    this.initSearchDebounce();
    this.fetchMasterCategories();
    this.loadSupportGroups();
  }

  public fetchMasterCategories(): void {
    this.webApiService.GetMedicalCategories({}).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const fetchedCats = res.data.map((c: string) => c.trim()).filter((c: string) => c.length > 0);
          this.masterCategories = fetchedCats;
          this.selectableCategories = fetchedCats;
          this.updateCategories();
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    this.openDropdownId = null;
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

  public onSearchClick(): void {
    this.applyFilters();
  }

  public clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
    this.applyFilters();
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

  public loadSupportGroups(): void {
    this.isLoading = true;

    // Purge old mock data from cache if present
    const cached = localStorage.getItem('activeLife_supportGroups');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0].id === 'string' && String(parsed[0].id).startsWith('SG-')) {
          localStorage.removeItem('activeLife_supportGroups');
        }
      } catch (e) {
        localStorage.removeItem('activeLife_supportGroups');
      }
    }

    // Call backend API http://20.193.140.173:8085/admin/api/support-groups/list
    this.webApiService.GetSupportGroups({}).pipe(
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

        this.groups = rawList.map((item: any) => ({
          id: Number(item.id),
          groupName: item.groupName || item.group_name || item.name || '',
          category: item.category || item.categoryName || item.category_name || '',
          description: item.description || item.desc || '',
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
        const cached = localStorage.getItem('activeLife_supportGroups');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0].id === 'number') {
              this.groups = parsed;
              this.updateStats();
              this.updateCategories();
              this.applyFilters();
              return;
            }
          } catch (e) {}
        }
        this.groups = [];
        this.updateStats();
        this.applyFilters();
      }
    });
  }

  public applyFilters(): void {
    let result = [...this.groups];

    // 1. Search Query
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(g =>
        (g.groupName && g.groupName.toLowerCase().includes(q)) ||
        (g.category && g.category.toLowerCase().includes(q)) ||
        (g.description && g.description.toLowerCase().includes(q))
      );
    }

    // 2. Category Tab Filter
    const activeCategory = this.activeTab || this.selectedCategory;
    if (activeCategory && activeCategory !== 'All') {
      const target = activeCategory.toLowerCase();
      result = result.filter(g => {
        const cat = (g.category || '').toLowerCase();
        return cat === target || cat.includes(target) || target.includes(cat);
      });
    }

    // 3. Status Filter
    if (this.selectedStatus === 'Active') {
      result = result.filter(g => g.isActive);
    } else if (this.selectedStatus === 'Inactive') {
      result = result.filter(g => !g.isActive);
    }

    this.filteredGroups = result;
  }

  public updateStats(totalElements?: number): void {
    this.totalGroupsCount = totalElements !== undefined ? totalElements : this.groups.length;
    this.activeCount = this.groups.filter(g => g.isActive).length;
    this.inactiveCount = this.groups.filter(g => !g.isActive).length;
    const catSet = new Set(this.groups.map(g => g.category).filter(c => c && c.trim()));
    this.categoriesCount = catSet.size;
  }

  public updateCategories(): void {
    const base = this.masterCategories.length > 0
      ? this.masterCategories
      : this.selectableCategories;
    this.categories = ['All', ...base];
  }

  private saveToStorage(): void {
    localStorage.setItem('activeLife_supportGroups', JSON.stringify(this.groups));
  }

  // Modals & CRUD
  public openCreateModal(): void {
    this.isEditing = false;
    this.formModel = this.getEmptyForm();
    this.formError = '';
    this.isCreateModalOpen = true;
  }

  public openEditModal(group: SupportGroupItem): void {
    this.isEditing = true;
    this.formModel = {
      id: group.id,
      groupName: group.groupName,
      category: group.category,
      description: group.description
    };
    this.formError = '';
    this.isCreateModalOpen = true;
  }

  public closeModal(): void {
    this.isCreateModalOpen = false;
    this.formError = '';
    this.isSaving = false;
  }

  public saveGroup(): void {
    this.formError = '';

    if (!this.formModel.groupName || this.formModel.groupName.trim().length < 2) {
      this.formError = 'Please enter a valid group name.';
      return;
    }
    if (!this.formModel.category || !this.formModel.category.trim()) {
      this.formError = 'Please select or enter a category.';
      return;
    }
    if (!this.formModel.description || this.formModel.description.trim().length < 3) {
      this.formError = 'Please provide a group description.';
      return;
    }

    this.isSaving = true;

    const requestBody: any = {
      groupName: this.formModel.groupName.trim(),
      category: this.formModel.category.trim(),
      description: this.formModel.description.trim()
    };

    if (this.isEditing && this.formModel.id !== undefined && this.formModel.id !== null && this.formModel.id !== '') {
      requestBody.id = String(this.formModel.id);
    }

    const apiCall$ = this.isEditing
      ? this.webApiService.UpdateSupportGroup(requestBody)
      : this.webApiService.CreateSupportGroup(requestBody);

    apiCall$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res && res.success) {
          const msg = res?.message || (this.isEditing ? 'Support group updated successfully' : 'Support group created successfully');
          this.showToast(msg, 'success');
          this.closeModal();

          if (res?.data && res.data.id !== undefined) {
            const item: SupportGroupItem = {
              id: Number(res.data.id),
              groupName: res.data.groupName || requestBody.groupName,
              category: res.data.category || requestBody.category,
              description: res.data.description || requestBody.description,
              isActive: res.data.isActive !== undefined ? Boolean(res.data.isActive) : true,
              createdAt: res.data.createdAt || new Date().toISOString(),
              updatedAt: res.data.updatedAt || new Date().toISOString()
            };

            const existingIdx = this.groups.findIndex(g => Number(g.id) === Number(item.id));
            if (existingIdx !== -1) {
              this.groups[existingIdx] = item;
            } else {
              this.groups.unshift(item);
            }
            this.saveToStorage();
            this.updateStats();
            this.updateCategories();
            this.applyFilters();
          } else {
            this.loadSupportGroups();
          }
        } else {
          this.formError = res?.message || 'Failed to save support group.';
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        this.formError = err?.error?.message || err?.message || 'Failed to save support group. Please try again.';
      }
    });
  }

  public toggleStatus(group: SupportGroupItem): void {
    if (this.isTogglingId === group.id) return;
    this.isTogglingId = group.id;

    const previousStatus = group.isActive;
    const nextStatus = !previousStatus;

    // Optimistically update
    group.isActive = nextStatus;
    this.updateStats();
    this.applyFilters();

    this.webApiService.ToggleSupportGroupStatus(group.id, nextStatus).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        this.isTogglingId = null;
        if (res && res.success) {
          const finalActive = res.data?.isActive !== undefined ? Boolean(res.data.isActive) : nextStatus;
          group.isActive = finalActive;
          if (res.data?.updatedAt) group.updatedAt = res.data.updatedAt;
          this.saveToStorage();
          this.updateStats();
          this.applyFilters();
          this.showToast(res?.message || 'Support group status updated successfully', 'success');
        } else {
          group.isActive = previousStatus;
          this.updateStats();
          this.applyFilters();
          this.showToast(res?.message || 'Failed to update group status', 'error');
        }
      },
      error: (err: any) => {
        this.isTogglingId = null;
        group.isActive = previousStatus;
        this.updateStats();
        this.applyFilters();
        this.showToast(err?.error?.message || 'Failed to update group status', 'error');
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

  private getEmptyForm(): SupportGroupForm {
    return {
      groupName: '',
      category: '',
      description: ''
    };
  }
}
