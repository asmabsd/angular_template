import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationsComponent } from './my-reservations.component';

describe('MyReservationsComponent', () => {
  let component: MyReservationsComponent;
  let fixture: ComponentFixture<MyReservationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyReservationsComponent]
    });
    fixture = TestBed.createComponent(MyReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
