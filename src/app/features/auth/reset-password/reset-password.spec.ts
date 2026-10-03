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
import { ResetPasswordComponent } from './reset-password';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let resetPassword: ReturnType<typeof vi.fn>;
  let clear: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    resetPassword = vi.fn(() => of({ message: 'success', token: 'new-token' }));
    clear = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        provideRouter([]),
        ...provideEnglishTranslations(),
        { provide: AuthService, useValue: { resetPassword } },
        {
          provide: PasswordResetFlowService,
          useValue: { email: signal<string | null>('ahmedmutti@gmail.com'), clear },
        },
      ],
    }).compileComponents();

    loadEnglishTranslations();
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sends the email and new password then returns to login', () => {
    component.resetForm.setValue({
      password: 'Ahmed1@123',
      confirmPassword: 'Ahmed1@123',
    });

    component.onSubmit();

    expect(resetPassword).toHaveBeenCalledWith({
      email: 'ahmedmutti@gmail.com',
      newPassword: 'Ahmed1@123',
    });
    expect(clear).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
