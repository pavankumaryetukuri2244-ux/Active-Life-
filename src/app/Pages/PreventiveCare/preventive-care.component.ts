import { Component, OnInit } from '@angular/core';
import { WebapiService } from '../../services/webapi.service';

interface Stage {
  id?: number;
  raw?: any;
  weekRange: string;
  trimester: string;
  milestones: string;
  scans: string;
  status: 'Active' | 'Inactive';
  isActive?: boolean;
}

interface Vaccine {
  id?: number;
  raw?: any;
  title: string;
  vaccineName?: string;
  timing: string;
  recommendedAge?: string;
  numberOfDoses?: number | string;
  doseNumber?: number | string;
  recommendedTiming?: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status?: string;
}

@Component({
  selector: 'app-preventive-care',
  templateUrl: './preventive-care.component.html',
  standalone: false,
  styles: [`
    .pc-page-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 700 !important;
      font-style: normal !important;
      font-size: 30px !important;
      line-height: 36px !important;
      letter-spacing: 0.4px !important;
      color: #0F172A !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
      white-space: nowrap !important;
    }

    .pc-page-subtitle {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 400 !important;
      font-style: normal !important;
      font-size: 16px !important;
      line-height: 24px !important;
      letter-spacing: -0.31px !important;
      color: #62748E !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
      white-space: normal !important;
    }

    /* Stat Cards */
    .pc-stat-card {
      border-radius: 16px !important;
      padding: 22px 24px !important;
      border: none !important;
      transition: none !important;
      transform: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      height: 100% !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    }

    .pc-stat-card:hover {
      transform: none !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    }

    .pc-stat-card-pink {
      background-color: #FFF1F2 !important;
    }
    .pc-stat-card-blue {
      background-color: #EFF6FF !important;
    }
    .pc-stat-card-purple {
      background-color: #FAF5FF !important;
    }
    .pc-stat-card-green {
      background-color: #F0FDF4 !important;
    }

    .pc-stat-label {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      color: #64748B !important;
      margin-bottom: 8px !important;
      display: block !important;
    }

    .pc-stat-value {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 28px !important;
      font-weight: 700 !important;
      letter-spacing: -0.02em !important;
      margin: 0 !important;
      line-height: 1.15 !important;
    }

    .pc-stat-icon-pink {
      color: #E11D48 !important;
    }
    .pc-stat-icon-blue {
      color: #2563EB !important;
    }
    .pc-stat-icon-purple {
      color: #9333EA !important;
    }
    .pc-stat-icon-green {
      color: #16A34A !important;
    }

    /* Segmented Tab Switcher (Sleek Compact Full Pill) */
    .pc-tab-container {
      background: #EAECEE !important;
      border-radius: 9999px !important;
      padding: 4px !important;
      display: flex !important;
      align-items: center !important;
      gap: 4px !important;
      width: 100% !important;
      border: 1px solid #E2E8F0 !important;
      height: 42px !important;
      box-sizing: border-box !important;
    }

    .pc-tab-btn {
      flex: 1 !important;
      height: 100% !important;
      background: transparent !important;
      border: none !important;
      color: #334155 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 500 !important;
      letter-spacing: -0.01em !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 9999px !important;
      cursor: pointer !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      outline: none !important;
      user-select: none !important;
      padding: 0 16px !important;
      line-height: 1 !important;
      margin: 0 !important;
      white-space: nowrap !important;
    }

    .pc-tab-btn:hover:not(.active) {
      color: #0F172A !important;
    }

    .pc-tab-btn.active {
      background: #FFFFFF !important;
      color: #0F172A !important;
      font-weight: 600 !important;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08) !important;
    }

    /* Main Section Card */
    .pc-content-card {
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 16px !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      padding: 24px 28px !important;
    }

    .pc-card-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 18px !important;
      font-weight: 600 !important;
      font-style: normal !important;
      line-height: 28px !important;
      letter-spacing: -0.44px !important;
      color: #0F172A !important;
      margin: 0 !important;
    }

    .pc-btn-add {
      background: #F43F5E !important;
      color: #FFFFFF !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 600 !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 8px 18px !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
    }

    .pc-btn-add:hover {
      background: #E11D48 !important;
      box-shadow: 0 4px 12px rgba(244, 63, 94, 0.25) !important;
    }

    /* Individual Card for each item */
    .pc-list-item {
      padding: 18px 22px !important;
      background: #FFFFFF !important;
      border: 1px solid #EEF2F6 !important;
      border-radius: 14px !important;
      margin-bottom: 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      flex-wrap: wrap !important;
      gap: 16px !important;
      transition: all 0.15s ease !important;
      cursor: pointer !important;
    }

    .pc-list-item:hover {
      background: #F8FAFC !important;
      border-color: #CBD5E1 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03) !important;
    }

    .pc-list-item.selected,
    .pc-list-item.active {
      background: #EFF6FF !important;
      border-color: #3B82F6 !important;
      box-shadow: 0 0 0 1px #3B82F6, 0 4px 12px rgba(59, 130, 246, 0.08) !important;
    }

    .pc-list-item:last-child {
      margin-bottom: 0 !important;
    }

    .pc-badge-icon {
      width: 44px !important;
      height: 44px !important;
      border-radius: 12px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #FFFFFF !important;
      flex-shrink: 0 !important;
    }

    .pc-status-badge {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 20px !important;
      padding: 4px 14px !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      font-family: 'Inter', sans-serif !important;
      background: #DCFCE7 !important;
      color: #16A34A !important;
    }

    .pc-icon-btn {
      background: transparent !important;
      border: none !important;
      color: #334155 !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 6px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: all 0.15s ease !important;
    }

    .pc-icon-btn:hover {
      background-color: #F1F5F9 !important;
      color: #0F172A !important;
    }

    .pc-icon-btn.danger {
      color: #F87171 !important;
    }

    .pc-icon-btn.danger:hover {
      background-color: #FEE2E2 !important;
      color: #EF4444 !important;
    }

    /* Modal Action Buttons matching Design / Screenshot */
    .pc-modal-actions {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      margin-top: 24px !important;
      width: 100% !important;
    }

    .pc-modal-btn-cancel {
      flex: 1 !important;
      height: 42px !important;
      border-radius: 10px !important;
      background: #FFFFFF !important;
      border: 1px solid #E2E8F0 !important;
      color: #0F172A !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      outline: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: background 0.15s ease, border-color 0.15s ease !important;
      box-shadow: none !important;
    }

    .pc-modal-btn-cancel:hover {
      background: #F8FAFC !important;
      border-color: #CBD5E1 !important;
    }

    .pc-modal-btn-submit {
      flex: 1 !important;
      height: 42px !important;
      border-radius: 10px !important;
      background: #E60076 !important;
      border: none !important;
      color: #FFFFFF !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      outline: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: background 0.15s ease, opacity 0.15s ease !important;
      box-shadow: none !important;
    }

    .pc-modal-btn-submit:hover {
      background: #D0006B !important;
      opacity: 0.96 !important;
    }
  `]
})
export class PreventiveCareComponent implements OnInit {

