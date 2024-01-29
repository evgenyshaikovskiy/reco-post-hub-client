import { Component } from '@angular/core';
import { NavigationLink } from '../../core/interfaces/link.interface';
import { Router, RouterModule } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { UserBarComponent } from '../user-bar/user-bar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, SearchBarComponent, UserBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public navigationLinks: NavigationLink[] = [
    { label: 'Home', path: '' },
    { label: 'Trending', path: 'trending' },
    { label: 'Topics', path: 'topics' },
  ];

  constructor(private readonly router: Router) {}

  public onLogoClick() {
    this.router.navigate(['']);
  }
}
