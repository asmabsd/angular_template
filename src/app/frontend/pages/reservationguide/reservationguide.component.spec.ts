import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationGuideComponent } from './reservationguide.component';

describe('ReservationguideComponent', () => {
  let component: ReservationGuideComponent;
  let fixture: ComponentFixture<ReservationGuideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationGuideComponent]
    });
    fixture = TestBed.createComponent(ReservationGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
