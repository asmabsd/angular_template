import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingguideComponent } from './ratingguide.component';

describe('RatingguideComponent', () => {
  let component: RatingguideComponent;
  let fixture: ComponentFixture<RatingguideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RatingguideComponent]
    });
    fixture = TestBed.createComponent(RatingguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
