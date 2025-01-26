import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ThemeService } from './services/theme.service';
import { LocationSearchComponent } from './components/location-search/location-search.component';
import { ChangeTemperatureUnitComponent } from './components/change-temperature-unit/change-temperature-unit.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LocationSearchComponent, ChangeTemperatureUnitComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  constructor(private themeService: ThemeService) {}

  public router = inject(Router);

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.document) {
      this.themeService.currentTheme$.subscribe(theme => {
        this.applyTheme(theme);
      });
    }
  }

  private applyTheme(theme: string): void {
    if (typeof window !== 'undefined' && window.document) {
      const body = document.body;
      switch (theme) {
        case 'dark':
          body.classList.add('bg-dark', 'text-white');
          body.classList.remove('bg-light', 'text-dark');
          break;
        case 'light':
          body.classList.add('bg-light', 'text-dark');
          body.classList.remove('bg-dark', 'text-white');
          break;
        case 'auto':
          break;
      }
    }
  }

}
