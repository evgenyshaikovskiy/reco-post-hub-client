import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { UserRole } from '../../core/interfaces/user.interface';
import { NotificationService } from '../../core/services/notification.service';
import { combineLatest, map, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-bar',
  standalone: true,
  imports: [OverlayPanelModule, RouterModule, CommonModule, ButtonModule],
  templateUrl: './user-bar.component.html',
  styleUrl: './user-bar.component.scss',
})
export class UserBarComponent {
  constructor(
    private readonly _authService: AuthService,
    private readonly _notificationService: ToastNotificationsService,
    private readonly _userNotificationService: NotificationService,
    private readonly _router: Router
  ) {}

  private _destroyRef = inject(DestroyRef);

  public get isLoggedIn() {
    return this._authService.isLoggedIn();
  }

  public get isAdmin(): boolean {
    return (
      this._authService.User?.role === UserRole.ADMIN ||
      this._authService.User?.role === UserRole.MOD
    );
  }

  public notificationCount$ = this._userNotificationService.notifications$.pipe(
    map(notifications => notifications.filter(nt => !nt.viewed).length)
  );

  public notifications$ = this._userNotificationService.notifications$;

  public notificationData$ = combineLatest([
    this.notificationCount$,
    this.notifications$,
  ]).pipe(
    map(([count, notifications]) => {
      return { count, notifications };
    })
  );

  public goToUrl(url: string) {
    this._router.navigateByUrl(url);
  }

  public markAsRead(id: string) {
    this._userNotificationService
      .markNotificationAsViewed(id)
      .pipe(
        switchMap(() => this._userNotificationService.getNotifications()),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(notifications => {
        console.log(notifications);
      });
  }

  public logOut(): void {
    this._authService
      .logOut()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((message: string) => {
        this._notificationService.showNotification('info', message);
        this._router.navigate(['']);
      });
  }
}
