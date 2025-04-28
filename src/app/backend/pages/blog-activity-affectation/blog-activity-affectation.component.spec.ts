import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogActivityAffectationComponent } from './blog-activity-affectation.component';

describe('BlogActivityAffectationComponent', () => {
  let component: BlogActivityAffectationComponent;
  let fixture: ComponentFixture<BlogActivityAffectationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogActivityAffectationComponent]
    });
    fixture = TestBed.createComponent(BlogActivityAffectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
