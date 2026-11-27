import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { DoctorService, FALLBACK_MASTER_DATA } from '../../services/doctor.service';
import { DoctorProfileData, MasterDataResponse } from '../../core/models/doctor-api.models';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styles: [`
    .dpr-page {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1120px;
      margin: 0 auto;
      color: #0F172A;
    }

    .dpr-hero {
      background: linear-gradient(135deg, #0082B3 0%, #00A0D2 100%);
      border-radius: 18px;
      padding: 24px 28px;
      color: #FFFFFF;
      margin-bottom: 24px;
      box-shadow: 0 8px 24px rgba(0, 136, 186, 0.2);
    }

    .dpr-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      padding: 24px 26px;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
      margin-bottom: 20px;
    }

    .dpr-label {
      font-size: 12.5px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 6px;
      display: block;
    }

    .dpr-input {
      width: 100%;
      border: 1px solid #E2E8F0;
      background: #F8FAFC;
      border-radius: 12px;
      padding: 11px 14px;
      font-size: 14px;
      color: #0F172A;
      outline: none;
    }

    .dpr-input:focus {
      border-color: #00A0D2;
      background: #FFFFFF;
    }

    .custom-select-wrapper {
      position: relative;
      width: 100%;
    }

    .custom-select-trigger {
      cursor: pointer;
      user-select: none;
      background: #F8FAFC;
      transition: all 0.15s ease;
      min-height: 45px;
    }

    .custom-select-trigger:hover {
      border-color: #CBD5E1;
      background: #FFFFFF;
    }

    .custom-select-trigger.active {
      border-color: #00A0D2 !important;
      background: #FFFFFF !important;
      box-shadow: 0 0 0 3px rgba(0, 160, 210, 0.15) !important;
    }

    .placeholder-text {
      color: #94A3B8;
    }

    .chevron-icon {
      color: #64748B;
      transition: transform 0.2s ease;
      flex-shrink: 0;
      margin-left: 8px;
    }

    .chevron-icon.rotated {
      transform: rotate(180deg);
    }

    /* FORCES DROPDOWN TO ALWAYS OPEN DOWNWARDS */
    .custom-dropdown-menu {
      position: absolute;
      top: calc(100% + 4px) !important;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14), 0 4px 10px rgba(15, 23, 42, 0.06);
      max-height: 250px;
      overflow-y: auto;
      z-index: 1050;
      padding: 6px 0;
      animation: slideDownFade 0.15s ease-out;
    }

    @keyframes slideDownFade {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .custom-dropdown-item {
      padding: 10px 16px;
      font-size: 13.5px;
      color: #1E293B;
      cursor: pointer;
      transition: background-color 0.12s ease, color 0.12s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .custom-dropdown-item:hover {
      background-color: #F0F9FF;
      color: #0088BA;
    }

    .custom-dropdown-item.selected {
      background-color: #E0F2FE;
      color: #0088BA;
      font-weight: 600;
    }

    .dpr-mode-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      background: #F8FAFC;
      font-size: 13.5px;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
    }

    .dpr-mode-chip.selected {
      background: #E0F2FE;
      border-color: #38BDF8;
      color: #0369A1;
    }

    .dpr-submit-btn {
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, #0088BA 0%, #00A8E8 100%);
      color: #FFFFFF;
      padding: 13px 26px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0, 136, 186, 0.25);
    }

    .dpr-submit-btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .dpr-photo-preview {
      width: 78px;
      height: 78px;
      border-radius: 16px;
      object-fit: cover;
      border: 1px solid #E2E8F0;
      background: #F1F5F9;
    }
  `]
})
export class DoctorProfileComponent implements OnInit {
  profileForm!: FormGroup;
  masterData: MasterDataResponse = FALLBACK_MASTER_DATA;
  existingProfile: DoctorProfileData | null = null;

  todayDate = new Date().toISOString().split('T')[0];
  isEditMode = false;
  isLoading = true;
  isSubmitting = false;

  errorMessage = '';
  successMessage = '';
  fieldErrors: Record<string, string> = {};

