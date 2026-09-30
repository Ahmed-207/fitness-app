import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../../testing/english-translations';
import { AccountFormComponent } from './account-form.component';

describe('AccountFormComponent', () => {
  let fixture: ComponentFixture<AccountFormComponent>;
  let component: AccountFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountFormComponent],
      providers: [provideRouter([]), ...provideEnglishTranslations()],
    }).compileComponents();

    loadEnglishTranslations();
    fixture = TestBed.createComponent(AccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not emit when the form is invalid', () => {
    const emitted: unknown[] = [];
    component.submitted.subscribe((value) => emitted.push(value));

    component.submit();
    fixture.detectChanges();

    expect(emitted).toEqual([]);
    expect(component.form.controls.email.touched).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Enter a valid email address.');
  });

  it('rejects a password that misses the API symbol requirement', () => {
    component.form.controls.password.setValue('Password123');
    component.form.controls.password.markAsTouched();
    fixture.detectChanges();

    expect(component.form.controls.password.invalid).toBe(true);
    expect(fixture.nativeElement.textContent).toContain(
      'Use 8+ characters with uppercase, lowercase, a number, and a symbol.',
    );
  });

  it('requires at least two characters in each name', () => {
    component.form.controls.firstName.setValue('A');
    component.form.controls.firstName.markAsTouched();
    fixture.detectChanges();

    expect(component.form.invalid).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Use at least 2 characters.');
  });

  it('emits credentials when the password matches the API rule', () => {
    const emitted: unknown[] = [];
    component.submitted.subscribe((value) => emitted.push(value));
    const credentials = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'Password@123',
    };

    component.form.setValue(credentials);
    component.submit();

    expect(emitted).toEqual([credentials]);
  });
});
