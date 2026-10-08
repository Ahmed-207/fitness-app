import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { AboutusPage } from './aboutus-page';

describe('AboutusPage', () => {
  let component: AboutusPage;
  let fixture: ComponentFixture<AboutusPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutusPage],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutusPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
