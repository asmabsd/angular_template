import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsreservationComponent } from './detailsreservation.component';

describe('DetailsreservationComponent', () => {
  let component: DetailsreservationComponent;
  let fixture: ComponentFixture<DetailsreservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsreservationComponent]
    });
    fixture = TestBed.createComponent(DetailsreservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
