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
    .password-toggle-btn-custom {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: none;
      z-index: 10;
      padding: 0;
      color: #9ca3af;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .password-toggle-btn-custom:hover {
      color: #6b7280;
    }
    .forgot-link-custom {
      color: #3b82f6;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .forgot-link-custom:hover {
      color: #2563eb;
      text-decoration: underline;
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
    .btn-login-custom:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(154, 68, 242, 0.35);
      opacity: 0.95;
    }
    .btn-login-custom:active {
      transform: translateY(1px);
    }
    .ssl-text-custom {
      font-size: 0.72rem;
      color: #9ca3af;
      font-family: 'Inter', sans-serif;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.2px;
    }
    .alert-danger-custom {
      background-color: rgba(239, 68, 68, 0.06);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.1) !important;
      font-size: 0.82rem;
      font-family: 'Inter', sans-serif;
      border-radius: 8px !important;
    }
    .alert-success-custom {
      background-color: rgba(16, 185, 129, 0.06);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.1) !important;
      font-size: 0.82rem;
      font-family: 'Inter', sans-serif;
      border-radius: 8px !important;
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

