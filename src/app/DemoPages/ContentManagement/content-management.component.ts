import { Component, OnInit } from '@angular/core';

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
}

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  standalone: false
})
export class ContentManagementComponent implements OnInit {
  
  contentList: ContentItem[] = [
    { id: 'C001', title: 'Morning Yoga Flow', duration: '20 min', category: 'Meditation', status: 'Active', tags: ['Beginner', 'Morning'], views: '1,234 views', viewsRaw: 1234, created: '2026-03-15' },
    { id: 'C002', title: 'HIIT Cardio Workout', duration: '30 min', category: 'Gym', status: 'Active', tags: ['Advanced', 'Cardio'], views: '2,156 views', viewsRaw: 2156, created: '2026-03-20' },
    { id: 'C003', title: 'Prenatal Stretching', duration: '15 min', category: 'Videos', status: 'Active', tags: ['Pregnancy', 'Stretching'], views: '892 views', viewsRaw: 892, created: '2026-03-10' },
    { id: 'C004', title: 'Mindfulness Meditation', duration: '25 min', category: 'Meditation', status: 'Active', tags: ['All Ages', 'Mindfulness'], views: '3,421 views', viewsRaw: 3421, created: '2026-03-05' },
    { id: 'C005', title: 'Strength Training Basics', duration: '40 min', category: 'Gym', status: 'Disabled', tags: ['Beginner', 'Strength'], views: '1,567 views', viewsRaw: 1567, created: '2026-02-28' }
  ];

  filteredContent: ContentItem[] = [];
  searchQuery: string = '';
  activeTab: 'All' | 'Gym' | 'Meditation' | 'Videos' = 'All';

  ngOnInit() {
    this.filterContent();
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
    return 342;
  }

  get gymVideosCount() {
    return 124;
  }

  get meditationCount() {
    return 98;
  }

  get totalViews() {
    return '45.2K';
  }
}
