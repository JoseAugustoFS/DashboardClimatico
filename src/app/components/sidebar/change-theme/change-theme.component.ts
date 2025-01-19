import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-change-theme',
  imports: [],
  templateUrl: './change-theme.component.html',
  styleUrl: './change-theme.component.css'
})
export class ChangeThemeComponent implements OnInit {

  private themeService = inject(ThemeService)
  public applyedTheme?: string | null
  constructor() {}

  ngOnInit(): void {
    this.getApplyedTheme();
  }

  private getApplyedTheme(): void {
    if (typeof window !== 'undefined' && window.document) {
      this.applyedTheme = localStorage.getItem('theme');
    }
  }

  changeTheme(theme: string): void {
    this.themeService.changeTheme(theme);
    this.getApplyedTheme();
  }
}
