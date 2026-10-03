import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../testing/english-translations';
import { OnboardingComponent } from '../onboarding/onboarding.component';
import { AuthService } from '../services/auth.service';
import { AccountFormComponent } from './account-form/account-form.component';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        ...provideEnglishTranslations(),
        {
          provide: AuthService,
          useValue: {
            signUp: () => of({ message: 'success', token: 'test-token' }),
          },
        },
      ],
    }).compileComponents();

    loadEnglishTranslations();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts on the account form', () => {
    expect(component.phase()).toBe('account');
    expect(fixture.nativeElement.textContent).toContain('Create An Account');
  });

  it('stays on the account form until the credentials are valid', () => {
    accountForm().submit();
    fixture.detectChanges();

    expect(component.phase()).toBe('account');
    expect(accountForm().form.controls.email.touched).toBe(true);
  });

  it('opens onboarding after valid credentials and returns without losing the draft', () => {
    accountForm().form.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'Password@123',
    });
    submitForm();

    expect(component.phase()).toBe('onboarding');
    expect(fixture.nativeElement.textContent).toContain('TELL US ABOUT YOURSELF');

    const male = fixture.nativeElement.querySelector('.gender-card') as HTMLButtonElement;
    male.click();
    fixture.detectChanges();

    const back = fixture.nativeElement.querySelector(
      'app-auth-back-button button',
    ) as HTMLButtonElement;
    back.click();
    fixture.detectChanges();

    expect(component.phase()).toBe('account');

    submitForm();
    expect(onboarding().gender()).toBe('male');
    expect(fixture.nativeElement.querySelector('.gender-card.selected')?.textContent).toContain(
      'Male',
    );
  });

  function accountForm(): AccountFormComponent {
    return fixture.debugElement.query(By.directive(AccountFormComponent)).componentInstance;
  }

  function onboarding(): OnboardingComponent {
    return fixture.debugElement.query(By.directive(OnboardingComponent)).componentInstance;
  }

  function submitForm(): void {
    accountForm().submit();
    fixture.detectChanges();
  }
});
