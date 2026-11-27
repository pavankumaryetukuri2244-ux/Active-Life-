import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
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

    /* Ambient Glass / Glow Circle */
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

    /* Login Container: Vertical Flow */
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

    /* Logo white rounded square */
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

    /* "HealthFamily" title */
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

    /* "Admin Portal" subtitle */
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

    /* Login card container */
    .login-card-custom {
      width: 448px !important;
      max-width: 448px !important;
      min-height: 509px !important;
      height: auto !important;
      transform: rotate(0deg) !important;
      opacity: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 24px !important;
      border-radius: 14px !important;
      padding: 32px 32px 28px 32px !important;
      background: #FFFFFFF2 !important;
      box-shadow: 0px 25px 50px -12px #00000040 !important;
      border: none !important;
      box-sizing: border-box !important;
    }

    /* "Welcome back" heading */
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

    /* "Sign in to your admin account" subtitle */
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

    /* Welcome back header block */
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

    /* Email / Form container */
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

    /* Remember Me & Forgot Password row */
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

    /* Remember Me wrapper */
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

    /* "Remember me" label */
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

    /* "Forgot password?" link */
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

    /* Sign In button */
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
      padding-top: 14px;
      border-top: 1px solid #F1F5F9;
    }

    /* Demo credentials container */
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

    /* Demo credentials text */
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

    /* Alert feedback blocks */
    .alert-box-error {
      background-color: #FEF2F2 !important;
      color: #EF4444 !important;
      border: 1px solid #FEE2E2 !important;
      border-radius: 8px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 12.5px !important;
      font-weight: 400 !important;
      padding: 9px 14px !important;
      margin-bottom: 0 !important;
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

    /* Doctor Registration Modal */
    .doctor-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    /* Doctor Registration Modal Card - exact match to login card */
    .doctor-modal-card {
      width: 448px !important;
      max-width: 448px !important;
      background: #FFFFFFF2 !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
      border-radius: 14px !important;
      box-shadow: 0px 25px 50px -12px #00000040 !important;
      border: none !important;
      padding: 32px !important;
      box-sizing: border-box !important;
      position: relative !important;
      animation: lgScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .doctor-modal-close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: #F4F4F6;
      color: #64748B;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      z-index: 10;
    }
    .doctor-modal-close-btn:hover {
      background: #E2E8F0;
      color: #0F172A;
    }

    @keyframes lgScaleUp {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* OTP Input boxes */
    .otp-input {
      width: 44px;
      height: 48px;
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      color: #0F172A;
      border: 1.5px solid transparent;
      border-radius: 10px;
      background: #F4F4F6;
      transition: all 0.18s ease;
      outline: none;
    }
    .otp-input:focus {
      border: 1.5px solid #000000 !important;
      background: #F4F4F6 !important;
      box-shadow: none !important;
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

  // Doctor Registration 4-Step Flow State
  isDoctorRegisterModalOpen = false;
  docRegStep: 'phone' | 'otp' | 'password' | 'success' = 'phone';
  docRegLoading = false;
  docRegError = '';
  docRegSuccessMsg = '';

  doctorCountryCode = '91';
  doctorPhone = '';
  doctorRole: 'DOCTOR' = 'DOCTOR';

  docOtpValues: string[] = ['', '', '', '', '', ''];
  docGeneratedOtp = '';
  docMaskedMobile = '';
  docOtpExpiresInSeconds = 180;
  docOtpExpiryTimer = 0;
  docExistUser = false;
  docIsNewUser = true;
  docIsMpinSet = false;
  docIsMobileVerified = false;
  docOtpVerified = false;
  docNextStep = 'REGISTER';
  docResendTimer = 30;
  private resendTimerInterval: any = null;
  private expiryTimerInterval: any = null;

  docNewPassword = '';
  docConfirmPassword = '';
  showDocNewPassword = false;
  showDocConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private webApiService: WebapiService,
    public CF: CommonService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    const loginOrPhonePattern = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[0-9+ -]{10,15})$/;
    this.Form = this.fb.group({
      loginid: ['', [Validators.required, Validators.pattern(loginOrPhonePattern)]],
      password: ['', [Validators.required]]
    });

    // Auto-redirect to dashboard if session already active
    try {
      const token = localStorage.getItem('accessToken');
      const hasToken = !!token && token !== 'null' && token !== 'undefined' && token.trim().length > 10;
      if (localStorage.getItem('isLoggedIn') === 'true' || hasToken) {
        const email = (localStorage.getItem('adminEmail') || '').trim().toLowerCase();
        const savedRole = (localStorage.getItem('userRole') || '').trim().toUpperCase();
        let hasDoctorJwtRole = false;
        if (hasToken && token && token.includes('.')) {
          try {
            const payloadPart = token.split('.')[1];
            const decoded = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
            hasDoctorJwtRole = Array.isArray(decoded?.realm_access?.roles) && decoded.realm_access.roles.includes('DOCTOR');
          } catch {
            hasDoctorJwtRole = false;
          }
        }
        const isDoctorSession = savedRole === 'DOCTOR' || (hasDoctorJwtRole && !email);
        const targetDashboard = isDoctorSession
          ? '/doctor/dashboard'
          : (email === 'testadmin@healthfamily.com' ? '/dashboards/users' : '/dashboards/analytics');
        this.ngZone.run(() => {
          this.router.navigateByUrl(targetDashboard).then(navigated => {
            if (!navigated) window.location.href = targetDashboard;
          }).catch(() => {
            window.location.href = targetDashboard;
          });
        });
      }
    } catch (e) {
      // ignore
    }
  }

  ngOnDestroy(): void {
    this.clearDoctorTimers();
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

    const rawLoginId = String(this.Form.value.loginid || '').trim();
    const password = String(this.Form.value.password || '');

    if (rawLoginId.includes('@')) {
      this.loginAdminWithEmail(rawLoginId, password);
      return;
    }

    const parsedPhone = this.parseDoctorPhone(rawLoginId);
    if (!parsedPhone) {
      this.errorMessage = 'Please enter a valid email address or 10-digit mobile number.';
      return;
    }

    this.loginDoctorWithMobile(parsedPhone.countryCode, parsedPhone.mobileNumber, password);
  }

  private parseDoctorPhone(rawInput: string): { countryCode: string; mobileNumber: string } | null {
    const cleaned = (rawInput || '').trim();
    const digits = cleaned.replace(/\D/g, '');
    if (digits.length === 10) {
      return { countryCode: '91', mobileNumber: digits };
    }
    if (digits.length === 12 && digits.startsWith('91')) {
      return { countryCode: '91', mobileNumber: digits.slice(2) };
    }
    if (digits.length >= 11 && digits.length <= 15 && cleaned.startsWith('+')) {
      return {
        countryCode: digits.slice(0, digits.length - 10),
        mobileNumber: digits.slice(-10)
      };
    }
    return null;
  }

  private navigateAfterLogin(targetDashboard: string): void {
    this.ngZone.run(() => {
      this.router.navigateByUrl(targetDashboard).then((navigated: boolean) => {
        if (!navigated) {
          window.location.href = targetDashboard;
        }
      }).catch((err: any) => {
        console.warn('Router navigation error, using window.location.href:', err);
        window.location.href = targetDashboard;
      });
    });

    setTimeout(() => {
      if (window.location.pathname.includes('login')) {
        window.location.href = targetDashboard;
      }
    }, 120);
  }

  private loginAdminWithEmail(emailInput: string, password: string): void {
    this.success = true;
    const requestBody = {
      email: emailInput,
      password
    };

    this.webApiService.LoginAdmin(requestBody).subscribe({
      next: (response: any) => {
        this.success = false;
        if (response && (response.success || response.data?.accessToken || response.accessToken)) {
          const accessToken = (response.data?.accessToken || response.accessToken || response.data?.token || response.token || '').trim();
          const tokenType = response.data?.tokenType || response.tokenType || 'Bearer';
          const expiresIn = response.data?.expiresIn != null ? String(response.data.expiresIn) : '43200';
          const enteredEmail = emailInput.toLowerCase();

          // Clear any previous Doctor session keys
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('doctorPortalState');
          localStorage.removeItem('doctorMobile');
          localStorage.removeItem('doctorCountryCode');
          localStorage.removeItem('doctorLoginExpiresIn');

          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('tokenType', tokenType);
          localStorage.setItem('expiresIn', expiresIn);
          localStorage.setItem('userRole', 'ADMIN');
          localStorage.setItem('adminEmail', enteredEmail);
          if (password) {
            localStorage.setItem('lastKnownPassword', password);
          }

          let adminProfile: any = {};
          try {
            if (accessToken && accessToken.includes('.')) {
              const payloadPart = accessToken.split('.')[1];
              const decoded = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
              adminProfile = {
                name: decoded.name || decoded.preferred_username || enteredEmail.split('@')[0],
                email: decoded.email || enteredEmail,
                username: decoded.preferred_username || enteredEmail.split('@')[0],
                roles: decoded.realm_access?.roles || []
              };
            }
          } catch (e) {
            console.warn('JWT parse notice:', e);
          }

          if (response.data?.admin && typeof response.data.admin === 'object') {
            adminProfile = { ...adminProfile, ...response.data.admin };
          }
          if (!adminProfile.email) adminProfile.email = enteredEmail;
          if (!adminProfile.name) adminProfile.name = enteredEmail.split('@')[0];

          localStorage.setItem('adminProfile', JSON.stringify(adminProfile));

          // Sync with CommonService and StorageService reactive subjects
          this.CF.SetLS$('accessToken', accessToken);
          this.CF.SetLS$('isLoggedIn', 'true');
          this.CF.SetLS$('adminEmail', enteredEmail);
          this.CF.SetLS$('adminProfile', JSON.stringify(adminProfile));
          this.CF.refreshLogin$.next(true);
          this.CF.showAuth = false;

          const targetDashboard = (enteredEmail === 'testadmin@healthfamily.com')
            ? '/dashboards/users'
            : '/dashboards/analytics';

          this.navigateAfterLogin(targetDashboard);
        } else {
          this.errorMessage = response?.message || 'Login failed. Please check your credentials.';
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.success = false;
        console.error('Admin Login error:', error);
        if (error?.status === 0) {
          this.errorMessage = 'Cannot connect to backend server. Please verify backend API status or network.';
        } else if (error?.status === 504 || error?.name === 'TimeoutError') {
          this.errorMessage = 'Backend gateway timeout (Server took too long to respond). Please try again.';
        } else if (error?.status === 502 || error?.status === 503) {
          this.errorMessage = 'Backend service temporarily unavailable (502/503). Server may be restarting.';
        } else if (error?.status === 401 || error?.status === 400) {
          this.errorMessage = error?.error?.message || 'Invalid email or password. Please check your credentials.';
        } else {
          this.errorMessage = error?.error?.message || 'Server error. Please try again later.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  private loginDoctorWithMobile(countryCode: string, mobileNumber: string, password: string): void {
    this.success = true;
    const payload = {
      countryCode: countryCode || '91',
      mobileNumber,
      password,
      role: 'DOCTOR'
    };

    this.webApiService.LoginDoctorPassword(payload).subscribe({
      next: (response: any) => {
        this.success = false;
        const data = response?.data || {};
        const accessToken = (data?.accessToken || response?.accessToken || '').trim();
        const isApiSuccess =
          Boolean(response) &&
          response.success !== false &&
          (response.errorCode === 0 || response.errorCode === undefined || response.errorCode === null) &&
          (response.responseCode === 200 || response.responseCode === undefined || response.responseCode === null) &&
          data.success !== false &&
          Boolean(accessToken);

        if (!isApiSuccess) {
          this.errorMessage =
            data?.message ||
            response?.message ||
            'Doctor login failed. Please verify your phone number and password.';
          this.cdr.detectChanges();
          return;
        }

        const refreshToken = (data?.refreshToken || response?.refreshToken || '').trim();
        const expiresIn = data?.expiresIn != null ? String(data.expiresIn) : '43200';
        const doctorPortalState = {
          success: data?.success ?? response?.success ?? true,
          message: data?.message || response?.message || '',
          title: data?.title || '',
          registrationStatus: data?.registrationStatus || '',
          isProfileVerified: Boolean(data?.isProfileVerified),
          isProfileComplete: data?.isProfileComplete,
          steps: Array.isArray(data?.steps) ? data.steps : []
        };

        // Clear any previous Admin session keys
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminProfile');
        localStorage.removeItem('lastKnownPassword');

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('tokenType', 'Bearer');
        localStorage.setItem('expiresIn', expiresIn);
        localStorage.setItem('userRole', 'DOCTOR');
        localStorage.setItem('doctorCountryCode', payload.countryCode);
        localStorage.setItem('doctorMobile', mobileNumber);
        localStorage.setItem('doctorPortalState', JSON.stringify(doctorPortalState));

        this.CF.SetLS$('accessToken', accessToken);
        this.CF.SetLS$('isLoggedIn', 'true');
        this.CF.refreshLogin$.next(true);
        this.CF.showAuth = false;

        this.navigateAfterLogin('/doctor/dashboard');
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.success = false;
        console.error('Doctor Login API error:', error);
        this.errorMessage = this.getDoctorAuthErrorMessage(
          error,
          'Invalid phone number or password. Please verify your credentials.',
          'DOCTOR login'
        );
        this.cdr.detectChanges();
      }
    });
  }

  // Doctor Registration Modal Handlers (4-Step Flow)
  openDoctorRegisterModal(): void {
    this.isDoctorRegisterModalOpen = true;
    this.docRegStep = 'phone';
    this.docRegError = '';
    this.docRegSuccessMsg = '';
    this.resetDoctorFlow();
    this.cdr.detectChanges();
  }

  closeDoctorRegisterModal(): void {
    this.isDoctorRegisterModalOpen = false;
    this.docRegError = '';
    this.docRegSuccessMsg = '';
    this.clearDoctorTimers();
    this.resetDoctorFlow();
    this.cdr.detectChanges();
  }

  private clearDoctorTimers(): void {
    if (this.resendTimerInterval) {
      clearInterval(this.resendTimerInterval);
      this.resendTimerInterval = null;
    }
    if (this.expiryTimerInterval) {
      clearInterval(this.expiryTimerInterval);
      this.expiryTimerInterval = null;
    }
  }

  resetDoctorFlow(): void {
    this.clearDoctorTimers();
    this.doctorCountryCode = '91';
    this.doctorPhone = '';
    this.doctorRole = 'DOCTOR';
    this.docOtpValues = ['', '', '', '', '', ''];
    this.docGeneratedOtp = '';
    this.docMaskedMobile = '';
    this.docOtpExpiresInSeconds = 180;
    this.docOtpExpiryTimer = 0;
    this.docExistUser = false;
    this.docIsNewUser = true;
    this.docIsMpinSet = false;
    this.docIsMobileVerified = false;
    this.docOtpVerified = false;
    this.docNextStep = 'REGISTER';
    this.docResendTimer = 30;
    this.docNewPassword = '';
    this.docConfirmPassword = '';
    this.showDocNewPassword = false;
    this.showDocConfirmPassword = false;
  }

  onDoctorPhoneInput(event: any): void {
    const input = event?.target as HTMLInputElement | null;
    if (!input) return;
    const digitsOnly = (input.value || '').replace(/\D/g, '').slice(0, 10);
    input.value = digitsOnly;
    this.doctorPhone = digitsOnly;
  }

  // Step 1: Send OTP to Phone Number (Role-based access: DOCTOR)
  sendDoctorPhoneOtp(): void {
    this.docRegError = '';
    this.docRegSuccessMsg = '';

    const rawPhone = (this.doctorPhone || '').replace(/\D/g, '').trim();
    if (!rawPhone || rawPhone.length !== 10) {
      this.docRegError = 'Please enter a valid 10-digit mobile phone number.';
      return;
    }
    this.doctorPhone = rawPhone;
    this.requestDoctorOtp(rawPhone, false);
  }

  /**
   * Calls the role-based userservice Send OTP API for Doctor registration/resend.
   */
  private requestDoctorOtp(mobileNumber: string, resendOtp: boolean): void {
    this.docRegLoading = true;
    this.docRegError = '';
    this.docRegSuccessMsg = '';

    const requestBody = {
      countryCode: this.doctorCountryCode || '91',
      mobileNumber,
      purpose: 'REGISTER_PASSWORD',
      role: this.doctorRole || 'DOCTOR',
      resendOtp
    };

    this.webApiService.SendDoctorOtp(requestBody).subscribe({
      next: (res: any) => {
        this.docRegLoading = false;
        const isSuccess =
          res &&
          res.success === true &&
          (res.errorCode === 0 || res.errorCode === undefined || res.errorCode === null) &&
          (res.responseCode === 200 || res.responseCode === undefined || res.responseCode === null);

        if (!isSuccess) {
          this.docRegError =
            res?.data?.message ||
            res?.message ||
            'Unable to send OTP. Please verify your mobile number and role access.';
          this.cdr.detectChanges();
          return;
        }

        const data = res.data || {};
        this.docMaskedMobile = data.maskedMobile || ('******' + mobileNumber.slice(-4));
        const expires = Number(data.expiresInSeconds);
        this.docOtpExpiresInSeconds = (!isNaN(expires) && expires > 0) ? expires : 180;
        this.docExistUser = Boolean(data.existUser);
        this.docNextStep = (data.nextStep || 'REGISTER').toString().toUpperCase();
        const serverOtp = data.otpCode ?? data.otp ?? '';
        this.docGeneratedOtp = serverOtp ? String(serverOtp).trim() : '';

        if (this.docExistUser && this.docNextStep === 'LOGIN' && !this.docGeneratedOtp) {
          this.docRegError =
            data.message ||
            res.message ||
            'This mobile number is already registered for this role. Please sign in.';
          this.cdr.detectChanges();
          return;
        }

        this.docRegStep = 'otp';
        this.startResendTimer(this.docOtpExpiresInSeconds);
        this.clearDocOtpInputs();
        const msgText = data.message || res.message || 'OTP sent successfully.';
        this.docRegSuccessMsg = `${msgText} (+${this.doctorCountryCode} ${this.docMaskedMobile})`;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.docRegLoading = false;
        console.error('Doctor Send OTP API error:', err);
        this.docRegError = this.getDoctorAuthErrorMessage(err, 'Failed to send OTP. Please try again.', 'DOCTOR registration');
        this.cdr.detectChanges();
      }
    });
  }

  private getDoctorAuthErrorMessage(err: any, fallback: string, accessContext: string): string {
    if (err?.status === 0) {
      return 'Cannot connect to authentication server. Please check your network.';
    }
    if (err?.status === 403) {
      return err?.error?.message || err?.error?.data?.message || `Access denied: Role-based access restricted for ${accessContext}.`;
    }
    if (err?.status === 401) {
      return err?.error?.message || err?.error?.data?.message || 'Unauthorized access for DOCTOR role.';
    }
    if (err?.name === 'TimeoutError' || err?.status === 504) {
      return 'Request timed out. Please try again.';
    }
    return err?.error?.data?.message || err?.error?.message || err?.message || fallback;
  }

  startResendTimer(expiresInSeconds: number = 180): void {
    this.clearDoctorTimers();
    this.docResendTimer = Math.min(30, expiresInSeconds > 0 ? expiresInSeconds : 30);
    this.docOtpExpiryTimer = expiresInSeconds > 0 ? expiresInSeconds : 180;

    this.resendTimerInterval = setInterval(() => {
      if (this.docResendTimer > 0) {
        this.docResendTimer--;
        this.cdr.detectChanges();
      } else {
        clearInterval(this.resendTimerInterval);
        this.resendTimerInterval = null;
        this.cdr.detectChanges();
      }
    }, 1000);

    this.expiryTimerInterval = setInterval(() => {
      if (this.docOtpExpiryTimer > 0) {
        this.docOtpExpiryTimer--;
        this.cdr.detectChanges();
      } else {
        clearInterval(this.expiryTimerInterval);
        this.expiryTimerInterval = null;
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  formatOtpExpiry(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  resendDoctorOtp(): void {
    if (this.docResendTimer > 0 || this.docRegLoading) return;
    if (!this.doctorPhone || this.doctorPhone.length !== 10) {
      this.docRegStep = 'phone';
      this.docRegError = 'Please enter a valid 10-digit mobile phone number.';
      return;
    }
    this.requestDoctorOtp(this.doctorPhone, true);
  }

  goBackToDoctorPhone(): void {
    this.clearDoctorTimers();
    this.docRegStep = 'phone';
    this.docRegError = '';
    this.docRegSuccessMsg = '';
  }

  clearDocOtpInputs(): void {
    this.docOtpValues = ['', '', '', '', '', ''];
    setTimeout(() => {
      for (let i = 0; i < 6; i++) {
        const el = document.getElementById(`docOtpInput_${i}`) as HTMLInputElement;
        if (el) el.value = '';
      }
      const firstEl = document.getElementById('docOtpInput_0') as HTMLInputElement;
      if (firstEl) firstEl.focus();
    }, 100);
  }

  onDocOtpInput(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    let val = input.value || '';
    if (val.length > 1) {
      val = val.slice(-1);
      input.value = val;
    }
    this.docOtpValues[index] = val;

    if (val && index < 5) {
      const nextEl = document.getElementById(`docOtpInput_${index + 1}`) as HTMLInputElement;
      if (nextEl) {
        nextEl.focus();
        nextEl.select();
      }
    }
  }

  onDocOtpKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        const prevEl = document.getElementById(`docOtpInput_${index - 1}`) as HTMLInputElement;
        if (prevEl) {
          prevEl.focus();
          prevEl.select();
        }
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.isDocOtpComplete()) {
        this.verifyDoctorOtp();
      }
    }
  }

  onDocOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    digits.forEach((digit, i) => {
      this.docOtpValues[i] = digit;
      const el = document.getElementById(`docOtpInput_${i}`) as HTMLInputElement;
      if (el) el.value = digit;
    });

    const lastIdx = Math.min(digits.length, 5);
    const lastEl = document.getElementById(`docOtpInput_${lastIdx}`) as HTMLInputElement;
    if (lastEl) lastEl.focus();
  }

  getEnteredDocOtp(): string {
    const domDigits: string[] = [];
    for (let i = 0; i < 6; i++) {
      const el = document.getElementById(`docOtpInput_${i}`) as HTMLInputElement;
      domDigits.push(el ? el.value.trim() : (this.docOtpValues[i] || ''));
    }
    return domDigits.join('');
  }

  isDocOtpComplete(): boolean {
    return this.getEnteredDocOtp().length === 6;
  }

  // Step 2: Verify OTP via role-based userservice Verify OTP API
  verifyDoctorOtp(): void {
    const entered = this.getEnteredDocOtp();
    if (!entered || !/^\d{6}$/.test(entered)) {
      this.docRegError = 'Please enter all 6 digits of the OTP code.';
      return;
    }

    if (this.docOtpExpiresInSeconds > 0 && this.docOtpExpiryTimer === 0) {
      this.docRegError = 'OTP has expired. Please click Resend OTP to receive a new code.';
      return;
    }

    const rawPhone = (this.doctorPhone || '').replace(/\D/g, '').trim();
    if (!rawPhone || rawPhone.length !== 10) {
      this.docRegError = 'Please enter a valid 10-digit mobile phone number.';
      this.docRegStep = 'phone';
      return;
    }

    this.docRegLoading = true;
    this.docRegError = '';
    this.docRegSuccessMsg = '';

    const payload = {
      countryCode: this.doctorCountryCode || '91',
      mobileNumber: rawPhone,
      otpCode: entered,
      purpose: 'REGISTER_PASSWORD',
      role: this.doctorRole || 'DOCTOR'
    };

    this.webApiService.VerifyDoctorOtp(payload).subscribe({
      next: (res: any) => {
        this.docRegLoading = false;
        const data = res?.data || {};
        const isApiSuccess =
          res &&
          res.success === true &&
          (res.errorCode === 0 || res.errorCode === undefined || res.errorCode === null) &&
          (res.responseCode === 200 || res.responseCode === undefined || res.responseCode === null);

        const isOtpVerified = data.otpVerified !== false && data.isMobileVerified !== false;

        if (!isApiSuccess || !isOtpVerified) {
          this.docRegError =
            data?.message ||
            res?.message ||
            'Invalid OTP code. Please enter the correct 6-digit verification code.';
          this.cdr.detectChanges();
          return;
        }

        this.docIsNewUser = data.isNewUser !== undefined ? Boolean(data.isNewUser) : !this.docExistUser;
        this.docIsMpinSet = Boolean(data.isMpinSet);
        this.docIsMobileVerified = data.isMobileVerified !== undefined ? Boolean(data.isMobileVerified) : true;
        this.docOtpVerified = data.otpVerified !== undefined ? Boolean(data.otpVerified) : true;
        this.docNextStep = (data.nextStep || 'REGISTER_PASSWORD').toString().toUpperCase();

        this.clearDoctorTimers();
        this.docRegStep = 'password';
        this.docRegSuccessMsg = data?.message || res?.message || 'OTP verified successfully.';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.docRegLoading = false;
        console.error('Doctor Verify OTP API error:', err);
        this.docRegError = this.getDoctorAuthErrorMessage(err, 'Invalid OTP code. Please verify and try again.', 'DOCTOR verification');
        this.cdr.detectChanges();
      }
    });
  }

  // Step 3: Complete Registration via role-based userservice Register Password API
  completeDoctorRegistration(): void {
    this.docRegError = '';
    this.docRegSuccessMsg = '';

    if (!this.docNewPassword || this.docNewPassword.length < 6) {
      this.docRegError = 'Password must be at least 6 characters long.';
      return;
    }

    if (!this.docConfirmPassword) {
      this.docRegError = 'Please confirm your password.';
      return;
    }

    if (this.docNewPassword !== this.docConfirmPassword) {
      this.docRegError = 'New password and Confirm password do not match.';
      return;
    }

    const rawPhone = (this.doctorPhone || '').replace(/\D/g, '').trim();
    if (!rawPhone || rawPhone.length !== 10) {
      this.docRegError = 'Please enter a valid 10-digit mobile phone number.';
      this.docRegStep = 'phone';
      return;
    }

    this.docRegLoading = true;

    const payload = {
      countryCode: this.doctorCountryCode || '91',
      mobileNumber: rawPhone,
      password: this.docNewPassword,
      confirmPassword: this.docConfirmPassword,
      role: this.doctorRole || 'DOCTOR'
    };

    this.webApiService.RegisterDoctorPassword(payload).subscribe({
      next: (res: any) => {
        this.docRegLoading = false;
        const data = res?.data || {};
        const isApiSuccess =
          res &&
          res.success === true &&
          (res.errorCode === 0 || res.errorCode === undefined || res.errorCode === null) &&
          (res.responseCode === 200 || res.responseCode === undefined || res.responseCode === null) &&
          data.success !== false;

        if (!isApiSuccess) {
          this.docRegError =
            data?.message ||
            res?.message ||
            'Failed to register password. Please try again.';
          this.cdr.detectChanges();
          return;
        }

        this.docRegStep = 'success';
        this.docRegSuccessMsg = data?.message || res?.message || 'Password registered successfully';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.docRegLoading = false;
        console.error('Doctor Register Password API error:', err);
        this.docRegError = this.getDoctorAuthErrorMessage(err, 'Failed to register password. Please try again.', 'DOCTOR registration');
        this.cdr.detectChanges();
      }
    });
  }

  // Step 4: Proceed to Log In
  proceedToLogin(): void {
    const countryCodeToUse = this.doctorCountryCode || '91';
    const phoneToFill = this.doctorPhone;
    const pwdToFill = this.docNewPassword;

    this.closeDoctorRegisterModal();

    // Prefill login form
    this.Form.patchValue({
      loginid: phoneToFill,
      password: pwdToFill
    });
    this.Form.markAsDirty();
    this.Form.markAllAsTouched();

    this.successMessage = `Registration successful! Account +${countryCodeToUse} ${phoneToFill} is ready. Click Sign In to enter.`;
    this.cdr.detectChanges();
  }
}

