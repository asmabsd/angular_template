import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsguideComponent } from './detailsguide.component';

describe('DetailsguideComponent', () => {
  let component: DetailsguideComponent;
  let fixture: ComponentFixture<DetailsguideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsguideComponent]
    });
    fixture = TestBed.createComponent(DetailsguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
