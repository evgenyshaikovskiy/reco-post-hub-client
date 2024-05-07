import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';

@Component({
  selector: 'app-user-bar',
  standalone: true,
  imports: [OverlayPanelModule, RouterModule, CommonModule],
  templateUrl: './user-bar.component.html',
  styleUrl: './user-bar.component.scss',
})
export class UserBarComponent {
  constructor(
    private readonly _authService: AuthService,
    private readonly _notificationService: ToastNotificationsService,
    private readonly _router: Router
  ) {}

  private _destroyRef = inject(DestroyRef);

  public get isLoggedIn() {
    return this._authService.isLoggedIn();
  }

  public logOut(): void {
    this._authService
      .logOut()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((message: string) => {
        this._notificationService.showNotification('info', message);
        this._router.navigate(['home']);
      });
  }
}
