import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import {
  ConsultationRecord,
  MasterDataResponse,
  PrescriptionMedicineInput
} from '../../core/models/doctor-api.models';

export interface MedicineFormRow {
  medicineName: string;
  medicationForm: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  timing: 'Before food' | 'After food';
  instructions: string;
}

@Component({
  selector: 'app-doctor-prescriptions',
  templateUrl: './doctor-prescriptions.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styles: [`
    .dx-page {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1240px;
      margin: 0 auto;
      color: #0F172A;
    }

    .dx-hero {
      background: linear-gradient(135deg, #00A36C 0%, #00895B 100%);
      border-radius: 18px;
      padding: 24px 28px;
      color: #FFFFFF;
      margin-bottom: 24px;
      box-shadow: 0 8px 24px rgba(0, 163, 108, 0.2);
    }

    .dx-hero-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #FFFFFF;
    }

    .dx-hero-sub {
      font-size: 14px;
      opacity: 0.92;
      margin: 0;
    }

    .dx-back-btn {
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: #FFFFFF;
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .dx-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      padding: 22px 24px;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
      margin-bottom: 18px;
    }

    .dx-avatar {
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

    .dx-field-label {
      font-size: 12.5px;
      font-weight: 600;
      color: #64748B;
      margin-bottom: 6px;
      display: block;
    }

    .dx-input {
      width: 100%;
      border: 1px solid #E2E8F0;
      background: #F4F6F9;
      border-radius: 12px;
      padding: 11px 14px;
      font-size: 14px;
      color: #0F172A;
      outline: none;
    }

    .dx-input:focus {
      border-color: #00A36C;
      background: #FFFFFF;
    }

    .dx-timing-btn {
      flex: 1 1 0;
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      background: #F4F6F9;
      color: #475569;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
    }

    .dx-timing-btn.active {
      background: #D1FAE5;
      border-color: #86EFAC;
      color: #047857;
    }

    .dx-add-med-btn {
      width: 100%;
      padding: 13px 16px;
      border-radius: 14px;
      border: 1.5px dashed #38BDF8;
      background: #F0F9FF;
      color: #0284C7;
      font-size: 14.5px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 18px;
    }

    .dx-save-btn {
      width: 100%;
      padding: 14px 20px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, #00A36C 0%, #008F5D 100%);
      color: #FFFFFF;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0, 163, 108, 0.25);
    }

    .dx-save-btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }
  `]
})
export class DoctorPrescriptionsComponent implements OnInit {
  masterData: MasterDataResponse | null = null;
  appointmentsQueue: ConsultationRecord[] = [];

  selectedAppointmentId: number | string = '';
  patientName = '';
  patientAge: string | number = '';
  patientCode = '';
  category = 'General Consultation';
  reportName = 'Prescription';
  description = '';

  medicines: MedicineFormRow[] = [
    {
      medicineName: '',
      medicationForm: 'Tablet',
      dosage: '500 mg',
      frequency: 'Once Daily',
      durationDays: 5,
      timing: 'After food',
      instructions: ''
    }
  ];

  attachments: Array<{ fileName: string; dataUrl: string }> = [];

  isLoading = true;
  isSubmitting = false;
  saveNotice = '';
  saveError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['appointmentId']) {
        this.selectedAppointmentId = params['appointmentId'];
      }
      if (params['patientName']) {
        this.patientName = String(params['patientName']);
      }
      if (params['patientAge']) {
        this.patientAge = params['patientAge'];
      }
      if (params['patientCode']) {
        this.patientCode = String(params['patientCode']);
      }
      if (params['diagnosisNotes']) {
        this.description = String(params['diagnosisNotes']);
      }
    });

    this.loadPrescriptionContext();
  }

  async loadPrescriptionContext(): Promise<void> {
    this.isLoading = true;
    const [masterRes, todayRes] = await Promise.all([
      this.doctorService.getAllMasterData(),
      this.doctorService.getTodayConsultations()
    ]);

    if (masterRes.success && masterRes.data) {
      this.masterData = masterRes.data;
    }

    if (todayRes.success && Array.isArray(todayRes.data)) {
      this.appointmentsQueue = todayRes.data;
      if (!this.selectedAppointmentId && this.appointmentsQueue.length > 0) {
        const first = this.appointmentsQueue[0];
        this.selectedAppointmentId = first.appointmentId || first.id || '';
        this.syncPatientFromSelectedAppointment();
      }
    }

    this.isLoading = false;
  }

  onAppointmentSelectionChange(): void {
    this.syncPatientFromSelectedAppointment();
  }

  private syncPatientFromSelectedAppointment(): void {
    const match = this.appointmentsQueue.find(
      item => String(item.appointmentId || item.id) === String(this.selectedAppointmentId)
    );
    if (match) {
      this.patientName = match.patientName || match.fullName || '';
      this.patientAge = match.age || '';
      this.patientCode = match.patientCode || (match.patientId ? `PAT-${match.patientId}` : '');
    }
  }

  get medicationFormOptions(): string[] {
    const raw = this.masterData?.medicationForms;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map(item => (typeof item === 'string' ? item : item.name));
    }
    return ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 'Cream', 'Ointment', 'Inhaler', 'Spray', 'Powder', 'Other'];
  }

  get frequencyOptions(): string[] {
    const raw = this.masterData?.frequencies;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map(item => (typeof item === 'string' ? item : item.name));
    }
    return ['Once Daily', 'Twice Daily', 'Thrice Daily', 'As Needed'];
  }

  addMedicine(): void {
    this.medicines.push({
      medicineName: '',
      medicationForm: this.medicationFormOptions[0] || 'Tablet',
      dosage: '500 mg',
      frequency: this.frequencyOptions[0] || 'Once Daily',
      durationDays: 5,
      timing: 'After food',
      instructions: ''
    });
  }

  removeMedicine(index: number): void {
    if (this.medicines.length > 1) {
      this.medicines.splice(index, 1);
    }
  }

  onAttachmentSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const files = Array.from(input?.files || []);
    if (files.length === 0) return;

    if (this.attachments.length + files.length > 4) {
      this.saveError = 'Maximum 4 prescription attachments are allowed.';
      return;
    }

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        this.saveError = `Attachment "${file.name}" exceeds the 10MB limit.`;
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const resultStr = String(reader.result || '');
        if (resultStr) {
          this.attachments.push({
            fileName: file.name,
            dataUrl: resultStr
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (input) input.value = '';
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
  }

  private generateDigitalPrescriptionDataUrl(): string {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 600, 800);

        ctx.fillStyle = '#00A36C';
        ctx.fillRect(0, 0, 600, 80);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('HealthDoctor Digital Prescription', 30, 48);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`Patient: ${this.patientName || 'Consultation Patient'}`, 30, 120);
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#64748B';
        ctx.fillText(`Appointment ID: #${this.selectedAppointmentId || 'N/A'}`, 30, 145);
        ctx.fillText(`Date: ${new Date().toLocaleDateString('en-GB')}`, 420, 145);

        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, 165);
        ctx.lineTo(570, 165);
        ctx.stroke();

        ctx.fillStyle = '#00A36C';
        ctx.font = 'bold 28px serif';
        ctx.fillText('Rx', 30, 205);

        let y = 240;
        this.medicines.forEach((med, idx) => {
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText(`${idx + 1}. ${med.medicineName || 'Medicine'} (${med.medicationForm || 'Tablet'})`, 30, y);
          ctx.font = '13px sans-serif';
          ctx.fillStyle = '#475569';
          ctx.fillText(`   Dosage: ${med.dosage || '1-0-1'} | Frequency: ${med.frequency} | Duration: ${med.durationDays} days | ${med.timing || 'After food'}`, 30, y + 20);
          if (med.instructions) {
            ctx.fillStyle = '#047857';
            ctx.fillText(`   Note: ${med.instructions}`, 30, y + 38);
            y += 58;
          } else {
            y += 42;
          }
        });

        if (this.description) {
          y += 20;
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText('Clinical Advice:', 30, y);
          ctx.font = '13px sans-serif';
          ctx.fillStyle = '#475569';
          ctx.fillText(this.description.slice(0, 80), 30, y + 20);
        }

        return canvas.toDataURL('image/png');
      }
    } catch {
      // fallback
    }
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }

  async savePrescription(): Promise<void> {
    this.saveNotice = '';
    this.saveError = '';

    const appointmentIdNum = Number(this.selectedAppointmentId);
    if (!appointmentIdNum) {
      this.saveError = 'Please select or provide a valid appointment ID before saving.';
      return;
    }

    const validMeds = this.medicines.every(
      m => m.medicineName.trim().length > 0 && m.dosage.trim().length > 0 && Number(m.durationDays) >= 1
    );
    if (!validMeds) {
      this.saveError = 'Each medicine row requires medicine name, dosage, and duration (>= 1 day).';
      return;
    }

    const mappedMedicines: PrescriptionMedicineInput[] = this.medicines.map(m => ({
      medicineName: m.medicineName.trim(),
      medicationForm: m.medicationForm || 'Tablet',
      dosage: m.dosage.trim(),
      frequency: m.frequency || 'Once Daily',
      durationDays: Math.max(1, Number(m.durationDays) || 1),
      timing: m.timing || 'After food',
      instructions: m.instructions ? m.instructions.trim() : undefined
    }));

    const instructionsList = this.medicines
      .map((m, idx) => {
        const parts = [];
        if (m.timing) parts.push(m.timing);
        if (m.instructions && m.instructions.trim()) parts.push(m.instructions.trim());
        return parts.length ? `${idx + 1}. ${m.medicineName}: ${parts.join(' - ')}` : '';
      })
      .filter(Boolean);
    const fullDescription = [this.description.trim(), ...instructionsList].filter(Boolean).join('\n');

    const finalDocuments = [...this.attachments];
    if (finalDocuments.length === 0) {
      finalDocuments.push({
        fileName: 'digital-prescription.png',
        dataUrl: this.generateDigitalPrescriptionDataUrl()
      });
    }

    this.isSubmitting = true;
    const res = await this.doctorService.addPrescription({
      appointmentId: appointmentIdNum,
      category: this.category.trim() || 'General Consultation',
      reportName: this.reportName.trim() || 'Prescription',
      description: fullDescription || 'Consultation Prescription',
      medicines: mappedMedicines,
      uploadDocuments: finalDocuments
    });
    this.isSubmitting = false;

    if (!res.success) {
      this.saveError = res.message || 'Failed to save prescription.';
      return;
    }

    this.saveNotice = res.message || 'Prescription saved and uploaded successfully.';
  }

  backToQueue(): void {
    this.router.navigate(['/doctor/consult']);
  }
}
