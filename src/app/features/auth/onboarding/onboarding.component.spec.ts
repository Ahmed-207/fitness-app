import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AccountCredentials } from '../register/account-credentials';
import { AuthService } from '../services/auth.service';
import { heightFromDisplay, weightFromDisplay } from './measurement';
import { OnboardingComponent } from './onboarding.component';

describe('OnboardingComponent', () => {
  let fixture: ComponentFixture<OnboardingComponent>;
  let component: OnboardingComponent;
  let signUp: ReturnType<typeof vi.fn>;
  let authError: string | null;

  const account: AccountCredentials = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    password: 'Password@123',
  };

  beforeEach(async () => {
    authError = null;
    signUp = vi.fn(() => of({ message: 'success', token: 'test-token' }));

    await TestBed.configureTestingModule({
      imports: [OnboardingComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp,
            error: () => authError,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('account', account);
    fixture.detectChanges();
  });

  it('requires a selection before progressing and supports going back', () => {
    let exited = false;
    component.exit.subscribe(() => {
      exited = true;
    });

    component.next();
    expect(component.step()).toBe(0);

    component.gender.set('female');
    component.next();
    expect(component.step()).toBe(1);

    component.back();
    expect(component.step()).toBe(0);

    component.back();
    expect(exited).toBe(true);
  });

  it('accepts imperial boundary measurements as answers', () => {
    component.units.set('imperial');
    component.weight.set(weightFromDisplay(66, 'imperial'));
    component.height.set(heightFromDisplay(47, 'imperial'));

    component.step.set(2);
    expect(component.hasAnswer()).toBe(true);
    component.step.set(3);
    expect(component.hasAnswer()).toBe(true);
  });

  it('sends canonical metric values when the display is imperial', () => {
    component.gender.set('female');
    component.age.set(30);
    component.units.set('imperial');
    component.weight.set(weightFromDisplay(154, 'imperial'));
    component.height.set(heightFromDisplay(67, 'imperial'));
    component.goal.set('Gain weight');
    component.activity.set('level1');
    component.step.set(5);

    component.next();

    expect(signUp).toHaveBeenCalledWith({
      ...account,
      rePassword: account.password,
      gender: 'female',
      age: 30,
      weight: component.weight(),
      height: component.height(),
      goal: 'Gain weight',
      activityLevel: 'level1',
    });
    expect(component.weight()).toBeCloseTo(69.85, 2);
    expect(component.height()).toBeCloseTo(170.18, 2);
  });

  it('shows the API error and stays on the last step when signup fails', () => {
    authError = 'Email already exists';
    signUp.mockReturnValue(throwError(() => new Error('fail')));
    component.gender.set('male');
    component.goal.set('Lose weight');
    component.activity.set('level2');
    component.step.set(5);

    component.next();
    fixture.detectChanges();

    expect(component.step()).toBe(5);
    expect(fixture.nativeElement.textContent).toContain('Email already exists');
  });
});
