import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render six approved typography roles and switch theme', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    for (const role of ['page-title', 'section-title', 'component-title', 'body', 'supporting', 'control-label']) {
      expect(compiled.querySelector(`.role-${role}`)).toBeTruthy();
    }
    const button = compiled.querySelector<HTMLButtonElement>('.theme-button')!;
    button.click();
    await fixture.whenStable();
    expect(compiled.querySelector('main')?.getAttribute('data-harpia-theme')).toBe('dark');
  });
});
