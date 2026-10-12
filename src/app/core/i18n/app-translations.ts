import type { TranslationObject } from '@ngx-translate/core';
import ar from '../../../../public/i18n/ar.json';
import en from '../../../../public/i18n/en.json';

export const appTranslations: Record<'en' | 'ar', TranslationObject> = {
  en: en as TranslationObject,
  ar: ar as TranslationObject,
};
