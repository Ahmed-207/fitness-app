import { signal } from '@angular/core';
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
import { VerifyOtpComponent } from './verify-otp';

describe('VerifyOtpComponent', () => {
  let component: VerifyOtpComponent;
  let fixture: ComponentFixture<VerifyOtpComponent>;
  let verifyResetCode: ReturnType<typeof vi.fn>;
  let forgotPassword: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    verifyResetCode = vi.fn(() => of({ status: 'Success' }));
    forgotPassword = vi.fn(() => of({ message: 'success' }));

    await TestBed.configureTestingModule({
      imports: [VerifyOtpComponent],
      providers: [
        provideRouter([]),
        ...provideEnglishTranslations(),
        { provide: AuthService, useValue: { verifyResetCode, forgotPassword } },
        {
          provide: PasswordResetFlowService,
          useValue: { email: signal<string | null>('ahmedmutti@gmail.com') },
        },
      ],
    }).compileComponents();

    loadEnglishTranslations();
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(VerifyOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sends the six-digit reset code and opens the reset step', () => {
    component.otpForm.setValue({
      otpInputs: {
        digit1: '7',
        digit2: '5',
        digit3: '4',
        digit4: '2',
        digit5: '7',
        digit6: '4',
      },
    });

    component.onVerify();

    expect(verifyResetCode).toHaveBeenCalledWith({ resetCode: '754274' });
    expect(navigate).toHaveBeenCalledWith(['/auth/reset-password']);
  });

  it('resends the code to the email from the reset flow', () => {
    component.resendCode();

    expect(forgotPassword).toHaveBeenCalledWith({ email: 'ahmedmutti@gmail.com' });
  });
});
