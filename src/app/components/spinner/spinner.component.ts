import { Component } from '@angular/core';
import { SpinnerService } from '../../core/services/spinner.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BlockUIModule } from 'primeng/blockui';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [AsyncPipe, BlockUIModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  public isLoading$: Observable<boolean> =
    this._spinnerService.loadingInProgress$;
  constructor(private readonly _spinnerService: SpinnerService) {}
}
