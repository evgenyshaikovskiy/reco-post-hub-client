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
  IUserProfile,
  SubscriptionType,
} from '../../core/interfaces/user.interface';
import { map, switchMap, tap } from 'rxjs';
import { ResourcesService } from '../../core/services/resources.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { AuthService } from '../../core/services/auth.service';
import { SubscriptionService } from '../../core/services/subscription.service';

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

  public get isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly resourceService: ResourcesService,
    private readonly spinnerService: SpinnerService,
    private readonly authService: AuthService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.spinnerService.changeLoadingState(true);
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
        console.log(this.authService.User);
        this.spinnerService.changeLoadingState(false);
        this.isLoaded = true;
      });
  }

  ngOnDestroy(): void {
    URL.revokeObjectURL(this.url);
  }

  public onSubscribe() {
    if (this.isAuthenticated) {
      this.subscriptionService
        .addToSubscriptions({
          targetId: this.profile.id,
          type: SubscriptionType.TO_USER,
        })
        .subscribe(sub => console.log(sub));
    }
  }
}
