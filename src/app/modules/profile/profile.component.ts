import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  ISubscription,
  IUserProfile,
  SubscriptionType,
} from '../../core/interfaces/user.interface';
import { map, switchMap, tap } from 'rxjs';
import { ResourcesService } from '../../core/services/resources.service';
// import { SpinnerService } from '../../core/services/spinner.service';
import { AuthService } from '../../core/services/auth.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Store } from '@ngrx/store';
import {
  setSpinnerState,
  setUserData,
  updateUserData,
} from '../../store/actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnDestroy, OnInit {
  private destroyRef = inject(DestroyRef);

  public profile!: IUserProfile;
  public url!: string;

  public isLoaded = false;
  public subscriptionButtonPending = false;

  public get isAuthenticated(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    return isLoggedIn;
  }

  public get isSubbed(): boolean {
    return this.relativeSubscription ? true : false;
  }

  private get relativeSubscription(): ISubscription | null {
    return (
      this.authService.User?.subscriptions.find(
        sub => sub.targetId === this.profile.id
      ) ?? null
    );
  }

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly resourceService: ResourcesService,
    // private readonly spinnerService: SpinnerService,
    private readonly authService: AuthService,
    private readonly subscriptionService: SubscriptionService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(setSpinnerState({ state: true }));
    this.activatedRoute.data
      .pipe(
        map(data => data['data'] as IUserProfile),
        tap(data => console.log(data)),
        switchMap(profile =>
          this.resourceService.getFileByName(profile.userPictureId).pipe(
            map(blob => ({
              picture: blob,
              profile: profile,
            }))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => {
        this.url = URL.createObjectURL(data.picture);
        this.profile = data.profile;
        this.store.dispatch(setSpinnerState({ state: false }));
        this.isLoaded = true;
      });

    if (this.authService.isLoggedIn() && !this.authService.User) {
      this.store.dispatch(setSpinnerState({ state: true }));
      this.authService
        .fetchUser()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(user => {
          this.store.dispatch(setUserData({ data: user }));
          this.store.dispatch(setSpinnerState({ state: false }));
        });
    }
  }

  ngOnDestroy(): void {
    URL.revokeObjectURL(this.url);
  }

  public onSubscribe() {
    if (this.isAuthenticated) {
      this.subscriptionButtonPending = true;
      this.subscriptionService
        .addToSubscriptions({
          targetId: this.profile.id,
          type: SubscriptionType.TO_USER,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.subscriptionButtonPending = false;
          this.store.dispatch(updateUserData());
        });
    }
  }

  public onUnsubscribe() {
    if (this.isAuthenticated && this.relativeSubscription) {
      this.subscriptionButtonPending = true;
      this.subscriptionService
        .removeFromSubscriptions(this.relativeSubscription!.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.subscriptionButtonPending = false;
          this.store.dispatch(updateUserData());
        });
    }
  }
}
