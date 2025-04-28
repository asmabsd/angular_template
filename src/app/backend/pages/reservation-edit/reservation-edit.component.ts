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
  prixParNuit: number = 100; // Prix par nuit (exemple)

  constructor(
    private reservationService: ReservationchambreService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService // Injecte le service de toast ici

  ) {
    // Initialisation du formulaire
    this.reservationForm = this.formBuilder.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nombreadulte: ['', [Validators.required, Validators.min(1)]],
      nombrenfant: ['', [Validators.required, Validators.min(0)]],
      statut: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]], 
      prixTotal: ['', [Validators.required, Validators.min(0)]],
      nombreChambres: ['', Validators.required], // Ajouté
      typeChambre: ['', Validators.required],     // Ajouté
    });
    this.today = new Date().toISOString().split('T')[0];  // Format the date to yyyy-mm-dd
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
          clientEmail: this.reservation.clientEmail, // Charger l'email
          nombreChambres: this.reservation.nombreChambres,
          typeChambre: this.reservation.typeChambre,
          prixTotal: this.reservation.prixTotal,

        });
      },
      error => {
        console.error('Erreur lors du chargement de la réservation', error);
      }
    );
  }

  calculerPrixTotal(): void {
    const formValue = this.reservationForm.value;
  
    const dateDebut = formValue.dateDebut;
    const dateFin = formValue.dateFin;
    const nombreadulte = formValue.nombreadulte;
    const nombrenfant = formValue.nombrenfant;
    const nombreChambres = formValue.nombreChambres;
    const typeChambre = formValue.typeChambre;
  
    if (
      dateDebut &&
      dateFin &&
      this.reservation.hebergement &&
      nombreadulte >= 0 &&
      nombrenfant >= 0 &&
      nombreChambres > 0 &&
      typeChambre
    ) {
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);
  
      if (debut >= fin) {
        alert("❌ La date de début doit être inférieure à la date de fin.");
        this.reservationForm.patchValue({ prixTotal: 0 });
        return;
      }
  
      // Définir les tarifs selon le type de chambre
      let tarifType = this.reservation.hebergement.price; // Tarif de base
      switch (typeChambre) {
        case 'Single':
          tarifType = this.reservation.hebergement.price;
          break;
        case 'Double':
          tarifType = this.reservation.hebergement.price * 1.5;
          break;
        case 'Suite':
          tarifType = this.reservation.hebergement.price * 2.5;
          break;
        case 'Deluxe':
          tarifType = this.reservation.hebergement.price * 3.5;
          break;
      }
  
      let total = 0;
      const date = new Date(debut);
      while (date < fin) {
        const jour = date.getDay(); // 0 = Dimanche, 5 = Vendredi, 6 = Samedi
        let tarifJournalier = tarifType;
  
        if (jour === 0 || jour === 5 || jour === 6) {
          tarifJournalier *= 1.2; // 20% de plus le week-end
        }
  
        total += tarifJournalier * nombreChambres;
        date.setDate(date.getDate() + 1);
      }
  
      this.reservationForm.patchValue({ prixTotal: Math.round(total) });
    }
  }

  saveReservation(): void {
    if (this.reservationForm.invalid) {
      return;
    }
  
    const updatedReservation: ReservationChambre = this.reservationForm.value;
    updatedReservation.hebergement = this.reservation.hebergement; // Garde le même hébergement
  
    const type = updatedReservation.typeChambre;
    let chambresDisponibles = 0;
  
    // Calculer le nombre de chambres disponibles pour le type donné
    switch (type) {
      case 'single':
        chambresDisponibles = this.reservation.hebergement?.totalSingleChambres ?? 0;
        break;
      case 'Double':
        chambresDisponibles = this.reservation.hebergement?.totalDoubleChambres ?? 0;
        break;
      case 'Suite':
        chambresDisponibles = this.reservation.hebergement?.totalSuiteChambres ?? 0;
        break;
      case 'Deluxe':
        chambresDisponibles = this.reservation.hebergement?.totalDelexueChambres ?? 0;
        break;
      default:
        this.toastr?.error("❌ Type de chambre invalide.");
        return;
    }
  
    // Calculer le nombre de chambres restantes après avoir libéré celles de l'ancienne réservation
    let chambresDisponiblesCorrigées = chambresDisponibles;
  
    // Si une réservation existe déjà et que son type correspond, on libère les chambres
    if (this.reservation && this.reservation.typeChambre === type) {
      chambresDisponiblesCorrigées += this.reservation.nombreChambres; // Libérer les chambres de l'ancienne réservation
    }
  
    // Vérifier si le nombre de chambres demandées dépasse le nombre de chambres disponibles
    if (updatedReservation.nombreChambres > chambresDisponiblesCorrigées) {
      const reste = chambresDisponiblesCorrigées;
      const chambreLabel = reste === 1 ? '1 chambre' : `${reste} chambres`;
      this.toastr?.error(`❌ Il reste seulement ${chambreLabel} pour le type de chambre ${type}.`, 'Erreur');
      return;
    }
  
    // Si tout est valide, procéder à la mise à jour de la réservation
    this.reservationService.updateReservation(this.reservationId, updatedReservation).subscribe(
      (data) => {
        console.log('Réservation mise à jour', data);
        this.router.navigate([`/dashboard/hebergement-details/${this.reservation.hebergement.id_hebergement}`]);
      },
      error => {
        console.error('Erreur lors de la mise à jour de la réservation', error);
      }
    );
  }
  
  

  onDateChange(): void {
    this.calculerPrixTotal();
  }
  
  onInputChange(): void {
    this.calculerPrixTotal();
  }
  




  
}
