import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService, TranslationObject } from '@ngx-translate/core';
import en from '../../public/i18n/en.json';

export function provideEnglishTranslations(): Provider[] {
  return provideTranslateService({
    fallbackLang: 'en',
    lang: 'en',
  });
}

export function loadEnglishTranslations(): void {
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en as TranslationObject);
  translate.use('en');
}
