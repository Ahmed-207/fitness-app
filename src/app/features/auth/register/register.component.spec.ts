import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { signUp: () => of({ message: 'success', token: 'test-token' }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with the account form and requires valid credentials before onboarding', () => {
    expect(fixture.nativeElement.textContent).toContain('Create your account');
    component.beginOnboarding();
    expect(component.step()).toBe(-1);
    expect(component.credentials.controls.email.touched).toBe(true);
  });

  it('requires a selection before progressing and supports going back', () => {
    component.credentials.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'Password123',
    });
    component.beginOnboarding();
    expect(component.step()).toBe(0);
    component.next();
    expect(component.step()).toBe(0);
    component.chooseGender('female');
    component.next();
    expect(component.step()).toBe(1);
    component.back();
    expect(component.step()).toBe(0);
  });

  it('keeps profile measurements in metric units when imperial display is selected', () => {
    component.setUnits('imperial');
    component.setDisplayWeight(154);
    component.setDisplayHeight(67);

    expect(component.weight()).toBeCloseTo(69.85, 2);
    expect(component.height()).toBeCloseTo(170.18, 2);
    expect(component.displayWeight).toBe(154);
    expect(component.displayHeight).toBe(67);
  });

  it('keeps the selected measurement centered at both wheel boundaries', () => {
    expect(component.measurementValues(16, 16, 100)).toEqual([null, null, null, null, 16, 17, 18, 19, 20]);
    expect(component.measurementValues(100, 16, 100)).toEqual([96, 97, 98, 99, 100, null, null, null, null]);
  });

  it('supports arrow-key changes and clamps age to the allowed range', () => {
    component.age.set(16);
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
    component.onMeasurementKeydown(event, 'age');

    expect(event.defaultPrevented).toBe(true);
    expect(component.age()).toBe(16);

    component.onMeasurementKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 'age');
    expect(component.age()).toBe(17);
  });

  it('keeps imperial boundary selections valid in canonical metric values', () => {
    component.setUnits('imperial');
    component.setDisplayWeight(66);
    component.setDisplayHeight(47);

    expect(component.weight()).toBe(30);
    expect(component.height()).toBe(120);
    expect(component.displayWeight).toBe(66);
    expect(component.displayHeight).toBe(47);
    component.step.set(2);
    expect(component.hasAnswerForCurrentStep()).toBe(true);
    component.step.set(3);
    expect(component.hasAnswerForCurrentStep()).toBe(true);
  });

  it('keeps the selected height visible in the wheel when changing units', () => {
    component.setUnits('imperial');
    component.setDisplayHeight(67);
    component.setUnits('metric');

    expect(component.displayHeight).toBe(170);
    expect(component.measurementValues(component.displayHeight, 120, 230)[4]).toBe(170);
  });
});
