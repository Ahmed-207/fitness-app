import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UnitSystem } from '../onboarding.models';
import { MeasurementWheelComponent } from '../measurement-wheel/measurement-wheel.component';

@Component({
  selector: 'app-measurement-step',
  imports: [MeasurementWheelComponent, TranslatePipe],
  templateUrl: './measurement-step.component.html',
  styleUrl: './measurement-step.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurementStepComponent {
  readonly title = input.required<string>();
  readonly intro = input('ONBOARDING.PLAN_INTRO');
  readonly caption = input.required<string>();
  readonly captionMode = input<'label' | 'units'>('label');
  readonly unitAriaLabel = input('');
  readonly units = input<UnitSystem>('metric');
  readonly value = input.required<number>();
  readonly minimum = input.required<number>();
  readonly maximum = input.required<number>();
  readonly ariaLabel = input.required<string>();
  readonly unitSuffix = input.required<string>();
  readonly feet = input<number | null>(null);
  readonly inches = input<number | null>(null);

  readonly unitsChange = output<UnitSystem>();
  readonly valueChange = output<number>();

  toggleUnits(): void {
    this.unitsChange.emit(this.units() === 'metric' ? 'imperial' : 'metric');
  }
}
