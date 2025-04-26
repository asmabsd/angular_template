import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Hebergement } from 'src/app/models/hebergement.model';
import { ReservationChambre, TypeChambre } from 'src/app/models/reservationchambre';
import { HebergementService } from 'src/app/services/hebergement.service';

@Component({
  selector: 'app-reservation-chambre',
  templateUrl: './reservation-chambre.component.html',
  styleUrls: ['./reservation-chambre.component.css']
})
export class ReservationChambreComponent {
  reservationForm!: FormGroup;
  hebergementId!: number;
  hebergement!: Hebergement;
  typeChambres = Object.values(TypeChambre);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hebergementService: HebergementService,
    // Ajoute ici ton ReservationService plus tard
  ) {}

  ngOnInit(): void {
    this.hebergementId = +this.route.snapshot.paramMap.get('id')!;
    
    this.hebergementService.getHebergementById(this.hebergementId).subscribe((data) => {
      this.hebergement = data;
    });

    this.reservationForm = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nombreadulte: [1, [Validators.required, Validators.min(1)]],
      nombrenfant: [0, [Validators.required, Validators.min(0)]],
      nombrePersonnes: [{ value: 1, disabled: true }],
      typeChambre: ['', Validators.required], // ajout ici

    });

    // Mettre à jour nombrePersonnes automatiquement
    this.reservationForm.valueChanges.subscribe(val => {
      const total = (+val.nombreadulte || 0) + (+val.nombrenfant || 0);
      this.reservationForm.get('nombrePersonnes')?.setValue(total, { emitEvent: false });
    });
    
  }

  submitReservation(): void {
    if (this.reservationForm.invalid) return;

    const formValue = this.reservationForm.getRawValue();

    const newReservation: ReservationChambre = {
      id_reservation: 0, // ou auto-généré par backend
      dateDebut: formValue.dateDebut,
      dateFin: formValue.dateFin,
      nombreadulte: formValue.nombreadulte,
      nombrenfant: formValue.nombrenfant,
      statut: 'en attente',
      prixTotal: this.hebergement.price * this.calculateNights(formValue.dateDebut, formValue.dateFin),
      hebergement: this.hebergement,
      nombreChambres: formValue.nombreChambres,
      typeChambre: formValue.typeChambre as TypeChambre,

    };

    // Appeler ton ReservationService ici pour l'envoyer au backend
    console.log('Reservation:', newReservation);

    // Redirection ou confirmation ici...
    this.router.navigate(['/confirmation']);
  }

  calculateNights(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
