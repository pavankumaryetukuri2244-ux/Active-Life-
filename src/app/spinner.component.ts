import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-spinner',
  standalone: false,
  template: `
    <div class="loader" *ngIf="CF.isSpinnerVisible()">
      <div class="spinner-container">
        <div class="premium-spinner"></div>
        <div class="pulsing-core"></div>
        <span class="loading-text">HealthFamily</span>
      </div>
    </div>
  `,
  styles: [`
    .loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(6px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
    }
    .spinner-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .premium-spinner {
      width: 70px;
      height: 70px;
      border: 3px solid transparent;
      border-top: 3px solid #3b82f6; /* HealthFamily Blue */
      border-right: 3px solid #8b5cf6; /* HealthFamily Violet */
      border-radius: 50%;
      animation: spin-forward 1.2s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
    }
    .pulsing-core {
      position: absolute;
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 50%;
      top: 21px;
      animation: pulse-core 1.5s ease-in-out infinite;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    }
    .loading-text {
      margin-top: 20px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 1.05rem;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: pulse-text 1.5s ease-in-out infinite;
    }
    @keyframes spin-forward {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse-core {
      0%, 100% { transform: scale(0.85); opacity: 0.7; }
      50% { transform: scale(1.15); opacity: 1; }
    }
    @keyframes pulse-text {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
  constructor(
    private router: Router,
    public CF: CommonService
  ) {
    // Disabled navigation spinner to make sidebar page transitions instant and seamless
    /*
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.CF.isSpinnerVisible.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError) {
        setTimeout(() => {
          this.CF.isSpinnerVisible.set(false);
        }, 1000);
      }
    }, () => {
      setTimeout(() => {
        this.CF.isSpinnerVisible.set(false);
      }, 1000);
    });
    */
  }

  ngOnDestroy(): void {
    this.CF.isSpinnerVisible.set(false);
  }
}
