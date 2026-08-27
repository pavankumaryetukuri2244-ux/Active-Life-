import { Component, OnInit } from '@angular/core';
import { WebapiService } from '../../services/webapi.service';

interface Stage {
  weekRange: string;
  trimester: string;
  milestones: string;
  scans: string;
  status: 'Active' | 'Inactive';
}

interface Vaccine {
  title: string;
  timing: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-preventive-care',
  templateUrl: './preventive-care.component.html',
  standalone: false
})
export class PreventiveCareComponent implements OnInit {
  
  stagesList: Stage[] = [];
  pregnancyVaccines: Vaccine[] = [];
  childVaccines: Vaccine[] = [];
  
  activeTab: 'Pregnancy Care' | 'Pregnancy Vaccines' | 'Child Vaccines' = 'Pregnancy Care';
  isLoading = false;
  errorMessage = '';

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

  constructor(private api: WebapiService) {}

  ngOnInit() {
    this.loadPreventiveCareData();
  }

  loadPreventiveCareData(showLoader = true) {
    if (showLoader && this.stagesList.length === 0 && this.pregnancyVaccines.length === 0 && this.childVaccines.length === 0) {
      this.isLoading = true;
    }
    this.errorMessage = '';
    this.api.GetPreventiveCare().subscribe({
      next: (res: any) => {
        if (res?.success && res.data) {
          // 1. Map pregnancy stages
          const stages = res.data.pregnancyStages || [];
          stages.sort((a: any, b: any) => (a.weekStart || 0) - (b.weekStart || 0));
          this.stagesList = stages.map((s: any) => ({
            weekRange: s.weekStart === s.weekEnd ? `Week ${s.weekStart}` : `Week ${s.weekStart}-${s.weekEnd}`,
            trimester: s.trimester === 1 ? 'First Trimester' : s.trimester === 2 ? 'Second Trimester' : 'Third Trimester',
            milestones: s.milestones || '—',
            scans: s.scans || '—',
            status: 'Active'
          }));

          // 2. Map pregnancy vaccines
          const pVaccines = res.data.pregnancyVaccines || [];
          this.pregnancyVaccines = pVaccines.map((v: any) => ({
            title: v.vaccineName || '—',
            timing: v.recommendedTiming ? `Timing: ${v.recommendedTiming}` : 'Timing: Any trimester',
            description: v.description || '—',
            priority: v.recommendedTiming === 'ANY' ? 'Medium' : 'High',
            status: 'Active'
          }));

          // 3. Map child vaccines
          const cVaccines = res.data.childVaccines || [];
          cVaccines.sort((a: any, b: any) => (a.recommendedAgeMonths || 0) - (b.recommendedAgeMonths || 0));
          this.childVaccines = cVaccines.map((v: any) => ({
            title: v.vaccineName + (v.doseNumber ? ` (Dose ${v.doseNumber})` : ''),
            timing: v.recommendedAgeMonths === 0 || v.recommendedAgeMonths === null ? 'Timing: At birth' : `Recommended Age: ${v.recommendedAgeMonths} months`,
            description: v.description || '—',
            priority: 'High',
            status: 'Active'
          }));
        } else {
          this.errorMessage = res?.message || 'Failed to load preventive care data.';
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Preventive Care API error:', err);
        this.errorMessage = 'Failed to load data from server. Please try again.';
        this.isLoading = false;
      }
    });
  }

  setTab(tab: 'Pregnancy Care' | 'Pregnancy Vaccines' | 'Child Vaccines') {
    this.activeTab = tab;
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
      scans: this.stageScans.trim()
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
        this.errorMessage = 'Failed to add pregnancy stage. Please try again.';
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

    // Extract only digits for recommendedAge and keep as string (e.g. "6")
    const recommendedAge = this.childRecommendedAge.replace(/\D/g, '').trim();

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
