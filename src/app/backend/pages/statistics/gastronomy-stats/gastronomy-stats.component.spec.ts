import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastronomyStatsComponent } from './gastronomy-stats.component';

describe('GastronomyStatsComponent', () => {
  let component: GastronomyStatsComponent;
  let fixture: ComponentFixture<GastronomyStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GastronomyStatsComponent]
    });
    fixture = TestBed.createComponent(GastronomyStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
