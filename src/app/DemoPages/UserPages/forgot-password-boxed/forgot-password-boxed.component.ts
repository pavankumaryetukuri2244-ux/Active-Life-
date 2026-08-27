import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-forgot-password-boxed',
  templateUrl: './forgot-password-boxed.component.html',
  standalone: false,
  
  styles: [`
    .login-bg {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%) !important;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }
    .login-card-custom {
      max-width: 420px;
      width: 100%;
    }
    .back-link-custom {
      color: #6b7280;
      font-weight: 600;
      text-decoration: none;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      transition: color 0.15s ease;
      display: inline-flex;
      align-items: center;
    }
    .back-link-custom:hover {
      color: #374151;
    }
    .form-label-custom {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 6px;
      font-family: 'Inter', sans-serif;
    }
    .custom-input-field {
      background-color: #f9fafb !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 8px !important;
      padding: 0.75rem 1rem !important;
      font-size: 0.9rem;
      color: #1f2937 !important;
      font-family: 'Inter', sans-serif;
      transition: all 0.2s ease;
      height: 44px;
      width: 100%;
    }
    .custom-input-field::placeholder {
      color: #9ca3af;
      font-size: 0.85rem;
    }
    .custom-input-field:focus {
      background-color: #ffffff !important;
      border-color: #8b5cf6 !important;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15) !important;
    }
    .btn-login-custom {
      background: linear-gradient(135deg, #446ef2 0%, #9a44f2 100%) !important;
      color: #ffffff !important;
      border: none !important;
      font-size: 0.92rem;
      border-radius: 8px !important;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      height: 45px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(154, 68, 242, 0.25);
    }
    .btn-login-custom:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(154, 68, 242, 0.35);
      opacity: 0.95;
    }
    .btn-login-custom:active:not(:disabled) {
      transform: translateY(1px);
    }
    .btn-login-custom:disabled {
      background: #e5e7eb !important;
      color: #9ca3af !important;
      box-shadow: none !important;
      cursor: not-allowed;
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ForgotPasswordBoxedComponent {

  constructor() { }

  onSubmit() {
    // Handle password recovery form submission
  }

}
