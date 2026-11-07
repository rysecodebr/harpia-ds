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

  it('should show every documented typography variation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('[data-token^="size."]')).toHaveLength(12);
    expect(compiled.querySelectorAll('[data-token^="weight."]')).toHaveLength(5);
    expect(compiled.querySelectorAll('[data-token^="line-height."]')).toHaveLength(6);
    expect(compiled.querySelectorAll('[data-token^="role."]')).toHaveLength(6);
  });

  it('should render the six diagnostic layers', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect([...compiled.querySelectorAll('[data-layer]')].map((item) => item.getAttribute('data-layer')))
      .toEqual(['card', 'popover', 'backdrop', 'dialog', 'tooltip', 'toast']);
  });

  it('should render focus examples on all four catalog surfaces', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.focus-sample button')).toHaveLength(4);
    for (const surface of ['page', 'surface', 'muted', 'elevated']) {
      expect(compiled.querySelector(`.focus-${surface} button`)).toBeTruthy();
    }
  });
});