  selectedModes: string[] = [];
  selectedPhotoFile: File | null = null;
  photoPreviewUrl = '';
  photoError = '';

  selectedCertFiles: File[] = [];
  existingDocUrls: string[] = [];
  certError = '';

  activeDropdown: string | null = null;

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeDropdown = null;
  }

  toggleDropdown(name: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  selectGender(gender: string): void {
    this.profileForm.get('gender')?.setValue(gender);
    this.profileForm.get('gender')?.markAsDirty();
    this.profileForm.get('gender')?.markAsTouched();
    this.activeDropdown = null;
  }

  selectQualification(qual: string): void {
    this.profileForm.get('qualification')?.setValue(qual);
    this.profileForm.get('qualification')?.markAsDirty();
    this.profileForm.get('qualification')?.markAsTouched();
    this.activeDropdown = null;
  }

  selectSpecialization(spec: { id: number; categoryName: string }): void {
    this.profileForm.get('specializationId')?.setValue(spec.id ? spec.id : '');
    this.profileForm.get('specializationId')?.markAsDirty();
    this.profileForm.get('specializationId')?.markAsTouched();
    this.activeDropdown = null;
  }

  selectDepartment(dept: { id: number; categoryName: string }): void {
    this.profileForm.get('departmentId')?.setValue(dept.id ? dept.id : '');
    this.profileForm.get('departmentId')?.markAsDirty();
    this.profileForm.get('departmentId')?.markAsTouched();
    this.activeDropdown = null;
  }

  selectCouncil(council: string): void {
    this.profileForm.get('registrationCouncil')?.setValue(council);
    this.profileForm.get('registrationCouncil')?.markAsDirty();
    this.profileForm.get('registrationCouncil')?.markAsTouched();
    this.activeDropdown = null;
  }

  getGenderLabel(): string {
    const val = this.profileForm?.get('gender')?.value;
    if (val === 'FEMALE') return 'Female';
    if (val === 'OTHER') return 'Other';
    return 'Male';
  }

  getQualificationLabel(): string {
    const val = this.profileForm?.get('qualification')?.value;
    return val || 'Select Qualification';
  }

  getSpecializationLabel(): string {
    const id = this.profileForm?.get('specializationId')?.value;
    if (!id) return 'Select Specialization';
    const found = this.masterData.specializations?.find(s => String(s.id) === String(id));
    return found ? found.categoryName : 'Select Specialization';
  }

  getDepartmentLabel(): string {
    const id = this.profileForm?.get('departmentId')?.value;
    if (!id) return 'Select Department';
    const found = this.masterData.departments?.find(d => String(d.id) === String(id));
    return found ? found.categoryName : 'Select Department';
  }

  getCouncilLabel(): string {
    const val = this.profileForm?.get('registrationCouncil')?.value;
    return val || 'Select Council';
  }

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const savedMobile = (localStorage.getItem('doctorMobile') || '').trim();
    const forceEdit = this.route.snapshot.queryParamMap.get('mode') === 'edit';

    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      mobileNumber: [savedMobile, [Validators.required, Validators.pattern(/^(\+91)?[6-9][0-9]{9}$/)]],
      gender: ['MALE', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      qualification: ['', [Validators.required]],
      specializationId: ['', [Validators.required]],
      departmentId: [''],
      professionalExperienceDate: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      registrationCouncil: ['', [Validators.required]],
      hospitalName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });

    this.loadInitialData(forceEdit);
  }

  async loadInitialData(forceEdit: boolean): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    const [masterRes, profileRes] = await Promise.all([
      this.doctorService.getAllMasterData(),
      this.doctorService.getProfile()
    ]);

    if (masterRes?.data) {
      this.masterData = masterRes.data;
    }

    if (profileRes.success && profileRes.data) {
      this.existingProfile = profileRes.data;
      const regStatus = (profileRes.data.registrationStatus || '').toUpperCase();
      this.isEditMode = forceEdit || (Boolean(regStatus) && regStatus !== 'NOT_REGISTERED');
      this.patchFormFromProfile(profileRes.data);
    } else {
      const portalState = this.getStoredPortalState();
      const storedStatus = (portalState?.registrationStatus || '').toUpperCase();
      this.isEditMode = forceEdit || (storedStatus !== '' && storedStatus !== 'NOT_REGISTERED');
    }

    this.isLoading = false;
  }

  private patchFormFromProfile(profile: DoctorProfileData): void {
    this.profileForm.patchValue({
      fullName: profile.fullName || '',
      mobileNumber: (profile.mobileNumber || localStorage.getItem('doctorMobile') || '').replace(/^\+?91/, ''),
      gender: profile.gender || 'MALE',
      email: profile.email || '',
      qualification: profile.qualification || '',
      specializationId: profile.specializationId || '',
      departmentId: profile.departmentId || '',
      professionalExperienceDate: profile.professionalExperienceDate || '',
      registrationNumber: profile.registrationNumber || '',
      registrationCouncil: profile.registrationCouncil || '',
      hospitalName: profile.hospitalName || '',
      address: profile.address || '',
      pinCode: profile.pinCode || ''
    });

    if (Array.isArray(profile.consultationModes)) {
      this.selectedModes = [...profile.consultationModes];
    }
    if (profile.profilePhotoUrl) {
      this.photoPreviewUrl = this.commonService.formatMediaUrl(profile.profilePhotoUrl);
    }
    if (Array.isArray(profile.documentUrls)) {
      this.existingDocUrls = profile.documentUrls.map(u => this.commonService.formatMediaUrl(u));
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

  toggleConsultationMode(modeCode: string): void {
    const idx = this.selectedModes.indexOf(modeCode);
    if (idx > -1) {
      this.selectedModes.splice(idx, 1);
    } else {
      this.selectedModes.push(modeCode);
    }
  }

  isModeSelected(modeCode: string): boolean {
    return this.selectedModes.includes(modeCode);
  }

  onPhotoSelected(event: Event): void {
    this.photoError = '';
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      this.photoError = 'Profile photo exceeds the 2MB limit. Please choose a smaller image.';
      if (input) input.value = '';
      return;
    }

    this.selectedPhotoFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreviewUrl = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  }

  onCertificatesSelected(event: Event): void {
    this.certError = '';
    const input = event.target as HTMLInputElement | null;
    const files = Array.from(input?.files || []);
    if (files.length === 0) return;

    const maxBytes = 5 * 1024 * 1024;
    for (const file of files) {
      if (file.size > maxBytes) {
        this.certError = `File "${file.name}" exceeds the 5MB limit. Please compress and re-upload.`;
        if (input) input.value = '';
        return;
      }
    }

    this.selectedCertFiles = [...this.selectedCertFiles, ...files];
    if (input) input.value = '';
  }

  removeSelectedCert(index: number): void {
    this.selectedCertFiles.splice(index, 1);
  }

  async submitProfile(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.fieldErrors = {};
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      this.errorMessage = 'Please complete all required medical registration fields accurately.';
      return;
    }

    const expDate = this.profileForm.value.professionalExperienceDate;
    if (expDate && expDate > this.todayDate) {
      this.fieldErrors['professionalExperienceDate'] = 'Professional experience date cannot be in the future.';
      this.errorMessage = 'Professional experience date cannot be in the future.';
      return;
    }

    if (!this.selectedModes || this.selectedModes.length === 0) {
      this.errorMessage = 'At least one consultation mode is required (e.g. Video Call, Audio Call, or Offline).';
      this.fieldErrors['consultationModeIds'] = 'At least one consultation mode is required';
      return;
    }

    this.isSubmitting = true;
    const raw = this.profileForm.value;
    const formData = new FormData();

    formData.append('fullName', String(raw.fullName || '').trim());

    // Format mobile number to match backend requirement: +91 followed by 10 digits starting with 6-9
    let formattedMobile = String(raw.mobileNumber || '').trim().replace(/\s+/g, '');
    if (!formattedMobile.startsWith('+91')) {
      formattedMobile = '+91' + formattedMobile.replace(/^\+?91/, '');
    }
    formData.append('mobileNumber', formattedMobile);

    formData.append('gender', String(raw.gender || 'MALE'));
    formData.append('email', String(raw.email || '').trim());
    formData.append('qualification', String(raw.qualification || '').trim());
    formData.append('specializationId', String(raw.specializationId || ''));
    if (raw.departmentId) {
      formData.append('departmentId', String(raw.departmentId));
    }
    formData.append('professionalExperienceDate', String(raw.professionalExperienceDate || ''));
    formData.append('registrationNumber', String(raw.registrationNumber || '').trim());
    formData.append('registrationCouncil', String(raw.registrationCouncil || '').trim());
    formData.append('hospitalName', String(raw.hospitalName || '').trim());
    formData.append('address', String(raw.address || '').trim());
    formData.append('pinCode', String(raw.pinCode || '').trim());

    // Resolve consultationModeIds (numeric IDs required by backend validation)
    const selectedModeIds: number[] = [];
    this.selectedModes.forEach(modeVal => {
      const found = this.masterData.consultationModes?.find(
        m => String(m.id) === String(modeVal) || m.modeCode === modeVal || m.displayName === modeVal
      );
      if (found && found.id) {
        selectedModeIds.push(found.id);
      } else if (!isNaN(Number(modeVal))) {
        selectedModeIds.push(Number(modeVal));
      } else if (modeVal === 'VIDEO') {
        selectedModeIds.push(1);
      } else if (modeVal === 'AUDIO') {
        selectedModeIds.push(2);
      } else if (modeVal === 'OFFLINE') {
        selectedModeIds.push(3);
      }
    });

    if (selectedModeIds.length === 0) {
      selectedModeIds.push(1);
    }

    selectedModeIds.forEach(id => {
      formData.append('consultationModeIds', String(id));
      formData.append('consultationModes', String(id));
    });
    this.selectedModes.forEach(mode => formData.append('consultationModes', mode));

    if (this.selectedPhotoFile) {
      formData.append('uploadPhoto', this.selectedPhotoFile, this.selectedPhotoFile.name);
      formData.append('profilePhoto', this.selectedPhotoFile, this.selectedPhotoFile.name);
      formData.append('photo', this.selectedPhotoFile, this.selectedPhotoFile.name);
      formData.append('profileImage', this.selectedPhotoFile, this.selectedPhotoFile.name);
    }
    this.selectedCertFiles.forEach(file => {
      formData.append('uploadFiles', file, file.name);
      formData.append('documents', file, file.name);
    });

    const result = this.isEditMode
      ? await this.doctorService.updateProfile(formData)
      : await this.doctorService.registerDoctor(formData);

    this.isSubmitting = false;

    if (!result.success) {
      this.errorMessage = result.message || 'Unable to submit doctor profile.';
      if (result.errors && typeof result.errors === 'object') {
        Object.keys(result.errors).forEach(key => {
          this.fieldErrors[key] = String(result.errors?.[key] || '');
        });
      }
      return;
    }

    const nextStatus = result.data?.registrationStatus || 'PENDING';
    const currentState = this.getStoredPortalState() || {};
    localStorage.setItem('doctorPortalState', JSON.stringify({
      ...currentState,
      registrationStatus: nextStatus,
      isProfileComplete: true,
      isProfileVerified: nextStatus === 'APPROVED',
      title: nextStatus === 'APPROVED' ? 'Doctor Account Verified' : 'Profile Under Review',
      message: result.message || 'Your doctor profile has been submitted for verification.'
    }));

    this.successMessage = result.message || (
      this.isEditMode
        ? 'Doctor profile updated and submitted.'
        : 'Doctor registration submitted for review.'
    );

    if (!this.isEditMode || this.existingProfile?.registrationStatus === 'REJECTED') {
      setTimeout(() => {
        this.router.navigate(['/doctor/profile-status']);
      }, 900);
    }
  }
}
