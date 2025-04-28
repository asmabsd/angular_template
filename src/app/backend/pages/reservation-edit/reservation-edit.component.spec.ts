import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationEditComponent } from './reservation-edit.component';

describe('ReservationEditComponent', () => {
  let component: ReservationEditComponent;
  let fixture: ComponentFixture<ReservationEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationEditComponent]
    });
    fixture = TestBed.createComponent(ReservationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
