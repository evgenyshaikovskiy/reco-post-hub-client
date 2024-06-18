import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { IHashtag } from '../../core/interfaces/request-interfaces';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';
import {
  ISubscription,
  SubscriptionType,
} from '../../core/interfaces/user.interface';
import { SubscriptionService } from '../../core/services/subscription.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hashtag-list',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, ButtonModule],
  templateUrl: './hashtag-list.component.html',
  styleUrl: './hashtag-list.component.scss',
})
export class HashtagListComponent implements OnInit {
  @Input() hashtags!: IHashtag[];
  @Input() textSize!: number;

  @Input() isPreview: boolean = false;

  @Input() color?: string;

  private _userHashtags: ISubscription[] = [];
  private destroyRef = inject(DestroyRef);

  public get style(): string {
    return `font-size: ${this.textSize}px;${this.color ? `color: ${this.color};` : ''}`;
  }

  public get isAuthenticated(): boolean {
    return !!this.authService.User;
  }

  public isSubbed(hashtagId: string): boolean {
    return this._userHashtags.map(h => h.targetId).includes(hashtagId);
  }

  constructor(
    private readonly authService: AuthService,
    private readonly subscriptionService: SubscriptionService,
    private readonly toastNotificationService: ToastNotificationsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this._userHashtags =
      this.authService.User?.subscriptions.filter(
        sub => sub.type === SubscriptionType.TO_HASHTAG
      ) ?? [];
  }

  public subscribeToHashtag(hashtagId: string) {
    this.subscriptionService
      .addToSubscriptions({
        targetId: hashtagId,
        type: SubscriptionType.TO_HASHTAG,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(subscription => {
        if (
          this._userHashtags.findIndex(
            value => value.targetId === subscription.targetId
          ) === -1
        ) {
          this._userHashtags.push(subscription);
          this.toastNotificationService.showNotification(
            'success',
            'You have subscribed to hashtag'
          );
        }
      });
  }

  public unsubscribeFromHashtag(hashtagId: string) {
    const item = this._userHashtags.find(sub => sub.targetId === hashtagId);

    if (item) {
      this.subscriptionService
        .removeFromSubscriptions(item.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this._userHashtags = [
            ...this._userHashtags.filter(sub => sub.id !== item.id),
          ];

          this.toastNotificationService.showNotification(
            'info',
            'You unsubscribed from hashtag'
          );
        });
    }
  }

  public onRead(hashtagName: string) {
    this.router.navigate([`hashtag/${hashtagName}`]);
  }
}
