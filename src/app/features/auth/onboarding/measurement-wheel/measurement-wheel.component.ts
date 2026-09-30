import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  isNearWheelIndex,
  measurementValues,
  stepMeasurement,
  swipeDelta,
  wheelDelta,
} from '../measurement';

@Component({
  selector: 'app-measurement-wheel',
  templateUrl: './measurement-wheel.component.html',
  styleUrl: './measurement-wheel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurementWheelComponent {
  readonly value = input.required<number>();
  readonly minimum = input.required<number>();
  readonly maximum = input.required<number>();
  readonly ariaLabel = input.required<string>();
  readonly unitSuffix = input.required<string>();
  readonly valueChange = output<number>();

  private pointerStart: { id: number; x: number; y: number } | null = null;

  slots(): (number | null)[] {
    return measurementValues(this.value(), this.minimum(), this.maximum());
  }

  isNear(index: number): boolean {
    return isNearWheelIndex(index);
  }

  select(value: number): void {
    this.valueChange.emit(value);
  }

  onKeydown(event: KeyboardEvent): void {
    const key = event.key;
    if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') {
      return;
    }

    event.preventDefault();
    const minimum = this.minimum();
    const maximum = this.maximum();

    if (key === 'Home') {
      this.valueChange.emit(minimum);
      return;
    }

    if (key === 'End') {
      this.valueChange.emit(maximum);
      return;
    }

    const delta = key === 'ArrowLeft' ? -1 : 1;
    this.valueChange.emit(stepMeasurement(this.value(), delta, minimum, maximum));
  }

  onWheel(event: WheelEvent): void {
    const delta = wheelDelta(event.deltaX, event.deltaY);
    if (delta === null) {
      return;
    }

    event.preventDefault();
    this.valueChange.emit(stepMeasurement(this.value(), delta, this.minimum(), this.maximum()));
  }

  startSwipe(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      return;
    }

    this.pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  cancelSwipe(): void {
    this.pointerStart = null;
  }

  endSwipe(event: PointerEvent): void {
    const start = this.pointerStart;
    this.pointerStart = null;

    if (!start || start.id !== event.pointerId) {
      return;
    }

    const delta = swipeDelta(start.x, start.y, event.clientX, event.clientY);
    if (delta === null) {
      return;
    }

    event.preventDefault();
    this.valueChange.emit(stepMeasurement(this.value(), delta, this.minimum(), this.maximum()));
  }
}
