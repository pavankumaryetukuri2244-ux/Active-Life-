import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeOptions } from '../../../../../theme-options';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  
  standalone: false,
  styles: [`
    .font-poppins {
      font-family: 'Poppins', sans-serif !important;
    }
    .btn-profile-trigger {
      background: transparent;
      border: none;
      box-shadow: none !important;
      border-radius: 12px;
      transition: all 0.2s ease-in-out;
    }
    .btn-profile-trigger:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
    .avatar-wrapper {
      width: 40px;
      height: 40px;
    }
    .profile-img {
      object-fit: cover;
      border: 2px solid rgba(0, 0, 0, 0.05);
    }
    .status-indicator {
      width: 12px;
      height: 12px;
      z-index: 2;
    }
    .status-online {
      background-color: #10b981;
    }
    .user-info {
      line-height: 1.2;
    }
    .info-name {
      font-family: 'Poppins', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      color: #1e293b;
    }
    .info-role {
      font-family: 'Poppins', sans-serif;
      font-size: 0.72rem;
      color: #64748b !important;
    }
    .chevron-icon {
      transition: transform 0.2s ease;
    }
    .btn-profile-trigger[aria-expanded="true"] .chevron-icon {
      transform: rotate(180deg);
    }
    .dropdown-menu-custom {
      min-width: 240px;
      border-radius: 16px !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
      animation: dropdownFadeIn 0.2s ease-out forwards;
    }
    .profile-dropdown-header {
      background-color: #f8fafc;
    }
    .p-2-5 {
      padding: 0.65rem 0.85rem !important;
    }
    .me-2-5 {
      margin-right: 0.65rem !important;
    }
    .logout-item {
      background: transparent;
      border: none;
      color: #334155;
      font-weight: 500;
      font-size: 0.88rem;
      transition: all 0.2s ease;
    }
    .logout-item:hover {
      background-color: #fef2f2 !important;
      color: #ef4444 !important;
    }
    .logout-item:hover .arrow-right {
      transform: translateX(3px);
      color: #ef4444 !important;
      opacity: 1 !important;
    }
    .logout-item .arrow-right {
      transition: all 0.2s ease;
    }
    @keyframes dropdownFadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class UserBoxComponent {
  constructor(
    public globals: ThemeOptions,
    private router: Router
  ) { }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/pages/login-boxed']);
  }
}
