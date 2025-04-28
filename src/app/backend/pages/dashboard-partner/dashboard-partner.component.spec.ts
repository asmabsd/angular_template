import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPartnerComponent } from './dashboard-partner.component';

describe('DashboardPartnerComponent', () => {
  let component: DashboardPartnerComponent;
  let fixture: ComponentFixture<DashboardPartnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPartnerComponent]
    });
    fixture = TestBed.createComponent(DashboardPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
