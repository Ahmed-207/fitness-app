import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <img
      [class]="imgClass()"
      [src]="logoSrc()"
      [attr.alt]="decorative() ? '' : (altKey() | translate)"
      [width]="width()"
      [height]="height()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogoComponent {
  private readonly themeService = inject(ThemeService);

  readonly imgClass = input('');
  readonly altKey = input('NAV.LOGO_ALT');
  readonly decorative = input(false);
  readonly width = input(74);
  readonly height = input(56);

  readonly logoSrc = computed(() =>
    this.themeService.theme() === 'light'
      ? '/assets/logo-light.png'
      : '/assets/logo-image-512.png',
  );
}
