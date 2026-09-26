import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.forgotForm.valid) {
      console.log('Sending OTP to:', this.forgotForm.value.email);
      
      this.router.navigate(['/auth/verify-otp']);
    }
  }
}