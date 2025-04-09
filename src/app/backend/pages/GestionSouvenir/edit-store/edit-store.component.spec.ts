import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoreComponent } from './edit-store.component';

describe('EditStoreComponent', () => {
  let component: EditStoreComponent;
  let fixture: ComponentFixture<EditStoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditStoreComponent]
    });
    fixture = TestBed.createComponent(EditStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
