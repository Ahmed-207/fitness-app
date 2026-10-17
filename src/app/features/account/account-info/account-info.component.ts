import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

interface AccountInfoRouteData {
  titleKey: string;
  descriptionKey: string;
  bulletKeys: string[];
}

@Component({
  selector: 'app-account-info',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './account-info.component.html',
  styleUrl: '../account-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountInfoComponent {
  private readonly route = inject(ActivatedRoute);
  readonly content = this.route.snapshot.data as AccountInfoRouteData;
}
