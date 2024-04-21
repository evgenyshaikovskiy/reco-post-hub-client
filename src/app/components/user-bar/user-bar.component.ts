import { Component, DestroyRef, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { tap } from 'rxjs';

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
    private readonly _notificationService: ToastNotificationsService
  ) {}

  private _destroyRef = inject(DestroyRef);
  public isLoggedIn$ = this._authService.isLoggedIn$.pipe(
    tap(value => console.log('is logged in', value))
  );

  public logOut(): void {
    this._authService
      .logOut()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((message: string) => {
        this._notificationService.showNotification('info', message);
      });
  }
}
