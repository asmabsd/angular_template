import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddguideComponent } from './addguide.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('AddguideComponent', () => {
  let component: AddguideComponent;
  let fixture: ComponentFixture<AddguideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddguideComponent]
    });
    fixture = TestBed.createComponent(AddguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
