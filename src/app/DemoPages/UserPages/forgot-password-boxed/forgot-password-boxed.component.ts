import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-forgot-password-boxed',
  templateUrl: './forgot-password-boxed.component.html',
  standalone: false,
  
  styles: [`
    .login-bg {
      background: linear-gradient(-45deg, #0f172a, #1e1b4b, #311042, #111827);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
    }
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .glass-card {
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
    }
    .text-dark {
      color: #212529 !important;
    }
    .text-secondary {
      color: #495057 !important;
    }
    .text-muted {
      color: #6c757d !important;
    }
    .form-check-label {
      color: #495057 !important;
    }
    .text-shadow {
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    }
    .hover-primary {
      cursor: pointer;
      transition: color 0.15s ease-in-out;
    }
    .hover-primary:hover {
      color: #3f6ad8 !important;
    }
    .hover-underline:hover {
      text-decoration: underline !important;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #3f6ad8, #2a52be);
      border: none;
      transition: all 0.25s ease;
    }
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #2a52be, #1f3d95);
      box-shadow: 0 4px 15px rgba(63, 106, 216, 0.35);
    }
    .btn-primary:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    .py-2-5 {
      padding-top: 0.68rem;
      padding-bottom: 0.68rem;
    }
    .hover-scale {
      transition: all 0.2s ease-in-out;
    }
    .hover-scale:hover:not(:disabled) {
      transform: translateY(-1px);
    }
    .hover-scale:active:not(:disabled) {
      transform: translateY(1px);
    }
  `]
})
export class ForgotPasswordBoxedComponent {

  constructor() { }

  onSubmit() {
    // Handle password recovery form submission
  }

}
