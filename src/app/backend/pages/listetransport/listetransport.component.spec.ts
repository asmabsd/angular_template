import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListetransportComponent } from './listetransport.component';

describe('ListetransportComponent', () => {
  let component: ListetransportComponent;
  let fixture: ComponentFixture<ListetransportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListetransportComponent]
    });
    fixture = TestBed.createComponent(ListetransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
