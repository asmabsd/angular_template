import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddhebergementComponent } from './addhebergement.component';

describe('AddhebergementComponent', () => {
  let component: AddhebergementComponent;
  let fixture: ComponentFixture<AddhebergementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddhebergementComponent]
    });
    fixture = TestBed.createComponent(AddhebergementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
