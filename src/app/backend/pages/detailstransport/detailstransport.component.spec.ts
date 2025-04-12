import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailstransportComponent } from './detailstransport.component';

describe('DetailstransportComponent', () => {
  let component: DetailstransportComponent;
  let fixture: ComponentFixture<DetailstransportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailstransportComponent]
    });
    fixture = TestBed.createComponent(DetailstransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
