import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddtransportComponent } from './addtransport.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddtransportComponent', () => {
  let component: AddtransportComponent;
  let fixture: ComponentFixture<AddtransportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddtransportComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(AddtransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
