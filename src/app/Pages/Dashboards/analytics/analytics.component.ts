import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { WebapiService } from '../../../services/webapi.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  standalone: false
})
export class AnalyticsComponent implements OnInit {
  totalUsers = 12459;
  activeDoctorsCount: number = 0;

  constructor(
    private webApiService: WebapiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    // 1. Initial cached/local value to avoid delay or mismatch with Doctor Management
    try {
      const savedCount = localStorage.getItem('activeLife_activeDoctorsCount_v1');
      if (savedCount !== null && savedCount !== undefined) {
        this.activeDoctorsCount = Number(savedCount) || 0;
      } else {
        const cached = localStorage.getItem('activeLife_doctorManagement_live_v2');
        if (cached) {
          const list = JSON.parse(cached);
          if (Array.isArray(list)) {
            this.activeDoctorsCount = list.filter((d: any) => d.status === 'Active' && d.approval === 'Approved').length;
          }
        }
      }
    } catch (e) {}

    // 2. Load dashboard statistics
    this.webApiService.GetDashboardStatistics().subscribe({
      next: (response: any) => {
        if (response && response.success) {
          if (response.data.totalUsers) {
            this.totalUsers = response.data.totalUsers;
          }
          if (response.data.activeDoctors !== undefined && response.data.activeDoctors !== null) {
            this.activeDoctorsCount = Number(response.data.activeDoctors);
          } else if (response.data.activeDoctorsCount !== undefined && response.data.activeDoctorsCount !== null) {
            this.activeDoctorsCount = Number(response.data.activeDoctorsCount);
          }
          
          if (response.data.userRegistrations) {
            const labels = response.data.userRegistrations.map((item: any) => item.month);
            const counts = response.data.userRegistrations.map((item: any) => item.count);
            
            this.userRegData = {
              labels: labels,
              datasets: [
                {
                  label: 'Users',
                  data: counts,
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  borderWidth: 2.5,
                  fill: 'origin',
                  tension: 0,
                  pointBackgroundColor: '#ffffff',
                  pointBorderColor: '#3b82f6',
                  pointBorderWidth: 2.5,
                  pointRadius: 5,
                  pointHoverRadius: 7
                }
              ]
            };
          }
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.error('Error fetching dashboard statistics:', error);
      }
    });

    // 3. Load live doctors to guarantee exact active doctor count synchronization with Doctor Management
    this.loadActiveDoctorsCount();
  }

  loadActiveDoctorsCount(): void {
    this.webApiService.GetDoctors({}).subscribe({
      next: (res: any) => {
        let rawList: any[] = [];
        if (res?.data?.data && Array.isArray(res.data.data)) rawList = res.data.data;
        else if (Array.isArray(res?.data)) rawList = res.data;
        else if (Array.isArray(res)) rawList = res;
        else if (Array.isArray(res?.data?.doctors)) rawList = res.data.doctors;
        else if (Array.isArray(res?.doctors)) rawList = res.doctors;

        if (rawList && rawList.length > 0) {
          this.activeDoctorsCount = rawList.filter((doc: any) => {
            const regStatus = (doc.registrationStatus || doc.approvalStatus || doc.approval || '').toString().toUpperCase();
            const isApproved = regStatus === 'APPROVED' || (!regStatus && doc.isVerified !== false);
            const rawStatus = (doc.status || '').toString().trim().toUpperCase();
            const isActive = rawStatus === 'ACTIVE' || rawStatus === 'TRUE' || doc.isActive === true || doc.status === 'Active';
            return isApproved && isActive && regStatus !== 'PENDING' && regStatus !== 'REJECTED';
          }).length;
          try {
            localStorage.setItem('activeLife_activeDoctorsCount_v1', String(this.activeDoctorsCount));
          } catch (e) {}
          this.cdr.detectChanges();
        } else {
          this.loadActiveDoctorsFromApprovals();
        }
      },
      error: () => {
        this.loadActiveDoctorsFromApprovals();
      }
    });
  }

  loadActiveDoctorsFromApprovals(): void {
    this.webApiService.GetDoctorApprovals({}).subscribe({
      next: (res: any) => {
        let rawList: any[] = [];
        if (res?.data?.data && Array.isArray(res.data.data)) rawList = res.data.data;
        else if (Array.isArray(res?.data)) rawList = res.data;
        else if (Array.isArray(res)) rawList = res;

        if (rawList) {
          const approvedCount = rawList.filter((doc: any) => {
            const regStatus = (doc.registrationStatus || doc.approvalStatus || doc.approval || '').toString().toUpperCase();
            return regStatus === 'APPROVED' && (doc.isActive === true || String(doc.status).toUpperCase() === 'ACTIVE');
          }).length;
          this.activeDoctorsCount = approvedCount;
          try {
            localStorage.setItem('activeLife_activeDoctorsCount_v1', String(this.activeDoctorsCount));
          } catch (e) {}

          const pendingCount = rawList.filter((doc: any) => {
            const regStatus = (doc.registrationStatus || doc.approvalStatus || doc.approval || '').toString().toUpperCase();
            return regStatus === 'PENDING' || regStatus === '';
          }).length;
          if (this.systemAlerts && this.systemAlerts[1]) {
            this.systemAlerts[1].text = `${pendingCount} doctor registration${pendingCount === 1 ? '' : 's'} pending approval`;
          }
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  // 1. User Registrations Line Chart (Default Placeholder matching mockup curve)
  public userRegData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Users',
        data: [10, 14, 17, 15, 19, 21],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        borderWidth: 2.5,
        fill: 'origin',
        tension: 0,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  public userRegOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'Outfit, sans-serif',
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#f1f5f9',
          drawTicks: false
        },
        border: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    }
  };

  // 2. Weekly Appointments Bar Chart
  public weeklyApptsData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Appointments',
        data: [70, 82, 58, 105.2, 86, 68, 46],
        backgroundColor: 'hsla(258, 90%, 66%, 1)',
        hoverBackgroundColor: 'hsla(258, 90%, 58%, 1)',
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 32.68,
        maxBarThickness: 33
      }
    ]
  };

  public weeklyApptsOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748B',
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      y: {
        min: 0,
        max: 115,
        ticks: {
          stepSize: 25,
          display: false
        },
        grid: {
          color: '#E8EDF5',
          drawTicks: false
        },
        border: {
          display: false
        }
      }
    }
  };

  // 3. Module Usage Doughnut Chart
  public moduleUsageData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Wellness Content', 'Doctor Booking', 'Preventive Care', 'Family Management'],
    datasets: [
      {
        data: [36, 27, 20, 17],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
        borderWidth: 0,
        weight: 1
      }
    ]
  };

  public moduleUsageOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  recentActivities = [
    { name: 'Sarah Johnson', action: 'Registered new account', time: '2 min ago', initial: 'S', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { name: 'Dr. Michael Chen', action: 'Updated profile', time: '15 min ago', initial: 'D', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { name: 'Emma Wilson', action: 'Booked appointment', time: '28 min ago', initial: 'E', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { name: 'Admin', action: 'Updated wellness content', time: '1 hr ago', initial: 'A', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { name: 'John Davis', action: 'Completed vaccination milestone', time: '2 hrs ago', initial: 'J', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' }
  ];

  systemAlerts = [
    { type: 'info', text: 'Scheduled maintenance on March 31, 2026', icon: 'fa-circle-info', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', border: '#3b82f6' },
    { type: 'warning', text: '2 doctor registrations pending approval', icon: 'fa-triangle-exclamation', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: '#f59e0b' }
  ];
}
