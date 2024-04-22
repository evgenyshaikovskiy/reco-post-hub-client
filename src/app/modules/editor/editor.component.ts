import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { TextSelectionEvent } from '../../core/interfaces/selection-text.interface';
import { isSingleParagraph } from '../../core/utility/text';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) form!: FormGroup;
  @Output() textSelectionEvent = new EventEmitter<TextSelectionEvent>();

  public editor!: Editor;

  public toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  ngOnInit(): void {
    this.editor = new Editor({ keyboardShortcuts: true, history: true });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  constructor(
    private readonly notificationsService: ToastNotificationsService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleClick(clickEvent: any) {
    const selection = window.getSelection();
    if (selection && selection?.toString()) {
      if (!isSingleParagraph(selection.toString())) {
        this.notificationsService.showNotification(
          'warning',
          'Selected text is not single paragraph'
        );
        return;
      }

      this.textSelectionEvent.emit({
        text: selection.toString(),
        screenY: clickEvent.screenY,
      });
    }
  }
}
