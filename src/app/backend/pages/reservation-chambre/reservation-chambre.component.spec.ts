import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationChambreComponent } from './reservation-chambre.component';

describe('ReservationChambreComponent', () => {
  let component: ReservationChambreComponent;
  let fixture: ComponentFixture<ReservationChambreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationChambreComponent]
    });
    fixture = TestBed.createComponent(ReservationChambreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
