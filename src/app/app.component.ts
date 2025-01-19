import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  constructor(private themeService: ThemeService) {}

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
