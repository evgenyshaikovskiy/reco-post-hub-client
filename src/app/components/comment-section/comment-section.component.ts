import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { IComment } from '../../core/interfaces/request-interfaces';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { extractTextFromHtml } from '../../core/utility/extract-text';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [NgxEditorModule, ReactiveFormsModule, FormsModule, ButtonModule],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss',
})
export class CommentSectionComponent implements OnInit, OnDestroy {
  @Input() public isPreview: boolean = false;
  @Input({ required: true }) public comments!: IComment[];
  @Output() sendCommentEvent = new EventEmitter<{
    htmlContent: string;
    mentions: string[];
  }>();

  public editor!: Editor;

  public toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
  ];

  public commentControl = new FormControl('');
  public mentions: string[] = [];

  private _destroyRef: DestroyRef = inject(DestroyRef);

  public get isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: ToastNotificationsService
  ) {}

  public sendComment() {
    const htmlContent = this.commentControl.getRawValue();
    if (!htmlContent) {
      this.notificationService.showNotification(
        'warning',
        "Can't send this comment."
      );
      return;
    }

    this.sendCommentEvent.emit({ htmlContent, mentions: [] });
    this.commentControl.reset();
    // const textContent = extractTextFromHtml(htmlContent);
  }

  ngOnInit(): void {
    this.editor = new Editor({ keyboardShortcuts: true, history: true });

    this.commentControl.valueChanges
      .pipe(
        filter(content => !!content),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(value => {
        const textContent = extractTextFromHtml(String(value));
        const mentions = textContent
          .split(' ')
          .filter(word => word.startsWith('@'));
        this.mentions = [...mentions];

        console.log(textContent);
      });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
