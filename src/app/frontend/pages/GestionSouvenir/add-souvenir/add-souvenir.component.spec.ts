import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSouvenirComponent } from './add-souvenir.component';

describe('AddSouvenirComponent', () => {
  let component: AddSouvenirComponent;
  let fixture: ComponentFixture<AddSouvenirComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSouvenirComponent]
    });
    fixture = TestBed.createComponent(AddSouvenirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