  pregnancyProgramsCount = 0;
  childCareProgramsCount = 0;
  vaccinesTrackedCount = 0;
  milestonesLoggedCount = 0;

  stagesList: Stage[] = [];
  pregnancyVaccines: Vaccine[] = [];
  childVaccines: Vaccine[] = [];

  activeTab: 'Pregnancy Care' | 'Pregnancy Vaccines' | 'Child Vaccines' = 'Pregnancy Care';
  selectedItem: any = null;
  isLoading = false;
  errorMessage = '';

  setTab(tab: 'Pregnancy Care' | 'Pregnancy Vaccines' | 'Child Vaccines') {
    this.activeTab = tab;
    this.selectedItem = null;
  }

  selectItem(item: any) {
    if (this.selectedItem === item) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
  }

  // Add Stage Modal state
  showAddStageModal = false;
  stageWeekRange = '';
  stageTrimester = 1;
  stageMilestones = '';
  stageScans = '';

  // Add Child Vaccine Modal state
  showAddChildVaccineModal = false;
  childVaccineName = '';
  childRecommendedAge = '';
  childDoseNumber = '';
  childDescription = '';

  // Add Pregnancy Vaccine Modal state
  showAddPregnancyVaccineModal = false;
  pregnancyVaccineName = '';
  pregnancyRecommendedTiming = '';
  pregnancyImportanceLevel = 'High';
  pregnancyDescription = '';

  // Dropdown state
  openDropdownId: string | null = null;

