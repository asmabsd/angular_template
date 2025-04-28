import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherplanningComponent } from './afficherplanning.component';

describe('AfficherplanningComponent', () => {
  let component: AfficherplanningComponent;
  let fixture: ComponentFixture<AfficherplanningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfficherplanningComponent]
    });
    fixture = TestBed.createComponent(AfficherplanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
