import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hashtag',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './hashtag.component.html',
  styleUrl: './hashtag.component.scss',
})
export class HashtagComponent {
  @Input({ required: true }) public value!: string;
  @Output() deleteHashtag: EventEmitter<string> = new EventEmitter<string>();

  public removeClick(): void {
    this.deleteHashtag.emit(this.value);
  }
}