  // Edit Modal state
  showEditModal = false;
  isSavingEdit = false;
  editErrorMessage = '';
  editItemType: 'stage' | 'pregnancyVaccine' | 'childVaccine' | null = null;
  editingItemRef: any = null;
  editTitle = '';
  editTiming = '';
  editDescription = '';
  editWeekRange = '';
  editTrimester = 1;
  editMilestones = '';
  editScans = '';
  editStageId: number = 0;

  // Child Vaccine Edit fields (matching Add Child Vaccine modal)
  editChildVaccineId: number = 0;
  editChildVaccineName = '';
  editChildRecommendedAge = '';
  editChildDoseNumber = '';
  editChildDescription = '';

  // Pregnancy Vaccine Edit fields (matching Add Pregnancy Vaccine modal)
  editPregnancyVaccineId: number = 0;
  editPregnancyVaccineName = '';
  editPregnancyRecommendedTiming = '';
  editPregnancyDescription = '';

  constructor(private api: WebapiService) {
    document.addEventListener('click', () => this.closeDropdown());
  }

  toggleDropdown(id: string, event: Event) {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  closeDropdown() {
    this.openDropdownId = null;
  }

  private getStoredInactiveStages(): Stage[] {
    try {
      const raw = localStorage.getItem('inactive_pregnancy_stages');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveStoredInactiveStages(stages: Stage[]): void {
    try {
      localStorage.setItem('inactive_pregnancy_stages', JSON.stringify(stages));
    } catch (e) {
      console.error('Error saving inactive stages:', e);
    }
  }

  private saveSingleInactiveStage(stage: Stage): void {
    const list = this.getStoredInactiveStages().filter(s => s.id !== stage.id);
    list.push({
      id: stage.id,
      weekRange: stage.weekRange,
      trimester: stage.trimester,
      milestones: stage.milestones,
      scans: stage.scans,
      status: 'Inactive',
      isActive: false,
      raw: stage.raw
    });
    this.saveStoredInactiveStages(list);
  }

  private removeSingleInactiveStage(stageId: number): void {
    const list = this.getStoredInactiveStages().filter(s => s.id !== stageId);
    this.saveStoredInactiveStages(list);
  }

  toggleStatus(item: Stage | Vaccine, event?: Event) {
    if (event) event.stopPropagation();
    this.closeDropdown();

    const stageId = (item as any).id || (item as any).raw?.id;
    if (stageId && ('milestones' in item || 'scans' in item)) {
      const prevStatus = item.status;
      const targetStatus: 'Active' | 'Inactive' = item.status === 'Active' ? 'Inactive' : 'Active';
      const isTargetActive = targetStatus === 'Active';

      // 1. Immediately update UI state
      item.status = targetStatus;
      (item as any).isActive = isTargetActive;

      // 2. Persist local cache so it never vanishes from screen
      if (!isTargetActive) {
        this.saveSingleInactiveStage(item as Stage);
      } else {
        this.removeSingleInactiveStage(stageId);
      }

      this.api.TogglePregnancyStageStatus(stageId).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            const isAct = res.data.isActive !== undefined ? res.data.isActive : (res.data.status?.toLowerCase() === 'active');
            item.status = isAct ? 'Active' : 'Inactive';
            (item as any).isActive = isAct;
            if (isAct) {
              this.removeSingleInactiveStage(stageId);
            } else {
              this.saveSingleInactiveStage(item as Stage);
            }
          }
          // Only re-fetch backend list if reactivated to Active.
          // Never re-fetch immediately on Inactive because backend API filters out inactive items!
          if (item.status === 'Active') {
            this.loadPreventiveCareData(false);
          }
        },
        error: (err: any) => {
          console.error('Error toggling pregnancy stage status:', err);
          item.status = prevStatus;
          (item as any).isActive = prevStatus === 'Active';
          if (prevStatus === 'Inactive') {
            this.saveSingleInactiveStage(item as Stage);
          } else {
            this.removeSingleInactiveStage(stageId);
          }
        }
      });
    } else {
      item.status = item.status === 'Active' ? 'Inactive' : 'Active';
    }
  }

  openEditModal(item: any, type: 'stage' | 'pregnancyVaccine' | 'childVaccine', event?: Event) {
    if (event) event.stopPropagation();
    this.closeDropdown();
    this.editingItemRef = item;
    this.editItemType = type;
    this.editErrorMessage = '';
    this.isSavingEdit = false;

    if (type === 'stage') {
      this.editStageId = Number(item.id || item.raw?.id || 0);
      this.editWeekRange = item.weekRange || '';
      this.editTrimester = item.trimester === 'First Trimester' ? 1 : item.trimester === 'Second Trimester' ? 2 : 3;
      this.editMilestones = item.milestones && item.milestones !== '—' ? item.milestones : '';
      this.editScans = item.scans && item.scans !== '—' ? item.scans : '';
    } else if (type === 'childVaccine') {
      this.editChildVaccineId = Number(item.id || item.raw?.id || 0);
      this.editChildVaccineName = item.vaccineName || item.title?.replace(/\s*\(Dose\s*\d+\)/i, '').replace(/\s*\(\d+\s*dose[s]?\)/i, '') || '';
      
      // Extract clean number of months (e.g. "8", or "0" for at birth) so input doesn't carry "months" text
      let initialAge = '';
      if (item.raw?.recommendedAgeMonths !== undefined && item.raw?.recommendedAgeMonths !== null) {
        initialAge = String(item.raw.recommendedAgeMonths);
      } else {
        const sourceAge = String(item.recommendedAge || item.timing || '');
        if (sourceAge.toLowerCase().includes('birth')) {
          initialAge = '0';
        } else {
          initialAge = sourceAge.replace(/\D/g, '');
        }
      }
      this.editChildRecommendedAge = initialAge;
      this.editChildDoseNumber = String(item.numberOfDoses || item.doseNumber || item.raw?.numberOfDoses || item.raw?.dose || '').replace(/\D/g, '') || '';
      this.editChildDescription = item.description && item.description !== '—' ? item.description : '';
    } else if (type === 'pregnancyVaccine') {
      this.editPregnancyVaccineId = Number(item.id || item.raw?.id || 0);
      this.editPregnancyVaccineName = item.vaccineName || item.title || '';
      this.editPregnancyRecommendedTiming = item.recommendedTiming || item.timing?.replace(/^Timing:\s*/i, '') || '';
      this.editPregnancyDescription = item.description && item.description !== '—' ? item.description : '';
    } else {
      this.editTitle = item.title || '';
      this.editTiming = item.timing || '';
      this.editDescription = item.description || '';
    }

    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingItemRef = null;
    this.editItemType = null;
    this.editStageId = 0;
    this.editPregnancyVaccineId = 0;
    this.editChildVaccineId = 0;
    this.editErrorMessage = '';
    this.isSavingEdit = false;
  }

  saveEditChanges() {
    if (!this.editingItemRef) return;

    if (this.editItemType === 'stage') {
      const stageId = Number(this.editStageId || this.editingItemRef?.id || this.editingItemRef?.raw?.id);
      let rangeInput = this.editWeekRange.trim();
      const milestones = this.editMilestones.trim();
      const scan = this.editScans.trim();

      if (!rangeInput) {
        this.editErrorMessage = 'Please enter a week range.';
        return;
      }

      if (!rangeInput.toLowerCase().startsWith('week')) {
        rangeInput = 'Week ' + rangeInput;
      }

      const itemRef = this.editingItemRef;

      // Optimistically update local stage so UI reflects changes immediately
      if (itemRef) {
        itemRef.weekRange = rangeInput;
        itemRef.milestones = milestones || '—';
        itemRef.scans = scan || '—';
      }

      const payload = {
        id: stageId,
        weekRange: rangeInput,
        milestones: milestones,
        scan: scan
      };

      this.isSavingEdit = true;
      this.editErrorMessage = '';

      this.api.UpdatePregnancyStage(payload).subscribe({
        next: (res: any) => {
          this.isSavingEdit = false;
          if (res?.success || res?.status === 200) {
            const returned = res.data;
            if (returned && itemRef) {
              itemRef.id = returned.id || itemRef.id;
              itemRef.weekRange = returned.weekRange
                ? (returned.weekRange.toLowerCase().startsWith('week') ? returned.weekRange : `Week ${returned.weekRange}`)
                : itemRef.weekRange;
              itemRef.trimester = returned.trimester || itemRef.trimester;
              itemRef.milestones = returned.milestoneName || returned.milestones || milestones || '—';
              itemRef.scans = returned.milestoneType || returned.scan || returned.scans || scan || '—';
              if (returned.isActive !== undefined) {
                itemRef.isActive = returned.isActive;
                itemRef.status = returned.isActive ? 'Active' : 'Inactive';
              }
            }
            this.loadPreventiveCareData(false);
            this.closeEditModal();
          } else {
            this.editErrorMessage = res?.message || 'Failed to update pregnancy stage.';
          }
        },
        error: (err: any) => {
          this.isSavingEdit = false;
          console.error('Error updating pregnancy stage:', err);
          const errMsg = err.error?.message || err.message || 'Failed to update pregnancy stage. Please try again.';
          this.editErrorMessage = errMsg;
        }
      });
      return;
    } else if (this.editItemType === 'childVaccine') {
      const vName = this.editChildVaccineName.trim();
      const rawAge = this.editChildRecommendedAge.trim();
      const doseNum = parseInt(String(this.editChildDoseNumber).replace(/\D/g, ''), 10) || 1;
      const desc = this.editChildDescription.trim();

      if (!vName) {
        this.editErrorMessage = 'Please enter a vaccine name.';
        return;
      }
      if (!rawAge) {
        this.editErrorMessage = 'Please enter recommended age.';
        return;
      }
      if (!desc) {
        this.editErrorMessage = 'Please enter description.';
        return;
      }

      // Backend expects recommendedAge to be a pure number of months string (e.g. "8", or "0" for at birth).
      // If "8 months" is sent, backend throws: "Recommended age must be a valid number of months."
      const cleanAge = rawAge.toLowerCase().includes('birth') ? '0' : rawAge.replace(/\D/g, '').trim();
      if (!cleanAge) {
        this.editErrorMessage = 'Recommended age must be a valid number of months (e.g. 8, or 0 for at birth).';
        return;
      }

      const itemRef = this.editingItemRef;
      const vaccineId = Number(this.editChildVaccineId || itemRef?.id || itemRef?.raw?.id);

      // Optimistically update local item so user sees changes immediately
      if (itemRef) {
        itemRef.vaccineName = vName;
        itemRef.recommendedAge = cleanAge === '0' ? 'At birth' : `${cleanAge} months`;
        itemRef.numberOfDoses = doseNum;
        itemRef.title = vName + (doseNum ? ` (Dose ${doseNum})` : '');
        itemRef.timing = cleanAge === '0' ? 'Timing: At birth' : `Recommended Age: ${cleanAge} months`;
        itemRef.description = desc || '—';
      }

      const payload: {
        id?: number;
        vaccineName: string;
        recommendedAge: string;
        numberOfDoses: number;
        description: string;
      } = {
        vaccineName: vName,
        recommendedAge: cleanAge,
        numberOfDoses: doseNum,
        description: desc
      };

      if (vaccineId) {
        payload.id = vaccineId;
      }

      this.isSavingEdit = true;
      this.editErrorMessage = '';

      this.api.AddChildVaccine(payload).subscribe({
        next: (res: any) => {
          this.isSavingEdit = false;
          if (res?.success || res?.status === 200) {
            const returned = Array.isArray(res.data) ? res.data[0] : res.data;
            if (returned && itemRef) {
              itemRef.id = returned.id || itemRef.id;
              itemRef.vaccineName = returned.vaccineName || vName;
              itemRef.recommendedAge = returned.recommendedAge || (returned.recommendedAgeMonths !== undefined ? `${returned.recommendedAgeMonths} months` : (cleanAge === '0' ? 'At birth' : `${cleanAge} months`));
              itemRef.numberOfDoses = returned.numberOfDoses || returned.doseNumber || doseNum;
              itemRef.title = itemRef.vaccineName + (itemRef.numberOfDoses ? ` (Dose ${itemRef.numberOfDoses})` : '');
              itemRef.description = returned.description || desc;
            }
            this.loadPreventiveCareData(false);
            this.closeEditModal();
          } else {
            this.editErrorMessage = res?.message || 'Failed to update child vaccine.';
          }
        },
        error: (err: any) => {
          this.isSavingEdit = false;
          console.error('Error updating child vaccine:', err);
          const errMsg = err.error?.message || err.message || 'Failed to update child vaccine. Please try again.';
          this.editErrorMessage = errMsg;
        }
      });
      return;
    } else if (this.editItemType === 'pregnancyVaccine') {
      const vName = this.editPregnancyVaccineName.trim();
      const timing = this.editPregnancyRecommendedTiming.trim();
      const desc = this.editPregnancyDescription.trim();

      if (!vName) {
        this.editErrorMessage = 'Please enter a vaccine name.';
        return;
      }

      const itemRef = this.editingItemRef;
      const vaccineId = Number(this.editPregnancyVaccineId || itemRef?.id || itemRef?.raw?.id);

      // Optimistically update the local object so user sees changes immediately
      if (itemRef) {
        itemRef.vaccineName = vName;
        itemRef.recommendedTiming = timing;
        itemRef.title = vName;
        itemRef.timing = timing ? (timing.toLowerCase().startsWith('timing') ? timing : `Timing: ${timing}`) : 'Timing: Any trimester';
        itemRef.description = desc || '—';
      }

      const payload: {
        id?: number;
        vaccineName: string;
        recommendedTiming: string;
        description: string;
      } = {
        vaccineName: vName,
        recommendedTiming: timing,
        description: desc
      };

      if (vaccineId) {
        payload.id = vaccineId;
      }

      this.isSavingEdit = true;
      this.editErrorMessage = '';

      this.api.AddPregnancyVaccine(payload).subscribe({
        next: (res: any) => {
          this.isSavingEdit = false;
          if (res?.success || res?.status === 200) {
            if (res.data && itemRef) {
              itemRef.id = res.data.id || itemRef.id;
              itemRef.vaccineName = res.data.vaccineName || vName;
              itemRef.recommendedTiming = res.data.recommendedTiming || timing;
              itemRef.title = res.data.vaccineName || vName;
              itemRef.description = res.data.description || desc;
              itemRef.timing = itemRef.recommendedTiming ? (itemRef.recommendedTiming.toLowerCase().startsWith('timing') ? itemRef.recommendedTiming : `Timing: ${itemRef.recommendedTiming}`) : 'Timing: Any trimester';
            }
            this.loadPreventiveCareData(false);
            this.closeEditModal();
          } else {
            this.editErrorMessage = res?.message || 'Failed to update pregnancy vaccine.';
          }
        },
        error: (err: any) => {
          this.isSavingEdit = false;
          console.error('Error updating pregnancy vaccine:', err);
          const errMsg = err.error?.message || err.message || 'Failed to update pregnancy vaccine. Please try again.';
          this.editErrorMessage = errMsg;
        }
      });
      return;
    } else {
      this.editingItemRef.title = this.editTitle.trim();
      this.editingItemRef.timing = this.editTiming.trim();
      this.editingItemRef.description = this.editDescription.trim();
      this.closeEditModal();
    }
  }

  ngOnInit() {
    this.loadPreventiveCareData();
  }

  loadPreventiveCareData(showLoader = true) {
    if (showLoader && this.stagesList.length === 0) {
      this.isLoading = true;
    }
    this.errorMessage = '';
    this.api.GetPreventiveCare().subscribe({
      next: (res: any) => {
        if (res?.success && res.data) {
          // 1. Map pregnancy stages from API
          if (Array.isArray(res.data.pregnancyStages)) {
            const stages = res.data.pregnancyStages;
            stages.sort((a: any, b: any) => (a.weekRangeStart || a.weekStart || 0) - (b.weekRangeStart || b.weekStart || 0));
            const activeMapped: Stage[] = stages.map((s: any) => {
              const weekRangeStr = s.weekRange
                ? (s.weekRange.toLowerCase().startsWith('week') ? s.weekRange : `Week ${s.weekRange}`)
                : (s.weekRangeStart && s.weekRangeEnd ? (s.weekRangeStart === s.weekRangeEnd ? `Week ${s.weekRangeStart}` : `Week ${s.weekRangeStart}-${s.weekRangeEnd}`) : (s.weekStart ? `Week ${s.weekStart}` : '—'));

              let trimStr = 'First Trimester';
              if (s.trimester) {
                if (typeof s.trimester === 'string') {
                  const tLower = s.trimester.toLowerCase();
                  if (tLower.includes('first') || tLower.includes('1')) trimStr = 'First Trimester';
                  else if (tLower.includes('second') || tLower.includes('2')) trimStr = 'Second Trimester';
                  else if (tLower.includes('third') || tLower.includes('3')) trimStr = 'Third Trimester';
                  else trimStr = s.trimester;
                } else if (s.trimester === 1) trimStr = 'First Trimester';
                else if (s.trimester === 2) trimStr = 'Second Trimester';
                else if (s.trimester === 3) trimStr = 'Third Trimester';
              }

              const isAct = s.isActive !== undefined ? s.isActive : (s.status ? s.status.toLowerCase() === 'active' : true);

              return {
                id: s.id,
                weekRange: weekRangeStr,
                trimester: trimStr,
                milestones: s.milestoneName || s.milestones || '—',
                scans: s.milestoneType || s.scan || s.scans || '—',
                status: isAct ? 'Active' : 'Inactive',
                isActive: isAct,
                raw: s
              };
            });

            // Preserve inactive stages that backend might omit from its active-only response
            const storedInactive = this.getStoredInactiveStages();
            const activeIds = new Set(activeMapped.map(s => s.id));
            const validInactive = storedInactive.filter(s => s.id && !activeIds.has(s.id));
            this.saveStoredInactiveStages(validInactive);

            this.stagesList = [...activeMapped, ...validInactive];
            this.stagesList.sort((a: any, b: any) => {
              const aStart = a.raw?.weekRangeStart || a.raw?.weekStart || 0;
              const bStart = b.raw?.weekRangeStart || b.raw?.weekStart || 0;
              return aStart - bStart;
            });
          } else {
            this.stagesList = this.getStoredInactiveStages();
          }

          // 2. Map pregnancy vaccines from API
          if (Array.isArray(res.data.pregnancyVaccines)) {
            const pVaccines = res.data.pregnancyVaccines;
            this.pregnancyVaccines = pVaccines.map((v: any) => ({
              id: v.id,
              vaccineName: v.vaccineName || '',
              recommendedTiming: v.recommendedTiming || '',
              title: v.vaccineName || '—',
              timing: v.recommendedTiming ? `Timing: ${v.recommendedTiming}` : 'Timing: Any trimester',
              description: v.description || '—',
              priority: 'High',
              status: v.status ? (v.status.toUpperCase() === 'ACTIVE' ? 'Active' : 'Inactive') : '',
              raw: v
            }));
          } else {
            this.pregnancyVaccines = [];
          }

          // 3. Map child vaccines from API
          if (Array.isArray(res.data.childVaccines)) {
            const cVaccines = res.data.childVaccines;
            cVaccines.sort((a: any, b: any) => (a.recommendedAgeMonths || 0) - (b.recommendedAgeMonths || 0));
            this.childVaccines = cVaccines.map((v: any) => ({
              id: v.id,
              vaccineName: v.vaccineName || '',
              recommendedAge: v.recommendedAge || (v.recommendedAgeMonths !== undefined && v.recommendedAgeMonths !== null ? `${v.recommendedAgeMonths} months` : ''),
              numberOfDoses: v.numberOfDoses || v.doseNumber || (v.dose ? String(v.dose).replace(/\D/g, '') : '') || '',
              title: v.vaccineName + (v.doseNumber ? ` (Dose ${v.doseNumber})` : (v.dose ? ` (${v.dose})` : '')),
              timing: v.recommendedAgeMonths === 0 || v.recommendedAgeMonths === null ? 'Timing: At birth' : (v.recommendedAge ? `Recommended Age: ${v.recommendedAge}` : `Recommended Age: ${v.recommendedAgeMonths} months`),
              description: v.description || '—',
              priority: 'High',
              status: v.status ? (v.status.toUpperCase() === 'ACTIVE' ? 'Active' : 'Inactive') : '',
              raw: v
            }));
          } else {
            this.childVaccines = [];
          }

          // 4. Dynamic counts strictly calculated from API data
          if (res.data.stats) {
            this.pregnancyProgramsCount = res.data.stats.pregnancyPrograms ?? this.stagesList.length;
            this.childCareProgramsCount = res.data.stats.childCarePrograms ?? this.childVaccines.length;
            this.vaccinesTrackedCount = res.data.stats.vaccinesTracked ?? (this.pregnancyVaccines.length + this.childVaccines.length);
            this.milestonesLoggedCount = res.data.stats.milestonesLogged ?? 0;
          } else {
            this.pregnancyProgramsCount = this.stagesList.length;
            this.childCareProgramsCount = this.childVaccines.length;
            this.vaccinesTrackedCount = this.pregnancyVaccines.length + this.childVaccines.length;
            this.milestonesLoggedCount = 0;
          }
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Preventive Care API error:', err);
        this.isLoading = false;
      }
    });
  }

  openAddStageModal() {
    this.stageWeekRange = '';
    this.stageTrimester = 1;
    this.stageMilestones = '';
    this.stageScans = '';
    this.showAddStageModal = true;
  }

  closeAddStageModal() {
    this.showAddStageModal = false;
  }

  submitAddStage() {
    if (!this.stageWeekRange.trim()) {
      alert('Please enter a week range.');
      return;
    }

    let rangeInput = this.stageWeekRange.trim();
    if (!rangeInput.toLowerCase().startsWith('week')) {
      // Auto-capitalize first letter of range prefix
      rangeInput = 'Week ' + rangeInput;
    }

    const body = {
      weekRange: rangeInput,
      milestones: this.stageMilestones.trim(),
      scan: this.stageScans.trim()
    };

    this.showAddStageModal = false;

    this.api.AddPregnancyStage(body).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.loadPreventiveCareData(false);
        } else {
          this.errorMessage = res?.message || 'Failed to add pregnancy stage.';
        }
      },
      error: (err: any) => {
        console.error('Add pregnancy stage error:', err);
        const errMsg = err.error?.message || err.message || 'Failed to add pregnancy stage. Please try again.';
        this.errorMessage = `Error: ${errMsg}`;
      }
    });
  }

  openAddChildVaccineModal() {
    this.childVaccineName = '';
    this.childRecommendedAge = '';
    this.childDoseNumber = '';
    this.childDescription = '';
    this.showAddChildVaccineModal = true;
  }

  closeAddChildVaccineModal() {
    this.showAddChildVaccineModal = false;
  }

  submitAddChildVaccine() {
    if (!this.childVaccineName.trim()) {
      alert('Please enter a vaccine name.');
      return;
    }

    // Extract only digits for recommendedAge and keep as string (e.g. "6", or "0" for at birth)
    const rawAge = this.childRecommendedAge.trim();
    const recommendedAge = rawAge.toLowerCase().includes('birth') ? '0' : rawAge.replace(/\D/g, '').trim();

    if (!recommendedAge) {
      alert('Please enter a valid recommended age in months (e.g. 6, or 0 for at birth).');
      return;
    }

    // Parse Dose Number to integer type
    const doseDigits = this.childDoseNumber.replace(/\D/g, '');
    const numberOfDoses = parseInt(doseDigits, 10) || 1;

    const body = {
      vaccineName: this.childVaccineName.trim(),
      description: this.childDescription.trim(),
      numberOfDoses,
      recommendedAge
    };

    this.showAddChildVaccineModal = false;

    this.api.AddChildVaccine(body).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.loadPreventiveCareData(false);
        } else {
          this.errorMessage = res?.message || 'Failed to add child vaccine.';
        }
      },
      error: (err: any) => {
        console.error('Add child vaccine error:', err);
        const errMsg = err.error?.message || err.message || (err.error ? JSON.stringify(err.error) : '');
        this.errorMessage = `Error: ${errMsg || 'Failed to add child vaccine. Please try again.'}`;
      }
    });
  }

  openAddPregnancyVaccineModal() {
    this.pregnancyVaccineName = '';
    this.pregnancyRecommendedTiming = '';
    this.pregnancyImportanceLevel = 'High';
    this.pregnancyDescription = '';
    this.showAddPregnancyVaccineModal = true;
  }

  closeAddPregnancyVaccineModal() {
    this.showAddPregnancyVaccineModal = false;
  }

  submitAddPregnancyVaccine() {
    if (!this.pregnancyVaccineName.trim()) {
      alert('Please enter a vaccine name.');
      return;
    }

    const body = {
      vaccineName: this.pregnancyVaccineName.trim(),
      recommendedTiming: this.pregnancyRecommendedTiming.trim(),
      description: this.pregnancyDescription.trim()
    };

    this.showAddPregnancyVaccineModal = false;

    this.api.AddPregnancyVaccine(body).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.loadPreventiveCareData(false);
        } else {
          this.errorMessage = res?.message || 'Failed to add pregnancy vaccine.';
        }
      },
      error: (err: any) => {
        console.error('Add pregnancy vaccine error:', err);
        const errMsg = err.error?.message || err.message || (err.error ? JSON.stringify(err.error) : '');
        this.errorMessage = `Error: ${errMsg || 'Failed to add pregnancy vaccine. Please try again.'}`;
      }
    });
  }
}
