import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorProfileData } from '../../core/models/doctor-api.models';

@Component({
  selector: 'app-doctor-profile-status',
  templateUrl: './doctor-profile-status.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    .dps-page {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 960px;
      margin: 0 auto;
      color: #0F172A;
    }

    .dps-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      padding: 26px 28px;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
      margin-bottom: 20px;
    }

    .dps-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
    }

    .dps-pending { background: #FEF3C7; color: #B45309; }
    .dps-approved { background: #DCFCE7; color: #15803D; }
    .dps-rejected { background: #FEE2E2; color: #DC2626; }
    .dps-unregistered { background: #EFF6FF; color: #1D4ED8; }

    .dps-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 11px 0;
      border-bottom: 1px solid #F1F5F9;
      font-size: 14px;
    }

    .dps-row:last-child { border-bottom: none; }
  `]
})
export class DoctorProfileStatusComponent implements OnInit {
  profile: DoctorProfileData | null = null;
  registrationStatus = 'NOT_REGISTERED';
  rejectionReason = '';
  isLoading = true;
  statusMessage = '';

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshStatus();
  }

  async refreshStatus(): Promise<void> {
    this.isLoading = true;
    this.statusMessage = '';

    const storedState = this.getStoredPortalState();
    const res = await this.doctorService.getProfile();

    this.isLoading = false;

    if (res.success && res.data) {
      this.profile = res.data;
      this.registrationStatus = (res.data.registrationStatus || storedState?.registrationStatus || 'PENDING').toUpperCase();
      this.rejectionReason = res.data.rejectionReason || '';

      localStorage.setItem('doctorPortalState', JSON.stringify({
        ...(storedState || {}),
        registrationStatus: this.registrationStatus,
        isProfileVerified: this.registrationStatus === 'APPROVED',
        isProfileComplete: this.registrationStatus !== 'NOT_REGISTERED'
      }));
    } else {
      this.registrationStatus = (storedState?.registrationStatus || 'NOT_REGISTERED').toUpperCase();
      this.statusMessage = res.message || storedState?.message || '';
    }
  }

  private getStoredPortalState(): any {
    try {
      const raw = localStorage.getItem('doctorPortalState');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  get statusDisplayLabel(): string {
    switch (this.registrationStatus) {
      case 'APPROVED':
        return 'Verified & Approved';
      case 'PENDING':
      case 'REGISTERED':
        return 'Under Review';
      case 'REJECTED':
        return 'Rejected — Action Required';
      default:
        return 'Profile Not Submitted';
    }
  }

  get statusPillClass(): string {
    switch (this.registrationStatus) {
      case 'APPROVED':
        return 'dps-approved';
      case 'PENDING':
      case 'REGISTERED':
        return 'dps-pending';
      case 'REJECTED':
        return 'dps-rejected';
      default:
        return 'dps-unregistered';
    }
  }

  editAndResubmit(): void {
    this.router.navigate(['/doctor/profile'], { queryParams: { mode: 'edit' } });
  }

  goToDashboard(): void {
    this.router.navigate(['/doctor/dashboard']);
  }
}
