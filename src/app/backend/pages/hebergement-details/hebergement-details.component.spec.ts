import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HebergementDetailsComponent } from './hebergement-details.component';

describe('HebergementDetailsComponent', () => {
  let component: HebergementDetailsComponent;
  let fixture: ComponentFixture<HebergementDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HebergementDetailsComponent]
    });
    fixture = TestBed.createComponent(HebergementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
