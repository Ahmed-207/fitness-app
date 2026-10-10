import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutsSection } from './workouts-section';

describe('WorkoutsSection', () => {
  let component: WorkoutsSection;
  let fixture: ComponentFixture<WorkoutsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutsSection],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutsSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
