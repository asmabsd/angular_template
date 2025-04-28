import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupFaComponent } from './setup-fa.component';

describe('SetupFaComponent', () => {
  let component: SetupFaComponent;
  let fixture: ComponentFixture<SetupFaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetupFaComponent]
    });
    fixture = TestBed.createComponent(SetupFaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
