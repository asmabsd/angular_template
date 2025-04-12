import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTransportComponent } from './edittransport.component';
import { TransportService } from 'src/app/services/transport.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Transport } from 'src/app/models/transport.model';

describe('EdittransportComponent', () => {
  let component: EditTransportComponent;
  let fixture: ComponentFixture<EditTransportComponent>;
  let mockTransportService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(() => {
    mockTransportService = {
      getTransportById: jasmine.createSpy('getTransportById').and.returnValue(of({
        id: 1,
        type: 'Bus',
        disponibilite: 'Available',
        location: 'Paris',
        description: 'Comfortable bus',
        capacity: '50'
      })),
      editTransport: jasmine.createSpy('editTransport').and.returnValue(of({}))
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      declarations: [EditTransportComponent],
      providers: [
        { provide: TransportService, useValue: mockTransportService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    });

    fixture = TestBed.createComponent(EditTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transport on init', () => {
    expect(component.transportId).toBe(1);
    expect(mockTransportService.getTransportById).toHaveBeenCalledWith(1);
  });

  it('should update transport and navigate on success', () => {
    component.updateTransport();
    expect(mockTransportService.editTransport).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/listetransport']);
  });

  it('should handle update error', () => {
    mockTransportService.editTransport.and.returnValue(throwError(() => new Error('Update failed')));
    component.updateTransport();
    expect(component.errorMessage).toBe('Erreur lors de la mise à jour du transport');
  });
});
