import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { DoctorService } from '../../services/doctor.service';
import { ConsultationRecord } from '../../core/models/doctor-api.models';

export interface ConsultationViewItem extends ConsultationRecord {
  localState: 'Waiting' | 'Active' | 'Paused' | 'Completed';
  notesDraft: string;
}

@Component({
  selector: 'app-doctor-consult',
  templateUrl: './doctor-consult.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styles: [`
    .dc-page {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1240px;
      margin: 0 auto;
      color: #0F172A;
    }

    .dc-hero {
      background: linear-gradient(135deg, #0082B3 0%, #00A0D2 100%);
      border-radius: 18px;
      padding: 24px 28px;
      color: #FFFFFF;
      margin-bottom: 24px;
      box-shadow: 0 8px 24px rgba(0, 136, 186, 0.2);
    }

    .dc-hero-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #FFFFFF;
    }

    .dc-hero-sub {
      font-size: 14px;
      opacity: 0.9;
      margin: 0;
    }

    .dc-filter-pill {
      padding: 7px 14px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.35);
      background: rgba(255, 255, 255, 0.14);
      color: #FFFFFF;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .dc-filter-pill.active {
      background: #FFFFFF;
      color: #0082B3;
      border-color: #FFFFFF;
    }

    .dc-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      padding: 22px;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .dc-avatar {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #DBEAFE;
      color: #2563EB;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .dc-mode-badge {
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }

    .dc-mode-online { background: #DBEAFE; color: #1D4ED8; }
    .dc-mode-inperson { background: #FEF3C7; color: #B45309; }

    .dc-state-chip {
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 600;
    }

    .dc-state-waiting { background: #F1F5F9; color: #475569; }
    .dc-state-active { background: #DCFCE7; color: #15803D; }
    .dc-state-paused { background: #FEF3C7; color: #B45309; }
    .dc-state-completed { background: #E0E7FF; color: #4338CA; }

    .dc-notes-area {
      width: 100%;
      border: 1px solid #E2E8F0;
      background: #F8FAFC;
      border-radius: 14px;
      padding: 12px 14px;
      font-size: 13.5px;
      color: #0F172A;
      resize: vertical;
      min-height: 92px;
      outline: none;
    }

    .dc-notes-area:focus {
      border-color: #00A0D2;
      background: #FFFFFF;
    }

    .dc-btn-rx {
      width: 100%;
      border: none;
      border-radius: 12px;
      background: #D1FAE5;
      color: #047857;
      padding: 11px 16px;
      font-size: 14px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
    }

    .dc-action-btn {
      flex: 1 1 0;
      border: none;
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 13.5px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
    }

    .dc-btn-start { background: #16A34A; color: #FFFFFF; }
    .dc-btn-pause { background: #FEF3C7; color: #B45309; }
    .dc-btn-end { background: #FEE2E2; color: #DC2626; }
  `]
})
export class DoctorConsultComponent implements OnInit {
  modeFilter: 'All' | 'Online' | 'In-person' = 'All';
  queue: ConsultationViewItem[] = [];
  isLoading = true;
  errorMessage = '';
  statusToast = '';

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadTodayQueue();
  }

  async loadTodayQueue(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    const res = await this.doctorService.getTodayConsultations();
    if (res.success && Array.isArray(res.data)) {
      this.queue = res.data.map(item => this.mapToViewItem(item));
      this.isLoading = false;
      return;
    }

    const dashRes = await this.doctorService.getConsultationsDashboard();
    if (dashRes.success && dashRes.data) {
      const merged = [
        ...(Array.isArray(dashRes.data.upcoming) ? dashRes.data.upcoming : []),
        ...(Array.isArray(dashRes.data.completed) ? dashRes.data.completed : [])
      ];
      this.queue = merged.map(item => this.mapToViewItem(item));
      this.isLoading = false;
      return;
    }

    this.queue = [];
    this.errorMessage = res.message || dashRes.message || 'Unable to load consultation queue.';
    this.isLoading = false;
  }

  private mapToViewItem(item: ConsultationRecord): ConsultationViewItem {
    const statusUpper = (item.status || '').toUpperCase();
    const localState: ConsultationViewItem['localState'] =
      statusUpper === 'COMPLETED' ? 'Completed' : statusUpper === 'ACTIVE' ? 'Active' : 'Waiting';
    return {
      ...item,
      localState,
      notesDraft: item.diagnosisNotes || ''
    };
  }

  isOnlineMode(item: ConsultationViewItem): boolean {
    const mode = (item.consultationMode || item.mode || '').toUpperCase();
    return mode !== 'OFFLINE' && mode !== 'IN-PERSON' && mode !== 'IN_PERSON';
  }

  get filteredQueue(): ConsultationViewItem[] {
    if (this.modeFilter === 'All') {
      return this.queue;
    }
    if (this.modeFilter === 'Online') {
      return this.queue.filter(item => this.isOnlineMode(item));
    }
    return this.queue.filter(item => !this.isOnlineMode(item));
  }

  updateSessionState(item: ConsultationViewItem, nextState: 'Active' | 'Paused' | 'Completed'): void {
    item.localState = nextState;
    const actionLabel = nextState === 'Active' ? 'started' : nextState === 'Paused' ? 'paused' : 'ended';
    const displayName = item.patientName || item.fullName || 'patient';
    this.statusToast = `Consultation session with ${displayName} ${actionLabel}.`;
    setTimeout(() => {
      this.statusToast = '';
    }, 3000);
  }

  openAddPrescription(item: ConsultationViewItem): void {
    this.router.navigate(['/doctor/prescriptions'], {
      queryParams: {
        appointmentId: item.appointmentId || item.id || '',
        patientName: item.patientName || item.fullName || '',
        patientAge: item.age || '',
        patientCode: item.patientCode || (item.patientId ? `PAT-${item.patientId}` : ''),
        diagnosisNotes: item.notesDraft || ''
      }
    });
  }
}
