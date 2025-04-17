import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCartComponent } from './view-cart.component';

describe('ViewCartComponent', () => {
  let component: ViewCartComponent;
  let fixture: ComponentFixture<ViewCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCartComponent]
    });
    fixture = TestBed.createComponent(ViewCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
