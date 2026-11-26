import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ArchitectUI - Angular 20 Bootstrap 5 & Material Design Admin Dashboard Template';

  private modalObserver?: MutationObserver;
  private isModalScrollLocked = false;
  private checkRafId: number | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const syncModalScrollLock = () => {
      const hasOpenModal = !!document.querySelector(
        '.ha-modal-backdrop, .dm-modal-backdrop, .da-modal-backdrop, .da-cert-modal-backdrop, .apt-modal-backdrop, .nt-modal-backdrop, .doctor-modal-backdrop, .modal-backdrop, .modal.d-block'
      );

      if (hasOpenModal === this.isModalScrollLocked) {
        return;
      }
      this.isModalScrollLocked = hasOpenModal;

      document.body.classList.toggle('modal-open', hasOpenModal);
      document.documentElement.classList.toggle('modal-open', hasOpenModal);
    };

    const scheduleCheck = () => {
      if (this.checkRafId !== null) {
        return;
      }
      this.checkRafId = window.requestAnimationFrame(() => {
        this.checkRafId = null;
        syncModalScrollLock();
      });
    };

    // Run outside Angular Zone and watch ONLY childList additions/removals so
    // toggling classes/styles never re-triggers MutationObserver or Change Detection.
    this.ngZone.runOutsideAngular(() => {
      this.modalObserver = new MutationObserver(scheduleCheck);
      this.modalObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      syncModalScrollLock();
    });
  }

  ngOnDestroy(): void {
    if (this.checkRafId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.checkRafId);
      this.checkRafId = null;
    }
    if (this.modalObserver) {
      this.modalObserver.disconnect();
      this.modalObserver = undefined;
    }
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      this.isModalScrollLocked = false;
    }
  }
}
