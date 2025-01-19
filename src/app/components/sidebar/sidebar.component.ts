import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ChangeThemeComponent } from './change-theme/change-theme.component';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, ChangeThemeComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  public router = inject(Router);
  
}
