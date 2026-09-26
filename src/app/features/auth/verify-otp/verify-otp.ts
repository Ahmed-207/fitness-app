import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe , NgClass],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyOtpComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  otpForm = this.fb.group({
    otpInputs: this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit2: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit3: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit4: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
    })
  });

  onDigitInput(event: KeyboardEvent, nextInput: HTMLInputElement | null, prevInput: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && prevInput) {
      prevInput.focus();
      return;
    }

    if (input.value && nextInput) {
      nextInput.focus();
    }
  }

  onVerify() {
    if (this.otpForm.valid) {
      const otpValues = this.otpForm.value.otpInputs;
      const fullCode = `${otpValues?.digit1}${otpValues?.digit2}${otpValues?.digit3}${otpValues?.digit4}`;
      console.log('OTP Code Entered:', fullCode);
      
      this.router.navigate(['/auth/reset-password']);
    }
  }

 resendCode() {
  console.log('Resending OTP Code...');
  
  this.otpForm.get('otpInputs')?.reset();

  // AuthService.resendOtp(email)
}
}