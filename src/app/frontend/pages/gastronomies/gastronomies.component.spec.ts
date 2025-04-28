import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastronomiesComponent } from './gastronomies.component';

describe('GastronomiesComponent', () => {
  let component: GastronomiesComponent;
  let fixture: ComponentFixture<GastronomiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GastronomiesComponent]
    });
    fixture = TestBed.createComponent(GastronomiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
