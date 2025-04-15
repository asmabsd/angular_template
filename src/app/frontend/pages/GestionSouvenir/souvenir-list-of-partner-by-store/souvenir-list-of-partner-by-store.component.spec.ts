import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouvenirListOfPartnerByStoreComponent } from './souvenir-list-of-partner-by-store.component';

describe('SouvenirListOfPartnerByStoreComponent', () => {
  let component: SouvenirListOfPartnerByStoreComponent;
  let fixture: ComponentFixture<SouvenirListOfPartnerByStoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SouvenirListOfPartnerByStoreComponent]
    });
    fixture = TestBed.createComponent(SouvenirListOfPartnerByStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
