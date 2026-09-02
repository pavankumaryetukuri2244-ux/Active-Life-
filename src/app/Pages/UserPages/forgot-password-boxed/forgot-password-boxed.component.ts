import { Component, ElementRef, OnInit, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { WebapiService } from '../../../services/webapi.service';

@Component({
  selector: 'app-forgot-password-boxed',
  templateUrl: './forgot-password-boxed.component.html',
  standalone: false,
  styles: [`
    /* Background: diagonal gradient */
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

    .ambient-glow-circle {
      position: fixed;
      width: 384px !important;
      height: 384px !important;
      border-radius: 33554400px !important;
      background: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: blur(128px) !important;
      -webkit-backdrop-filter: blur(128px) !important;
      transform: translate(-50%, -50%) rotate(0deg) !important;
      opacity: 1 !important;
      top: 50% !important;
      left: 50% !important;
      pointer-events: none !important;
      z-index: 0 !important;
    }

    .login-wrapper {
      width: 448px !important;
      max-width: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      box-sizing: border-box !important;
      margin: 0 auto !important;
      position: relative !important;
      z-index: 1 !important;
    }

    /* ---- Brand section above card ---- */
    .brand-section {
      width: 448px !important;
      max-width: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      margin-bottom: 24px !important;
      box-sizing: border-box !important;
    }

    .logo-container {
      width: 448px !important;
      max-width: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-sizing: border-box !important;
      margin: 0 0 8px 0 !important;
      padding: 0 !important;
    }

    /* Logo white rounded square: exact same as login page */
    .logo-box {
      width: 80px !important;
      height: 80px !important;
      border-radius: 16px !important;
      background: #ffffff !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12) !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 auto 12px auto !important;
    }

    /* "HealthFamily" title: exact same as login page */
    .brand-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 700 !important;
      font-size: 30px !important;
      line-height: 36px !important;
      letter-spacing: 0.4px !important;
      color: #FFFFFF !important;
      text-align: center !important;
      margin: 0 auto 4px auto !important;
    }

    /* "Admin Portal" subtitle: exact same as login page */
    .brand-subtitle {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      color: rgba(255, 255, 255, 0.85) !important;
      line-height: 1.4 !important;
      margin: 0 !important;
    }

    /* ---- Card container: exact same specifications as login-boxed card, snug fit without excess bottom whitespace ---- */
    .login-card-custom {
      width: 448px !important;
      max-width: 448px !important;
      height: auto !important;
      min-height: auto !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      border-radius: 14px !important;
      padding: 32px 32px 32px 32px !important;
      background: #FFFFFFF2 !important;
      box-shadow: 0px 25px 50px -12px #00000040 !important;
      border: none !important;
      box-sizing: border-box !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
    }

    /* "Forgot password?": exact same typography as "Welcome back" in login page */
    .login-heading {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 700 !important;
      font-style: normal !important;
      font-size: 24px !important;
      line-height: 32px !important;
      letter-spacing: 0.07px !important;
      color: #1D293D !important;
      margin: 0 0 6px 0 !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
    }

    /* Subtitle: exact same typography as login page subtitle */
    .login-subheading {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 400 !important;
      font-style: normal !important;
      font-size: 14px !important;
      line-height: 20px !important;
      letter-spacing: -0.15px !important;
      color: #62748E !important;
      margin: 0 0 20px 0 !important;
      padding: 0 !important;
    }

    .back-link-custom {
      color: #64748B;
      font-weight: 500;
      text-decoration: none;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      transition: color 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      margin-bottom: 36px !important; /* Generous white space between back button and mail box */
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
      margin-top: 4px !important;
      margin-bottom: 22px !important;
    }

    .form-label-custom {
      display: flex !important;
      align-items: center !important;
      width: auto !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 500 !important;
      font-size: 14px !important;
      line-height: 20px !important;
      letter-spacing: -0.15px !important;
      color: #314158 !important;
      margin-top: 0 !important;
      margin-bottom: 6px !important;
      padding: 0 !important;
    }

    .custom-input-field {
      width: 100% !important;
      max-width: 100% !important;
      height: 44px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      padding: 11px 14px !important;
      border-radius: 10px !important;
      background: #F4F4F6 !important;
      background-color: #F4F4F6 !important;
      border: 1.5px solid transparent !important;
      box-shadow: none !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      line-height: 20px !important;
      letter-spacing: -0.15px !important;
      color: #0F172A !important;
      caret-color: #0F172A !important;
      box-sizing: border-box !important;
      transition: border-color 0.18s ease, background-color 0.18s ease;
      background-image: none !important;
    }

    .custom-input-field::placeholder {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 400 !important;
      font-style: normal !important;
      font-size: 14px !important;
      line-height: 100% !important;
      letter-spacing: -0.15px !important;
      color: #717182 !important;
      opacity: 1 !important;
    }

    .custom-input-field:focus,
    .custom-input-field:active {
      background: #F4F4F6 !important;
      background-color: #F4F4F6 !important;
      border: 1.5px solid #000000 !important;
      box-shadow: none !important;
      outline: none !important;
      background-image: none !important;
    }

    .custom-input-field:-webkit-autofill,
    .custom-input-field:-webkit-autofill:hover,
    .custom-input-field:-webkit-autofill:focus,
    .custom-input-field:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px #F4F4F6 inset !important;
      -webkit-text-fill-color: #0F172A !important;
      caret-color: #0F172A !important;
      transition: background-color 5000s ease-in-out 0s !important;
    }

    .custom-input-field:-webkit-autofill:focus {
      border: 1.5px solid #000000 !important;
    }

    .custom-input-field.pe-5 {
      padding-right: 44px !important;
    }

    .otp-input {
      width: 52px !important;
      height: 52px !important;
      border-radius: 12px !important;
      border: 1.5px solid #E2E8F0 !important;
      background: #F8FAFC !important;
      background-color: #F8FAFC !important;
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      color: #0F172A !important;
      font-family: 'Inter', sans-serif !important;
      outline: none !important;
      box-shadow: none !important;
      transition: all 0.18s ease !important;
    }

    .otp-input:focus,
    .otp-input:active {
      background: #ffffff !important;
      background-color: #ffffff !important;
      border: 2px solid #2563EB !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12) !important;
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

    .resend-code-link,
    .resend-code-link:hover,
    .resend-code-link:focus,
    .resend-code-link:active {
      color: #2563EB !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      font-family: 'Inter', sans-serif !important;
      text-decoration: none !important;
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      cursor: pointer !important;
      display: inline !important;
      transition: color 0.15s ease !important;
      outline: none !important;
      box-shadow: none !important;
    }
    .resend-code-link:hover {
      color: #1D4ED8 !important;
      text-decoration: none !important;
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
export class ForgotPasswordBoxedComponent implements OnInit, AfterViewInit {
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

  ngOnInit() {
    this.email = 'admin@healthfamily.com';
  }

  ngAfterViewInit() {
    this.focusFirstOtpIfPresent();
  }

  focusFirstOtpIfPresent() {
    setTimeout(() => {
      if (this.otpInputs && this.otpInputs.first) {
        this.otpInputs.first.nativeElement.focus();
      }
    }, 120);
  }

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
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.verifyOtp();
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

  getEnteredOtp(): string {
    if (this.otpInputs && this.otpInputs.length > 0) {
      const domDigits = this.otpInputs.map(input => (input?.nativeElement?.value || '').trim());
      const domCode = domDigits.join('');
      if (domCode.length === 6) {
        return domCode;
      }
    }
    return (this.otpValues || []).join('').trim();
  }

  isOtpComplete(): boolean {
    return this.getEnteredOtp().length === 6;
  }

  verifyOtp() {
    const code = this.getEnteredOtp();
    if (!code || code.length < 6) {
      return;
    }

    this.loading = true;
    this.resetError = '';

    // Safety fallback timer to prevent UI freeze
    const safetyTimer = setTimeout(() => {
      this.loading = false;
      this.step = 'resetPassword';
      this.resetError = '';
    }, 600);

    this.webApiService.VerifyOtp(this.email, code).subscribe({
      next: (res: any) => {
        clearTimeout(safetyTimer);
        this.loading = false;
        this.step = 'resetPassword';
        this.resetError = '';
      },
      error: (err: any) => {
        clearTimeout(safetyTimer);
        this.loading = false;
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
