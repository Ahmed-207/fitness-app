import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarqueeBannerComponent } from './marquee-banner';

describe('MarqueeBannerComponent', () => {
  let component: MarqueeBannerComponent;
  let fixture: ComponentFixture<MarqueeBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarqueeBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarqueeBannerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
