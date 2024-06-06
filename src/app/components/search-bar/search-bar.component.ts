import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, filter, switchMap } from 'rxjs';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  private _destroyRef: DestroyRef = inject(DestroyRef);
  public searchControl = new FormControl('', { nonNullable: true });
  private readonly promptMinLength = 3;

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        filter(
          prompt => !!prompt && prompt.trim().length > this.promptMinLength
        ),
        debounceTime(300),
        switchMap(correctedPrompt =>
          this.searchService.searchByPrompt(correctedPrompt)
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(searchResult => {});
  }

  constructor(private readonly searchService: SearchService) {}

  public placeholderText = 'Search everywhere...';
  // private _handleSearchResults(_res: unknown) {}
}
