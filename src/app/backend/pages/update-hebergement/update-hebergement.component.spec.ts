import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHebergementComponent } from './update-hebergement.component';

describe('UpdateHebergementComponent', () => {
  let component: UpdateHebergementComponent;
  let fixture: ComponentFixture<UpdateHebergementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateHebergementComponent]
    });
    fixture = TestBed.createComponent(UpdateHebergementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
