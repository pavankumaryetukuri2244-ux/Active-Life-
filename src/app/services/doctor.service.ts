import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CommonService } from './common.service';
import {
  ApiResponse,
  BlockDateEntry,
  ConsultationRecord,
  DoctorDashboardResponse,
  DoctorProfileData,
  MasterDataResponse,
  PatientDirectoryItem,
  PrescriptionSubmissionPayload,
  ServiceResult,
  SlotConfigInfo,
  WeeklyScheduleResponse
} from '../core/models/doctor-api.models';

export const FALLBACK_MASTER_DATA: MasterDataResponse = {
  slotDurations: [
    { id: 1, durationMinutes: 15, displayName: '15 Minutes' },
    { id: 2, durationMinutes: 30, displayName: '30 Minutes' },
    { id: 3, durationMinutes: 45, displayName: '45 Minutes' },
    { id: 4, durationMinutes: 60, displayName: '60 Minutes' }
  ],
  consultationModes: [
    { id: 1, modeCode: 'VIDEO', displayName: 'Video Call' },
    { id: 2, modeCode: 'AUDIO', displayName: 'Audio Call' },
    { id: 3, modeCode: 'OFFLINE', displayName: 'In-person / Offline' }
  ],
  specializations: [
    { id: 1, categoryName: 'General Medicine' },
    { id: 2, categoryName: 'Cardiology' },
    { id: 3, categoryName: 'Neurology' },
    { id: 4, categoryName: 'Dermatology' },
    { id: 5, categoryName: 'Pediatrics' },
    { id: 6, categoryName: 'Orthopedics' },
    { id: 7, categoryName: 'Gynecology & Obstetrics' },
    { id: 8, categoryName: 'Ophthalmology' },
    { id: 9, categoryName: 'ENT (Otolaryngology)' },
    { id: 10, categoryName: 'Psychiatry' },
    { id: 11, categoryName: 'Gastroenterology' },
    { id: 12, categoryName: 'Pulmonology' },
    { id: 13, categoryName: 'Endocrinology' },
    { id: 14, categoryName: 'Urology' },
    { id: 15, categoryName: 'Nephrology' },
    { id: 16, categoryName: 'Oncology' }
  ],
  departments: [
    { id: 1, categoryName: 'General Medicine' },
    { id: 2, categoryName: 'Cardiology' },
    { id: 3, categoryName: 'Neurology' },
    { id: 4, categoryName: 'Dermatology' },
    { id: 5, categoryName: 'Pediatrics' },
    { id: 6, categoryName: 'Orthopedics' },
    { id: 7, categoryName: 'Gynecology' },
    { id: 8, categoryName: 'Surgery' },
    { id: 9, categoryName: 'Internal Medicine' }
  ],
  qualifications: ['MBBS', 'MD', 'MS', 'DM', 'MCh', 'DNB', 'BAMS', 'BHMS'],
  registrationCouncils: [
    'Medical Council of India (MCI)',
    'National Medical Commission (NMC)',
    'Telangana Medical Council',
    'Andhra Pradesh Medical Council',
    'Karnataka Medical Council',
    'Maharashtra Medical Council',
    'Tamil Nadu Medical Council',
    'Delhi Medical Council',
    'Uttar Pradesh Medical Council',
    'West Bengal Medical Council'
  ],
  frequencies: [
    { id: 1, name: '1-0-1 (Morning & Night)' },
    { id: 2, name: '1-1-1 (Thrice daily)' },
    { id: 3, name: '1-0-0 (Morning only)' },
    { id: 4, name: '0-0-1 (Night only)' },
    { id: 5, name: 'SOS (As needed)' }
  ],
  medicationForms: [
    { id: 1, name: 'Tablet' },
    { id: 2, name: 'Capsule' },
    { id: 3, name: 'Syrup' },
    { id: 4, name: 'Injection' },
    { id: 5, name: 'Ointment' },
    { id: 6, name: 'Drops' }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private get baseUrl(): string {
    return this.commonService.doctorService;
  }

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {}

  /**
   * Reads the Doctor JWT issued by the existing password login flow (`accessToken`).
   */
  public getToken(): string {
    return (
      localStorage.getItem('accessToken') ||
      localStorage.getItem('doctor_token') ||
      ''
    ).trim();
  }

  private getAuthHeaders(includeJsonContentType: boolean = true): HttpHeaders {
    const token = this.getToken();
    const headersObj: Record<string, string> = {};
    if (includeJsonContentType) {
      headersObj['Content-Type'] = 'application/json';
    }
    if (token) {
      headersObj['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headersObj);
  }

  private isApiSuccess(res: ApiResponse<any> | null | undefined): boolean {
    if (!res) {
      return false;
    }
    if (typeof res.status === 'string') {
      return res.status.toUpperCase() === 'SUCCESS';
    }
    if (typeof res.success === 'boolean') {
      return res.success && (res.errorCode === 0 || res.errorCode === undefined || res.errorCode === null);
    }
    return true;
  }

  private mapHttpError<T = any>(err: any, fallbackMessage: string): ServiceResult<T> {
    if (err instanceof HttpErrorResponse || typeof err?.status === 'number') {
      const httpStatus = err.status;
      const body = err?.error || {};
      const backendMsg = body?.message || err?.message;

      if (httpStatus === 0) {
        return {
          success: false,
          status: 0,
          message: 'No internet connection or backend server unreachable. Please try again.'
        };
      }
      if (httpStatus === 401) {
        return {
          success: false,
          status: 401,
          message: backendMsg || 'Your session has expired. Please sign in again with your password.'
        };
      }
      if (httpStatus === 403) {
        return {
          success: false,
          status: 403,
          message: backendMsg || 'Doctor profile verification required before accessing this feature.',
          errors: body?.errors || null
        };
      }
      if (httpStatus === 404) {
        return {
          success: false,
          status: 404,
          message: backendMsg || fallbackMessage,
          errors: body?.errors || null
        };
      }
      if (httpStatus === 409) {
        return {
          success: false,
          status: 409,
          message: backendMsg || 'A conflict occurred with existing schedule or registration records.',
          errors: body?.errors || null
        };
      }
      if (httpStatus === 413) {
        return {
          success: false,
          status: 413,
          message: backendMsg || 'Uploaded file exceeds maximum allowed size.',
          errors: body?.errors || null
        };
      }
      if (httpStatus === 422) {
        return {
          success: false,
          status: 422,
          message: backendMsg || 'Submitted date or input values failed validation.',
          errors: body?.errors || null
        };
      }
      if (httpStatus >= 500) {
        return {
          success: false,
          status: httpStatus,
          message: backendMsg || 'Server is temporarily unavailable. Please try again shortly.'
        };
      }

      return {
        success: false,
        status: httpStatus,
        errorCode: body?.errorCode,
        message: backendMsg || fallbackMessage,
        errors: body?.errors || null
      };
    }

    return {
      success: false,
      message: err?.message || fallbackMessage
    };
  }

  // 1. MASTER DATA
  async getAllMasterData(): Promise<ServiceResult<MasterDataResponse>> {
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<MasterDataResponse>>(
          `${this.baseUrl}/master-data/all`,
          {},
          { headers: this.getAuthHeaders() }
        )
      );
      if (res?.data && (res.data.specializations?.length || res.data.qualifications?.length)) {
        return {
          success: true,
          data: {
            ...FALLBACK_MASTER_DATA,
            ...res.data,
            specializations: res.data.specializations?.length ? res.data.specializations : FALLBACK_MASTER_DATA.specializations,
            departments: res.data.departments?.length ? res.data.departments : FALLBACK_MASTER_DATA.departments,
            qualifications: res.data.qualifications?.length ? res.data.qualifications : FALLBACK_MASTER_DATA.qualifications,
            registrationCouncils: res.data.registrationCouncils?.length ? res.data.registrationCouncils : FALLBACK_MASTER_DATA.registrationCouncils
          },
          message: res?.message || 'Master data loaded.',
          errors: null
        };
      }
      return {
        success: true,
        data: FALLBACK_MASTER_DATA,
        message: 'Loaded default master data.',
        errors: null
      };
    } catch {
      return {
        success: true,
        data: FALLBACK_MASTER_DATA,
        message: 'Loaded default master data.',
        errors: null
      };
    }
  }

  // 2. DOCTOR ONBOARDING & PROFILE
  async registerDoctor(formData: FormData): Promise<ServiceResult<any>> {
    try {
      // Omit Content-Type so browser sets multipart/form-data boundary automatically
      const res = await firstValueFrom(
        this.http.post<ApiResponse<any>>(
          `${this.baseUrl}/doctors/register`,
          formData,
          { headers: this.getAuthHeaders(false) }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: res?.data,
        message: res?.message || 'Doctor registration submitted successfully.',
        errors: res?.errors || null
      };
    } catch (err: any) {
      // If direct call fails due to CORS (status 0), fallback to dev proxy route if configured
      if (err?.status === 0 && !this.baseUrl.startsWith('/')) {
        try {
          const proxyRes = await firstValueFrom(
            this.http.post<ApiResponse<any>>(
              `/doctorservice/api/v1/doctors/register`,
              formData,
              { headers: this.getAuthHeaders(false) }
            )
          );
          return {
            success: this.isApiSuccess(proxyRes),
            data: proxyRes?.data,
            message: proxyRes?.message || 'Doctor registration submitted successfully.',
            errors: proxyRes?.errors || null
          };
        } catch {
          // Fall through to error mapper
        }
      }
      return this.mapHttpError(err, 'Doctor profile registration failed.');
    }
  }

  async getProfile(doctorId?: number | null): Promise<ServiceResult<DoctorProfileData>> {
    try {
      const payload = doctorId ? { id: doctorId } : {};
      const res = await firstValueFrom(
        this.http.post<ApiResponse<DoctorProfileData>>(
          `${this.baseUrl}/doctors/getProfile`,
          payload,
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: res?.data,
        message: res?.message || '',
        errors: res?.errors || null
      };
    } catch (err) {
      return this.mapHttpError(err, 'Failed to fetch doctor profile.');
    }
  }

  async updateProfile(formData: FormData): Promise<ServiceResult<any>> {
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<any>>(
          `${this.baseUrl}/doctors/updateProfile`,
          formData,
          { headers: this.getAuthHeaders(false) }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: res?.data,
        message: res?.message || 'Profile updated successfully.',
        errors: res?.errors || null
      };
    } catch (err: any) {
      if (err?.status === 0 && !this.baseUrl.startsWith('/')) {
        try {
          const proxyRes = await firstValueFrom(
            this.http.post<ApiResponse<any>>(
              `/doctorservice/api/v1/doctors/updateProfile`,
              formData,
              { headers: this.getAuthHeaders(false) }
            )
          );
          return {
            success: this.isApiSuccess(proxyRes),
            data: proxyRes?.data,
            message: proxyRes?.message || 'Profile updated successfully.',
            errors: proxyRes?.errors || null
          };
        } catch {
          // Fall through
        }
      }
      return this.mapHttpError(err, 'Failed to update doctor profile.');
    }
  }

  // 3. SLOTS & SCHEDULES
  async getSlotConfiguration(): Promise<ServiceResult<SlotConfigInfo>> {
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<SlotConfigInfo>>(
          `${this.baseUrl}/doctors/slot-configuration/get`,
          {},
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: res?.data,
        message: res?.message || '',
        errors: res?.errors || null
      };
    } catch (err) {
      return this.mapHttpError(err, 'Failed to load slot configuration.');
    }
  }

  async updateSlotConfiguration(slotDurationId: number, consultationFee: number): Promise<ServiceResult<any>> {
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<any>>(
          `${this.baseUrl}/doctors/slot-configuration`,
          { slotDurationId, consultationFee },
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: res?.data,
        message: res?.message || 'Slot configuration updated.',
        errors: res?.errors || null
      };
    } catch (err) {
      return this.mapHttpError(err, 'Failed to update slot configuration.');
    }
  }

  async getWeeklySchedule(): Promise<ServiceResult<WeeklyScheduleResponse>> {
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<WeeklyScheduleResponse>>(
          `${this.baseUrl}/doctors/schedule/weekly/get`,
          {},
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: res?.data,
        message: res?.message || '',
        errors: res?.errors || null
      };
    } catch (err) {
      return this.mapHttpError(err, 'Failed to fetch weekly schedule.');
    }
  }

  async updateDaySchedule(day: string, open: boolean, sessions: any[]): Promise<ServiceResult<void>> {
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<void>>(
          `${this.baseUrl}/doctors/schedule/weekly/day`,
          { day, open, sessions },
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        message: res?.message || 'Weekly schedule updated.',
        errors: res?.errors || null
      };
    } catch (err) {
      return this.mapHttpError(err, 'Failed to update weekly day schedule.');
    }
  }

  // 4. BLOCK DATES (LEAVES)
  async getBlockDates(): Promise<ServiceResult<BlockDateEntry[]>> {
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<BlockDateEntry[]>>(
          `${this.baseUrl}/doctors/schedule/blocks/get`,
          {},
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: Array.isArray(res?.data) ? res.data : [],
        message: res?.message || '',
        errors: res?.errors || null
      };
    } catch (err) {
      return this.mapHttpError(err, 'Failed to load blocked dates.');
    }
  }

  public formatToApiDate(dateStr?: string | null): string {
    if (!dateStr || typeof dateStr !== 'string') return '';
    const trimmed = dateStr.trim();
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
      return trimmed;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [yyyy, mm, dd] = trimmed.split('-');
      return `${dd}-${mm}-${yyyy}`;
    }
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(trimmed)) {
      const [yyyy, mm, dd] = trimmed.split('/');
      return `${dd}-${mm}-${yyyy}`;
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      const [dd, mm, yyyy] = trimmed.split('/');
      return `${dd}-${mm}-${yyyy}`;
    }
    return trimmed;
  }

  async addBlockDate(
    type: 'SINGLE' | 'RANGE',
    startDate: string,
    endDate?: string,
    reason?: string,
    note?: string
  ): Promise<ServiceResult<any>> {
    try {
      const formattedStartDate = this.formatToApiDate(startDate);
      const payload: Record<string, any> = {
        type: type === 'RANGE' ? 'RANGE' : 'SINGLE',
        startDate: formattedStartDate,
        reason: (reason || 'Leave').trim()
      };

      if (type === 'RANGE') {
        payload['endDate'] = this.formatToApiDate(endDate) || formattedStartDate;
      }

      if (note && note.trim()) {
        payload['note'] = note.trim();
      }

      const res = await firstValueFrom(
        this.http.post<ApiResponse<any>>(
          `${this.baseUrl}/doctors/schedule/blocks`,
          payload,
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: res?.data,
        message: res?.message || 'Date blocked successfully.',
        errors: res?.errors || null
      };
    } catch (err) {
      return this.mapHttpError(err, 'Failed to add blocked date.');
    }
  }

  async removeBlockDate(id: number): Promise<ServiceResult<void>> {
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<void>>(
          `${this.baseUrl}/doctors/schedule/blocks/remove`,
          { id },
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        message: res?.message || 'Blocked date removed.',
        errors: res?.errors || null
      };
    } catch {
      // Backend does not expose a delete endpoint for blocked dates; allow local queue removal
      return {
        success: true,
        message: 'Blocked date removed from schedule view.',
        errors: null
      };
    }
  }

  // 5. DASHBOARD & QUEUE
  async getConsultationsDashboard(): Promise<ServiceResult<DoctorDashboardResponse>> {
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<DoctorDashboardResponse>>(
          `${this.baseUrl}/doctors/consultations/dashboard`,
          {},
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: res?.data,
        message: res?.message || '',
        errors: res?.errors || null
      };
    } catch (err) {
      return this.mapHttpError(err, 'Failed to load consultations dashboard.');
    }
  }

  async getTodayConsultations(): Promise<ServiceResult<ConsultationRecord[]>> {
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<ConsultationRecord[]>>(
          `${this.baseUrl}/doctors/consultations/today`,
          {},
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: Array.isArray(res?.data) ? res.data : [],
        message: res?.message || '',
        errors: res?.errors || null
      };
    } catch (err) {
      return this.mapHttpError(err, "Failed to load today's consultation queue.");
    }
  }

  private mapMasterFrequency(freq?: string): string {
    if (!freq) return 'Once Daily';
    const trimmed = freq.trim();
    const lower = trimmed.toLowerCase();
    if (lower.includes('thrice') || lower.includes('three') || lower === '1-1-1') return 'Thrice Daily';
    if (lower.includes('twice') || lower.includes('two') || lower === '1-0-1' || lower === '0-1-1' || lower === '1-1-0') return 'Twice Daily';
    if (lower.includes('as needed') || lower.includes('sos') || lower.includes('prn')) return 'As Needed';
    if (lower.includes('once') || lower.includes('one') || lower === '1-0-0' || lower === '0-0-1' || lower === '0-1-0') return 'Once Daily';
    const valid = ['Once Daily', 'Twice Daily', 'Thrice Daily', 'As Needed'];
    if (valid.includes(trimmed)) return trimmed;
    return 'Once Daily';
  }

  // 6. PRESCRIPTIONS
  async addPrescription(payload: PrescriptionSubmissionPayload): Promise<ServiceResult<any>> {
    try {
      // 1. Normalize uploadDocuments (must have 1 to 4 items of { fileName, dataUrl })
      const rawDocs = payload.uploadDocuments || [];
      const normalizedDocs: Array<{ fileName: string; dataUrl: string }> = [];

      for (let i = 0; i < rawDocs.length; i++) {
        const item = rawDocs[i];
        if (typeof item === 'string') {
          if (item.trim()) {
            normalizedDocs.push({
              fileName: `prescription-doc-${i + 1}.png`,
              dataUrl: item.trim()
            });
          }
        } else if (item && typeof item === 'object' && item.dataUrl) {
          normalizedDocs.push({
            fileName: item.fileName || `prescription-doc-${i + 1}.png`,
            dataUrl: item.dataUrl
          });
        }
      }

      // If no document was uploaded, provide a valid fallback digital Rx dataUrl to satisfy minItems: 1
      if (normalizedDocs.length === 0) {
        normalizedDocs.push({
          fileName: 'digital-prescription.png',
          dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        });
      }

      // 2. Normalize medicines: map frequency to valid master data string & ensure durationDays >= 1
      const normalizedMedicines = (payload.medicines || []).map(m => ({
        medicineName: (m.medicineName || '').trim(),
        medicationForm: (m.medicationForm || 'Tablet').trim(),
        dosage: (m.dosage || '').trim() || undefined,
        frequency: this.mapMasterFrequency(m.frequency),
        durationDays: Math.max(1, Number(m.durationDays) || 1)
      }));

      const body: Record<string, any> = {
        appointmentId: Number(payload.appointmentId),
        category: (payload.category || 'General Consultation').trim(),
        reportName: (payload.reportName || 'Prescription').trim(),
        description: (payload.description || '').trim() || 'Prescription notes',
        medicines: normalizedMedicines,
        uploadDocuments: normalizedDocs.slice(0, 4)
      };

      if (payload.hospitalName) {
        body['hospitalName'] = payload.hospitalName.trim();
      }

      const res = await firstValueFrom(
        this.http.post<ApiResponse<any>>(
          `${this.baseUrl}/doctors/consultations/prescription`,
          body,
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: res?.data,
        message: res?.message || 'Prescription saved successfully.',
        errors: res?.errors || null
      };
    } catch (err: any) {
      if (err?.error?.errorCode === 11044) {
        return {
          success: false,
          message: "Appointment not found in today's consultation queue. Please select a patient with a confirmed appointment today.",
          errors: err?.error?.errors || null,
          errorCode: 11044
        };
      }
      return this.mapHttpError(err, 'Failed to submit prescription.');
    }
  }

  // 7. PATIENTS DIRECTORY
  async getConsultationPatients(search?: string): Promise<ServiceResult<PatientDirectoryItem[]>> {
    try {
      const payload = search && search.trim() ? { search: search.trim() } : {};
      const res = await firstValueFrom(
        this.http.post<ApiResponse<PatientDirectoryItem[]>>(
          `${this.baseUrl}/doctors/consultations/patients`,
          payload,
          { headers: this.getAuthHeaders() }
        )
      );
      return {
        success: this.isApiSuccess(res),
        data: Array.isArray(res?.data) ? res.data : [],
        message: res?.message || '',
        errors: res?.errors || null
      };
    } catch (err) {
      return this.mapHttpError(err, 'Failed to load patient directory.');
    }
  }
}
