import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationChambreListComponent } from './reservation-chambre-list.component';

describe('ReservationChambreListComponent', () => {
  let component: ReservationChambreListComponent;
  let fixture: ComponentFixture<ReservationChambreListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationChambreListComponent]
    });
    fixture = TestBed.createComponent(ReservationChambreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
