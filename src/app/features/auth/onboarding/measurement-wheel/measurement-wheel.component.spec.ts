import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeasurementWheelComponent } from './measurement-wheel.component';

describe('MeasurementWheelComponent', () => {
  let fixture: ComponentFixture<MeasurementWheelComponent>;
  let component: MeasurementWheelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementWheelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeasurementWheelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 16);
    fixture.componentRef.setInput('minimum', 16);
    fixture.componentRef.setInput('maximum', 100);
    fixture.componentRef.setInput('ariaLabel', 'Age in years');
    fixture.componentRef.setInput('unitSuffix', ' years');
    fixture.detectChanges();
  });

  it('prevents arrow keys and emits the next clamped value', () => {
    const emitted: number[] = [];
    component.valueChange.subscribe((value) => emitted.push(value));
    const wheel = fixture.nativeElement.querySelector('.measurement-wheel') as HTMLElement;

    const backward = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
    wheel.dispatchEvent(backward);
    const forward = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
    wheel.dispatchEvent(forward);

    expect(backward.defaultPrevented).toBe(true);
    expect(emitted).toEqual([16, 17]);
  });
});
