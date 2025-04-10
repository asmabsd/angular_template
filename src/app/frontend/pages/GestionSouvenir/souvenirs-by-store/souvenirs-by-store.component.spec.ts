import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouvenirsByStoreComponent } from './souvenirs-by-store.component';

describe('SouvenirsByStoreComponent', () => {
  let component: SouvenirsByStoreComponent;
  let fixture: ComponentFixture<SouvenirsByStoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SouvenirsByStoreComponent]
    });
    fixture = TestBed.createComponent(SouvenirsByStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
