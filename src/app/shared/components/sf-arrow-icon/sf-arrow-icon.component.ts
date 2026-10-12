import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SfArrowIconSize = 'xs' | 'sm' | 'md' | 'lg';
export type SfArrowIconTone = 'default' | 'accent';

@Component({
  selector: 'app-sf-arrow-icon',
  template: `
    <svg
      class="sf-arrow-icon"
      [class.sf-arrow-icon--accent]="tone() === 'accent'"
      [class.sf-arrow-icon--flip-start]="flipForRtl()"
      [attr.width]="dimension()"
      [attr.height]="dimension()"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22.0973 11.137C20.3733 12.8609 17.2317 12.8616 15.507 11.137L14.7999 10.4299L13.3857 11.8441L14.0928 12.5512C15.3472 13.8056 17.074 14.4321 18.8014 14.4328L10.0765 23.1578L11.4907 24.572L20.2157 15.847C20.2164 17.5745 20.8429 19.3012 22.0973 20.5557L22.8044 21.2628L24.2186 19.8485L23.5115 19.1414C21.7868 17.4168 21.7876 14.2751 23.5115 12.5512L24.2186 11.8441L22.8044 10.4299L22.0973 11.137Z"
      />
    </svg>
  `,
  styleUrl: './sf-arrow-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sf-arrow-icon-host',
  },
})
export class SfArrowIconComponent {
  readonly size = input<SfArrowIconSize>('sm');
  readonly tone = input<SfArrowIconTone>('default');
  /** Mirror the arrow in RTL so it still reads as forward/outward. */
  readonly flipForRtl = input(true);

  readonly dimension = computed(() => {
    const map: Record<SfArrowIconSize, string> = {
      xs: '13',
      sm: '17',
      md: '21',
      lg: '24',
    };
    return map[this.size()];
  });
}
