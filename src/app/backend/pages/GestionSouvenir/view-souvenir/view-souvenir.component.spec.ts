import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSouvenirComponent } from './view-souvenir.component';

describe('ViewSouvenirComponent', () => {
  let component: ViewSouvenirComponent;
  let fixture: ComponentFixture<ViewSouvenirComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSouvenirComponent]
    });
    fixture = TestBed.createComponent(ViewSouvenirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
