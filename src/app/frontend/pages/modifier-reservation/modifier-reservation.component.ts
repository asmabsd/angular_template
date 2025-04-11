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

ngOnInit(): void {
  const id = +this.route.snapshot.params['id'];
  this.today = new Date().toISOString().split('T')[0];

  this.reservationService.getReservationById(id).subscribe(data => {
    this.reservation = data;
    this.hebergementNom = data.hebergement?.name || 'Nom indisponible';
  });
}


  calculerPrixTotal(): void {
    if (this.reservation.dateDebut && this.reservation.dateFin) {
      const debut = new Date(this.reservation.dateDebut);
      const fin = new Date(this.reservation.dateFin);
      const jours = (fin.getTime() - debut.getTime()) / (1000 * 3600 * 24);
      if (jours <= 0) {
        this.reservation.prixTotal = 0;
        return;
      }

      const prixParNuit = 100; // Ex. : prix de base, à adapter
      let total = 0;

      for (let i = 0; i < jours; i++) {
        const jour = new Date(debut);
        jour.setDate(debut.getDate() + i);
        const jourSemaine = jour.getDay();
        const estWeekend = jourSemaine === 5 || jourSemaine === 6 || jourSemaine === 0;
        total += estWeekend ? prixParNuit * 1.2 : prixParNuit;
      }

      this.reservation.prixTotal = Math.round(total);
    }
  }

  modifierReservation(): void {
    this.reservationService.updateReservation(this.reservation.id_reservation, this.reservation).subscribe(() => {
      this.toastr.success('Réservation mise à jour avec succès ! ✅', 'Succès');
      this.router.navigate(['/listreservations']); // Redirection vers la page de liste des réservations
    }, error => {
      this.toastr.error('Une erreur est survenue.', 'Erreur');
    });
  }
}
