import { Component, OnInit } from '@angular/core';
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
  standalone: false
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

  constructor(private webApiService: WebapiService) {}

  ngOnInit() {
    this.loadAllContent();
  }

  loadAllContent() {
    this.isLoading = true;
    this.webApiService.GetAllContent({}).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.success && res.data) {
          const apiContent = res.data.content || [];
          const apiStats = res.data.statistics || {};

          this.stats.totalContent = apiStats.totalContent !== undefined ? apiStats.totalContent : apiContent.length;
          this.stats.gymVideos = apiStats.gymVideos !== undefined ? apiStats.gymVideos : 0;
          this.stats.meditation = apiStats.meditation !== undefined ? apiStats.meditation : 0;
          this.stats.totalViews = apiStats.totalViews !== undefined ? `${apiStats.totalViews}` : '0';

          if (apiContent.length > 0) {
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
          }
          this.filterContent();
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching all content:', err);
        this.filterContent();
      }
    });
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

  setTab(tab: 'All' | 'Gym' | 'Meditation' | 'Videos') {
    this.activeTab = tab;
    this.filterContent();
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.filterContent();
  }

  filterContent() {
    this.filteredContent = this.contentList.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            item.id.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesTab = this.activeTab === 'All' || item.category === this.activeTab || (this.activeTab === 'Videos' && item.category === 'Videos');
      
      return matchesSearch && matchesTab;
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
