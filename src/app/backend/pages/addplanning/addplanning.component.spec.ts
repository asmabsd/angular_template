import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddplanningComponent } from './addplanning.component';

describe('AddplanningComponent', () => {
  let component: AddplanningComponent;
  let fixture: ComponentFixture<AddplanningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddplanningComponent]
    });
    fixture = TestBed.createComponent(AddplanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
