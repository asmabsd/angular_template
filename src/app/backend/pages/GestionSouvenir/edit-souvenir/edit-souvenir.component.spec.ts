import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSouvenirComponent } from './edit-souvenir.component';

describe('EditSouvenirComponent', () => {
  let component: EditSouvenirComponent;
  let fixture: ComponentFixture<EditSouvenirComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSouvenirComponent]
    });
    fixture = TestBed.createComponent(EditSouvenirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
