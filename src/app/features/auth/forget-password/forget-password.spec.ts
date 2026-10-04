import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../testing/english-translations';
import { AuthService } from '../services/auth.service';
import { PasswordResetFlowService } from '../services/password-reset-flow.service';
import { ForgotPasswordComponent } from './forget-password';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let forgotPassword: ReturnType<typeof vi.fn>;
  let setEmail: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    forgotPassword = vi.fn(() => of({ message: 'success' }));
    setEmail = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideRouter([]),
        ...provideEnglishTranslations(),
        { provide: AuthService, useValue: { forgotPassword } },
        { provide: PasswordResetFlowService, useValue: { setEmail } },
      ],
    }).compileComponents();

    loadEnglishTranslations();
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sends the email and opens the OTP step', () => {
    component.forgotForm.setValue({ email: 'ahmedmutti@gmail.com' });

    component.onSubmit();

    expect(forgotPassword).toHaveBeenCalledWith({ email: 'ahmedmutti@gmail.com' });
    expect(setEmail).toHaveBeenCalledWith('ahmedmutti@gmail.com');
    expect(navigate).toHaveBeenCalledWith(['/auth/verify-otp']);
  });

  it('shows validation when submitting an empty form', () => {
    component.onSubmit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Enter your email address.');
  });

  it('disables submit until the email is valid', () => {
    const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    component.forgotForm.controls.email.setValue('user@example.com');
    fixture.detectChanges();

    expect(button.disabled).toBe(false);
  });
});
