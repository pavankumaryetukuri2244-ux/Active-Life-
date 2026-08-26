import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-login-boxed',
  templateUrl: './login-boxed.component.html',
  standalone: false,
  
  styles: [`
    .login-bg {
      background-size: cover !important;
      background-position: center !important;
      position: relative;
      height: 100vh;
      width: 100vw;
    }
    .login-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.45);
      z-index: 1;
    }
    .z-index-2 {
      z-index: 2;
    }
    .login-card {
      background-color: #fcfcfc !important;
      border-radius: 28px !important;
      box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.25) !important;
      max-width: 370px;
      width: 100%;
      margin-left: auto;
    }
    .logo-container {
      margin-bottom: 2rem;
    }
    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 2.2rem;
      text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .text-priority {
      color: #f06449 !important;
    }
    .text-pulse {
      color: #4caee3 !important;
    }
    .login-title {
      color: #515c92;
      font-family: 'Outfit', sans-serif;
      font-size: 1.7rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .custom-input {
      background-color: #f3f4f6 !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 12px !important;
      padding: 0.9rem 1.1rem !important;
      font-size: 0.95rem;
      color: #1f2937 !important;
      font-family: 'Poppins', sans-serif;
      transition: all 0.2s ease;
    }
    .custom-input::placeholder {
      color: #9ca3af;
      font-size: 0.9rem;
    }
    .custom-input:focus {
      background-color: #ffffff !important;
      border-color: #6366f1 !important;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
    }
    .custom-input.is-invalid {
      border-color: #f87171 !important;
    }
    .password-toggle-btn {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: none;
      z-index: 10;
      padding: 0;
      color: #6b7280;
      font-size: 1.1rem;
    }
    .btn-login, .btn-forgot {
      background-color: #5d6edc !important;
      color: #ffffff !important;
      border: none !important;
      letter-spacing: 1.5px;
      font-size: 0.85rem;
      border-radius: 12px !important;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 4px 10px rgba(93, 110, 220, 0.2);
    }
    .btn-login:hover, .btn-forgot:hover {
      background-color: #4b5bc5 !important;
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(93, 110, 220, 0.3);
    }
    .btn-login:active, .btn-forgot:active {
      transform: translateY(1px);
    }
    .btn-login:disabled {
      background-color: #a5b1e8 !important;
      box-shadow: none;
      cursor: not-allowed;
    }
    .uppercase-text {
      text-transform: uppercase;
    }
    .alert-danger-custom {
      background-color: rgba(239, 68, 68, 0.08);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.15) !important;
      font-size: 0.85rem;
    }
    .alert-success-custom {
      background-color: rgba(16, 185, 129, 0.08);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.15) !important;
      font-size: 0.85rem;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
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
    if (!this.Form.invalid) {
      this.success = true;
      const user = this.Form.value;
      setTimeout(() => {
        this.CF.showAuth = this.submitted = this.success = false;        
        this.CF.ToastSuccess('Successful', 'Login');
        this.Form.reset();
        localStorage.setItem('isLoggedIn', 'true'); // Keep isLoggedIn local storage for auth guard
        this.CF.GotoURLParam('/customer_sales');
        this.CF.SetLS$(this.CF.Token, JSON.stringify(this.CF.Encrypt(user, this.CF.Token)));
        this.cdr.detectChanges();
      }, 500);
    }
  }
}

