import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonService } from '../../services/common.service';
import { DoctorService } from '../../services/doctor.service';
import { PatientDirectoryItem } from '../../core/models/doctor-api.models';

@Component({
  selector: 'app-doctor-patients',
  templateUrl: './doctor-patients.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styles: [`
    .dp-patients-page {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1240px;
      margin: 0 auto;
      color: #0F172A;
    }

    .dp-patients-title {
      font-size: 24px;
      font-weight: 700;
      color: #0F172A;
      margin: 0;
    }

    .dp-search-wrap {
      position: relative;
      margin-bottom: 22px;
      max-width: 520px;
    }

    .dp-search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #94A3B8;
      pointer-events: none;
    }

    .dp-search-input {
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 12px 16px 12px 44px;
      font-size: 14.5px;
      color: #0F172A;
      outline: none;
    }

    .dp-search-input:focus {
      border-color: #00A0D2;
    }

    .dp-patient-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      padding: 20px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
    }

    .dp-patient-card:hover,
    .dp-patient-card.selected {
      border-color: #00A0D2;
      box-shadow: 0 6px 18px rgba(0, 160, 210, 0.1);
    }

    .dp-patient-avatar {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      background: #DBEAFE;
      color: #2563EB;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .dp-record-pill {
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
      background: #F8FAFC;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      white-space: nowrap;
    }

    .dp-conditions-bar {
      background: #F4F6F9;
      border-radius: 10px;
      padding: 9px 12px;
      font-size: 13px;
      color: #475569;
      margin-top: 14px;
    }

    .dp-detail-panel {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
      position: sticky;
      top: 20px;
    }
  `]
})
export class DoctorPatientsComponent implements OnInit, OnDestroy {
  searchQuery = '';
  patients: PatientDirectoryItem[] = [];
  selectedPatient: PatientDirectoryItem | null = null;
  isLoading = true;
  errorMessage = '';

  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.searchSub = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => this.fetchPatients(query));

    this.fetchPatients('');
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onSearchChanged(value: string): void {
    this.searchSubject.next(value);
  }

  async fetchPatients(search: string): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    const res = await this.doctorService.getConsultationPatients(search);
    this.isLoading = false;

    if (!res.success) {
      this.patients = [];
      this.selectedPatient = null;
      this.errorMessage = res.message || 'Failed to load patients directory.';
      return;
    }

    this.patients = Array.isArray(res.data) ? res.data : [];
    if (this.patients.length > 0) {
      if (this.selectedPatient) {
        const stillExists = this.patients.find(
          p => (p.patientId || p.id) === (this.selectedPatient!.patientId || this.selectedPatient!.id)
        );
        this.selectedPatient = stillExists || this.patients[0];
      } else {
        this.selectedPatient = this.patients[0];
      }
    } else {
      this.selectedPatient = null;
    }
  }

  getPatientName(patient: PatientDirectoryItem): string {
    return patient.fullName || patient.name || 'Patient';
  }

  getConditionsText(patient: PatientDirectoryItem): string {
    const raw = patient.chronicConditions || patient.conditions;
    if (Array.isArray(raw)) {
      return raw.length > 0 ? raw.join(', ') : 'None recorded';
    }
    return raw ? String(raw) : 'None recorded';
  }

  getVisitsList(patient: PatientDirectoryItem): any[] {
    if (Array.isArray(patient.consultations)) return patient.consultations;
    if (Array.isArray(patient.visits)) return patient.visits;
    return [];
  }

  getRecordCount(patient: PatientDirectoryItem): number {
    if (typeof patient.recordCount === 'number') return patient.recordCount;
    if (typeof patient.totalVisits === 'number') return patient.totalVisits;
    return this.getVisitsList(patient).length;
  }

  selectPatient(patient: PatientDirectoryItem): void {
    this.selectedPatient = patient;
  }

  writePrescriptionFor(patient: PatientDirectoryItem): void {
    this.router.navigate(['/doctor/prescriptions'], {
      queryParams: {
        patientName: this.getPatientName(patient),
        patientAge: patient.age || '',
        patientCode: patient.patientCode || (patient.patientId ? `PAT-${patient.patientId}` : '')
      }
    });
  }
}
