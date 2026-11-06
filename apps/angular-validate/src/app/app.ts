import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly theme = signal<'light' | 'dark'>('light');

  protected toggleTheme(): void {
    this.theme.update((current) => current === 'light' ? 'dark' : 'light');
  }
}
