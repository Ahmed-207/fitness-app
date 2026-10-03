import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let signIn: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    signIn = vi.fn(() => of({ message: 'success', token: 'test-token' }));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
        {
          provide: AuthService,
          useValue: { signIn, error: () => null },
        },
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
    expect(compiled.querySelector('a[href="/auth/register"]')).toBeTruthy();
  });

  it('submits the email and password to the sign-in endpoint', () => {
    component.loginForm.setValue({
      email: 'ahmedmutti229@gmail.com',
      password: 'Ahmed@123',
    });

    component.onSubmit();

    expect(signIn).toHaveBeenCalledWith({
      email: 'ahmedmutti229@gmail.com',
      password: 'Ahmed@123',
    });
    expect(component.isSubmitting()).toBe(false);
  });
});
