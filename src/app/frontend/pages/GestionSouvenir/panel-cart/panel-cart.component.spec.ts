import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelCartComponent } from './panel-cart.component';

describe('PanelCartComponent', () => {
  let component: PanelCartComponent;
  let fixture: ComponentFixture<PanelCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelCartComponent]
    });
    fixture = TestBed.createComponent(PanelCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
