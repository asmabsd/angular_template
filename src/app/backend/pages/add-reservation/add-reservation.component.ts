import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hebergement } from 'src/app/models/hebergement.model';
import { ReservationChambre } from 'src/app/models/reservationchambre';
import { HebergementService } from 'src/app/services/hebergement.service';
import { ReservationchambreService } from 'src/app/services/reservationchambre.service';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit {
  idHebergement!: number;
  reservation: ReservationChambre = new ReservationChambre();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationchambreService,
    private hebergementService: HebergementService ,
    private toastr: ToastrService


  ) {}

  ngOnInit(): void {
    this.idHebergement = Number(this.route.snapshot.paramMap.get('id'));
    
    this.hebergementService.getHebergementById(this.idHebergement).subscribe({
      next: (data) => {
        this.hebergement = data;
      },
      error: (err) => {
        console.error("Erreur de chargement de l’hébergement :", err);
      }
    });
  }
  
  onSubmit() {
    const type = this.reservation.typeChambre;
    let chambresDisponibles = 0;
  
    switch (type) {
      case 'single':
        chambresDisponibles = this.hebergement.totalSingleChambres;
        break;
      case 'Double':
        chambresDisponibles = this.hebergement.totalDoubleChambres;
        break;
      case 'Suite':
        chambresDisponibles = this.hebergement.totalSuiteChambres;
        break;
      case 'Deluxe':
        chambresDisponibles = this.hebergement.totalDelexueChambres;
        break;
      default:
        this.toastr.error("Type de chambre invalide ❌");
        return;
    }
  
    if (this.reservation.nombreChambres > chambresDisponibles) {
      const reste = chambresDisponibles;
      const chambreLabel = reste < 1 ? 'une seule chambre' : `${reste} chambres`;
      this.toastr.error(`❌ Il reste ${chambreLabel} de type ${type}`);
      return; // Empêche la soumission
    }
  
    // ✅ OK : nombre disponible suffisant
    this.reservationService.addReservationToHebergement(this.idHebergement, this.reservation).subscribe({
      next: () => {
        this.toastr.success('Réservation ajoutée avec succès ! ✅');
        this.router.navigate(['/dashboard/gethebback']);
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout :", err);
        this.toastr.error("Erreur lors de l'ajout de la réservation ❌");
      }
    });
  }
  
  
  today: string = new Date().toISOString().split('T')[0];

  hebergement!: Hebergement;

  calculerPrixTotal(): void {
    if (
      this.reservation.dateDebut &&
      this.reservation.dateFin &&
      this.hebergement &&
      this.reservation.nombreadulte >= 0 &&
      this.reservation.nombrenfant >= 0 &&
      this.reservation.nombreChambres > 0 &&
      this.reservation.typeChambre
    ) {
      const debut = new Date(this.reservation.dateDebut);
      const fin = new Date(this.reservation.dateFin);
  
      if (debut >= fin) {
        alert("❌ La date de début doit être inférieure à la date de fin.");
        this.reservation.prixTotal = 0;
        return;
      }
  
      // Déterminer le tarif selon le type de chambre
      let tarifBase = this.hebergement.price;
      switch (this.reservation.typeChambre) {
        case 'single':
          tarifBase = this.hebergement.price;
          break;
        case 'Double':
          tarifBase = this.hebergement.price * 1.5;
          break;
        case 'Suite':
          tarifBase = this.hebergement.price * 2.5;
          break;
        case 'Deluxe':
          tarifBase = this.hebergement.price * 3.5;
          break;
      }
  
      let total = 0;
      const date = new Date(debut);
  
      while (date < fin) {
        const jour = date.getDay(); // 0=dimanche, 5=vendredi, 6=samedi
        let tarifJournalier = tarifBase;
  
        if (jour === 0 || jour === 5 || jour === 6) {
          tarifJournalier *= 1.2; // Majoration week-end de 20%
        }
  
        total += tarifJournalier * this.reservation.nombreChambres;
        date.setDate(date.getDate() + 1);
      }
  
      this.reservation.prixTotal = Math.round(total);
    } else {
      this.reservation.prixTotal = 0;
    }
  }
  
  
}
