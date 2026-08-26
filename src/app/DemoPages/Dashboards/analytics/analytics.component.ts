import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { UserinfoService } from '../../../services/userinfo.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  standalone: false
})
export class AnalyticsComponent implements OnInit {

  constructor(public userInfo: UserinfoService) { }

  ngOnInit(): void { }

  // 1. User Registrations Line Chart
  public userRegData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Users',
        data: [6500, 8500, 10000, 9200, 11500, 12459],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  public userRegOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
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
          color: '#f3f4f6'
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'Outfit, sans-serif',
            size: 11
          }
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
        data: [60, 68, 55, 82, 79, 65, 48],
        backgroundColor: '#8b5cf6',
        hoverBackgroundColor: '#7c3aed',
        borderRadius: 8,
        barThickness: 20
      }
    ]
  };

  public weeklyApptsOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
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
          color: '#f3f4f6'
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'Outfit, sans-serif',
            size: 11
          }
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
