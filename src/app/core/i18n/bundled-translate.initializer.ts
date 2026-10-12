import { APP_INITIALIZER, Provider } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { appTranslations } from './app-translations';

export function provideBundledTranslations(): Provider {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [TranslateService],
    useFactory: (translate: TranslateService) => () => {
      for (const [lang, dictionary] of Object.entries(appTranslations)) {
        translate.setTranslation(lang, dictionary);
      }
    },
  };
}
