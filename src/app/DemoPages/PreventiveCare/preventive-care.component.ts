import { Component, OnInit } from '@angular/core';

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
  
  stagesList: Stage[] = [
    { weekRange: 'Week 1-4', trimester: 'First Trimester', milestones: 'Conception, Implantation', scans: 'None', status: 'Active' },
    { weekRange: 'Week 5-8', trimester: 'First Trimester', milestones: 'Heartbeat Detection, Embryo Development', scans: 'Early Ultrasound', status: 'Active' },
    { weekRange: 'Week 9-12', trimester: 'First Trimester', milestones: 'Major Organs Form, First Prenatal Visit', scans: 'NT Scan', status: 'Active' },
    { weekRange: 'Week 13-16', trimester: 'Second Trimester', milestones: 'Gender Detection Possible, Quickening', scans: 'None', status: 'Active' }
  ];

  pregnancyVaccines: Vaccine[] = [
    { title: 'Tdap Vaccine', timing: 'Timing: 27-36 weeks', description: 'Protects against tetanus, diphtheria, and pertussis', priority: 'High', status: 'Active' },
    { title: 'Flu Vaccine', timing: 'Timing: Any trimester', description: 'Annual flu shot recommended during pregnancy', priority: 'High', status: 'Active' },
    { title: 'COVID-19 Vaccine', timing: 'Timing: Any trimester', description: 'Recommended for pregnant women', priority: 'Medium', status: 'Active' }
  ];

  childVaccines: Vaccine[] = [
    { title: 'BCG Vaccine', timing: 'Timing: At birth', description: 'Protects against tuberculosis', priority: 'High', status: 'Active' },
    { title: 'Hepatitis B Vaccine', timing: 'Timing: At birth, 1-2 months, 6-18 months', description: 'Protects against Hepatitis B virus', priority: 'High', status: 'Active' },
    { title: 'Polio Vaccine (IPV)', timing: 'Timing: 2 months, 4 months, 6-18 months', description: 'Protects against poliovirus infection', priority: 'High', status: 'Active' }
  ];

  activeTab: 'Pregnancy Care' | 'Pregnancy Vaccines' | 'Child Vaccines' = 'Pregnancy Care';

  ngOnInit() {}

  setTab(tab: 'Pregnancy Care' | 'Pregnancy Vaccines' | 'Child Vaccines') {
    this.activeTab = tab;
  }
}
