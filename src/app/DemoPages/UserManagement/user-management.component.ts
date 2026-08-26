import { Component, OnInit } from '@angular/core';

interface User {
  id: string;
  name: string;
  email: string;
  contact: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  familyMembers: number;
  created: string;
  initials: string;
  initialsBg: string;
  initialsColor: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  standalone: false
})
export class UserManagementComponent implements OnInit {
  
  usersList: User[] = [
    { id: 'U001', name: 'Sarah Johnson', email: 'sarah.j@email.com', contact: '+1 234-567-8901', status: 'Active', familyMembers: 4, created: '2026-01-15', initials: 'SJ', initialsBg: 'rgba(59, 130, 246, 0.15)', initialsColor: '#3b82f6' },
    { id: 'U002', name: 'Michael Chen', email: 'm.chen@email.com', contact: '+1 234-567-8902', status: 'Active', familyMembers: 3, created: '2026-02-10', initials: 'MC', initialsBg: 'rgba(139, 92, 246, 0.15)', initialsColor: '#8b5cf6' },
    { id: 'U003', name: 'Emma Wilson', email: 'emma.w@email.com', contact: '+1 234-567-8903', status: 'Inactive', familyMembers: 2, created: '2026-01-28', initials: 'EW', initialsBg: 'rgba(20, 184, 166, 0.15)', initialsColor: '#14b8a6' },
    { id: 'U004', name: 'James Brown', email: 'james.b@email.com', contact: '+1 234-567-8904', status: 'Active', familyMembers: 5, created: '2026-03-05', initials: 'JB', initialsBg: 'rgba(59, 130, 246, 0.15)', initialsColor: '#1d4ed8' },
    { id: 'U005', name: 'Patricia Davis', email: 'p.davis@email.com', contact: '+1 234-567-8905', status: 'Blocked', familyMembers: 1, created: '2026-02-18', initials: 'PD', initialsBg: 'rgba(239, 68, 68, 0.15)', initialsColor: '#ef4444' },
    { id: 'U006', name: 'Robert Miller', email: 'r.miller@email.com', contact: '+1 234-567-8906', status: 'Active', familyMembers: 3, created: '2026-03-01', initials: 'RM', initialsBg: 'rgba(245, 158, 11, 0.15)', initialsColor: '#f59e0b' }
  ];

  filteredUsers: User[] = [];
  searchQuery: string = '';
  activeTab: 'All' | 'Active' | 'Inactive' | 'Blocked' = 'All';
  selectedUserId: string | null = null;

  ngOnInit() {
    this.filterUsers();
  }

  selectRow(userId: string) {
    this.selectedUserId = userId;
  }

  setTab(tab: 'All' | 'Active' | 'Inactive' | 'Blocked') {
    this.activeTab = tab;
    this.filterUsers();
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.filterUsers();
  }

  filterUsers() {
    this.filteredUsers = this.usersList.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            user.id.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesTab = this.activeTab === 'All' || user.status === this.activeTab;
      
      return matchesSearch && matchesTab;
    });
  }

  get totalUsersCount() {
    return this.usersList.length;
  }

  get activeUsersCount() {
    return this.usersList.filter(u => u.status === 'Active').length;
  }

  get inactiveUsersCount() {
    return this.usersList.filter(u => u.status === 'Inactive').length;
  }

  get blockedUsersCount() {
    return this.usersList.filter(u => u.status === 'Blocked').length;
  }
}
