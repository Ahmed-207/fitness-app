import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../services/language.service';
import { languageInterceptor } from './language.interceptor';

describe('languageInterceptor', () => {
  let http: HttpClient;
  let httpController: HttpTestingController;
  let language: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([languageInterceptor])),
        provideHttpClientTesting(),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    language = TestBed.inject(LanguageService);
    language.setLanguage('ar');
  });

  afterEach(() => httpController.verify());

  it('adds Accept-Language for Elevate API requests', () => {
    http.get(`${environment.apiBaseUrl}/levels`).subscribe();

    const request = httpController.expectOne(`${environment.apiBaseUrl}/levels`);
    expect(request.request.headers.get('Accept-Language')).toBe('ar');
  });

  it('does not modify i18n asset requests', () => {
    http.get('/i18n/en.json').subscribe();

    const request = httpController.expectOne('/i18n/en.json');
    expect(request.request.headers.has('Accept-Language')).toBe(false);
  });
});
