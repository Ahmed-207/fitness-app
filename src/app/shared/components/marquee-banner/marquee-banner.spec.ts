import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarqueeBanner } from './marquee-banner';

describe('MarqueeBanner', () => {
  let component: MarqueeBanner;
  let fixture: ComponentFixture<MarqueeBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarqueeBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(MarqueeBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
