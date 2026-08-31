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
  standalone: false,
  styles: [`
    .pc-page-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 26px !important;
      font-weight: 700 !important;
      color: #0F172A !important;
      letter-spacing: -0.02em !important;
      margin: 0 0 4px 0 !important;
    }

    .pc-page-subtitle {
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 400 !important;
      color: #64748B !important;
      margin: 0 0 24px 0 !important;
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
      background: #F1F3F5 !important;
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
      font-size: 13px !important;
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
    }

    .pc-tab-btn:hover {
      color: #0F172A !important;
    }

    .pc-tab-btn.active {
      background: #FFFFFF !important;
      color: #0F172A !important;
      font-weight: 600 !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04) !important;
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
      font-family: 'Inter', sans-serif !important;
      font-size: 17px !important;
      font-weight: 700 !important;
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
      transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
    }

    .pc-list-item:hover {
      border-color: #E2E8F0 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03) !important;
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
  `]
})
export class PreventiveCareComponent implements OnInit {
  
  pregnancyProgramsCount = 342;
  childCareProgramsCount = 1234;
  vaccinesTrackedCount = 8945;
  milestonesLoggedCount = 12456;

  stagesList: Stage[] = [
    {
      weekRange: 'Week 1-4',
      trimester: 'First Trimester',
      milestones: 'Conception, Implantation',
      scans: 'None',
      status: 'Active'
    },
    {
      weekRange: 'Week 5-8',
      trimester: 'First Trimester',
      milestones: 'Heartbeat Detection, Embryo Development',
      scans: 'Early Ultrasound',
      status: 'Active'
    },
    {
      weekRange: 'Week 9-12',
      trimester: 'First Trimester',
      milestones: 'Major Organs Form, First Prenatal Visit',
      scans: 'NT Scan',
      status: 'Active'
    },
    {
      weekRange: 'Week 13-16',
      trimester: 'Second Trimester',
      milestones: 'Gender Detection Possible, Quickening',
      scans: 'None',
      status: 'Active'
    }
  ];

  pregnancyVaccines: Vaccine[] = [
    {
      title: 'Tdap Vaccine',
      timing: 'Timing: 27-36 weeks',
      description: 'Protects against tetanus, diphtheria, and pertussis',
      priority: 'High',
      status: 'Active'
    },
    {
      title: 'Flu Vaccine',
      timing: 'Timing: Any trimester',
      description: 'Annual flu shot recommended during pregnancy',
      priority: 'High',
      status: 'Active'
    },
    {
      title: 'COVID-19 Vaccine',
      timing: 'Timing: Any trimester',
      description: 'Recommended for pregnant women',
      priority: 'Medium',
      status: 'Active'
    }
  ];

  childVaccines: Vaccine[] = [
    {
      title: 'Hepatitis B',
      timing: 'Age: Birth • Doses: 3',
      description: 'First dose at birth, second at 1-2 months, third at 6-18 months',
      priority: 'High',
      status: 'Active'
    },
    {
      title: 'DTaP',
      timing: 'Age: 2 months • Doses: 5',
      description: 'Protection against diphtheria, tetanus, and pertussis',
      priority: 'High',
      status: 'Active'
    },
    {
      title: 'Polio (IPV)',
      timing: 'Age: 2 months • Doses: 4',
      description: 'Inactivated poliovirus vaccine',
      priority: 'High',
      status: 'Active'
    },
    {
      title: 'MMR',
      timing: 'Age: 12 months • Doses: 2',
      description: 'Measles, mumps, and rubella vaccine',
      priority: 'High',
      status: 'Active'
    }
  ];
  
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
    if (showLoader && this.stagesList.length === 0) {
      this.isLoading = true;
    }
    this.errorMessage = '';
    this.api.GetPreventiveCare().subscribe({
      next: (res: any) => {
        if (res?.success && res.data) {
          // 1. Map pregnancy stages from API if present
          if (res.data.pregnancyStages && res.data.pregnancyStages.length > 0) {
            const stages = res.data.pregnancyStages;
            stages.sort((a: any, b: any) => (a.weekStart || 0) - (b.weekStart || 0));
            this.stagesList = stages.map((s: any) => ({
              weekRange: s.weekStart === s.weekEnd ? `Week ${s.weekStart}` : `Week ${s.weekStart}-${s.weekEnd}`,
              trimester: s.trimester === 1 ? 'First Trimester' : s.trimester === 2 ? 'Second Trimester' : 'Third Trimester',
              milestones: s.milestones || '—',
              scans: s.scans || '—',
              status: 'Active'
            }));
          }

          // 2. Map pregnancy vaccines from API if present
          if (res.data.pregnancyVaccines && res.data.pregnancyVaccines.length > 0) {
            const pVaccines = res.data.pregnancyVaccines;
            this.pregnancyVaccines = pVaccines.map((v: any) => ({
              title: v.vaccineName || '—',
              timing: v.recommendedTiming ? `Timing: ${v.recommendedTiming}` : 'Timing: Any trimester',
              description: v.description || '—',
              priority: v.recommendedTiming === 'ANY' ? 'Medium' : 'High',
              status: 'Active'
            }));
          }

          // 3. Map child vaccines from API if present
          if (res.data.childVaccines && res.data.childVaccines.length > 0) {
            const cVaccines = res.data.childVaccines;
            cVaccines.sort((a: any, b: any) => (a.recommendedAgeMonths || 0) - (b.recommendedAgeMonths || 0));
            this.childVaccines = cVaccines.map((v: any) => ({
              title: v.vaccineName + (v.doseNumber ? ` (Dose ${v.doseNumber})` : ''),
              timing: v.recommendedAgeMonths === 0 || v.recommendedAgeMonths === null ? 'Timing: At birth' : `Recommended Age: ${v.recommendedAgeMonths} months`,
              description: v.description || '—',
              priority: 'High',
              status: 'Active'
            }));
          }

          // 4. Update dynamic counts
          if (res.data.stats) {
            this.pregnancyProgramsCount = res.data.stats.pregnancyPrograms ?? 342;
            this.childCareProgramsCount = res.data.stats.childCarePrograms ?? 1234;
            this.vaccinesTrackedCount = res.data.stats.vaccinesTracked ?? (this.pregnancyVaccines.length + this.childVaccines.length);
            this.milestonesLoggedCount = res.data.stats.milestonesLogged ?? 12456;
          } else {
            this.pregnancyProgramsCount = Math.max(342, this.stagesList.length);
            this.vaccinesTrackedCount = Math.max(8945, this.pregnancyVaccines.length + this.childVaccines.length);
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
