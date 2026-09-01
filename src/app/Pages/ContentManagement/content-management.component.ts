import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebapiService } from '../../services/webapi.service';

interface ContentItem {
  id: string;
  title: string;
  duration: string;
  category: 'Gym' | 'Meditation' | 'Videos';
  status: 'Active' | 'Disabled';
  tags: string[];
  views: string;
  viewsRaw: number;
  created: string;
  path?: string;
}

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
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

    /* Upload Content Button */
    .cm-btn-upload {
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      background: #059669 !important;
      color: #FFFFFF !important;
      border: none !important;
      border-radius: 10px !important;
      padding: 9px 18px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      box-shadow: 0 2px 6px rgba(5, 150, 105, 0.25) !important;
      transition: all 0.2s ease !important;
    }
    .cm-btn-upload:hover {
      background: #047857 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35) !important;
    }
    .cm-btn-upload:active {
      transform: translateY(0);
    }

    /* Modal Submit Button with pure white text */
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

    /* Stat Cards - Pastel Colored Boxes */
    .cm-stat-card {
      width: 100% !important;
      max-width: 388px !important;
      height: 120px !important;
      border-radius: 14px !important;
      padding: 20px !important;
      gap: 24px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      border: none !important;
      transition: none !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      box-sizing: border-box !important;
    }
    .cm-stat-card:hover {
      transform: none !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
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
      font-style: normal !important;
      font-size: 14px !important;
      line-height: 20px !important;
      letter-spacing: -0.15px !important;
      color: #64748B !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
      white-space: nowrap !important;
      box-sizing: border-box !important;
    }

    .cm-stat-value {
      height: 36px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 700 !important;
      font-style: normal !important;
      font-size: 30px !important;
      line-height: 36px !important;
      letter-spacing: 0.4px !important;
      margin: 0 !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      white-space: nowrap !important;
      box-sizing: border-box !important;
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
    }

    .cm-tab-btn:hover {
      background: #F8FAFC !important;
      color: #111827 !important;
    }

    .cm-tab-btn.active {
      background: #090D16 !important;
      color: #FFFFFF !important;
      border-color: #090D16 !important;
      font-weight: 600 !important;
    }
  `]
})
export class ContentManagementComponent implements OnInit {
  
  contentList: ContentItem[] = [
    { id: 'C001', title: 'Morning Yoga Flow', duration: '20 min', category: 'Meditation', status: 'Active', tags: ['Beginner', 'Morning'], views: '1,234 views', viewsRaw: 1234, created: '2026-03-15', path: '/content/meditation/morning-yoga.mp4' },
    { id: 'C002', title: 'HIIT Cardio Workout', duration: '30 min', category: 'Gym', status: 'Active', tags: ['Advanced', 'Cardio'], views: '2,156 views', viewsRaw: 2156, created: '2026-03-20', path: 'https://www.youtube.com/watch?v=q6z_UCBM5Ek' },
    { id: 'C003', title: 'Prenatal Stretching', duration: '15 min', category: 'Videos', status: 'Active', tags: ['Pregnancy', 'Stretching'], views: '892 views', viewsRaw: 892, created: '2026-03-10', path: 'https://youtu.be/q6z_UCBM5Ek' },
    { id: 'C004', title: 'Mindfulness Meditation', duration: '25 min', category: 'Meditation', status: 'Active', tags: ['All Ages', 'Mindfulness'], views: '3,421 views', viewsRaw: 3421, created: '2026-03-05' },
    { id: 'C005', title: 'Strength Training Basics', duration: '40 min', category: 'Gym', status: 'Disabled', tags: ['Beginner', 'Strength'], views: '1,567 views', viewsRaw: 1567, created: '2026-02-28' }
  ];

  filteredContent: ContentItem[] = [];
  searchQuery: string = '';
  activeTab: 'All' | 'Gym' | 'Meditation' | 'Videos' = 'All';
  selectedLevel: string = 'All Levels';
  selectedStatus: string = 'All Status';
  showUploadModal = false;
  isLoading = false;

  stats = {
    totalContent: 0,
    gymVideos: 0,
    meditation: 0,
    totalViews: '0'
  };

  // Form inputs for Upload Content API
  uploadTitle: string = '';
  uploadCategory: string = '';
  uploadDescription: string = '';
  uploadLevel: string = '';
  uploadTags: string = '';
  uploadPath: string = '';
  uploading: boolean = false;
  uploadErrorMessage: string = '';
  uploadSuccessMessage: string = '';

  private contentSubscription?: Subscription;

  constructor(private webApiService: WebapiService) {}

  ngOnInit() {
    this.loadAllContent();
  }

  ngOnDestroy() {
    this.contentSubscription?.unsubscribe();
  }

  onSearchClick() {
    this.applyFrontendFilters();
  }

  onSearchInput(event?: any) {
    this.applyFrontendFilters();
  }

  clearSearch() {
    this.searchQuery = '';
    this.applyFrontendFilters();
  }

  setTab(tab: 'All' | 'Gym' | 'Meditation' | 'Videos') {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.applyFrontendFilters();
  }

  /**
   * Load all content from API once on initial load.
   * Searching and category tab filtering are done purely in the frontend with 0 API calls.
   */
  loadAllContent(showLoader = true) {
    if (showLoader) {
      this.isLoading = true;
    }

    if (this.contentSubscription) {
      this.contentSubscription.unsubscribe();
    }

    // Fetch all content items from backend once with empty payload
    this.contentSubscription = this.webApiService.GetAllContent({}).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.success && res.data) {
          const apiContent = res.data.content || [];
          const apiStats = res.data.statistics || {};

          this.stats.totalContent = apiStats.totalContent !== undefined ? apiStats.totalContent : apiContent.length;
          this.stats.gymVideos = apiStats.gymVideos !== undefined ? apiStats.gymVideos : 0;
          this.stats.meditation = apiStats.meditation !== undefined ? apiStats.meditation : 0;
          this.stats.totalViews = apiStats.totalViews !== undefined ? `${apiStats.totalViews}` : '0';

          this.contentList = apiContent.map((item: any) => {
            let cat: 'Gym' | 'Meditation' | 'Videos' = 'Videos';
            const rawCat = (item.category || '').toUpperCase();
            if (rawCat === 'GYM') cat = 'Gym';
            else if (rawCat === 'MEDITATION') cat = 'Meditation';

            let tagList: string[] = [];
            if (item.tags) {
              if (typeof item.tags === 'string') {
                tagList = item.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
              } else if (Array.isArray(item.tags)) {
                tagList = item.tags;
              }
            }
            if (tagList.length === 0 && item.level) {
              tagList = [item.level];
            }

            return {
              id: `C${String(item.id).padStart(3, '0')}`,
              title: item.title || 'Untitled Content',
              duration: '20 min',
              category: cat,
              status: item.isActive !== false ? 'Active' : 'Disabled',
              tags: tagList,
              views: `${item.viewCount || 0} views`,
              viewsRaw: item.viewCount || 0,
              created: item.createdAt ? item.createdAt.split('T')[0] : '',
              path: item.path || ''
            };
          });

          // Apply frontend filters to display
          this.applyFrontendFilters();
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching all content:', err);
      }
    });
  }

  /**
   * Pure frontend filtering — 0 API calls!
   * Filters the master content list by:
   * 1. Category Tab ('All', 'Gym', 'Meditation', 'Videos')
   * 2. Search Query (Title, Category, ID, or Tags)
   */
  applyFrontendFilters() {
    let list = [...this.contentList];

    // 1. Category Tab Filter
    if (this.activeTab && this.activeTab !== 'All') {
      const tabLower = this.activeTab.toLowerCase();
      list = list.filter(item => (item.category || '').toLowerCase() === tabLower);
    }

    // 2. Search Query Filter: by Title or Category
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter(item => {
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const categoryMatch = (item.category || '').toLowerCase().includes(q);
        const idMatch = (item.id || '').toLowerCase().includes(q);
        const tagsMatch = Array.isArray(item.tags) && item.tags.some(t => (t || '').toLowerCase().includes(q));
        return titleMatch || categoryMatch || idMatch || tagsMatch;
      });
    }

    this.filteredContent = list;
  }

  getThumbnailUrl(path?: string): string | null {
    if (!path) return null;
    const match = path.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return null;
  }

  openUploadModal() {
    this.resetUploadForm();
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.resetUploadForm();
  }

  resetUploadForm() {
    this.uploadTitle = '';
    this.uploadCategory = '';
    this.uploadDescription = '';
    this.uploadLevel = '';
    this.uploadTags = '';
    this.uploadPath = '';
    this.uploadErrorMessage = '';
    this.uploadSuccessMessage = '';
  }

  submitUploadContent() {
    if (!this.uploadTitle || !this.uploadCategory || !this.uploadPath || !this.uploadLevel || !this.uploadTags) {
      this.uploadErrorMessage = 'Please fill in all required fields';
      return;
    }

    this.uploading = true;
    this.uploadErrorMessage = '';
    this.uploadSuccessMessage = '';

    const payload = {
      title: this.uploadTitle,
      category: this.uploadCategory.toUpperCase(),
      path: this.uploadPath,
      level: this.uploadLevel.toUpperCase().replace(/\s+/g, '_'),
      tags: this.uploadTags
    };

    this.webApiService.UploadContent(payload).subscribe({
      next: (res: any) => {
        this.uploading = false;
        if (res && (res.success || res.status === 200)) {
          this.uploadSuccessMessage = res.message || 'Content uploaded successfully';
          this.loadAllContent();

          setTimeout(() => {
            this.closeUploadModal();
          }, 1200);
        } else {
          this.uploadErrorMessage = res.message || 'Failed to upload content';
        }
      },
      error: (err: any) => {
        this.uploading = false;
        console.error('Error uploading content:', err);
        this.uploadErrorMessage = err.error?.message || err.message || 'Error uploading content. Please check authentication/fields and try again.';
      }
    });
  }

  get totalContentCount() {
    return this.stats.totalContent;
  }

  get gymVideosCount() {
    return this.stats.gymVideos;
  }

  get meditationCount() {
    return this.stats.meditation;
  }

  get totalViews() {
    return this.stats.totalViews;
  }
}
