import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusPlatsComponent } from './menus-plats.component';

describe('MenusPlatsComponent', () => {
  let component: MenusPlatsComponent;
  let fixture: ComponentFixture<MenusPlatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenusPlatsComponent]
    });
    fixture = TestBed.createComponent(MenusPlatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
