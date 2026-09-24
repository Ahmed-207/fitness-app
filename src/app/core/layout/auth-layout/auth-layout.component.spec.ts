import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout.component';

describe('AuthLayoutComponent', () => {
  let component: AuthLayoutComponent;
  let fixture: ComponentFixture<AuthLayoutComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayoutComponent],
      providers: [provideRouter([])],
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

  it('should render the visual panel with responsive visibility classes', () => {
    const visualPanel = compiled.querySelector('aside');
    expect(visualPanel).toBeTruthy();
    expect(visualPanel?.classList.contains('hidden')).toBe(true);
    expect(visualPanel?.classList.contains('lg:flex')).toBe(true);
  });

  it('should render the logo inside the visual panel', () => {
    const visualPanel = compiled.querySelector('aside');
    const logo = visualPanel?.querySelector('img[alt="Super Fitness"]');
    expect(logo).toBeTruthy();
  });

  it('should render the hero image inside the visual panel', () => {
    const hero = compiled.querySelector('[data-testid="auth-hero"]');
    expect(hero).toBeTruthy();
  });

  it('should render the mobile logo hidden on large screens', () => {
    const mobileLogo = compiled.querySelector('main > img[alt="Super Fitness"]');
    expect(mobileLogo).toBeTruthy();
    expect(mobileLogo?.classList.contains('lg:hidden')).toBe(true);
  });
});
