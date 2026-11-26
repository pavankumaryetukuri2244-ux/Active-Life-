import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WebapiService } from '../../../services/webapi.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  standalone: false
})
export class AnalyticsComponent implements OnInit {
  totalUsers: number = 0;
  activeDoctorsCount: number = 0;
  appointmentsTodayCount: number = 0;
  isLoadingActivities: boolean = true;

  private readonly monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    private webApiService: WebapiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initEmptyDynamicCharts();
    this.loadStatistics();
  }

  private getLocalDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private normalizeDateKey(raw: any): string {
    if (!raw) return '';
    const str = String(raw).trim();
    if (!str) return '';
    const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    const dmyMatch = str.match(/^(\d{2})-(\d{2})-(\d{4})/);
    if (dmyMatch) return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      return this.getLocalDateKey(parsed);
    }
    return '';
  }

  private getRecentMonthLabels(count: number = 6): string[] {
    const now = new Date();
    const labels: string[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(this.monthNames[d.getMonth()]);
    }
    return labels;
  }

  private initEmptyDynamicCharts(): void {
    const monthLabels = this.getRecentMonthLabels(6);
    this.userRegData = {
      ...this.userRegData,
      labels: monthLabels,
      datasets: [{ ...this.userRegData.datasets[0], data: monthLabels.map(() => 0) }]
    };

    const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.weeklyApptsData = {
      ...this.weeklyApptsData,
      labels: weekLabels,
      datasets: [{ ...this.weeklyApptsData.datasets[0], data: [0, 0, 0, 0, 0, 0, 0] }]
    };
  }

  loadStatistics(): void {
    // Load Dashboard Statistics strictly from live production APIs
    this.webApiService.GetDashboardStatistics().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          const d = response.data;
          if (d.totalUsers !== undefined && d.totalUsers !== null) {
            this.totalUsers = Number(d.totalUsers) || 0;
          }
          if (d.activeDoctors !== undefined && d.activeDoctors !== null) {
            this.activeDoctorsCount = Number(d.activeDoctors) || 0;
          } else if (d.activeDoctorsCount !== undefined && d.activeDoctorsCount !== null) {
            this.activeDoctorsCount = Number(d.activeDoctorsCount) || 0;
          }
          if (d.todaysAppointments !== undefined && d.todaysAppointments !== null && this.appointmentsTodayCount === 0) {
            this.appointmentsTodayCount = Number(d.todaysAppointments) || 0;
          } else if (d.todayAppointments !== undefined && d.todayAppointments !== null && this.appointmentsTodayCount === 0) {
            this.appointmentsTodayCount = Number(d.todayAppointments) || 0;
          }

          if (Array.isArray(d.userRegistrations) && d.userRegistrations.length > 0) {
            const labels = d.userRegistrations.map((item: any) => item.month);
            const counts = d.userRegistrations.map((item: any) => Number(item.count ?? 0));
            this.setUserRegChart(labels, counts);
          }
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.error('Error fetching dashboard statistics:', error);
      }
    });

    // Load live Analytics endpoint for user engagement / fallback trends
    this.webApiService.GetAnalytics({}).subscribe({
      next: (res: any) => {
        const d = res?.data;
        if (!d) return;
        if ((d.totalUsers !== undefined && d.totalUsers !== null) && this.totalUsers === 0) {
          this.totalUsers = Number(d.totalUsers) || 0;
        }
        if (Array.isArray(d.userEngagementTrends) && d.userEngagementTrends.length > 0) {
          const hasNonZero = this.userRegData.datasets[0].data.some(v => Number(v) > 0);
          if (!hasNonZero) {
            const labels = d.userEngagementTrends.map((t: any) => t.month);
            const counts = d.userEngagementTrends.map((t: any) => Number(t.totalUsers ?? t.activeUsers ?? 0));
            this.setUserRegChart(labels, counts);
          }
        }
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    this.loadActiveDoctorsCount();
    this.loadAppointmentsMetrics();
    this.loadModuleUsageFromApi();
    this.loadRecentActivities();
  }

  private setUserRegChart(labels: string[], counts: number[]): void {
    this.userRegData = {
      labels,
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


  loadActiveDoctorsCount(): void {
    this.webApiService.GetDoctors({ page: 0, size: 200 }).subscribe({
      next: (res: any) => {
        let rawList: any[] = [];
        if (res?.data?.data && Array.isArray(res.data.data)) rawList = res.data.data;
        else if (res?.data?.content && Array.isArray(res.data.content)) rawList = res.data.content;
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
    this.webApiService.GetDoctorApprovals({ page: 0, size: 200 }).subscribe({
      next: (res: any) => {
        let rawList: any[] = [];
        if (res?.data?.data && Array.isArray(res.data.data)) rawList = res.data.data;
        else if (res?.data?.content && Array.isArray(res.data.content)) rawList = res.data.content;
        else if (Array.isArray(res?.data)) rawList = res.data;
        else if (Array.isArray(res)) rawList = res;

        if (rawList) {
          this.activeDoctorsCount = rawList.filter((doc: any) => {
            const regStatus = (doc.registrationStatus || doc.approvalStatus || doc.approval || '').toString().toUpperCase();
            return regStatus === 'APPROVED' && (doc.isActive === true || String(doc.status).toUpperCase() === 'ACTIVE');
          }).length;
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  private loadAppointmentsMetrics(): void {
    this.webApiService.GetAppointments({ page: 0, size: 500 }).subscribe({
      next: (res: any) => {
        let rawList: any[] = [];
        if (Array.isArray(res?.data?.appointments)) rawList = res.data.appointments;
        else if (Array.isArray(res?.data?.content)) rawList = res.data.content;
        else if (Array.isArray(res?.data?.data)) rawList = res.data.data;
        else if (Array.isArray(res?.data)) rawList = res.data;
        else if (Array.isArray(res)) rawList = res;

        const now = new Date();
        const todayKey = this.getLocalDateKey(now);

        // Compute dynamic Appointments Today strictly matching current local date
        this.appointmentsTodayCount = rawList.filter((item: any) => {
          const itemKey = this.normalizeDateKey(
            item.appointmentDate || item.date || item.consultationDate || item.slotDate || item.createdAt
          );
          return itemKey === todayKey;
        }).length;

        // Compute dynamic Mon-Sun of the current week anchored on today
        const jsDay = now.getDay();
        const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
        const dayKeys: string[] = [];
        const dayCounts = [0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < 7; i++) {
          const d = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
          dayKeys.push(this.getLocalDateKey(d));
        }

        for (const item of rawList) {
          const itemKey = this.normalizeDateKey(
            item.appointmentDate || item.date || item.consultationDate || item.slotDate || item.createdAt
          );
          const idx = dayKeys.indexOf(itemKey);
          if (idx !== -1) {
            dayCounts[idx]++;
          }
        }

        const maxCount = Math.max(...dayCounts, 1);
        const niceMax = Math.max(Math.ceil(maxCount * 1.25), 5);
        if (this.weeklyApptsOptions?.scales?.['y']) {
          (this.weeklyApptsOptions.scales['y'] as any).max = niceMax;
        }

        this.weeklyApptsData = {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Appointments',
              data: dayCounts,
              backgroundColor: 'hsla(258, 90%, 66%, 1)',
              hoverBackgroundColor: 'hsla(258, 90%, 58%, 1)',
              borderRadius: 6,
              borderSkipped: false,
              barThickness: 32.68,
              maxBarThickness: 33
            }
          ]
        };

        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  private extractArrayCount(res: any): number {
    if (!res) return 0;
    const d = res.data ?? res;
    if (typeof d.totalElements === 'number') return d.totalElements;
    if (typeof d.totalCount === 'number') return d.totalCount;
    if (Array.isArray(d)) return d.length;
    if (Array.isArray(d.content)) return d.content.length;
    if (Array.isArray(d.data)) return d.data.length;
    if (Array.isArray(d.items)) return d.items.length;
    if (Array.isArray(d.appointments)) return d.appointments.length;
    return 0;
  }

  private loadModuleUsageFromApi(): void {
    forkJoin({
      content: this.webApiService.GetAllContent({ page: 0, size: 100 }).pipe(catchError(() => of(null))),
      awareness: this.webApiService.GetHealthAwareness({ page: 0, size: 100 }).pipe(catchError(() => of(null))),
      remedies: this.webApiService.GetHomeRemedies({ page: 0, size: 100 }).pipe(catchError(() => of(null))),
      appointments: this.webApiService.GetAppointments({ page: 0, size: 100 }).pipe(catchError(() => of(null))),
      preventive: this.webApiService.GetPreventiveCare().pipe(catchError(() => of(null))),
      groups: this.webApiService.GetSupportGroups({ page: 0, size: 100 }).pipe(catchError(() => of(null)))
    }).subscribe(({ content, awareness, remedies, appointments, preventive, groups }) => {
      const wellnessCount =
        this.extractArrayCount(content) +
        this.extractArrayCount(awareness) +
        this.extractArrayCount(remedies);
      const bookingCount = this.extractArrayCount(appointments);

      let preventiveCount = 0;
      const pData = preventive?.data ?? preventive;
      if (pData) {
        const stages = Array.isArray(pData.pregnancyStages) ? pData.pregnancyStages.length : 0;
        const pVac = Array.isArray(pData.pregnancyVaccines) ? pData.pregnancyVaccines.length : 0;
        const cVac = Array.isArray(pData.childVaccines) ? pData.childVaccines.length : 0;
        preventiveCount = stages + pVac + cVac || this.extractArrayCount(preventive);
      }

      const communityCount = this.extractArrayCount(groups);

      const rawCounts = [wellnessCount, bookingCount, preventiveCount, communityCount];
      const total = rawCounts.reduce((acc, n) => acc + n, 0);
      this.moduleUsageTotal = total;

      const percentages = total > 0
        ? rawCounts.map(c => Math.round((c / total) * 100))
        : [0, 0, 0, 0];

      const labels = ['Wellness Content', 'Doctor Booking', 'Preventive Care', 'Support Groups'];
      const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

      this.moduleUsageItems = labels.map((label, i) => ({
        label,
        count: rawCounts[i],
        percentage: percentages[i],
        color: colors[i]
      }));

      this.moduleUsageData = {
        labels,
        datasets: [
          {
            data: total > 0 ? rawCounts : [0, 0, 0, 0],
            backgroundColor: colors,
            borderWidth: 0,
            weight: 1
          }
        ]
      };

      this.cdr.detectChanges();
    });
  }

  private loadRecentActivities(): void {
    this.isLoadingActivities = true;
    this.webApiService.GetAuditLogsFiltered({ page: 0, size: 5 }).subscribe({
      next: (res: any) => {
        let logs: any[] = [];
        if (Array.isArray(res?.data?.content)) logs = res.data.content;
        else if (Array.isArray(res?.data?.logs)) logs = res.data.logs;
        else if (Array.isArray(res?.data?.data)) logs = res.data.data;
        else if (Array.isArray(res?.data)) logs = res.data;
        else if (Array.isArray(res)) logs = res;

        const palette = [
          { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
          { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
          { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
          { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
          { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' }
        ];

        this.recentActivities = logs.slice(0, 5).map((log: any, idx: number) => {
          const name = String(log.adminName || log.actorName || log.userName || log.performedBy || log.email || 'Admin').trim();
          const action = String(log.action || log.description || log.details || log.activity || log.module || 'System activity').trim();
          const rawTime = log.createdAt || log.timestamp || log.loggedAt || log.date || '';
          const theme = palette[idx % palette.length];
          return {
            name,
            action,
            time: this.formatRelativeTime(rawTime),
            initial: name ? name.charAt(0).toUpperCase() : 'A',
            color: theme.color,
            bg: theme.bg
          };
        });
        this.isLoadingActivities = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.recentActivities = [];
        this.isLoadingActivities = false;
        this.cdr.detectChanges();
      }
    });
  }

  private formatRelativeTime(raw: any): string {
    if (!raw) return 'Recently';
    const d = new Date(raw);
    if (isNaN(d.getTime())) return String(raw);
    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // 1. User Registrations Line Chart (Dynamic API data only)
  public userRegData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Users',
        data: [],
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
        enabled: true
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
        beginAtZero: true,
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

  // 2. Weekly Appointments Bar Chart (Dynamic API data only)
  public weeklyApptsData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Appointments',
        data: [0, 0, 0, 0, 0, 0, 0],
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
        enabled: true
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
        max: 10,
        ticks: {
          precision: 0,
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

  // 3. Module Usage Doughnut Chart (Dynamic API data only)
  public moduleUsageTotal: number = 0;
  public moduleUsageItems: { label: string; count: number; percentage: number; color: string }[] = [
    { label: 'Wellness Content', count: 0, percentage: 0, color: '#3b82f6' },
    { label: 'Doctor Booking', count: 0, percentage: 0, color: '#8b5cf6' },
    { label: 'Preventive Care', count: 0, percentage: 0, color: '#10b981' },
    { label: 'Support Groups', count: 0, percentage: 0, color: '#f59e0b' }
  ];

  public moduleUsageData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Wellness Content', 'Doctor Booking', 'Preventive Care', 'Support Groups'],
    datasets: [
      {
        data: [0, 0, 0, 0],
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

  recentActivities: { name: string; action: string; time: string; initial: string; color: string; bg: string }[] = [];
}
