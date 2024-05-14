import { distinctUntilChanged, share } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { getSpinnerState } from '../../store/selectors';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private _renderer!: Renderer2;
  public loadingInProgress$ = this._store.select(getSpinnerState);

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    rendererFactory: RendererFactory2,
    private readonly _store: Store
  ) {
    this._renderer = rendererFactory.createRenderer(null, null);
    this.loadingInProgress$
      .pipe(share(), distinctUntilChanged())
      .subscribe(state => this._changeLoadingState(state));
  }

  private _changeLoadingState(isLoading: boolean): void {
    if (isLoading) {
      const pBlockUi = this._document?.querySelector('p-blockUI');
      const pOverlay = this._document?.querySelector(
        '.p-component-overlay-enter'
      );

      if (pBlockUi) {
        this._renderer.setStyle(
          pBlockUi,
          'background-color',
          'transparent',
          RendererStyleFlags2.Important
        );
      }

      if (pOverlay) {
        this._renderer.setStyle(
          pOverlay,
          'background-color',
          'transparent',
          RendererStyleFlags2.Important
        );
      }

      this._renderer.setStyle(this._document.body, 'overflow', 'hidden');
    } else {
      this._renderer.removeStyle(this._document.body, 'overflow');
    }
  }
}
