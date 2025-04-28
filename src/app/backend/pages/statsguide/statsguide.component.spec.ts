import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsguideComponent } from './statsguide.component';
describe('StatsguideComponent', () => {
  let component: StatsguideComponent;
  let fixture: ComponentFixture<StatsguideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsguideComponent]
    });
    fixture = TestBed.createComponent(StatsguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
