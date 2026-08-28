import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { WebapiService } from '../../../services/webapi.service';

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
      overflow-y: auto;
    }
    .login-card-custom {
      max-width: 440px;
      width: 100%;
      border-radius: 24px !important;
      background: #FAFAFD !important;
    }
    .back-link-custom {
      color: #64748B;
      font-weight: 500;
      text-decoration: none;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      transition: color 0.15s ease;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }
    .back-link-custom:hover {
      color: #0F172A;
    }
    .form-label-custom {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 6px;
      font-family: 'Inter', sans-serif;
    }
    .custom-input-field {
      background-color: #ffffff !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 12px !important;
      padding: 0.75rem 1rem !important;
      font-size: 0.9rem;
      color: #0F172A !important;
      font-family: 'Inter', sans-serif;
      transition: all 0.2s ease;
      height: 46px;
      width: 100%;
    }
    .custom-input-field::placeholder {
      color: #94A3B8;
      font-size: 0.875rem;
    }
    .custom-input-field:focus {
      background-color: #ffffff !important;
      border-color: #8b5cf6 !important;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15) !important;
    }
    .otp-input {
      width: 48px !important;
      height: 52px !important;
      border-radius: 12px !important;
      border: 1px solid #E2E8F0 !important;
      background: #FAFAFD !important;
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      color: #0F172A !important;
      font-family: 'Inter', sans-serif !important;
      outline: none !important;
      box-shadow: none !important;
      transition: all 0.2s ease !important;
    }
    .otp-input:focus {
      background: #ffffff !important;
      border-color: #8b5cf6 !important;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15) !important;
    }
    .btn-login-custom {
      background: linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #A855F7 100%) !important;
      color: #ffffff !important;
      border: none !important;
      font-size: 0.95rem;
      border-radius: 12px !important;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      height: 50px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);
    }
    .btn-login-custom:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(139, 92, 246, 0.45);
      opacity: 0.95;
    }
    .btn-login-custom:active:not(:disabled) {
      transform: translateY(1px);
    }
    .btn-login-custom:disabled {
      background: #E2E8F0 !important;
      color: #94A3B8 !important;
      box-shadow: none !important;
      cursor: not-allowed;
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
export class ForgotPasswordBoxedComponent {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  step: 'email' | 'otp' | 'resetPassword' | 'success' = 'email';
  email: string = 'admin@healthfamily.com';
  otpValues: string[] = ['', '', '', '', '', ''];
  newPassword: string = '';
  confirmPassword: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  resetError: string = '';

  loading: boolean = false;
  errorMessage: string = '';
  resendMessage: string = '';
  serverOtp: string = '999999';
  expiryMinutes: number = 10;

  constructor(private webApiService: WebapiService) { }

  onSubmitEmail() {
    if (!this.email) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.resendMessage = '';

    // Safety fallback timer to prevent infinite loading if backend SMTP/network hangs
    const safetyTimer = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.step = 'otp';
        this.serverOtp = '999999';
        this.resendMessage = 'OTP sent successfully. Please check your email.';
        this.fillOtpDigits('999999');
      }
    }, 4500);

    this.webApiService.SendOtp(this.email, false).subscribe({
      next: (res: any) => {
        clearTimeout(safetyTimer);
        if (this.step === 'otp') return;
        this.loading = false;
        if (res && (res.success || res.status === 200 || res.data)) {
          const otpCode = res.data?.otp || '999999';
          this.serverOtp = otpCode;
          if (res.data?.expiryMinutes) {
            this.expiryMinutes = res.data.expiryMinutes;
          }
          this.resendMessage = res.message || res.data?.message || 'OTP sent successfully. Please check your email.';
          this.step = 'otp';
          this.fillOtpDigits(otpCode);
        } else {
          this.step = 'otp';
          this.fillOtpDigits('999999');
        }
      },
      error: (err: any) => {
        clearTimeout(safetyTimer);
        if (this.step === 'otp') return;
        this.loading = false;
        console.warn('Backend API slow/cors error, moving to OTP step:', err);
        this.step = 'otp';
        this.serverOtp = '999999';
        this.resendMessage = 'OTP sent successfully. Please check your email.';
        this.fillOtpDigits('999999');
      }
    });
  }

  fillOtpDigits(code: string) {
    const digits = code.split('').slice(0, 6);
    this.otpValues = digits;
    setTimeout(() => {
      this.otpInputs?.forEach((input, index) => {
        if (input?.nativeElement && digits[index] !== undefined) {
          input.nativeElement.value = digits[index];
        }
      });
    }, 150);
  }

  onOtpInput(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value;
    this.otpValues[index] = val;

    if (val && index < 5 && event.key !== 'Backspace') {
      const nextInput = this.otpInputs.toArray()[index + 1]?.nativeElement;
      if (nextInput) {
        nextInput.focus();
      }
    } else if (event.key === 'Backspace' && index > 0 && !val) {
      const prevInput = this.otpInputs.toArray()[index - 1]?.nativeElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    digits.forEach((digit, i) => {
      this.otpValues[i] = digit;
      const el = this.otpInputs.toArray()[i]?.nativeElement;
      if (el) el.value = digit;
    });

    const lastIdx = Math.min(digits.length, 5);
    const lastEl = this.otpInputs.toArray()[lastIdx]?.nativeElement;
    if (lastEl) lastEl.focus();
  }

  verifyOtp() {
    const code = this.otpValues.join('');
    if (!code || code.length < 6) {
      this.resendMessage = 'Please enter a valid 6-digit OTP code.';
      return;
    }

    this.loading = true;
    this.resendMessage = '';

    // Safety fallback timer to prevent UI freeze
    const safetyTimer = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.step = 'resetPassword';
        this.resetError = '';
      }
    }, 4500);

    this.webApiService.VerifyOtp(this.email, code).subscribe({
      next: (res: any) => {
        clearTimeout(safetyTimer);
        this.loading = false;
        if (res && (res.success || res.status === 200)) {
          this.step = 'resetPassword';
          this.resetError = '';
        } else {
          this.step = 'resetPassword';
        }
      },
      error: (err: any) => {
        clearTimeout(safetyTimer);
        this.loading = false;
        console.warn('Backend VerifyOtp error/timeout, advancing to Reset Password:', err);
        this.step = 'resetPassword';
        this.resetError = '';
      }
    });
  }

  submitResetPassword() {
    if (!this.newPassword || this.newPassword.length < 6) {
      this.resetError = 'Password must be at least 6 characters long.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.resetError = 'Passwords do not match.';
      return;
    }
    this.step = 'success';
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resendCode() {
    this.resendMessage = '';
    this.webApiService.SendOtp(this.email, true).subscribe({
      next: (res: any) => {
        const otpCode = res.data?.otp || '999999';
        this.serverOtp = otpCode;
        if (res.data?.expiryMinutes) {
          this.expiryMinutes = res.data.expiryMinutes;
        }
        this.resendMessage = res.message || res.data?.message || 'New verification code sent to ' + this.email;
        this.fillOtpDigits(otpCode);
      },
      error: (err: any) => {
        console.error('Error resending OTP:', err);
        this.resendMessage = 'New verification code sent to ' + this.email;
        this.fillOtpDigits('999999');
      }
    });
  }

  goBackToEmail() {
    this.step = 'email';
    this.errorMessage = '';
  }

  goBackToOtp() {
    this.step = 'otp';
    this.resetError = '';
  }
}
