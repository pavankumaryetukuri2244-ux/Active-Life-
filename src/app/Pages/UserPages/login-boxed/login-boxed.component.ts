import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
      background: linear-gradient(135deg, #155DFC 0%, #9810FA 50%, #E60076 100%) !important;
      opacity: 1 !important;
      transform: rotate(0deg) !important;
      /* position:fixed fills entire browser window — scrollbar aligns with browser right edge */
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: scroll !important;
      overflow-x: hidden;
      display: block;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      /* Custom scrollbar matching uploaded image */
      scrollbar-color: rgba(255, 255, 255, 0.45) rgba(0, 0, 0, 0.12);
      scrollbar-width: auto;
    }

    /* Webkit scrollbar — small sleek scrollbar at browser right edge */
    .login-bg::-webkit-scrollbar {
      width: 8px;
    }
    .login-bg::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.08);
    }
    .login-bg::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.45);
      border-radius: 4px;
      border: 1px solid transparent;
      background-clip: padding-box;
    }
    .login-bg::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.75);
    }

    /* ---- Figma Ambient Glass / Glow Circle: exact specifications ---- */
    .ambient-glow-circle {
      position: fixed;
      width: 384px !important;
      height: 384px !important;
      border-radius: 33554400px !important;
      background: #FFFFFF0D !important;
      background-color: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: blur(128px) !important;
      -webkit-backdrop-filter: blur(128px) !important;
      transform: translate(-50%, -50%) rotate(0deg) !important;
      opacity: 1 !important;
      top: 50% !important;
      left: 50% !important;
      pointer-events: none !important;
      z-index: 0 !important;
    }

    /* Inner scroll wrapper — minimal top gap, displays entire card, small scroll to see demo paragraph */
    .login-scroll-inner {
      min-height: calc(100vh + 50px) !important;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 18px !important;
      padding-bottom: 28px !important;
      padding-left: 16px;
      padding-right: 16px;
      box-sizing: border-box;
      position: relative;
      z-index: 1;
    }

    /* ---- Figma Container: Vertical Flow, Fixed 448px ---- */
    .login-wrapper {
      width: 448px !important;
      max-width: 448px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      box-sizing: border-box !important;
      margin: 0 auto !important;
    }

    /* ---- Brand section above card: compact clean spacing ---- */
    .brand-section {
      width: 448px !important;
      max-width: 448px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      opacity: 1 !important;
      transform: rotate(0deg) !important;
      margin: 0 0 16px 0 !important;
      box-sizing: border-box !important;
      padding: 0 !important;
    }

    /* Heart logo container */
    .logo-container {
      width: 448px !important;
      max-width: 448px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-sizing: border-box !important;
      margin: 0 0 8px 0 !important;
      padding: 0 !important;
    }

    /* Logo white rounded square: exact Figma specifications */
    .logo-box {
      width: 80px !important;
      height: 80px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      border-radius: 16px !important;
      background: #ffffff !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12) !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 auto !important;
    }

    /* "HealthFamily" title: exact Figma specifications */
    .brand-title {
      width: 198px !important;
      height: 36px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 700 !important;
      font-style: normal !important;
      font-size: 30px !important;
      line-height: 36px !important;
      letter-spacing: 0.4px !important;
      color: #FFFFFF !important;
      text-align: center !important;
      margin: 0 auto 4px auto !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-sizing: border-box !important;
    }

    /* "Admin Portal" subtitle: exact Figma specifications */
    .brand-subtitle {
      width: 94px !important;
      height: 24px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 400 !important;
      font-style: normal !important;
      font-size: 16px !important;
      line-height: 24px !important;
      letter-spacing: -0.31px !important;
      color: rgba(255, 255, 255, 0.7) !important;
      text-align: center !important;
      margin: 0 auto !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-sizing: border-box !important;
    }

    /* ---- Login card container: exact Figma specifications ---- */
    .login-card-custom {
      width: 448px !important;
      max-width: 448px !important;
      height: 509px !important;
      min-height: 509px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 24px !important;
      border-radius: 14px !important;
      padding: 32px !important;
      background: #FFFFFFF2 !important;
      box-shadow: 0px 25px 50px -12px #00000040 !important;
      border: none !important;
      box-sizing: border-box !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
    }

    /* ---- Card header text ---- */
    /* "Welcome back": exact Figma specifications (straight single line) */
    .login-heading {
      width: auto !important;
      min-width: 173px !important;
      height: 32px !important;
      white-space: nowrap !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
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

    /* "Sign in to your admin account": exact Figma specifications */
    .login-subheading {
      width: auto !important;
      min-width: 193px !important;
      height: 20px !important;
      white-space: nowrap !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 400 !important;
      font-style: normal !important;
      font-size: 14px !important;
      line-height: 20px !important;
      letter-spacing: -0.15px !important;
      color: #62748E !important;
      margin: 0 !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
    }

    /* ---- Welcome back container: exact Figma specifications ---- */
    .login-header-block {
      width: 384px !important;
      max-width: 100% !important;
      height: 80px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      padding-bottom: 24px !important;
      box-sizing: border-box !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-start !important;
      margin-bottom: 0 !important;
    }

    /* ---- Field labels: matching design ---- */
    /* ---- Field labels: exact spacing to input box ---- */
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
      margin-bottom: 6px !important; /* Clean spacing between text label and input box */
      padding: 0 !important;
    }

    /* ---- Email / Form container: exact Figma specifications ---- */
    .login-form-container {
      width: 384px !important;
      max-width: 100% !important;
      min-height: 256px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      box-sizing: border-box !important;
    }

    /* Field spacing: 18px between fields */
    .field-group {
      width: 384px !important;
      max-width: 100% !important;
      margin-bottom: 18px !important;
      box-sizing: border-box !important;
    }

    /* ---- Input fields: exact padding and inner spacing ---- */
    .custom-input-field,
    .was-validated .custom-input-field:valid,
    .was-validated .custom-input-field:valid:focus,
    .form-control.custom-input-field:valid,
    .form-control.custom-input-field.is-valid {
      width: 384px !important;
      max-width: 100% !important;
      height: 44px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      padding: 11px 14px !important; /* Balanced inner spacing for text inside box */
      border-radius: 10px !important;
      background: #F4F4F6 !important;
      background-color: #F4F4F6 !important;
      border: 1.5px solid transparent !important; /* No border by default */
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
      color: #717182 !important; /* rgba(113, 113, 130, 1) / hsla(240, 7%, 48%, 1) */
      opacity: 1 !important;
    }

    /* Focus/Click state: keeps #F4F4F6 background and shows black border only */
    .custom-input-field:focus,
    .custom-input-field:active,
    .was-validated .custom-input-field:valid:focus {
      background: #F4F4F6 !important;
      background-color: #F4F4F6 !important;
      border: 1.5px solid #000000 !important; /* Shows black border when clicked */
      box-shadow: none !important;
      outline: none !important;
      background-image: none !important;
    }

    /* Prevent browser autofill from turning input box blue — keeps existing #F4F4F6 */
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

    .custom-input-field::selection {
      background: rgba(0, 0, 0, 0.15) !important;
      color: #0F172A !important;
    }

    /* Padding-right for password field to not overlap toggle icon */
    .custom-input-field.pe-5,
    .was-validated .custom-input-field.pe-5:valid {
      padding-right: 44px !important;
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
      padding: 0;
      color: #8C9BB0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: color 0.15s ease;
      line-height: 1;
      width: 20px;
      height: 20px;
    }

    .password-toggle-btn-custom:hover {
      color: #64748B;
    }

    /* ---- Remember Me & Forgot Password row: exact Figma specifications ---- */
    .login-bottom-row {
      width: 384px !important;
      max-width: 100% !important;
      height: 24px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      box-sizing: border-box !important;
      margin-top: 0 !important;
      margin-bottom: 24px !important;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
    }

    /* Remember Me wrapper: exact Figma specifications */
    .remember-group {
      width: 129px !important;
      height: 24px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      box-sizing: border-box !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    /* "Remember me" label: exact Figma specifications */
    .remember-label {
      width: 108px !important;
      height: 24px !important;
      white-space: nowrap !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 500 !important;
      font-style: normal !important;
      font-size: 16px !important;
      line-height: 24px !important;
      letter-spacing: -0.31px !important;
      color: #45556C !important; /* rgba(69, 85, 108, 1) / hsla(215, 22%, 35%, 1) */
      cursor: pointer !important;
      user-select: none !important;
      display: flex !important;
      align-items: center !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Checkbox: strictly 13×13, radius 2px, border-width 1px, angle 0deg, opacity 1 */
    .remember-check {
      width: 13px !important;
      height: 13px !important;
      min-width: 13px !important;
      max-width: 13px !important;
      min-height: 13px !important;
      max-height: 13px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      border-radius: 2px !important;
      border-width: 1px !important;
      border: 1px solid #757575 !important; /* hsba(0, 0%, 46%, 1) */
      cursor: pointer !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #FFFFFF !important;
      background-color: #FFFFFF !important;
      accent-color: #2563EB !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
      box-sizing: border-box !important;
      transition: all 0.15s ease !important;
      position: relative !important;
    }

    .remember-check:hover {
      border-color: #4B5563 !important;
    }

    .remember-check:focus {
      border-color: #2563EB !important;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15) !important;
      outline: none !important;
    }

    .remember-check:checked,
    .was-validated .remember-check:valid:checked,
    .was-validated .remember-check:checked {
      background: #0077FF !important;
      background-color: #0077FF !important; /* hsba(212, 100%, 100%, 1) */
      border: 1px solid #0077FF !important;
      border-color: #0077FF !important;
      border-radius: 2px !important;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3E%3Cpath fill-rule='evenodd' d='M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z' clip-rule='evenodd'/%3E%3C/svg%3E") !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      background-size: 9px 9px !important;
    }

    /* "Forgot password?": exact Figma specifications */
    .forgot-link-custom {
      width: 133px !important;
      height: 24px !important;
      white-space: nowrap !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 500 !important;
      font-style: normal !important;
      font-size: 16px !important;
      line-height: 24px !important;
      letter-spacing: -0.31px !important;
      text-align: center !important;
      color: #155DFC !important; /* rgba(21, 93, 252, 1) / hsla(221, 97%, 54%, 1) */
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-decoration: none !important;
      transition: opacity 0.15s ease, color 0.15s ease;
    }

    .forgot-link-custom:hover {
      color: #1245c4 !important;
      text-decoration: none !important;
      opacity: 0.9 !important;
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
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #F1F5F9;
    }

    /* ---- Demo credentials container: exact Figma specifications ---- */
    .demo-credentials-container {
      width: 448px !important;
      max-width: 448px !important;
      height: 32px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      padding-top: 16px !important;
      box-sizing: border-box !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 20px auto 0 auto !important;
    }

    /* ---- Demo credentials text: exact Figma specifications ---- */
    .demo-credentials-text {
      width: 248px !important;
      height: 16px !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-weight: 400 !important;
      font-style: normal !important;
      font-size: 12px !important;
      line-height: 16px !important;
      letter-spacing: 0px !important;
      color: rgba(255, 255, 255, 0.75) !important; /* Clearly visible on dark gradient */
      text-align: center !important;
      margin: 0 !important;
      padding: 0 !important;
      white-space: nowrap !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-sizing: border-box !important;
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
export class LoginBoxedComponent implements OnInit, OnDestroy {
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
    // Force permanent scrollbar on login page (matching Figma)
    document.documentElement.style.setProperty('overflow-y', 'scroll', 'important');
    document.documentElement.style.setProperty('scrollbar-gutter', 'stable', 'important');
  }

  ngOnDestroy(): void {
    // Restore overflow when navigating to other pages
    document.documentElement.style.removeProperty('overflow-y');
    document.documentElement.style.removeProperty('scrollbar-gutter');
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

