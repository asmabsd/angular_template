import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hebergement } from 'src/app/models/hebergement.model';
import { ReservationChambre } from 'src/app/models/reservationchambre';
import { ReservationchambreService } from 'src/app/services/reservationchambre.service';

@Component({
  selector: 'app-modifier-reservation',
  templateUrl: './modifier-reservation.component.html',
  styleUrls: ['./modifier-reservation.component.css']
})
export class ModifierReservationComponent {

  reservation: ReservationChambre = {
    id_reservation: 0,
    dateDebut: new Date(), // ou new Date('') si tu veux vide (mais ça va créer une date invalide)
    dateFin: new Date(),
    nombreadulte: 0,
    nombrenfant: 0,
    statut: '',
    prixTotal: 0,
    hebergement: this.getDefaultHebergement(), // Initialisation de hebergement avec un objet par défaut
    typeChambre: undefined,
    nombreChambres: 0,
  };
  today: string = '';
  hebergement: any; // Si tu veux afficher les détails de l'hébergement associé
  getDefaultHebergement(): Hebergement {
    return new Hebergement(); // Utilise le constructeur de Hebergement pour définir les valeurs par défaut
  }

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationchambreService,
    private router: Router,
    private toastr: ToastrService // Injecte le service de toast ici

  ) {}

  hebergementNom: string = '';
  ancienneReservation: ReservationChambre | null = null;

ngOnInit(): void {
  const id = +this.route.snapshot.params['id'];
  this.today = new Date().toISOString().split('T')[0];
  this.reservationService.getReservationById(id).subscribe(data => {
    this.reservation = data;
    this.hebergement = data.hebergement; // 💡 C'est cette ligne qui manquait

    this.hebergementNom = data.hebergement?.name || 'Nom indisponible';
    this.calculerPrixTotal(); // facultatif pour forcer le calcul initial

  });
  const idd = this.route.snapshot.paramMap.get('id_reservation');
  if (id) {
    this.reservationService.getReservationById(Number(id)).subscribe(data => {
      this.reservation = data;
      this.ancienneReservation = { ...data }; // pour garder une copie
    });
  }
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
    const jours = (fin.getTime() - debut.getTime()) / (1000 * 3600 * 24);

    if (jours <= 0) {
      alert("❌ La date de début doit être inférieure à la date de fin.");
      this.reservation.prixTotal = 0;
      return;
    }

    // Définir le tarif selon le type de chambre
    let tarifType = this.hebergement.price; // Tarif de base
    switch (this.reservation.typeChambre) {
      case 'single':
        tarifType = this.hebergement.price;
        break;
      case 'Double':
        tarifType = this.hebergement.price * 1.5;
        break;
      case 'Suite':
        tarifType = this.hebergement.price * 2.5;
        break;
        case 'Deluxe':
          tarifType = this.hebergement.price * 3.5;
          break;
    }

    let total = 0;

    for (let i = 0; i < jours; i++) {
      const jour = new Date(debut);
      jour.setDate(debut.getDate() + i);
      const jourSemaine = jour.getDay();
      const estWeekend = jourSemaine === 5 || jourSemaine === 6 || jourSemaine === 0;
      const tarifJournalier = estWeekend ? tarifType * 1.2 : tarifType;

      total += tarifJournalier * this.reservation.nombreChambres;
    }

    this.reservation.prixTotal = Math.round(total);
  }
}


modifierReservation(): void {
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
      this.toastr.error("❌ Type de chambre invalide.");
      return;
  }

  // Récupérer la réservation originale (si tu l’as stockée dans le composant)
  const ancienneReservation = this.ancienneReservation; // À définir ailleurs

  let chambresDisponiblesCorrigées = chambresDisponibles;

  // Si le type de chambre n’a pas changé, on "libère" les chambres de l’ancienne réservation
  if (ancienneReservation && ancienneReservation.typeChambre === type) {
    chambresDisponiblesCorrigées += ancienneReservation.nombreChambres;
  }

  if (this.reservation.nombreChambres > chambresDisponiblesCorrigées) {
    const reste = chambresDisponiblesCorrigées;
    const chambreLabel = reste === 1 ? '1 chambre' : `${reste} chambres`;
    this.toastr.error(`❌ Il reste seulement ${chambreLabel} pour le type de chambre ${type}.`, 'Erreur');
    return;
  }

  // Si tout est OK : modifier la réservation
  this.reservationService.updateReservation(this.reservation.id_reservation, this.reservation).subscribe(() => {
    this.toastr.success('Réservation mise à jour avec succès ! ✅', 'Succès');
    this.router.navigate(['/listreservations']);
  }, error => {
    this.toastr.error('Une erreur est survenue.', 'Erreur');
  });
}

}
