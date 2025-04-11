import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReservationChambre } from 'src/app/models/reservationchambre';
import { ReservationchambreService } from 'src/app/services/reservationchambre.service';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.css']
})
export class ReservationEditComponent implements OnInit {
  reservationForm: FormGroup;
  reservation: ReservationChambre = {} as ReservationChambre;
  isEditMode: boolean = false;
  reservationId: number = 0;
  today: string; // Add this property for today's date

  constructor(
    private reservationService: ReservationchambreService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialisation du formulaire
    this.reservationForm = this.formBuilder.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nombreadulte: ['', [Validators.required, Validators.min(1)]],
      nombrenfant: ['', [Validators.required, Validators.min(0)]],
      statut: ['', Validators.required],
      prixTotal: ['', [Validators.required, Validators.min(0)]]
    });
    this.today = new Date().toISOString().split('T')[0];  // Format the date to yyyy-mm-dd

  }
  goToHebergementDetails(id: number): void {
    this.router.navigate([`/hebergement-details/${id}`]);
  }
  goToHebergementDetailsIfValid(): void {
    const hebergementId = this.reservation.hebergement?.id_hebergement;
    if (hebergementId !== undefined) {
      this.goToHebergementDetails(hebergementId);
    } else {
      // Vous pouvez gérer l'erreur ou l'absence de redirection ici
      console.warn('ID de l\'hébergement non défini');
    }
  }
  

  ngOnInit(): void {
    // Récupérer l'ID de la réservation à partir de l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reservationId = +id;  // Assurez-vous que l'ID est un nombre
      this.isEditMode = true;
      this.loadReservation();
    }
  }

  // Charger la réservation pour l'édition
  loadReservation(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe(
      (data: ReservationChambre) => {
        this.reservation = data;
        this.reservationForm.patchValue({
          dateDebut: this.reservation.dateDebut,
          dateFin: this.reservation.dateFin,
          nombreadulte: this.reservation.nombreadulte,
          nombrenfant: this.reservation.nombrenfant,
          statut: this.reservation.statut,
          prixTotal: this.reservation.prixTotal
        });
      },
      error => {
        console.error('Erreur lors du chargement de la réservation', error);
      }
    );
    
  }
  
  
  saveReservation(): void {
    if (this.reservationForm.invalid) {
      return;
    }

    const updatedReservation: ReservationChambre = this.reservationForm.value;
    updatedReservation.hebergement = this.reservation.hebergement; // Maintenir l'id de l'hébergement intact

    if (this.isEditMode) {
      this.reservationService.updateReservation(this.reservationId, updatedReservation).subscribe(
        (data) => {
          console.log('Réservation mise à jour', data);
          // Rediriger vers les détails de l'hébergement associé à la réservation
          this.router.navigate([`/hebergement-details/${this.reservation.hebergement.id_hebergement}`]);
        },
        error => {
          console.error('Erreur lors de la mise à jour de la réservation', error);
        }
      );
    } else {
      this.reservationService.addreservation(updatedReservation).subscribe(
        (data) => {
          console.log('Réservation ajoutée', data);
          this.router.navigate(['/reservations']);
        },
        error => {
          console.error('Erreur lors de l\'ajout de la réservation', error);
        }
      );
    }
  }

  
}
