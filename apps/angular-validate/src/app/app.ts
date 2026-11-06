import { Component, signal } from '@angular/core';
import { lineHeightSamples, roleSamples, sizeSamples, weightSamples } from './typography-samples';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly theme = signal<'light' | 'dark'>('light');
  protected readonly sizes = sizeSamples;
  protected readonly weights = weightSamples;
  protected readonly lineHeights = lineHeightSamples;
  protected readonly roles = roleSamples;

  protected toggleTheme(): void {
    this.theme.update((current) => current === 'light' ? 'dark' : 'light');
  }
}
