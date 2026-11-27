import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import {
  BlockDateEntry,
  DoctorProfileData,
  MasterDataResponse,
  ScheduleSession,
  ScheduleTimeObject
} from '../../core/models/doctor-api.models';

export interface WeeklySessionForm {
  startTime: string;
  endTime: string;
  consultationMode: string;
  hospitalId?: number | null;
}

export interface WeekdayScheduleRow {
  day: string;
  label: string;
  open: boolean;
  sessions: WeeklySessionForm[];
  addingSession?: boolean;
  draftStart?: string;
  draftEnd?: string;
  draftMode?: string;
  saving?: boolean;
  errorMsg?: string;
}

const WEEK_DAYS: Array<{ day: string; label: string }> = [
  { day: 'MONDAY', label: 'Monday' },
  { day: 'TUESDAY', label: 'Tuesday' },
  { day: 'WEDNESDAY', label: 'Wednesday' },
  { day: 'THURSDAY', label: 'Thursday' },
  { day: 'FRIDAY', label: 'Friday' },
  { day: 'SATURDAY', label: 'Saturday' },
  { day: 'SUNDAY', label: 'Sunday' }
];

@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styles: [`
    .da-page {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1120px;
      margin: 0 auto;
      color: #0F172A;
    }

    .da-title {
      font-size: 24px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 16px 0;
    }

    .da-tabs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      border-bottom: 1px solid #E2E8F0;
      margin-bottom: 24px;
      gap: 6px;
    }

    .da-tab-btn {
      padding: 12px 22px;
      border: none;
      background: transparent;
      font-size: 14.5px;
      font-weight: 600;
      color: #64748B;
      cursor: pointer;
      border-bottom: 2.5px solid transparent;
      margin-bottom: -1px;
    }

    .da-tab-btn.active {
      color: #00A8E8;
      border-bottom-color: #00A8E8;
    }

    .da-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      padding: 24px 26px;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
      margin-bottom: 20px;
    }

    .da-field-label {
      font-size: 12.5px;
      font-weight: 600;
      color: #64748B;
      margin-bottom: 6px;
      display: block;
    }

    .da-input {
      width: 100%;
      border: 1px solid #E2E8F0;
      background: #F4F6F9;
      border-radius: 12px;
      padding: 11px 14px;
      font-size: 14px;
      color: #0F172A;
      outline: none;
    }

    .da-input:focus {
      border-color: #00A8E8;
      background: #FFFFFF;
    }

    .da-cyan-btn {
      width: 100%;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, #00A8E8 0%, #0092CD 100%);
      color: #FFFFFF;
      padding: 13px 20px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0, 168, 232, 0.25);
    }

    .da-cyan-btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .da-schedule-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
    }

    .da-schedule-banner {
      background: linear-gradient(135deg, #00A8E8 0%, #0095D6 100%);
      color: #FFFFFF;
      padding: 18px 24px;
      font-size: 17px;
      font-weight: 700;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .da-day-row {
      padding: 18px 24px;
      border-bottom: 1px solid #F1F5F9;
    }

    .da-day-row:last-child { border-bottom: none; }

    .da-day-pill {
      padding: 5px 14px;
      border-radius: 999px;
      border: none;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
    }

    .da-day-open { background: #DCFCE7; color: #15803D; }
    .da-day-closed { background: #FEE2E2; color: #DC2626; }

    .da-session-line {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      color: #64748B;
      margin-top: 6px;
    }

    .da-mode-switch {
      display: inline-flex;
      background: #F1F5F9;
      border-radius: 10px;
      padding: 3px;
      gap: 2px;
    }

    .da-mode-opt {
      border: none;
      background: transparent;
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
    }

    .da-mode-opt.active {
      background: #0099D6;
      color: #FFFFFF;
    }

    .da-empty-block {
      text-align: center;
      padding: 40px 20px;
      color: #94A3B8;
    }
  `]
})
export class DoctorAppointmentsComponent implements OnInit {
  activeTab: 'profile' | 'slots' | 'schedule' | 'blocks' = 'profile';
  isLoading = true;
  masterData: MasterDataResponse | null = null;
  loadedProfile: DoctorProfileData | null = null;

  // Tab 1: Profile
  doctorId = '';
  doctorName = '';
  specialization = '';
  hospitalClinic = '';
  profileSaving = false;
  profileSavedMsg = '';
  profileErrorMsg = '';

  // Tab 2: Slot Configuration
  slotDurationId: number | string = '';
  consultationFee: number | null = null;
  slotSaving = false;
  slotSuccessMsg = '';
  slotErrorMsg = '';

  // Tab 3: Weekly Schedule
  weeklySchedule: WeekdayScheduleRow[] = WEEK_DAYS.map(w => ({
    day: w.day,
    label: w.label,
    open: false,
    sessions: []
  }));
  scheduleErrorMsg = '';
  scheduleSavedMsg = '';

