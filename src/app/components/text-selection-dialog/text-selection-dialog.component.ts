import { Component, DestroyRef, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HuggingFaceService } from '../../core/services/hugging-face.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-text-selection-dialog',
  templateUrl: './text-selection-dialog.component.html',
  styleUrl: './text-selection-dialog.component.scss',
  imports: [ButtonModule],
  standalone: true,
})
export class TextSelectionDialogComponent {
  public selectedText: string = this.config.data.text;

  public rephraseLoading: boolean = false;
  public correctLoading: boolean = false;

  public isCorrectDisabled: boolean = this.selectedText.length >= 100;

  public rephraseResult: string = '';
  public correctionResult: string = '';

  public get isRephraseResult(): boolean {
    return this.rephraseResult.length > 0;
  }

  public get isCorrectResult(): boolean {
    return this.correctionResult.length > 0;
  }

  private _destoyRef = inject(DestroyRef);

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private huggingFaceService: HuggingFaceService
  ) {}

  public onCorrectGrammar() {
    this.correctLoading = true;
    this.huggingFaceService
      .correctGrammar(this.selectedText)
      .pipe(takeUntilDestroyed(this._destoyRef))
      .subscribe(result => {
        console.log(result);
        // this.correctionResult = result;
      });
  }

  public onRephrase() {
    this.rephraseLoading = true;
    this.huggingFaceService
      .rephrase(this.selectedText)
      .pipe(takeUntilDestroyed(this._destoyRef))
      .subscribe(result => {
        this.rephraseResult = result;
        this.rephraseLoading = false;
      });
  }

  public onApply(action: 'rephrase' | 'correct') {
    this.ref.close({
      text: action === 'correct' ? this.correctionResult : this.rephraseResult,
    });
  }
}
