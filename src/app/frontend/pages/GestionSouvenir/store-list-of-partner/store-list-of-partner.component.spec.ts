import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreListOfPartnerComponent } from './store-list-of-partner.component';

describe('StoreListOfPartnerComponent', () => {
  let component: StoreListOfPartnerComponent;
  let fixture: ComponentFixture<StoreListOfPartnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreListOfPartnerComponent]
    });
    fixture = TestBed.createComponent(StoreListOfPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
