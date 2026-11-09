import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import { WebapiService } from '../../services/webapi.service';

export interface MetricCard {
  title: string;
  value: string;
  trend: string;
  trendPositive: boolean;
  colorTheme: 'green' | 'blue' | 'purple' | 'amber';
}

export interface FeatureUsageSlice {
  label: string;
  percentage: number;
  color: string;
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

    /* Pie Slice Pills */
    .ra-pie-pills {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
    }

    .ra-pie-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      color: #334155;
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
  selectedRange: string = 'Last 30 days';
  ranges: string[] = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This Year'];

  // Four Stat Cards matching exact Figma mockup
  metrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: '$75,000',
      trend: '+10.2%',
      trendPositive: true,
      colorTheme: 'green'
    },
    {
      title: 'Active Users',
      value: '10,200',
      trend: '+12.1%',
      trendPositive: true,
      colorTheme: 'blue'
    },
    {
      title: 'Avg. Session Time',
      value: '8m 42s',
      trend: '+5.3%',
      trendPositive: true,
      colorTheme: 'purple'
    },
    {
      title: 'Monthly Appointments',
      value: '1,847',
      trend: '+8.7%',
      trendPositive: true,
      colorTheme: 'amber'
    }
  ];

  // 1. User Engagement Trends (Area Line Chart)
  public engagementData: ChartConfiguration<'line'>['data'] = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Total Users',
        data: [7200, 8400, 9300, 10500, 11800, 13900],
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
        data: [5100, 5900, 6700, 7500, 8800, 10200],
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
        max: 14000,
        ticks: {
          stepSize: 3500,
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

  // 2. Feature Usage Distribution (Pie Chart)
  public featureSlices: FeatureUsageSlice[] = [
    { label: 'Wellness Content', percentage: 32, color: '#3B82F6' },
    { label: 'Doctor Booking', percentage: 24, color: '#8B5CF6' },
    { label: 'Preventive Care', percentage: 18, color: '#10B981' },
    { label: 'Family Management', percentage: 15, color: '#F59E0B' },
    { label: 'Health Records', percentage: 12, color: '#EF4444' }
  ];

  public featureUsageData: ChartConfiguration<'pie'>['data'] = {
    labels: [
      'Wellness Content',
      'Doctor Booking',
      'Preventive Care',
      'Family Management',
      'Health Records'
    ],
    datasets: [
      {
        data: [32, 24, 18, 15, 12],
        backgroundColor: [
          '#3B82F6',
          '#8B5CF6',
          '#10B981',
          '#F59E0B',
          '#EF4444'
        ],
        hoverBackgroundColor: [
          '#2563EB',
          '#7C3AED',
          '#059669',
          '#D97706',
          '#DC2626'
        ],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }
    ]
  };

  public featureUsageOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0F172A',
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
        }
      }
    }
  };

  // 3. Weekly Appointment Breakdown (Grouped Bar Chart)
  public appointmentBreakdownData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Consultations',
        data: [44, 51, 38, 61, 55, 42, 28],
        backgroundColor: '#2563EB',
        hoverBackgroundColor: '#1D4ED8',
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.7
      },
      {
        label: 'Follow-ups',
        data: [23, 28, 19, 32, 29, 21, 14],
        backgroundColor: '#10B981',
        hoverBackgroundColor: '#059669',
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.7
      },
      {
        label: 'Emergency',
        data: [5, 7, 4, 8, 6, 5, 3],
        backgroundColor: '#EF4444',
        hoverBackgroundColor: '#DC2626',
        borderRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.7
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
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 58000, 63000, 68000, 75000],
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
          label: (ctx) => ` Revenue: $${Number(ctx.raw).toLocaleString()}`
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
        max: 80000,
        ticks: {
          stepSize: 20000,
          color: '#94A3B8',
          font: { family: 'Inter', size: 11 },
          callback: (value) => value
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

  // 5. User Retention Analysis (Area Line Chart)
  public retentionData: ChartConfiguration<'line'>['data'] = {
    labels: ['Day 1', 'Day 7', 'Day 14', 'Day 30', 'Day 60', 'Day 90'],
    datasets: [
      {
        label: 'Retention Rate',
        data: [100, 68, 54, 42, 36, 31],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#8B5CF6',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }
    ]
  };

  public retentionOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        callbacks: {
          label: (ctx) => ` Retention: ${ctx.raw}%`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 12 } }
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          color: '#94A3B8',
          font: { family: 'Inter', size: 11 },
          callback: (val) => `${val}%`
        },
        grid: { color: '#F1F5F9' },
        border: { display: false }
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
    this.webApiService.GetDashboardStatistics().subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          if (res.data.totalUsers) {
            this.metrics[1].value = res.data.totalUsers.toLocaleString();
          }
          if (res.data.appointmentsCount) {
            this.metrics[3].value = res.data.appointmentsCount.toLocaleString();
          }
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.warn('Dashboard statistics fallback active for analytics', err);
      }
    });
  }

  onRangeChange(range: string): void {
    this.selectedRange = range;
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
