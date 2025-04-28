import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsbackguideComponent } from './detailsbackguide.component';

describe('DetailsbackguideComponent', () => {
  let component: DetailsbackguideComponent;
  let fixture: ComponentFixture<DetailsbackguideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsbackguideComponent]
    });
    fixture = TestBed.createComponent(DetailsbackguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
