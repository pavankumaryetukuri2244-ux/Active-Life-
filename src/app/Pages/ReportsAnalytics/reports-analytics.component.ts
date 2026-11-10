import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { WebapiService } from '../../services/webapi.service';

export interface MetricCard {
  title: string;
  value: string;
  trend: string;
  trendPositive: boolean;
  colorTheme: 'green' | 'blue' | 'purple' | 'amber';
}

@Component({
  selector: 'app-reports-analytics',
  templateUrl: './reports-analytics.component.html',
  standalone: false,
  styles: [`
    .ra-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0F172A;
    }

    /* Page Header */
    .ra-page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .ra-page-title {
      font-size: 26px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 4px 0;
      letter-spacing: -0.02em;
    }

    .ra-page-subtitle {
      font-size: 14px;
      color: #64748B;
      margin: 0;
      font-weight: 400;
    }

    /* Time filter select dropdown */
    .ra-time-select {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 9px 16px;
      font-size: 13.5px;
      font-weight: 500;
      color: #1E293B;
      outline: none;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      transition: all 0.2s ease;
    }

    .ra-time-select:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
    }

    /* 4 Stat Cards */
    .ra-stat-card {
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 16px !important;
      padding: 22px 24px !important;
      min-height: 125px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      transition: all 0.15s ease !important;
    }

    .ra-stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04) !important;
    }

    .ra-stat-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .ra-stat-label {
      font-size: 14px;
      font-weight: 500;
      color: #64748B;
    }

    .ra-icon-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .ra-icon-circle-green { background: #ECFDF5; }
    .ra-icon-circle-blue { background: #EFF6FF; }
    .ra-icon-circle-purple { background: #F5F3FF; }
    .ra-icon-circle-amber { background: #FFFBEB; }

    .ra-stat-value {
      font-size: 30px;
      font-weight: 700;
      line-height: 1.1;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }

    .ra-stat-val-green { color: #10B981; }
    .ra-stat-val-blue { color: #2563EB; }
    .ra-stat-val-purple { color: #8B5CF6; }
    .ra-stat-val-amber { color: #F59E0B; }

    .ra-trend-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12.5px;
      font-weight: 600;
      color: #10B981;
    }

    /* Chart Cards */
    .ra-chart-card {
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 18px !important;
      padding: 24px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .ra-chart-header {
      margin-bottom: 20px;
    }

    .ra-chart-title {
      font-size: 16.5px;
      font-weight: 700;
      color: #0F172A;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .ra-chart-body {
      flex: 1;
      min-height: 280px;
      position: relative;
    }

    /* Legend Pills */
    .ra-legend-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-top: 14px;
      flex-wrap: wrap;
    }

    .ra-legend-item {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 12.5px;
      color: #475569;
      font-weight: 500;
    }

    .ra-legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }

    .ra-legend-line {
      width: 20px;
      height: 3px;
      border-radius: 2px;
      display: inline-block;
      position: relative;
    }

    .ra-legend-line::after {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 2px solid currentColor;
      position: absolute;
      top: -2px;
      left: 6.5px;
    }

    .ra-legend-blue {
      background: #3B82F6;
      color: #3B82F6;
    }

    .ra-legend-emerald {
      background: #10B981;
      color: #10B981;
    }

    .ra-legend-box {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      display: inline-block;
    }
    .ra-box-blue { background: #2563EB; }
    .ra-box-green { background: #10B981; }
    .ra-box-red { background: #EF4444; }
  `]
})
export class ReportsAnalyticsComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;

  selectedRange: string = 'Last 30 days';
  ranges: string[] = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This Year'];
  public liveAnalyticsData: any = null;

  // Four Stat Cards matching exact Figma mockup & live API data
  metrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: '₹500',
      trend: '+10.2%',
      trendPositive: true,
      colorTheme: 'green'
    },
    {
      title: 'Active Users',
      value: '98',
      trend: '+12.1%',
      trendPositive: true,
      colorTheme: 'blue'
    },
    {
      title: 'Active Doctors',
      value: '7',
      trend: '+5.3%',
      trendPositive: true,
      colorTheme: 'purple'
    },
    {
      title: 'Monthly Appointments',
      value: '3',
      trend: '+8.7%',
      trendPositive: true,
      colorTheme: 'amber'
    }
  ];

  // 1. User Engagement Trends (Area Line Chart)
  public engagementData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    datasets: [
      {
        label: 'Total Users',
        data: [0, 0, 30, 87, 107, 107],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.40)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#3B82F6',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      },
      {
        label: 'Active Users',
        data: [0, 0, 23, 78, 98, 98],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.45)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#10B981',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }
    ]
  };

  public engagementOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 10,
        cornerRadius: 8
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
          color: '#94A3B8',
          font: { family: 'Inter', size: 12 }
        }
      },
      y: {
        min: 0,
        max: 140,
        ticks: {
          stepSize: 35,
          color: '#94A3B8',
          font: { family: 'Inter', size: 11 }
        },
        grid: {
          color: '#F1F5F9'
        },
        border: {
          display: false
        }
      }
    }
  };

  // 2. Weekly Appointment Breakdown (Grouped Bar Chart)
  public appointmentBreakdownData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Consultations',
        data: [44, 51, 38, 61, 55, 42, 28],
        backgroundColor: '#2563EB',
        hoverBackgroundColor: '#1D4ED8',
        borderRadius: 4,
        barPercentage: 0.75,
        categoryPercentage: 0.65
      },
      {
        label: 'Follow-ups',
        data: [23, 28, 19, 32, 29, 21, 14],
        backgroundColor: '#10B981',
        hoverBackgroundColor: '#059669',
        borderRadius: 4,
        barPercentage: 0.75,
        categoryPercentage: 0.65
      }
    ]
  };

  public appointmentBreakdownOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 10,
        cornerRadius: 8
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
          color: '#94A3B8',
          font: { family: 'Inter', size: 12 }
        }
      },
      y: {
        min: 0,
        max: 80,
        ticks: {
          stepSize: 20,
          color: '#94A3B8',
          font: { family: 'Inter', size: 11 }
        },
        grid: {
          color: '#F1F5F9'
        },
        border: {
          display: false
        }
      }
    }
  };

  // 4. Revenue Trends (Line Chart)
  public revenueTrendsData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    datasets: [
      {
        label: 'Revenue',
        data: [0, 0, 0, 0, 0, 500],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.25,
        pointRadius: 5,
        pointBackgroundColor: '#F59E0B',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointHoverRadius: 7
      }
    ]
  };

  public revenueTrendsOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` Revenue: ₹${Number(ctx.raw).toLocaleString()}`
        }
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
          color: '#94A3B8',
          font: { family: 'Inter', size: 12 }
        }
      },
      y: {
        min: 0,
        max: 600,
        ticks: {
          stepSize: 150,
          color: '#94A3B8',
          font: { family: 'Inter', size: 11 },
          callback: (value) => `₹${value}`
        },
        grid: {
          color: '#F1F5F9'
        },
        border: {
          display: false
        }
      }
    }
  };

  constructor(
    private webApiService: WebapiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchLiveStats();
  }

  fetchLiveStats(): void {
    this.webApiService.GetAnalytics({}).subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          this.applyAnalyticsData(res.data);
        } else {
          this.fallbackDashboardStats();
        }
      },
      error: (err: any) => {
        console.warn('[ReportsAnalytics] Analytics API error, falling back to dashboard stats', err);
        this.fallbackDashboardStats();
      }
    });
  }

  private fallbackDashboardStats(): void {
    this.webApiService.GetDashboardStatistics().subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          if (res.data.totalUsers) {
            this.metrics[1].value = Number(res.data.totalUsers).toLocaleString();
          }
          if (res.data.appointmentsCount) {
            this.metrics[3].value = Number(res.data.appointmentsCount).toLocaleString();
          }
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.warn('[ReportsAnalytics] Dashboard stats fallback also failed', err);
      }
    });
  }

  applyAnalyticsData(d: any): void {
    if (!d) return;
    this.liveAnalyticsData = d;

    const currency = d.currency || 'INR';
    const symbol = currency === 'INR' ? '₹' : (currency === 'USD' ? '$' : currency + ' ');

    // 1. Metric Cards
    if (d.totalRevenue !== undefined && d.totalRevenue !== null) {
      this.metrics[0].value = `${symbol}${Number(d.totalRevenue).toLocaleString()}`;
    }
    if (d.activeUsers !== undefined && d.activeUsers !== null) {
      this.metrics[1].value = Number(d.activeUsers).toLocaleString();
    }
    if (d.activeDoctors !== undefined && d.activeDoctors !== null) {
      this.metrics[2].title = 'Active Doctors';
      this.metrics[2].value = Number(d.activeDoctors).toLocaleString();
    }
    if (d.monthlyAppointments !== undefined && d.monthlyAppointments !== null) {
      this.metrics[3].value = Number(d.monthlyAppointments).toLocaleString();
    }

    // 2. User Engagement Trends (Area Line Chart)
    if (Array.isArray(d.userEngagementTrends) && d.userEngagementTrends.length > 0) {
      const labels = d.userEngagementTrends.map((t: any) => t.month);
      const totalUsers = d.userEngagementTrends.map((t: any) => Number(t.totalUsers ?? 0));
      const activeUsers = d.userEngagementTrends.map((t: any) => Number(t.activeUsers ?? 0));

      const maxVal = Math.max(...totalUsers, ...activeUsers, 10);
      const niceMax = Math.ceil((maxVal * 1.25) / 10) * 10;
      const stepSize = Math.max(Math.ceil(niceMax / 4), 1);

      this.engagementData = {
        labels: labels,
        datasets: [
          {
            label: 'Total Users',
            data: totalUsers,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.40)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#3B82F6',
            pointBorderWidth: 2,
            pointHoverRadius: 6
          },
          {
            label: 'Active Users',
            data: activeUsers,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.45)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#10B981',
            pointBorderWidth: 2,
            pointHoverRadius: 6
          }
        ]
      };

      if (this.engagementOptions && this.engagementOptions.scales && this.engagementOptions.scales['y']) {
        const yScale: any = this.engagementOptions.scales['y'];
        yScale.min = 0;
        yScale.max = niceMax;
        if (yScale.ticks) {
          yScale.ticks.stepSize = stepSize;
        }
      }
    }

    // 3. Revenue Trends (Line Chart)
    if (Array.isArray(d.revenueTrends) && d.revenueTrends.length > 0) {
      const revLabels = d.revenueTrends.map((t: any) => t.month);
      const revValues = d.revenueTrends.map((t: any) => Number(t.revenue ?? 0));

      const maxRev = Math.max(...revValues, 100);
      const niceRevMax = Math.ceil((maxRev * 1.2) / 100) * 100;
      const revStep = Math.max(Math.ceil(niceRevMax / 4), 25);

      this.revenueTrendsData = {
        labels: revLabels,
        datasets: [
          {
            label: 'Revenue',
            data: revValues,
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.25,
            pointRadius: 5,
            pointBackgroundColor: '#F59E0B',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointHoverRadius: 7
          }
        ]
      };

      if (this.revenueTrendsOptions) {
        if (this.revenueTrendsOptions.plugins?.tooltip?.callbacks) {
          this.revenueTrendsOptions.plugins.tooltip.callbacks.label = (ctx) => ` Revenue: ${symbol}${Number(ctx.raw).toLocaleString()}`;
        }
        if (this.revenueTrendsOptions.scales && this.revenueTrendsOptions.scales['y']) {
          const revYScale: any = this.revenueTrendsOptions.scales['y'];
          revYScale.min = 0;
          revYScale.max = niceRevMax;
          if (revYScale.ticks) {
            revYScale.ticks.stepSize = revStep;
            revYScale.ticks.callback = (val: any) => `${symbol}${val}`;
          }
        }
      }
    }

    this.cdr.detectChanges();
    if (this.charts) {
      this.charts.forEach(c => c.update());
    }
  }

  onRangeChange(range: string): void {
    this.selectedRange = range;
    if (this.liveAnalyticsData) {
      this.applyAnalyticsData(this.liveAnalyticsData);
      return;
    }
    if (range === 'Last 7 days') {
      this.metrics[0].value = '$18,500';
      this.metrics[1].value = '2,840';
      this.metrics[2].value = '7m 15s';
      this.metrics[3].value = '412';
    } else if (range === 'Last 90 days') {
      this.metrics[0].value = '$220,000';
      this.metrics[1].value = '28,400';
      this.metrics[2].value = '9m 10s';
      this.metrics[3].value = '5,420';
    } else if (range === 'This Year') {
      this.metrics[0].value = '$850,000';
      this.metrics[1].value = '84,500';
      this.metrics[2].value = '8m 55s';
      this.metrics[3].value = '21,300';
    } else {
      this.metrics[0].value = '$75,000';
      this.metrics[1].value = '10,200';
      this.metrics[2].value = '8m 42s';
      this.metrics[3].value = '1,847';
    }
  }
}
