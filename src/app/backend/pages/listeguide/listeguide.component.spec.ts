import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeguideComponent } from './listeguide.component';

describe('ListeguideComponent', () => {
  let component: ListeguideComponent;
  let fixture: ComponentFixture<ListeguideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeguideComponent]
    });
    fixture = TestBed.createComponent(ListeguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
