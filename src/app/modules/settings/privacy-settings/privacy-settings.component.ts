import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISettings } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-privacy-settings-dialog',
  templateUrl: './privacy-settings.component.html',
  styleUrl: './privacy-settings.component.scss',
  imports: [ButtonModule, FormsModule, ReactiveFormsModule, CheckboxModule],
  standalone: true,
})
export class PrivacySettingsDialogComponent {
  public form: FormGroup = new FormGroup({
    showBio: new FormControl<boolean>(this.config.data.values.showBio),
    showEmail: new FormControl<boolean>(this.config.data.values.showBio),
    showUserSubscriptions: new FormControl<boolean>(
      this.config.data.values.showUserSubscriptions
    ),
    showHashtagSubscriptions: new FormControl<boolean>(
      this.config.data.values.showHashtagSubscriptions
    ),
    showComments: new FormControl<boolean>(
      this.config.data.values.showComments
    ),
    showKarma: new FormControl<boolean>(this.config.data.values.showKarma),
    showRating: new FormControl<boolean>(this.config.data.values.showRating),
    showScores: new FormControl<boolean>(this.config.data.values.showScores),
  });

  public controlLabelMapping: { controlName: string; label: string }[] = [
    { controlName: 'showBio', label: 'Show Bio' },
    {
      controlName: 'showEmail',
      label: 'Show Email',
    },
    {
      controlName: 'showUserSubscriptions',
      label: 'Show Subscriptions',
    },
    {
      controlName: 'showHashtagSubscriptions',
      label: 'Show Hashtag Preferences',
    },
    {
      controlName: 'showComments',
      label: 'Show Comments',
    },
    {
      controlName: 'showKarma',
      label: 'Show Karma',
    },
    {
      controlName: 'showRating',
      label: 'Show Rating',
    },
    {
      controlName: 'showScores',
      label: 'Show Scores',
    },
  ];

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {}

  public onApply(): void {
    this.ref.close({ settings: this.form.getRawValue() as ISettings });
  }
}
