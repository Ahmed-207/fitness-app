import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';

    TestBed.configureTestingModule({
      providers: [provideTranslateService({ fallbackLang: 'en', lang: 'en' })],
    });

    service = TestBed.inject(LanguageService);
    TestBed.inject(TranslateService).use('en');
  });

  it('sets Arabic language and rtl direction', () => {
    service.setLanguage('ar');

    expect(service.language()).toBe('ar');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(localStorage.getItem('fitness-app.lang')).toBe('ar');
  });
});
