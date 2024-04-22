import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  catchError,
  debounceTime,
  filter,
  finalize,
  map,
  of,
  Subject,
} from 'rxjs';
import { HuggingFaceService } from '../../../core/services/hugging-face.service';
import { extractTextFromHtml } from '../../../core/utility/extract-text';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextSelectionEvent } from '../../../core/interfaces/selection-text.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextSelectionDialogComponent } from '../../../components/text-selection-dialog/text-selection-dialog.component';
import { capitalizeFirstLetter, toTitleCase } from '../../../core/utility/text';
import { ToastNotificationsService } from '../../../core/services/toast-notifications.service';
import { CreateTopicService } from '../create-topic.service';
import { CreateTopicDto } from './topic-dtos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrl: './create-topic.component.scss',
})
export class CreateTopicComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    editorContent: new FormControl(``),
    title: new FormControl(''),
  });

  public summarization: string = '';
  public summarizationLoading: boolean = false;

  public hashtags: string[] = [];
  public hashtagsLoading: boolean = false;

  public overlayInputValue: string = '';

  public titleInputValue: string = '';
  public titleLoading: boolean = false;

  private _selectedTextSubject = new Subject<TextSelectionEvent>();
  private _destroyRef = inject(DestroyRef);
  private _dialogRef: DynamicDialogRef | undefined;

  private get editorContent(): FormControl {
    return this.form.get('editorContent') as FormControl;
  }

  constructor(
    private readonly huggingFaceService: HuggingFaceService,
    private readonly dialogService: DialogService,
    private readonly notificationService: ToastNotificationsService,
    private readonly topicService: CreateTopicService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.form
      .get('editorContent')
      ?.valueChanges.pipe(
        filter(content => !!content),
        map(content => extractTextFromHtml(String(content))),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(text => {
        console.log('text', text);
      });

    // selection text event
    this._selectedTextSubject
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter(value => !!value && !!value.text && !!value.text.trim()),
        debounceTime(500)
      )
      .subscribe(selectedText => {
        console.log(selectedText);
        this._dialogRef = this.dialogService.open(
          TextSelectionDialogComponent,
          {
            position: 'center',
            modal: true,
            closable: true,
            closeOnEscape: true,
            data: {
              text: selectedText.text,
            },
            header: 'Change selected text',
          }
        );

        this._dialogRef.onClose
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe(results => {
            if (results) {
              let text = results['text'];
              if (text as string) {
                text = capitalizeFirstLetter(text.trim());
                const editorContentValue = this.editorContent.value as string;
                const modifiedText = editorContentValue.replace(
                  selectedText.text,
                  text
                );
                this.editorContent.setValue(modifiedText);
              }
            }

            this._dialogRef = undefined;
          });
      });
  }

  public addHashtag() {
    this.hashtags.includes(this.overlayInputValue) === false &&
      this.hashtags.push(this.overlayInputValue);
    this.overlayInputValue = '';
  }

  public onTitleChange(value: string) {
    this.titleInputValue = toTitleCase(value);
  }

  public onTextSelection(value: TextSelectionEvent): void {
    this._selectedTextSubject.next(value);
  }

  public onSummarization(): void {
    this.summarizationLoading = true;
    const text = extractTextFromHtml(String(this.editorContent.getRawValue()));
    this.huggingFaceService
      .summarizeText(text)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => (this.summarizationLoading = false))
      )
      .subscribe(text => {
        console.log(text, 'summarization');
        this.summarization = text;
      });
  }

  public onHashtags(): void {
    this.hashtagsLoading = true;
    const text = extractTextFromHtml(String(this.editorContent.getRawValue()));
    this.huggingFaceService
      .tokenGeneration(text)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => (this.hashtagsLoading = false))
      )
      .subscribe(value => {
        console.log('hashtags', value);
        this.hashtags = [...new Set([...this.hashtags, ...value])];
      });
  }

  public onTitle(): void {
    this.titleLoading = true;
    const text = extractTextFromHtml(String(this.editorContent.getRawValue()));
    this.huggingFaceService
      .generateTitle(text)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => (this.titleLoading = false))
      )
      .subscribe(value => {
        this.titleInputValue = value;
      });
  }

  public onRemoveHashtag(hashtag: string): void {
    this.hashtags = [...this.hashtags.filter(hs => hs !== hashtag)];
  }

  public onCreateClick(): void {
    if (this.validateContents()) {
      const contentHtml = this.editorContent.getRawValue();
      const contentText = extractTextFromHtml(contentHtml);
      const hashtags = [...this.hashtags];
      const summarization = this.summarization;
      const title = this.titleInputValue;
      const dto: CreateTopicDto = {
        contentHtml,
        contentText,
        hashtags,
        summarization,
        title,
      };

      // overlay spinner
      this.topicService
        .createTopic(dto)
        .pipe(
          catchError(error => {
            this.notificationService.showNotification(
              'error',
              error.error.message
            );
            return of(null);
          }),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe(value => {
          if (value) {
            this.notificationService.showNotification(
              'success',
              `${value.title} was created`
            );

            this.router.navigate(['/']);
          }
        });
    }
  }

  private validateContents(): boolean {
    // check if editor content is not empty
    const htmlText = this.editorContent.getRawValue() as string;
    if (htmlText.length === 0) {
      this.notificationService.showNotification(
        'error',
        "Can't submit empty topic!"
      );
      return false;
    }

    const rawText = extractTextFromHtml(htmlText);
    if (rawText.length < 100) {
      this.notificationService.showNotification('error', 'Topic is too short!');
      return false;
    }

    if (this.hashtags.length === 0) {
      this.notificationService.showNotification(
        'error',
        'Topic should have at least 1 hashtag!'
      );
      return false;
    }

    if (
      this.titleInputValue.length === 0 ||
      this.titleInputValue.trim().length === 0
    ) {
      this.notificationService.showNotification(
        'error',
        'Topic should have title!'
      );
      return false;
    }

    if (
      this.summarization.length === 0 ||
      this.summarization.trim().length === 0
    ) {
      this.notificationService.showNotification(
        'error',
        'Topic should have summarization!'
      );

      return false;
    }

    return true;
  }
}
