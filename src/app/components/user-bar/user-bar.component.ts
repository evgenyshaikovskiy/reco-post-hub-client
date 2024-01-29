import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-user-bar',
  standalone: true,
  imports: [OverlayPanelModule, RouterModule],
  templateUrl: './user-bar.component.html',
  styleUrl: './user-bar.component.scss',
})
export class UserBarComponent {}
