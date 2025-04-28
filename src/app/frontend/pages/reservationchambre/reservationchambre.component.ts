import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hebergement } from 'src/app/models/hebergement.model';
import { ReservationChambre } from 'src/app/models/reservationchambre';
import { HebergementService } from 'src/app/services/hebergement.service';
import { ReservationchambreService } from 'src/app/services/reservationchambre.service';

@Component({
  selector: 'app-reservationchambre',
  templateUrl: './reservationchambre.component.html',
  styleUrls: ['./reservationchambre.component.css']
})
export class ReservationchambreComponent implements OnInit {
  hebergement: Hebergement | undefined;
  reservation: ReservationChambre = new ReservationChambre();
  readonly DISCOUNT_RATE = 0.1; // Remise de 10% pour les hébergements premium

  constructor(
    private route: ActivatedRoute,
    private hebergementService: HebergementService,
    private router: Router,
    private reservationService: ReservationchambreService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id_hebergement');

    if (id) {
      this.hebergementService.getHebergementById(Number(id)).subscribe(
        (data: Hebergement) => {
          console.log('Hebergement reçu:', data);
          this.hebergement = {
            ...data,
            discountedPrice: data.rating >= 4 ? data.price * (1 - this.DISCOUNT_RATE) : undefined
          };
        },
        (error) => {
          console.error('Erreur lors de la récupération de l\'hébergement:', error);
          this.toastr.error('Erreur lors du chargement de l\'hébergement.');
        }
      );
    }
  }

  today: string = new Date().toISOString().split('T')[0];

  reserverChambre(): void {
    console.log('Données envoyées:', this.reservation);

    if (!this.reservation.clientEmail) {
      this.toastr.error('❌ Veuillez fournir une adresse email valide.', 'Erreur');
      return;
    }

    const idHebergement = this.route.snapshot.paramMap.get('id_hebergement');
    if (!idHebergement) {
      this.toastr.error('❌ ID hébergement manquant.');
      return;
    }

    const type = this.reservation.typeChambre;
    let chambresDisponibles = 0;

    switch (type) {
      case 'single':
        chambresDisponibles = this.hebergement?.totalSingleChambres ?? 0;
        break;
      case 'Double':
        chambresDisponibles = this.hebergement?.totalDoubleChambres ?? 0;
        break;
      case 'Suite':
        chambresDisponibles = this.hebergement?.totalSuiteChambres ?? 0;
        break;
      case 'Deluxe':
        chambresDisponibles = this.hebergement?.totalDelexueChambres ?? 0;
        break;
      default:
        this.toastr.error('❌ Type de chambre invalide.');
        return;
    }

    if (this.reservation.nombreChambres > chambresDisponibles) {
      const reste = chambresDisponibles;
      const chambreLabel = reste === 1 ? '1 chambre' : `${reste} chambres`;
      this.toastr.error(`❌ Il reste seulement ${chambreLabel} pour le type de chambre ${type}.`, 'Erreur');
      return;
    }

    this.reservationService.addReservationToHebergement(
      Number(idHebergement),
      this.reservation
    ).subscribe(
      () => {
        this.toastr.success(
          '✅ Réservation confirmée ! Un email de confirmation a été envoyé.',
          'Succès',
          {
            timeOut: 10000,
            positionClass: 'toast-bottom-left',
            closeButton: true,
            progressBar: true,
          }
        );
        this.router.navigate(['/hebergement']);
      },
      (error) => {
        console.error('❌ Erreur lors de la réservation:', error);
        this.toastr.error('❌ Une erreur est survenue, veuillez réessayer.', 'Erreur');
      }
    );
  }

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
        alert('❌ La date de début doit être inférieure à la date de fin.');
        this.reservation.prixTotal = 0;
        return;
      }

      // Utiliser discountedPrice si disponible (hébergement premium), sinon price
      const basePrice = this.hebergement.discountedPrice !== undefined 
        ? this.hebergement.discountedPrice 
        : this.hebergement.price;

      let tarifType = basePrice;
      switch (this.reservation.typeChambre) {
        case 'single':
          tarifType = basePrice;
          break;
        case 'Double':
          tarifType = basePrice * 1.5;
          break;
        case 'Suite':
          tarifType = basePrice * 2.5;
          break;
        case 'Deluxe':
          tarifType = basePrice * 3.5;
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

        total += tarifJournalier * this.reservation.nombreChambres;
        date.setDate(date.getDate() + 1);
      }

      this.reservation.prixTotal = Math.round(total);
    }
  }

  isHebergementAvailable(hebergement: Hebergement): boolean {
    return (
      hebergement.totalSingleChambres > 0 ||
      hebergement.totalDoubleChambres > 0 ||
      hebergement.totalSuiteChambres > 0 ||
      hebergement.totalDelexueChambres > 0
    );
  }
}