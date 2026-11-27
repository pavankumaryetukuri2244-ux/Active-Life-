import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { DoctorService } from '../../services/doctor.service';
import {
  ConsultationRecord,
  DoctorDashboardResponse,
  DoctorProfileData
} from '../../core/models/doctor-api.models';

export interface DoctorOnboardingStep {
  label: string;
  completed: boolean;
}

export interface DoctorPortalState {
  success?: boolean;
  message?: string;
  title?: string;
  registrationStatus?: string;
  isProfileVerified?: boolean;
  isProfileComplete?: boolean;
  steps?: DoctorOnboardingStep[];
}

@Component({
  selector: 'app-doctor-portal',
  templateUrl: './doctor-portal.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    .dp-web-page {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1240px;
      margin: 0 auto;
      color: #0F172A;
    }

    .dp-hero-card {
      background: linear-gradient(135deg, #0082B3 0%, #00A0D2 100%);
      border-radius: 20px;
      padding: 28px 30px;
      color: #FFFFFF;
      box-shadow: 0 10px 28px rgba(0, 136, 186, 0.22);
      margin-bottom: 24px;
    }

    .dp-hero-greeting {
      font-size: 14px;
      font-weight: 500;
      opacity: 0.92;
      margin-bottom: 4px;
    }

    .dp-hero-name {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.3px;
      margin: 0 0 4px 0;
      color: #FFFFFF;
    }

    .dp-hero-specialty {
      font-size: 14px;
      opacity: 0.92;
      margin: 0;
    }

    .dp-initials-badge {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.22);
      border: 1px solid rgba(255, 255, 255, 0.28);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      overflow: hidden;
    }

    .dp-hero-logout-btn {
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #FFFFFF;
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .dp-hero-logout-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.26);
    }

    .dp-kpi-tile {
      background: rgba(255, 255, 255, 0.17);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 14px;
      padding: 16px 18px;
    }

    .dp-kpi-num {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 4px;
      color: #FFFFFF;
    }

    .dp-kpi-label {
      font-size: 13px;
      opacity: 0.92;
      color: #FFFFFF;
      margin: 0;
    }

    .dp-surface-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 22px 24px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }

    .dp-section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0F172A;
      margin: 0;
    }

    .dp-load-pill {
      flex: 1 1 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      background: #F8FAFC;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      text-align: center;
    }

    .dp-load-pill.active-low {
      background: #DCFCE7;
      border-color: #86EFAC;
      color: #166534;
    }

    .dp-load-pill.active-medium {
      background: #FEF3C7;
      border-color: #FCD34D;
      color: #92400E;
    }

    .dp-load-pill.active-full {
      background: #FEE2E2;
      border-color: #FCA5A5;
      color: #991B1B;
    }

    .dp-load-dot {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      flex-shrink: 0;
    }

    .dp-notif-count {
      width: 24px;
      height: 24px;
      border-radius: 999px;
      background: #EF4444;
      color: #FFFFFF;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .dp-notif-row {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 13.5px;
      font-weight: 500;
      color: #92400E;
      cursor: pointer;
    }

    .dp-quick-tile {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }

    .dp-quick-tile:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07);
      border-color: #BAE6FD;
    }

    .dp-quick-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .dp-quick-title {
      font-size: 14.5px;
      font-weight: 600;
      color: #0F172A;
      margin: 0;
    }

    .dp-quick-sub {
      font-size: 12.5px;
      color: #64748B;
      margin: 2px 0 0 0;
    }

    .dp-schedule-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #F8FAFC;
      border: 1px solid #F1F5F9;
      border-radius: 14px;
      padding: 14px 16px;
      cursor: pointer;
    }

    .dp-schedule-row:hover {
      background: #F1F5F9;
      border-color: #E2E8F0;
    }

    .dp-avatar-square {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #DBEAFE;
      color: #2563EB;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .dp-status-pill {
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }

    .dp-status-upcoming { background: #DBEAFE; color: #1D4ED8; }
    .dp-status-completed { background: #DCFCE7; color: #15803D; }
    .dp-status-pending { background: #FEF3C7; color: #B45309; }
    .dp-status-rejected { background: #FEE2E2; color: #DC2626; }

    .dp-view-all-link {
      font-size: 13.5px;
      font-weight: 600;
      color: #0091CD;
      text-decoration: none;
      cursor: pointer;
    }

    .dp-verify-strip {
      background: #FFFFFF;
      border: 1px solid #DBEAFE;
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .dp-verify-step-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      background: #F1F5F9;
      color: #475569;
    }

    .dp-verify-step-chip.done {
      background: #DCFCE7;
      color: #15803D;
    }
  `]
})
export class DoctorPortalComponent implements OnInit {
  portalState: DoctorPortalState = {};
  steps: DoctorOnboardingStep[] = [];
  profile: DoctorProfileData | null = null;
  dashboard: DoctorDashboardResponse | null = null;
  todaySchedule: ConsultationRecord[] = [];

  countryCode = '91';
  mobileNumber = '';
  isLoading = true;
  dashboardError = '';
  isLoggingOut = false;

  constructor(
    private router: Router,
    public commonService: CommonService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.loadStoredSession();
    this.loadLiveDoctorDashboard();
  }

  private loadStoredSession(): void {
    this.countryCode = localStorage.getItem('doctorCountryCode') || '91';
    this.mobileNumber = localStorage.getItem('doctorMobile') || '';

    const rawState = localStorage.getItem('doctorPortalState');
    if (rawState) {
      try {
        const parsed = JSON.parse(rawState);
        this.portalState = parsed || {};
        this.steps = Array.isArray(parsed?.steps) ? parsed.steps : [];
      } catch {
        this.portalState = {};
        this.steps = [];
      }
    }
  }

  async loadLiveDoctorDashboard(): Promise<void> {
    this.isLoading = true;
    this.dashboardError = '';

    const [profileRes, dashRes, todayRes] = await Promise.all([
      this.doctorService.getProfile(),
      this.doctorService.getConsultationsDashboard(),
      this.doctorService.getTodayConsultations()
    ]);

    if (profileRes.success && profileRes.data) {
      this.profile = profileRes.data;
      const regStatus = (profileRes.data.registrationStatus || this.portalState.registrationStatus || '').toUpperCase();
      if (regStatus) {
        this.portalState = {
          ...this.portalState,
          registrationStatus: regStatus,
          isProfileVerified: regStatus === 'APPROVED' || Boolean(profileRes.data.isProfileVerified),
          isProfileComplete: regStatus !== 'NOT_REGISTERED'
        };
        localStorage.setItem('doctorPortalState', JSON.stringify(this.portalState));
      }
    }

    if (dashRes.success && dashRes.data) {
      this.dashboard = dashRes.data;
    } else if (dashRes.message) {
      this.dashboardError = dashRes.message;
    }

    if (todayRes.success && Array.isArray(todayRes.data) && todayRes.data.length > 0) {
      this.todaySchedule = todayRes.data;
    } else if (this.dashboard) {
      const merged = [
        ...(Array.isArray(this.dashboard.upcoming) ? this.dashboard.upcoming : []),
        ...(Array.isArray(this.dashboard.completed) ? this.dashboard.completed : [])
      ];
      this.todaySchedule = merged;
    } else {
      this.todaySchedule = [];
    }

    this.isLoading = false;
  }

  get displayName(): string {
    if (this.profile?.fullName) {
      return this.profile.fullName;
    }
    return this.formattedMobile ? `Doctor (${this.formattedMobile})` : 'Doctor Portal';
  }

  get displaySubtitle(): string {
    if (this.profile) {
      const spec = this.profile.specializationName || this.profile.specialization || this.profile.qualification || 'Physician';
      const hosp = this.profile.hospitalName || 'ActiveLife Clinic';
      return `${spec} · ${hosp}`;
    }
    return this.portalState.title || 'Complete your doctor profile to activate consultations';
  }

  get profilePhotoUrl(): string {
    return this.commonService.formatMediaUrl(this.profile?.profilePhotoUrl);
  }

  get doctorInitials(): string {
    const rawName = (this.profile?.fullName || '').replace(/^Dr\.?\s*/i, '').trim();
    if (!rawName) return 'DR';
    const parts = rawName.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }

  get greetingText(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  get formattedMobile(): string {
    return this.mobileNumber ? `+${this.countryCode} ${this.mobileNumber}` : '';
  }

  get activeRegistrationStatus(): string {
    return (this.profile?.registrationStatus || this.portalState.registrationStatus || 'NOT_REGISTERED').toUpperCase();
  }

  get formattedRegistrationStatus(): string {
    return this.activeRegistrationStatus
      .toLowerCase()
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  get activeLoad(): 'LOW' | 'MEDIUM' | 'FULL' {
    const load = (this.dashboard?.appointmentLoad || '').toUpperCase();
    if (load === 'FULL') return 'FULL';
    if (load === 'MEDIUM') return 'MEDIUM';
    return 'LOW';
  }

  get liveNotifications(): Array<{ label: string; route: string }> {
    const items: Array<{ label: string; route: string }> = [];
    const pending = this.dashboard?.pendingAppointments || 0;
    const todayTotal = this.dashboard?.todayAppointments || 0;
    if (pending > 0) {
      items.push({ label: `${pending} Pending Consultation${pending > 1 ? 's' : ''}`, route: '/doctor/consult' });
    }
    if (todayTotal > 0) {
      items.push({ label: `${todayTotal} Scheduled Appointment${todayTotal > 1 ? 's' : ''} Today`, route: '/doctor/appointments' });
    }
    if (this.activeRegistrationStatus === 'NOT_REGISTERED') {
      items.push({ label: 'Complete your medical profile & document upload', route: '/doctor/profile' });
    } else if (this.activeRegistrationStatus === 'PENDING' || this.activeRegistrationStatus === 'REGISTERED') {
      items.push({ label: 'Doctor verification is currently under review', route: '/doctor/profile-status' });
    } else if (this.activeRegistrationStatus === 'REJECTED') {
      items.push({ label: 'Profile review needs document resubmission', route: '/doctor/profile-status' });
    }
    return items;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  signOut(): void {
    if (this.isLoggingOut) {
      return;
    }
    this.isLoggingOut = true;
    const token = localStorage.getItem('accessToken') || '';
    if (token) {
      this.commonService.LogoutDoctor(token).subscribe({
        next: () => this.clearDoctorSession(),
        error: () => this.clearDoctorSession()
      });
    } else {
      this.clearDoctorSession();
    }
  }

  private clearDoctorSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('doctor_token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('doctorPortalState');
    localStorage.removeItem('doctorMobile');
    localStorage.removeItem('doctorCountryCode');
    localStorage.removeItem('doctorLoginExpiresIn');
    this.isLoggingOut = false;
    this.router.navigate(['/pages/login-boxed']);
  }
}
