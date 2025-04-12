import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportService } from 'src/app/services/transport.service';
import { Transport } from 'src/app/models/transport.model';

@Component({
  selector: 'app-edit-transport',
  templateUrl: './edittransport.component.html',
  styleUrls: ['./edittransport.component.css']
})
export class EditTransportComponent implements OnInit {

  transportId: number = 0;
  transportForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private transportService: TransportService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.transportId = +idParam;

      this.transportForm = this.fb.group({
        type: ['', Validators.required],
        disponibilite: ['', Validators.required],
        location: ['', Validators.required],
        description: ['', Validators.required],
        capacity: ['', Validators.required]
      });

      this.transportService.getTransportById(this.transportId).subscribe(
        (data: Transport) => {
          this.transportForm.patchValue(data);
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'Transport introuvable ou erreur lors du chargement.';
          this.isLoading = false;
        }
      );
    } else {
      this.errorMessage = 'ID du transport manquant dans l’URL.';
      this.isLoading = false;
    }
  }

  updateTransport(): void {
    if (this.transportForm.invalid) return;

    const updatedTransport: Transport = {
      id: this.transportId,
      ...this.transportForm.value
    };

    this.transportService.updateTransport(updatedTransport).subscribe(
      () => this.router.navigate(['/dashboard/listetransport']),
      () => this.errorMessage = 'Erreur lors de la mise à jour du transport.'
    );
  }

  navigateToList(): void {
    this.router.navigate(['/dashboard/listetransport']);
  }
}
