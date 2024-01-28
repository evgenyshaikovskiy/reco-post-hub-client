import { BehaviorSubject, Observable } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private _renderer!: Renderer2;
  private _loadingState$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public loadingInProcess$: Observable<boolean> =
    this._loadingState$.asObservable();

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    rendererFactory: RendererFactory2
  ) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  public changeLoadingState(isLoading: boolean): void {
    this._loadingState$.next(isLoading);
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
