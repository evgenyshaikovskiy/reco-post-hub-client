import { Component, DestroyRef, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FileSelectEvent } from 'primeng/fileupload';
import { ResourcesService } from '../../../core/services/resources.service';
import { ProfileService } from '../../../core/services/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private _currentFile?: File;
  private _destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly resourceService: ResourcesService,
    private readonly profileService: ProfileService
  ) {}

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
            this.profileService.updateProfilePicture({ userPictureId: picId })
          ),
          switchMap(user =>
            this.resourceService.getFileByName(user.userPictureId)
          ),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe(picId => {
          console.log(picId);
        });
    }
  }

  public onClear() {
    this._currentFile = undefined;
  }
}
