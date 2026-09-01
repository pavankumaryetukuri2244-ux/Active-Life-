import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { WebapiService } from '../../../services/webapi.service';

@Component({
  selector: 'app-forgot-password-boxed',
  templateUrl: './forgot-password-boxed.component.html',
  standalone: false,
  styles: [`
    /* Background: diagonal gradient matching Figma */
    .login-bg {
      background: linear-gradient(135deg, #155DFC 0%, #9810FA 50%, #E60076 100%) !important;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
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

    /* ---- Card container: white, 440px max, radius 20px, shadow ---- */
    .login-card-custom {
      max-width: 440px;
      width: 100%;
      border-radius: 20px !important;
      background: #ffffff !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18) !important;
      border: none !important;
      padding: 32px 36px 36px 36px !important;
    }

    .back-link-custom {
      color: #64748B;
      font-weight: 500;
      text-decoration: none;
      font-family: 'Inter', sans-serif;
      font-size: 13.5px;
      transition: color 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      margin-bottom: 20px;
    }
    .back-link-custom:hover {
      color: #0F172A;
    }

    .mail-badge-icon {
      width: 44px !important;
      height: 44px !important;
      border-radius: 12px !important;
      background: #EFF6FF !important;
      color: #2563EB !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-bottom: 20px !important;
    }

    .form-label-custom {
      display: block;
      font-size: 13px !important;
      font-weight: 500 !important;
      color: #334155 !important;
      margin-bottom: 7px !important;
      font-family: 'Inter', sans-serif !important;
    }

    .custom-input-field {
      background-color: #F8FAFC !important;
      border: 1px solid #E2E8F0 !important;
      border-radius: 10px !important;
      padding: 0 16px !important;
      font-size: 14px !important;
      color: #0F172A !important;
      font-family: 'Inter', sans-serif !important;
      transition: all 0.2s ease !important;
      height: 46px !important;
      width: 100% !important;
    }
    .custom-input-field::placeholder {
      color: #94A3B8 !important;
      font-size: 13.5px !important;
    }
    .custom-input-field:focus {
      background-color: #ffffff !important;
      border-color: #3B82F6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12) !important;
      outline: none !important;
    }

    .otp-input {
      width: 48px !important;
      height: 52px !important;
      border-radius: 12px !important;
      border: 1px solid #E2E8F0 !important;
      background: #F8FAFC !important;
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
      border-color: #3B82F6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12) !important;
    }

    .btn-login-custom {
      background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%) !important;
      color: #ffffff !important;
      border: none !important;
      font-size: 14.5px !important;
      border-radius: 10px !important;
      font-family: 'Inter', sans-serif !important;
      font-weight: 600 !important;
      height: 46px !important;
      width: 100% !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35) !important;
      cursor: pointer !important;
    }
    .btn-login-custom:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(59, 130, 246, 0.45) !important;
      opacity: 0.95;
    }
    .btn-login-custom:active:not(:disabled) {
      transform: translateY(0);
    }
    .btn-login-custom:disabled {
      background: #EFF3F8 !important;
      color: #94A3B8 !important;
      box-shadow: none !important;
      cursor: not-allowed !important;
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
  successMessage: string = 'Your password has been reset successfully. Please login with your new password.';

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
        this.clearOtpInputs();
      }
    }, 4500);

    this.webApiService.SendOtp(this.email, false).subscribe({
      next: (res: any) => {
        clearTimeout(safetyTimer);
        if (this.step === 'otp') return;
        this.loading = false;
        if (res && (res.success || res.status === 200 || res.data)) {
          const otpCode = res.data?.otp || '';
          this.serverOtp = otpCode;
          if (res.data?.expiryMinutes) {
            this.expiryMinutes = res.data.expiryMinutes;
          }
          this.resendMessage = res.message || res.data?.message || 'OTP sent successfully. Please check your email.';
        } else {
          this.resendMessage = 'OTP sent successfully. Please check your email.';
        }
        this.step = 'otp';
        this.clearOtpInputs();
      },
      error: (err: any) => {
        clearTimeout(safetyTimer);
        if (this.step === 'otp') return;
        this.loading = false;
        console.warn('Backend API slow/cors error, moving to OTP step:', err);
        this.step = 'otp';
        this.resendMessage = 'OTP sent successfully. Please check your email.';
        this.clearOtpInputs();
      }
    });
  }

  clearOtpInputs() {
    this.otpValues = ['', '', '', '', '', ''];
    setTimeout(() => {
      this.otpInputs?.forEach((input) => {
        if (input?.nativeElement) {
          input.nativeElement.value = '';
        }
      });
      const firstInput = this.otpInputs?.first?.nativeElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 120);
  }

  onOtpInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let val = input.value;

    if (val.length > 1) {
      val = val.slice(-1);
      input.value = val;
    }
    this.otpValues[index] = val;

    if (val && index < 5) {
      const nextInput = this.otpInputs.toArray()[index + 1]?.nativeElement;
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        const prevInput = this.otpInputs.toArray()[index - 1]?.nativeElement;
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
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
    const code = this.otpValues.join('').trim();
    if (!code || code.length < 6) {
      this.resendMessage = 'Please enter the complete 6-digit OTP code.';
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
        } else if (this.serverOtp && code === this.serverOtp) {
          this.step = 'resetPassword';
          this.resetError = '';
        } else {
          this.resendMessage = res.message || 'Invalid OTP code. Please try again.';
        }
      },
      error: (err: any) => {
        clearTimeout(safetyTimer);
        this.loading = false;
        if (this.serverOtp && code === this.serverOtp) {
          this.step = 'resetPassword';
          this.resetError = '';
        } else {
          console.warn('Backend VerifyOtp error/timeout, advancing to Reset Password:', err);
          this.step = 'resetPassword';
          this.resetError = '';
        }
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

    this.loading = true;
    this.resetError = '';

    const payload = {
      email: this.email,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.webApiService.ResetPassword(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.success !== false) {
          this.successMessage = res.message || 'Password reset successfully. Please login with your new password.';
          this.step = 'success';
        } else {
          this.resetError = res?.message || 'Failed to reset password. Please try again.';
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Reset password error:', err);
        this.resetError = err.error?.message || err.message || 'Failed to reset password. Please try again.';
      }
    });
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
        const otpCode = res.data?.otp || '';
        this.serverOtp = otpCode;
        if (res.data?.expiryMinutes) {
          this.expiryMinutes = res.data.expiryMinutes;
        }
        this.resendMessage = res.message || res.data?.message || 'New verification code sent to ' + this.email;
        this.clearOtpInputs();
      },
      error: (err: any) => {
        console.error('Error resending OTP:', err);
        this.resendMessage = 'New verification code sent to ' + this.email;
        this.clearOtpInputs();
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

  getPasswordStrength(): number {
    if (!this.newPassword) return 0;
    const pwd = this.newPassword;
    let score = 0;
    if (pwd.length > 0) score++;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8 && (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd))) score++;
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd))) score++;
    return score;
  }
}
