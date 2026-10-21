import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../testing/english-translations';

import { MarqueeBannerComponent } from './marquee-banner';

describe('MarqueeBannerComponent', () => {
  let component: MarqueeBannerComponent;
  let fixture: ComponentFixture<MarqueeBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarqueeBannerComponent],
      providers: [...provideEnglishTranslations()],
    }).compileComponents();

    loadEnglishTranslations();
    fixture = TestBed.createComponent(MarqueeBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
