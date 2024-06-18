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
import { extractTextFromHtml } from '../../core/utility/extract-text';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [
    NgxEditorModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss',
})
export class CommentSectionComponent implements OnInit, OnDestroy {
  @Input() public isPreview: boolean = false;
  @Input({ required: true }) public comments!: IComment[];
  @Output() sendCommentEvent = new EventEmitter<{
    htmlContent: string;
    textContent: string;
  }>();

  @Output() sendReplyEvent = new EventEmitter<{
    htmlContent: string;
    textContent: string;
    parentCommentId: string;
  }>();

  public editor!: Editor;

  private replyCommentId: string = '';
  private usernameToReply: string = '';

  private _destroyRef: DestroyRef = inject(DestroyRef);

  public get replyData(): string {
    return this.replyCommentId && this.usernameToReply
      ? `Reply to: ${this.usernameToReply}`
      : '';
  }

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
  public showNested: { [key: string]: boolean } = {};

  public get isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: ToastNotificationsService
  ) {}

  ngOnInit(): void {
    this.editor = new Editor({ keyboardShortcuts: true, history: true });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  public showMore(commentId: string): void {
    this.showNested[commentId] = true;
  }

  public sendComment() {
    const htmlContent = this.commentControl.getRawValue();
    if (!htmlContent) {
      this.notificationService.showNotification('warning', 'Comment is empty!');
      return;
    }

    const textContent = extractTextFromHtml(htmlContent);
    if (this.replyCommentId && this.usernameToReply) {
      this.sendReplyEvent.emit({
        htmlContent,
        textContent,
        parentCommentId: this.replyCommentId,
      });
    } else {
      this.sendCommentEvent.emit({ htmlContent, textContent });
    }
    this.commentControl.reset();
  }

  public replyToComment(commentId: string, usernameToReply: string) {
    this.replyCommentId = commentId;
    this.usernameToReply = usernameToReply;
  }

  public cancelReply() {
    this.replyCommentId = '';
    this.usernameToReply = '';
  }
}
