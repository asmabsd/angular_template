import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditguideComponent } from './editguide.component';

describe('EditguideComponent', () => {
  let component: EditguideComponent;
  let fixture: ComponentFixture<EditguideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditguideComponent]
    });
    fixture = TestBed.createComponent(EditguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
