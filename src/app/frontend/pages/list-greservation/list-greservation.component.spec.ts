import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGReservationComponent } from './list-greservation.component';

describe('ListGReservationComponent', () => {
  let component: ListGReservationComponent;
  let fixture: ComponentFixture<ListGReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListGReservationComponent]
    });
    fixture = TestBed.createComponent(ListGReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
