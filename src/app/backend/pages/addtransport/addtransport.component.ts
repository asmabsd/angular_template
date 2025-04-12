import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportService } from 'src/app/services/transport.service';
import { Router } from '@angular/router';
import { Transport } from 'src/app/models/transport.model';

@Component({
  selector: 'app-addtransport',
  templateUrl: './addtransport.component.html',
  styleUrls: ['./addtransport.component.css']
})
export class AddtransportComponent {
  transportForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transportService: TransportService,
    private router: Router
  ) {
    this.transportForm = this.fb.group({
      type: ['', Validators.required],
      disponibilite: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]]
    });
  }
  regions: string[] = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba',
    'Nabeul', 'Zaghouan', 'Bizerte', 'Beja',
    'Jendouba', 'Kef', 'Siliana', 'Sousse',
    'Monastir', 'Mahdia', 'Kairouan', 'Kasserine',
    'Sidi Bouzid', 'Sfax', 'Gabes', 'Medenine',
    'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'
  ];
  

  onSubmit(): void {
    if (this.transportForm.valid) {
      const newTransport: Transport = this.transportForm.value;

      this.transportService.addTransport(newTransport).subscribe({
        next: () => {
          console.log('Transport ajouté avec succès !');
          this.router.navigate(['/dashboard/listetransport']); // Vérifie bien ton routing ici
        },
        error: (err) => console.error('Erreur ajout transport', err)
      });
    } else {
      this.validateAllFormFields(this.transportForm);
    }
  }

  // Pour marquer tous les champs comme "touchés" et voir les erreurs
  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  // Getter pratique pour le HTML
  get f() {
    return this.transportForm.controls;
  }
  goBack(): void {
    this.router.navigate(['/dashboard/listetransport']);
  }
}
