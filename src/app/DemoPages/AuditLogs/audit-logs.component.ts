import { Component, OnInit } from '@angular/core';

interface AuditLog {
  id: string;
  adminName: string;
  adminId: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  status: 'Success' | 'Failed';
}

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  standalone: false
})
export class AuditLogsComponent implements OnInit {
  
  logsList: AuditLog[] = [
    { id: 'AL001', adminName: 'Admin User', adminId: 'A001', action: 'Updated user profile', module: 'User Management', timestamp: '2026-03-30 14:32:15', ipAddress: '192.168.1.1', status: 'Success' },
    { id: 'AL002', adminName: 'Super Admin', adminId: 'A002', action: 'Deleted wellness content', module: 'Content Management', timestamp: '2026-03-30 13:15:42', ipAddress: '192.168.1.2', status: 'Success' },
    { id: 'AL003', adminName: 'Admin User', adminId: 'A001', action: 'Approved doctor registration', module: 'Doctor Management', timestamp: '2026-03-30 12:05:23', ipAddress: '192.168.1.1', status: 'Success' },
    { id: 'AL004', adminName: 'Support Admin', adminId: 'A003', action: 'Failed login attempt', module: 'Authentication', timestamp: '2026-03-30 11:48:10', ipAddress: '192.168.1.3', status: 'Failed' }
  ];

  filteredLogs: AuditLog[] = [];
  searchQuery: string = '';
  selectedModule: string = 'All Modules';
  selectedStatus: string = 'All Status';

  modulesList: string[] = ['All Modules', 'User Management', 'Content Management', 'Doctor Management', 'Authentication'];
  statusesList: string[] = ['All Status', 'Success', 'Failed'];

  ngOnInit() {
    this.filterLogs();
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.filterLogs();
  }

  onModuleChange(event: any) {
    this.selectedModule = event.target.value;
    this.filterLogs();
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    this.filterLogs();
  }

  filterLogs() {
    this.filteredLogs = this.logsList.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            log.adminName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            log.id.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesModule = this.selectedModule === 'All Modules' || log.module === this.selectedModule;
      const matchesStatus = this.selectedStatus === 'All Status' || log.status === this.selectedStatus;
      
      return matchesSearch && matchesModule && matchesStatus;
    });
  }
}