  // Tab 4: Block Dates
  blockMode: 'SINGLE' | 'RANGE' = 'SINGLE';
  blockStartDate = '';
  blockEndDate = '';
  blockReason = 'Leave';
  blockNote = '';
  blockSaving = false;
  blockError = '';
  blockSuccessMsg = '';
  blockedDates: BlockDateEntry[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadAllAppointmentData();
  }

  async loadAllAppointmentData(): Promise<void> {
    this.isLoading = true;

    const [masterRes, profileRes, slotRes, scheduleRes, blocksRes] = await Promise.all([
      this.doctorService.getAllMasterData(),
      this.doctorService.getProfile(),
      this.doctorService.getSlotConfiguration(),
      this.doctorService.getWeeklySchedule(),
      this.doctorService.getBlockDates()
    ]);

    if (masterRes.success && masterRes.data) {
      this.masterData = masterRes.data;
    }

    if (profileRes.success && profileRes.data) {
      this.loadedProfile = profileRes.data;
      this.doctorId = profileRes.data.id != null ? String(profileRes.data.id) : '';
      this.doctorName = profileRes.data.fullName || '';
      this.specialization = profileRes.data.specializationName || profileRes.data.specialization || '';
      this.hospitalClinic = profileRes.data.hospitalName || '';
    } else if (profileRes.message) {
      this.profileErrorMsg = profileRes.message;
    }

    if (slotRes.success && slotRes.data) {
      this.slotDurationId = slotRes.data.slotDuration?.id ?? '';
      this.consultationFee = slotRes.data.consultationFee ?? 0;
    } else if (slotRes.message) {
      this.slotErrorMsg = slotRes.message;
    }

    if (scheduleRes.success && scheduleRes.data?.days) {
      this.applyWeeklyScheduleResponse(scheduleRes.data.days);
    } else if (scheduleRes.message) {
      this.scheduleErrorMsg = scheduleRes.message;
    }

    if (blocksRes.success && Array.isArray(blocksRes.data)) {
      this.blockedDates = blocksRes.data;
    } else if (blocksRes.message) {
      this.blockError = blocksRes.message;
    }

    this.isLoading = false;
  }

