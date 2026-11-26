import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ArchitectUI - Angular 20 Bootstrap 5 & Material Design Admin Dashboard Template';

  private modalObserver?: MutationObserver;
  private backdropWheelHandler?: (e: WheelEvent) => void;
  private backdropTouchHandler?: (e: TouchEvent) => void;

  ngOnInit(): void {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const checkAndLockScroll = () => {
        const modalBackdrops = document.querySelectorAll(
          '[class*="modal-backdrop"], [class*="-backdrop"], .modal.d-block, .ha-modal-backdrop, .apt-modal-backdrop, .da-modal-backdrop, .dm-modal-backdrop, .nt-modal-backdrop, .doctor-modal-backdrop'
        );
        const hasOpenModal = modalBackdrops.length > 0;

        if (hasOpenModal) {
          if (!document.body.classList.contains('modal-open')) {
            document.body.classList.add('modal-open');
          }
          if (!document.documentElement.classList.contains('modal-open')) {
            document.documentElement.classList.add('modal-open');
          }
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
        } else {
          if (document.body.classList.contains('modal-open')) {
            document.body.classList.remove('modal-open');
          }
          if (document.documentElement.classList.contains('modal-open')) {
            document.documentElement.classList.remove('modal-open');
          }
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }
      };

      // Watch for any modal backdrop element added or removed from the DOM
      this.modalObserver = new MutationObserver(() => {
        checkAndLockScroll();
      });

      this.modalObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });

      // Prevent wheel/touch events on the backdrop overlay from propagating to background
      this.backdropWheelHandler = (event: WheelEvent) => {
        const target = event.target as HTMLElement | null;
        if (target && this.isBackdropElement(target)) {
          event.preventDefault();
        }
      };

      this.backdropTouchHandler = (event: TouchEvent) => {
        const target = event.target as HTMLElement | null;
        if (target && this.isBackdropElement(target)) {
          event.preventDefault();
        }
      };

      window.addEventListener('wheel', this.backdropWheelHandler, { passive: false });
      window.addEventListener('touchmove', this.backdropTouchHandler, { passive: false });

      // Initial check
      checkAndLockScroll();
    }
  }

  private isBackdropElement(target: HTMLElement): boolean {
    const className = typeof target.className === 'string' ? target.className : '';
    return (
      className.includes('backdrop') ||
      className.includes('modal-backdrop') ||
      className.includes('ha-modal-backdrop') ||
      className.includes('dm-modal-backdrop') ||
      className.includes('da-modal-backdrop') ||
      className.includes('apt-modal-backdrop') ||
      className.includes('nt-modal-backdrop') ||
      className.includes('doctor-modal-backdrop') ||
      (className.includes('modal') && className.includes('d-block'))
    );
  }

  ngOnDestroy(): void {
    if (this.modalObserver) {
      this.modalObserver.disconnect();
    }
    if (typeof window !== 'undefined') {
      if (this.backdropWheelHandler) {
        window.removeEventListener('wheel', this.backdropWheelHandler);
      }
      if (this.backdropTouchHandler) {
        window.removeEventListener('touchmove', this.backdropTouchHandler);
      }
    }
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }
}
