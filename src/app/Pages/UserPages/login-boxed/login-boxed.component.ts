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
       LOGIN PAGE - MATCHING FIGMA SPEC
       ============================================================ */

    /* Background: diagonal gradient matching Figma exactly */
    .login-bg {
      background: linear-gradient(135deg,
        #2563EB  0%,
        #4F46E5 26%,
        #7C3AED 52%,
        #9333EA 76%,
        #C026D3 100%) !important;
      min-height: 100vh;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      /* Don't use justify-content:center — that clips top when overflowing */
      justify-content: flex-start;
      padding-top: 56px;
      padding-bottom: 40px;
      padding-left: 16px;
      padding-right: 16px;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* On tall viewports, vertically center the wrapper */
    @media (min-height: 680px) {
      .login-bg {
        justify-content: center;
        padding-top: 40px;
        padding-bottom: 40px;
      }
    }

    .login-wrapper {
      width: 100%;
      max-width: 410px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ---- Brand section above card ---- */
    .brand-section {
      margin-bottom: 24px;
    }

    /* Logo white rounded square: 60×60, radius 16px, white bg, soft shadow */
    .logo-box {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
    }

    /* "HealthFamily" title: Inter 700, 25px, white, letter-spacing -0.3px */
    .brand-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 25px;
      font-weight: 700;
      color: #ffffff !important;
      letter-spacing: -0.3px;
      line-height: 1.2;
      margin: 0 0 2px 0;
    }

    /* "Admin Portal" subtitle: Inter 400, 13.5px, rgba(255,255,255,0.85) */
    .brand-subtitle {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13.5px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.4;
      margin: 0;
    }

    /* ---- Login card: white, 410px max, radius 20px, shadow ---- */
    .login-card-custom {
      max-width: 410px;
      width: 100%;
      border-radius: 20px !important;
      background: #ffffff !important;
      box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.18) !important;
      border: none !important;
      padding: 34px 34px 26px 34px !important;
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

    /* "Sign in to your admin account": Inter 400, 13px, #64748B */
    .login-subheading {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      font-weight: 400;
      color: #64748B;
      line-height: 1.4;
      margin: 0;
    }

    .login-header-block {
      margin-bottom: 22px;
    }

    /* ---- Field labels: Inter 500, 13px, #334155 ---- */
    .form-label-custom {
      display: block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      color: #334155 !important;
      letter-spacing: 0 !important;
      margin-bottom: 6px !important;
      line-height: 1.4;
    }

    /* Field spacing: 16px between fields */
    .field-group {
      margin-bottom: 16px;
    }

    /* ---- Input fields: 44px height, #F8FAFC bg, radius 10px, subtle border ---- */
    .custom-input-field,
    .was-validated .custom-input-field:valid,
    .was-validated .custom-input-field:valid:focus,
    .form-control.custom-input-field:valid,
    .form-control.custom-input-field.is-valid {
      height: 44px !important;
      background-color: #F8FAFC !important;
      border: 1px solid #F1F5F9 !important;
      border-radius: 10px !important;
      padding: 0 14px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 400 !important;
      color: #0F172A !important;
      width: 100% !important;
      transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
      line-height: 1;
      background-image: none !important;
    }

    .custom-input-field::placeholder {
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      font-weight: 400 !important;
      color: #9CA3AF !important;
    }

    /* Focus state: white bg, subtle indigo ring */
    .custom-input-field:focus,
    .was-validated .custom-input-field:valid:focus {
      background-color: #ffffff !important;
      border-color: #6366F1 !important;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12) !important;
      outline: none !important;
      background-image: none !important;
    }

    /* Padding-right for password field to not overlap toggle icon */
    .custom-input-field.pe-5,
    .was-validated .custom-input-field.pe-5:valid {
      padding-right: 42px !important;
      background-image: none !important;
    }

    /* ---- Password toggle button ---- */
    .password-toggle-btn-custom {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: none;
      z-index: 10;
      padding: 4px;
      color: #94A3B8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: color 0.15s ease;
      line-height: 1;
    }

    .password-toggle-btn-custom:hover {
      color: #64748B;
    }

    /* ---- Remember Me & Forgot Password row ---- */
    .login-bottom-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 18px;
      margin-bottom: 20px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
    }

    /* Checkbox label: Inter 400, 13px, #475569 */
    .remember-label {
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      font-weight: 400 !important;
      color: #475569 !important;
      cursor: pointer;
      user-select: none;
    }

    /* Checkbox: 15×15, radius 4px, #CBD5E1 border, vibrant blue on check */
    .remember-check {
      width: 15px !important;
      height: 15px !important;
      min-width: 15px !important;
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
      background-size: 10px 10px !important;
    }

    /* "Forgot password?": Inter 600, 13px, #2563EB */
    .forgot-link-custom {
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #2563EB !important;
      text-decoration: none !important;
      transition: color 0.15s ease;
      letter-spacing: 0;
    }

    .forgot-link-custom:hover {
      color: #1D4ED8 !important;
      text-decoration: none !important;
    }

    /* ---- Sign In button: vibrant gradient matching Figma, 44px height, radius 10px ---- */
    .btn-login-custom {
      background: linear-gradient(90deg, #3B82F6 0%, #6366F1 50%, #7C3AED 100%) !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 10px !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14.5px !important;
      font-weight: 600 !important;
      letter-spacing: 0.1px;
      height: 44px !important;
      width: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px;
      cursor: pointer;
      transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35) !important;
    }

    .btn-login-custom:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45) !important;
    }

    .btn-login-custom:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25) !important;
    }

    .btn-login-custom:disabled {
      opacity: 0.75;
      cursor: not-allowed;
    }

    .btn-login-custom-wrap {
      margin-bottom: 0;
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
      margin-top: 18px;
    }

    /* ---- Demo credentials footer below card ---- */
    .demo-credentials {
      margin-top: 20px;
      font-family: 'Inter', sans-serif !important;
      font-size: 12px !important;
      font-weight: 400 !important;
      color: rgba(255, 255, 255, 0.65) !important;
      letter-spacing: 0.1px;
    }

    /* ---- Alert feedback blocks matching Figma ---- */
    .alert-box-error {
      background-color: #FEF2F2 !important;
      color: #EF4444 !important;
      border: 1px solid #FEE2E2 !important;
      border-radius: 8px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 12.5px !important;
      font-weight: 400 !important;
      padding: 9px 14px !important;
      margin-bottom: 18px !important;
      text-align: center !important;
      line-height: 1.4 !important;
    }

    .alert-box-success {
      background-color: #F0FDF4 !important;
      color: #16A34A !important;
      border: 1px solid #DCFCE7 !important;
      border-radius: 8px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 12.5px !important;
      font-weight: 400 !important;
      padding: 9px 14px !important;
      margin-bottom: 18px !important;
      text-align: center !important;
      line-height: 1.4 !important;
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