  private formatScheduleTime(timeVal: ScheduleTimeObject | string): string {
    if (!timeVal) return '09:00';
    if (typeof timeVal === 'string') {
      return timeVal.slice(0, 5);
    }
    const hh = String(timeVal.hour ?? 0).padStart(2, '0');
    const mm = String(timeVal.minute ?? 0).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private applyWeeklyScheduleResponse(apiDays: Array<{ day: string; open: boolean; sessions: ScheduleSession[] }>): void {
    this.weeklySchedule = WEEK_DAYS.map(w => {
      const found = apiDays.find(d => (d.day || '').toUpperCase() === w.day);
      const sessions: WeeklySessionForm[] = Array.isArray(found?.sessions)
        ? found!.sessions.map(s => ({
            startTime: this.formatScheduleTime(s.startTime),
            endTime: this.formatScheduleTime(s.endTime),
            consultationMode: s.consultationMode || 'VIDEO',
            hospitalId: s.hospitalId ?? null
          }))
        : [];
      return {
        day: w.day,
        label: w.label,
        open: Boolean(found?.open),
        sessions
      };
    });
  }

  async saveProfile(): Promise<void> {
    this.profileSavedMsg = '';
    this.profileErrorMsg = '';
    this.profileSaving = true;

    const formData = new FormData();
    formData.append('fullName', this.doctorName.trim());
    formData.append('hospitalName', this.hospitalClinic.trim());
    if (this.loadedProfile?.email) formData.append('email', this.loadedProfile.email);
    if (this.loadedProfile?.mobileNumber) formData.append('mobileNumber', this.loadedProfile.mobileNumber);
    if (this.loadedProfile?.gender) formData.append('gender', this.loadedProfile.gender);
    if (this.loadedProfile?.qualification) formData.append('qualification', this.loadedProfile.qualification);
    if (this.loadedProfile?.specializationId != null) {
      formData.append('specializationId', String(this.loadedProfile.specializationId));
    }
    if (this.loadedProfile?.registrationNumber) {
      formData.append('registrationNumber', this.loadedProfile.registrationNumber);
    }
    if (this.loadedProfile?.registrationCouncil) {
      formData.append('registrationCouncil', this.loadedProfile.registrationCouncil);
    }
    if (this.loadedProfile?.professionalExperienceDate) {
      formData.append('professionalExperienceDate', this.loadedProfile.professionalExperienceDate);
    }
    if (this.loadedProfile?.address) formData.append('address', this.loadedProfile.address);
    if (this.loadedProfile?.pinCode) formData.append('pinCode', this.loadedProfile.pinCode);

    const res = await this.doctorService.updateProfile(formData);
    this.profileSaving = false;

    if (!res.success) {
      this.profileErrorMsg = res.message || 'Failed to update profile.';
      return;
    }
    this.profileSavedMsg = res.message || 'Doctor profile updated successfully.';
  }

  async saveSlotConfig(): Promise<void> {
    this.slotSuccessMsg = '';
    this.slotErrorMsg = '';

    const durationIdNum = Number(this.slotDurationId);
    const feeNum = Number(this.consultationFee);

    if (!durationIdNum) {
      this.slotErrorMsg = 'Please select a slot duration.';
      return;
    }
    if (isNaN(feeNum) || feeNum < 0) {
      this.slotErrorMsg = 'Consultation fee must be 0 or greater.';
      return;
    }

    this.slotSaving = true;
    const res = await this.doctorService.updateSlotConfiguration(durationIdNum, feeNum);
    this.slotSaving = false;

    if (!res.success) {
      this.slotErrorMsg = res.message || 'Failed to update slot configuration.';
      return;
    }
    this.slotSuccessMsg = res.message || 'Slot duration and consultation fee updated.';
  }

  async toggleDayOpen(row: WeekdayScheduleRow): Promise<void> {
    const previousOpen = row.open;
    row.open = !row.open;
    if (row.open && row.sessions.length === 0) {
      row.sessions.push({ startTime: '09:00', endTime: '13:00', consultationMode: 'VIDEO' });
    }
    const ok = await this.persistDaySchedule(row);
    if (!ok) {
      row.open = previousOpen;
    }
  }

  startAddingSession(row: WeekdayScheduleRow): void {
    row.errorMsg = '';
    row.addingSession = true;
    row.draftStart = '09:00';
    row.draftEnd = '13:00';
    row.draftMode = 'VIDEO';
  }

  async confirmAddSession(row: WeekdayScheduleRow): Promise<void> {
    row.errorMsg = '';
    if (!row.draftStart || !row.draftEnd) {
      row.errorMsg = 'Start time and end time are required.';
      return;
    }
    if (row.draftStart >= row.draftEnd) {
      row.errorMsg = 'Start time must be strictly earlier than end time.';
      return;
    }

    const overlaps = row.sessions.some(
      existing => row.draftStart! < existing.endTime && row.draftEnd! > existing.startTime
    );
    if (overlaps) {
      row.errorMsg = 'The session timings overlap with another session on this day.';
      return;
    }

    row.sessions.push({
      startTime: row.draftStart,
      endTime: row.draftEnd,
      consultationMode: row.draftMode || 'VIDEO'
    });
    row.open = true;
    row.addingSession = false;

    const ok = await this.persistDaySchedule(row);
    if (!ok) {
      row.sessions.pop();
    }
  }

  async removeSession(row: WeekdayScheduleRow, index: number): Promise<void> {
    const removed = row.sessions.splice(index, 1);
    const ok = await this.persistDaySchedule(row);
    if (!ok && removed.length > 0) {
      row.sessions.splice(index, 0, removed[0]);
    }
  }

  private async persistDaySchedule(row: WeekdayScheduleRow): Promise<boolean> {
    this.scheduleErrorMsg = '';
    this.scheduleSavedMsg = '';
    row.errorMsg = '';
    row.saving = true;

    const sessionsPayload = row.sessions.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime,
      consultationMode: s.consultationMode || 'VIDEO',
      ...(s.hospitalId ? { hospitalId: s.hospitalId } : {})
    }));

    const res = await this.doctorService.updateDaySchedule(row.day, row.open, sessionsPayload);
    row.saving = false;

    if (!res.success) {
      row.errorMsg = res.message || `Failed to update ${row.label} schedule.`;
      this.scheduleErrorMsg = row.errorMsg;
      return false;
    }
    this.scheduleSavedMsg = `${row.label} schedule updated.`;
    return true;
  }

  async addBlockedDate(): Promise<void> {
    this.blockError = '';
    this.blockSuccessMsg = '';

    if (!this.blockStartDate) {
      this.blockError = 'Please select a start date.';
      return;
    }
    if (this.blockMode === 'RANGE' && (!this.blockEndDate || this.blockEndDate < this.blockStartDate)) {
      this.blockError = 'End date must be on or after the start date.';
      return;
    }

    this.blockSaving = true;
    const res = await this.doctorService.addBlockDate(
      this.blockMode,
      this.blockStartDate,
      this.blockMode === 'RANGE' ? this.blockEndDate : undefined,
      (this.blockReason || 'Leave').trim(),
      (this.blockNote || '').trim()
    );
    this.blockSaving = false;

    if (!res.success) {
      this.blockError = res.message || 'Failed to block dates.';
      return;
    }

    this.blockStartDate = '';
    this.blockEndDate = '';
    this.blockNote = '';
    this.blockSuccessMsg = res.message || 'Leave / block date added.';

    const refreshed = await this.doctorService.getBlockDates();
    if (refreshed.success && Array.isArray(refreshed.data)) {
      this.blockedDates = refreshed.data;
    }
  }

  async removeBlockedDate(id: number): Promise<void> {
    this.blockError = '';
    this.blockSuccessMsg = '';

    const res = await this.doctorService.removeBlockDate(id);
    this.blockedDates = this.blockedDates.filter(item => item.id !== id);
    this.blockSuccessMsg = res.message || 'Blocked date removed.';
  }
}
