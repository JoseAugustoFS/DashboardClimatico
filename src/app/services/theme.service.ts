import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themeSubject = new BehaviorSubject<string>('auto');
  currentTheme$ = this.themeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        this.themeSubject.next(storedTheme);
        this.applyTheme(storedTheme);
      } else {
        this.detectSystemTheme();
      }
    }
  }
  
  private detectSystemTheme(): void {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      this.themeSubject.next(systemTheme);
      this.applyTheme(systemTheme);
    }
  }

  changeTheme(theme: string): void {
    if (theme === 'auto') {
      this.detectSystemTheme();
    } else {
      this.themeSubject.next(theme);
      this.applyTheme(theme); 
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  private applyTheme(theme: string): void {
    const body = document.body;
    body.classList.remove('bg-light', 'bg-dark', 'text-dark', 'text-white');
    
    switch (theme) {
      case 'dark':
        body.classList.add('bg-dark', 'text-white');
        break;
      case 'light':
        body.classList.add('bg-light', 'text-dark');
        break;
      case 'auto':
        this.detectSystemTheme();
        break;
    }
  }

}
