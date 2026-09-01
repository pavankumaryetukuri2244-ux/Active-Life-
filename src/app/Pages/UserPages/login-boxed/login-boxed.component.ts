import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { WebapiService } from '../../../services/webapi.service';

@Component({
  selector: 'app-login-boxed',
  templateUrl: './login-boxed.component.html',
  standalone: false,
  
  styles: [`

    /* ============================================================
       LOGIN PAGE
       ============================================================ */

    /* Background: diagonal gradient */
    .login-bg {
      background: linear-gradient(135deg,
        #2563EB  0%,
        #4F46E5 25%,
        #7C3AED 50%,
        #9333EA 75%,
        #C026D3 100%) !important;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: scroll !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 48px 24px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .login-bg::-webkit-scrollbar {
      width: 8px !important;
    }

    .login-bg::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1) !important;
    }

    .login-bg::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.4) !important;
      border-radius: 4px !important;
    }

    .login-bg::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.6) !important;
    }

    /* ---- Brand section above card ---- */
    .brand-section {
      margin-bottom: 28px;
    }

    /* Logo white rounded square: 64×64, radius 18px, white bg, soft shadow */
    .logo-box {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      background: #ffffff;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    /* "HealthFamily" title: Inter 700, 26px, white, letter-spacing -0.4px */
    .brand-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #ffffff !important;
      letter-spacing: -0.4px;
      line-height: 1.2;
      margin: 0 0 4px 0;
    }

    /* "Admin Portal" subtitle: Inter 400, 14px, rgba(255,255,255,0.85) */
    .brand-subtitle {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.4;
      margin: 0;
    }

    /* ---- Login card: white, 440px max, radius 20px, shadow ---- */
    .login-card-custom {
      max-width: 440px;
      width: 100%;
      border-radius: 20px !important;
      background: #ffffff !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18) !important;
      border: none !important;
      padding: 36px 36px 28px 36px !important;
    }

    /* ---- Card header text ---- */
    /* "Welcome back": Inter 700, 22px, #0F172A */
    .login-heading {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #0F172A;
      letter-spacing: -0.3px;
      line-height: 1.25;
      margin: 0 0 4px 0;
    }

    /* "Sign in to your admin account": Inter 400, 13.5px, #64748B */
    .login-subheading {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13.5px;
      font-weight: 400;
      color: #64748B;
      line-height: 1.4;
      margin: 0;
    }

    .login-header-block {
      margin-bottom: 26px;
    }

    /* ---- Field labels: Inter 500, 13px, #334155 ---- */
    .form-label-custom {
      display: block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      color: #334155 !important;
      letter-spacing: 0 !important;
      margin-bottom: 7px !important;
      line-height: 1.4;
    }

    /* Field spacing: 18px between fields */
    .field-group {
      margin-bottom: 18px;
    }

    /* ---- Input fields: 46px height, #F8FAFC bg, radius 10px, 1px border ---- */
    .custom-input-field,
    .was-validated .custom-input-field:valid,
    .was-validated .custom-input-field:valid:focus,
    .form-control.custom-input-field:valid,
    .form-control.custom-input-field.is-valid {
      height: 46px !important;
      background-color: #F8FAFC !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 10px !important;
      padding: 0 16px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      color: #0F172A !important;
      width: 100% !important;
      transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
      line-height: 1;
      background-image: none !important;
    }

    .custom-input-field::placeholder {
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 400 !important;
      color: #9CA3AF !important;
    }

    /* Focus state: white bg, purple border, soft purple ring */
    .custom-input-field:focus,
    .was-validated .custom-input-field:valid:focus {
      background-color: #ffffff !important;
      border-color: #8B5CF6 !important;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.10) !important;
      outline: none !important;
      background-image: none !important;
    }

    /* Padding-right for password field to not overlap toggle icon */
    .custom-input-field.pe-5,
    .was-validated .custom-input-field.pe-5:valid {
      padding-right: 48px !important;
      background-image: none !important;
    }

    /* ---- Password toggle button ---- */
    .password-toggle-btn-custom {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: none;
      z-index: 10;
      padding: 4px;
      color: #9CA3AF;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: color 0.15s ease;
      line-height: 1;
    }

    .password-toggle-btn-custom:hover {
      color: #6B7280;
    }

    /* ---- Remember Me & Forgot Password row ---- */
    .login-bottom-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      font-family: 'Inter', sans-serif;
      font-size: 13.5px;
    }

    /* Checkbox label: Inter 400, 13.5px, #4B5563 */
    .remember-label {
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 400 !important;
      color: #4B5563 !important;
      cursor: pointer;
      user-select: none;
    }

    /* Checkbox: 16×16, radius 4px, #CBD5E1 border, vibrant blue on check */
    .remember-check {
      width: 16px !important;
      height: 16px !important;
      min-width: 16px !important;
      border-radius: 4px !important;
      border: 1.5px solid #CBD5E1 !important;
      cursor: pointer !important;
      margin: 0 !important;
      background-color: #FFFFFF !important;
      accent-color: #2563EB !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.15s ease !important;
      position: relative !important;
    }

    .remember-check:hover {
      border-color: #94A3B8 !important;
    }

    .remember-check:focus {
      border-color: #2563EB !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
      outline: none !important;
    }

    .remember-check:checked,
    .was-validated .remember-check:valid:checked,
    .was-validated .remember-check:checked {
      background-color: #2563EB !important;
      border-color: #2563EB !important;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3E%3Cpath fill-rule='evenodd' d='M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z' clip-rule='evenodd'/%3E%3C/svg%3E") !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      background-size: 11px 11px !important;
    }

    /* "Forgot password?": Inter 600, 13.5px, #3B82F6 */
    .forgot-link-custom {
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 600 !important;
      color: #3B82F6 !important;
      text-decoration: none !important;
      transition: color 0.15s ease;
      letter-spacing: 0;
    }

    .forgot-link-custom:hover {
      color: #1D4ED8 !important;
      text-decoration: none !important;
    }

    /* ---- Sign In button: gradient, 48px, radius 10px, Inter 600, 14.5px ---- */
    .btn-login-custom {
      background: linear-gradient(90deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%) !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 10px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 15px !important;
      font-weight: 600 !important;
      letter-spacing: 0.1px;
      height: 48px !important;
      width: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px;
      cursor: pointer;
      transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.32) !important;
    }

    .btn-login-custom:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 22px rgba(99, 102, 241, 0.42) !important;
    }

    .btn-login-custom:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25) !important;
    }

    .btn-login-custom:disabled {
      opacity: 0.75;
      cursor: not-allowed;
    }

    .btn-login-custom-wrap {
      margin-bottom: 20px;
    }

    /* ---- SSL footer text: Inter 400, 11.5px, #94A3B8 ---- */
    .ssl-text-custom {
      font-family: 'Inter', sans-serif !important;
      font-size: 11.5px !important;
      font-weight: 400 !important;
      color: #94A3B8 !important;
      letter-spacing: 0.1px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    .ssl-footer {
      margin-top: 20px;
    }

    /* ---- Alert feedback blocks ---- */
    .alert-danger-custom {
      background-color: rgba(239, 68, 68, 0.06) !important;
      color: #ef4444 !important;
      border: 1px solid rgba(239, 68, 68, 0.12) !important;
      border-radius: 10px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 0.82rem !important;
      margin-bottom: 18px;
    }

    .alert-success-custom {
      background-color: rgba(16, 185, 129, 0.06) !important;
      color: #10b981 !important;
      border: 1px solid rgba(16, 185, 129, 0.12) !important;
      border-radius: 10px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 0.82rem !important;
      margin-bottom: 18px;
    }

    /* ---- Validation feedback text ---- */
    .invalid-feedback {
      font-family: 'Inter', sans-serif !important;
      font-size: 12px !important;
      color: #ef4444 !important;
      margin-top: 5px !important;
    }

    /* ---- Fade-in animation ---- */
    .animate-fade-in {
      animation: lgFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes lgFadeIn {
      from {
        opacity: 0;
        transform: translateY(-12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ---- Responsive: tighten card padding on small screens ---- */
    @media (max-width: 480px) {
      .login-card-custom .card-body {
        padding: 28px 22px 24px 22px;
      }
      .brand-title {
        font-size: 22px;
      }
    }
  `]
})
export class LoginBoxedComponent implements OnInit {
  Form!: FormGroup;
  submitted = false;
  success = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private webApiService: WebapiService,
    public CF: CommonService
  ) { }

  ngOnInit(): void {
    this.Form = this.fb.group({
      loginid: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.Form.invalid) {
      return;
    }

    this.success = true;
    const requestBody = {
      email: this.Form.value.loginid,
      password: this.Form.value.password
    };

    this.webApiService.LoginAdmin(requestBody).subscribe({
      next: (response: any) => {
        this.success = false;
        if (response && response.success) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('tokenType', response.data.tokenType);
          localStorage.setItem('expiresIn', response.data.expiresIn.toString());
          
          if (response.data.admin) {
            localStorage.setItem('adminProfile', JSON.stringify(response.data.admin));
          }

          this.CF.showAuth = false;
          this.CF.ToastSuccess('Logged in successfully', 'Welcome');

          setTimeout(() => {
            this.router.navigate(['/dashboards/analytics']);
          }, 300);
        } else {
          this.errorMessage = response.message || 'Login failed. Please check your credentials.';
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.success = false;
        console.error('Login error:', error);
        this.errorMessage = error?.error?.message || 'Server error. Please try again later.';
        this.cdr.detectChanges();
      }
    });
  }
}

