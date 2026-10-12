import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-floating-fitness-agent',
  imports: [TranslatePipe],
  templateUrl: './floating-fitness-agent.component.html',
  styleUrl: './floating-fitness-agent.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingFitnessAgentComponent {}
