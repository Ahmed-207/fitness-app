import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../../testing/english-translations';
import { HomeHeroSectionComponent } from './home-hero-section.component';

describe('HomeHeroSectionComponent', () => {
  let fixture: ComponentFixture<HomeHeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHeroSectionComponent],
      providers: [provideRouter([]), ...provideEnglishTranslations()],
    }).compileComponents();

    loadEnglishTranslations();
    fixture = TestBed.createComponent(HomeHeroSectionComponent);
    fixture.detectChanges();
  });

  it('renders the hero headline and primary actions', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.home-hero__title')).toBeTruthy();
    expect(root.textContent).toContain('STAND');
    expect(root.querySelector('a.home-hero__btn--solid')?.getAttribute('href')).toContain(
      '/auth/register',
    );
    expect(root.querySelector('.home-hero__athlete')?.getAttribute('src')).toBe(
      '/assets/home/hero-athlete.png',
    );
  });
});
