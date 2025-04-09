import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStoreComponent } from './view-store.component';

describe('ViewStoreComponent', () => {
  let component: ViewStoreComponent;
  let fixture: ComponentFixture<ViewStoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewStoreComponent]
    });
    fixture = TestBed.createComponent(ViewStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
