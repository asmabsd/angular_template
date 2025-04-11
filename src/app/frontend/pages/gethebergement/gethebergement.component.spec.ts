import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GethebergementComponent } from './gethebergement.component';

describe('GethebergementComponent', () => {
  let component: GethebergementComponent;
  let fixture: ComponentFixture<GethebergementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GethebergementComponent]
    });
    fixture = TestBed.createComponent(GethebergementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
