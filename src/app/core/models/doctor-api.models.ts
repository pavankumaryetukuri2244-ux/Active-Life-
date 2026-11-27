export interface ApiResponse<T = any> {
  status?: 'SUCCESS' | 'ERROR' | string;
  success?: boolean;
  errorCode?: number;
  responseCode?: number;
  message: string;
  data?: T;
  errors?: Record<string, any> | null;
  timestamp?: string;
}

export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: Record<string, any> | null;
  status?: number;
  errorCode?: number;
}

export interface MasterDataOption {
  id: number;
  name?: string;
  categoryName?: string;
  displayName?: string;
  durationMinutes?: number;
  modeCode?: string;
  iconName?: string;
}

export interface MasterDataResponse {
  slotDurations: Array<{ id: number; durationMinutes: number; displayName: string }>;
  consultationModes: Array<{ id: number; modeCode: string; displayName: string; iconName?: string }>;
  specializations: Array<{ id: number; categoryName: string }>;
  departments: Array<{ id: number; categoryName: string }>;
  qualifications: string[];
  registrationCouncils: string[];
  frequencies?: Array<{ id: number; name: string } | string>;
  medicationForms?: Array<{ id: number; name: string } | string>;
}

export interface DoctorProfileData {
  id?: number;
  fullName: string;
  mobileNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | string;
  email: string;
  qualification: string;
  specializationId?: number;
  specializationName?: string;
  specialization?: string;
  departmentId?: number | null;
  departmentName?: string;
  professionalExperienceDate?: string;
  registrationNumber?: string;
  registrationCouncil?: string;
  hospitalName?: string;
  address?: string;
  pinCode?: string;
  consultationModes?: string[];
  profilePhotoUrl?: string | null;
  documentUrls?: string[] | null;
  registrationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REGISTERED' | 'REGISTERED' | string;
  isProfileVerified?: boolean;
  isProfileComplete?: boolean;
  rejectionReason?: string;
}

export interface SlotConfigInfo {
  slotDuration: { id: number; durationMinutes: number; displayName: string };
  consultationFee: number;
  isConfigured: boolean;
}

export interface ScheduleTimeObject {
  hour: number;
  minute: number;
}

export interface ScheduleSession {
  startTime: ScheduleTimeObject | string;
  endTime: ScheduleTimeObject | string;
  hospitalId?: number | null;
  consultationMode?: string;
}

export interface WeeklyScheduleDay {
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY' | string;
  open: boolean;
  sessions: ScheduleSession[];
}

export interface WeeklyScheduleResponse {
  offlineAppointments?: boolean;
  days: WeeklyScheduleDay[];
}

export interface BlockDateEntry {
  id: number;
  type?: 'SINGLE' | 'RANGE' | string;
  startDate: string;
  endDate?: string | null;
  reason?: string;
  note?: string;
}

export interface ConsultationRecord {
  id?: number;
  appointmentId?: number;
  patientId?: number;
  patientCode?: string;
  patientName?: string;
  fullName?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  consultationMode?: string;
  mode?: string;
  appointmentTime?: string;
  slotTime?: string;
  appointmentDate?: string;
  status?: string;
  chiefComplaint?: string;
  symptoms?: string;
  diagnosisNotes?: string;
  allergies?: string[];
  chronicConditions?: string[];
  vitals?: Record<string, any>;
  documents?: Array<{ name?: string; url?: string; fileUrl?: string }>;
}

export interface DoctorDashboardResponse {
  todayAppointments: number;
  patientsToday: number;
  pendingAppointments: number;
  completedAppointments: number;
  appointmentLoad: 'LOW' | 'MEDIUM' | 'FULL' | string;
  completed: ConsultationRecord[];
  upcoming: ConsultationRecord[];
}

export interface PrescriptionMedicineInput {
  medicineName: string;
  medicationForm: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  timing?: string;
  instructions?: string;
}

export interface PrescriptionFileItem {
  fileName: string;
  dataUrl: string;
}

export interface PrescriptionSubmissionPayload {
  appointmentId: number;
  category?: string;
  reportName?: string;
  hospitalName?: string;
  description?: string;
  medicines: PrescriptionMedicineInput[];
  uploadDocuments: Array<PrescriptionFileItem | string>;
}

export interface PatientDirectoryItem {
  id?: number;
  patientId?: number;
  patientCode?: string;
  fullName?: string;
  name?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  mobileNumber?: string;
  phone?: string;
  email?: string;
  lastVisit?: string;
  lastVisitDate?: string;
  totalVisits?: number;
  recordCount?: number;
  conditions?: string[] | string;
  chronicConditions?: string[] | string;
  allergies?: string[];
  consultations?: any[];
  visits?: any[];
  prescriptions?: any[];
  documents?: any[];
}
