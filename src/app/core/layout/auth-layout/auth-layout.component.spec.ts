import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthLayoutComponent } from './auth-layout.component';

describe('AuthLayoutComponent', () => {
  let component: AuthLayoutComponent;
  let fixture: ComponentFixture<AuthLayoutComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayoutComponent],
      providers: [provideRouter([]), provideTranslateService({ fallbackLang: 'en', lang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a router outlet', () => {
    const outlet = compiled.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  it('should render the full-screen background image', () => {
    const background = compiled.querySelector('.auth-layout__bg');
    expect(background).toBeTruthy();
  });

  it('should render the overlay', () => {
    const overlay = compiled.querySelector('[data-testid="auth-overlay"]');
    expect(overlay).toBeTruthy();
  });

  it('should render the visual panel', () => {
    const visualPanel = compiled.querySelector('.auth-layout__visual');
    expect(visualPanel).toBeTruthy();
  });

  it('should render the hero image inside the visual panel', () => {
    const hero = compiled.querySelector('[data-testid="auth-hero"]');
    expect(hero).toBeTruthy();
  });

  it('should render the auth card with preferences bar', () => {
    const card = compiled.querySelector('[data-testid="auth-card"]');
    expect(card).toBeTruthy();
    expect(card?.querySelector('app-preferences-bar')).toBeTruthy();
  });

  it('should render the mobile logo', () => {
    const mobileLogo = compiled.querySelector('.auth-layout__logo-mobile');
    expect(mobileLogo).toBeTruthy();
  });
});
