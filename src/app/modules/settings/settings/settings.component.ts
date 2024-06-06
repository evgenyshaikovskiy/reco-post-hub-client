import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FileSelectEvent } from 'primeng/fileupload';
import { ResourcesService } from '../../../core/services/resources.service';
import { ProfileService } from '../../../core/services/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ToastNotificationsService } from '../../../core/services/toast-notifications.service';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { setUserData } from '../../../store/actions';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrivacySettingsDialogComponent } from '../privacy-settings/privacy-settings.component';
import { ISettings } from '../../../core/interfaces/user.interface';
import { IUpdateUserDto } from '../../../core/services/dto';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  public url!: string;

  private _currentFile?: File;
  private _destroyRef = inject(DestroyRef);

  public bioForm: FormGroup = new FormGroup({
    bio: new FormControl<string | null>(this.profileInfo?.bio ?? null),
  });

  private _dialogRef: DynamicDialogRef | undefined;

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store,
    private readonly resourceService: ResourcesService,
    private readonly profileService: ProfileService,
    private readonly toastNotificationService: ToastNotificationsService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    if (this.profileInfo?.userPictureId) {
      this.resourceService
        .getFileByName(this.profileInfo.userPictureId)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(blob => {
          this.url = URL.createObjectURL(blob);
        });
    }
  }

  ngOnDestroy(): void {
    URL.revokeObjectURL(this.url);
  }

  public get profileInfo() {
    return this.authService.User;
  }

  public get isFileLoaded(): boolean {
    return !this._currentFile;
  }

  public onProfilePictureUpload(event: FileSelectEvent) {
    this._currentFile = event.currentFiles.at(0);
  }

  public onSend() {
    if (this._currentFile) {
      this.resourceService
        .loadProfilePicture(this._currentFile)
        .pipe(
          switchMap(picId =>
            this.profileService.updateUserProfile({ userPictureId: picId })
          ),
          switchMap(user =>
            this.resourceService.getFileByName(user.userPictureId)
          ),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe(() => {
          this.toastNotificationService.showNotification(
            'success',
            'Your profile picture was changed successfully'
          );
        });
    }
  }

  public onClear() {
    this._currentFile = undefined;
  }

  public onUpdateBio() {
    const bio = (this.bioForm.controls['bio'].getRawValue() as string) ?? '';
    const currentBio = this.profileInfo?.bio;

    if (bio === currentBio) {
      this.toastNotificationService.showNotification(
        'info',
        'Your bio has not changed.'
      );
      return;
    }

    this._updateProfile({ bio }, 'Your bio was changed successfully');
  }

  public openPrivacySettings() {
    this._dialogRef = this.dialogService.open(PrivacySettingsDialogComponent, {
      position: 'center',
      modal: true,
      closable: true,
      closeOnEscape: true,
      data: {
        values: this.profileInfo?.settings,
      },
      header: 'Privacy settings',
    });

    this._dialogRef.onClose
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(results => {
        this._updateProfile(
          { settings: results.settings as ISettings },
          'Your privacy settings were updated'
        );
      });
  }

  private _updateProfile(
    dto: IUpdateUserDto,
    successMessageText: string
  ): void {
    this.profileService
      .updateUserProfile({ ...dto })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(user => {
        this.profileInfo &&
          this.store.dispatch(
            setUserData({ data: { ...this.profileInfo, ...user } })
          );

        successMessageText &&
          this.toastNotificationService.showNotification(
            'success',
            successMessageText
          );
      });
  }
}
