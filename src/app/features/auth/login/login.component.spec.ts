import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { signIn: () => of({ message: 'success', token: 'test-token' }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a login form and registration link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.textContent).toContain('Log in to Super Fitness');
    expect(compiled.querySelector('a[href="/auth/register"]')).toBeTruthy();
  });
});
