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

  constructor(
    private route: ActivatedRoute,  // Pour accéder à l'ID dans l'URL
    private hebergementService: HebergementService, // Pour récupérer les données de l'hébergement
    private router: Router,
    private reservationService: ReservationchambreService,
    private toastr: ToastrService // Injecter ToastrService


  ) {}

 ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id_hebergement');
  
  if (id) {
    this.hebergementService.getHebergementById(Number(id)).subscribe(
      (data: Hebergement) => {
        console.log("Hebergement reçu :", data); // 🔍 Ajout ici
        this.hebergement = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'hébergement:', error);
      }
    );
  }
}

today: string = new Date().toISOString().split('T')[0];

reserverChambre(): void {
  const idHebergement = this.route.snapshot.paramMap.get('id_hebergement'); // Utilisation de l'ID correct dans l'URL
  if (idHebergement) {
    // Conversion en nombre et appel de la méthode du service pour réserver la chambre
    this.reservationService.addReservationToHebergement(Number(idHebergement), this.reservation).subscribe(
      () => {
        // Affichage de la notification "toast"
        this.toastr.success('✅ Réservation confirmée !', 'Succès', {
          timeOut: 10000,           // Durée d'affichage
          positionClass: 'toast-bottom-left',  // Position de la notification
          closeButton: true,       // Ajoute un bouton de fermeture
          progressBar: true,       // Affiche une barre de progression
        });

        // Optionnel : rediriger vers la page de l'hébergement
        this.router.navigate(['/hebergement']);
      },
      error => {
        console.error("❌ Erreur lors de la réservation :", error);
        this.toastr.error('❌ Une erreur est survenue, veuillez réessayer.', 'Erreur');
      }
    );
  } else {
    console.error("❌ ID de l'hébergement non trouvé dans l'URL");
    this.toastr.error('❌ ID de l\'hébergement manquant.', 'Erreur');
  }
}




calculerPrixTotal(): void {
  if (
    this.reservation.dateDebut &&
    this.reservation.dateFin &&
    this.hebergement &&
    this.reservation.nombreadulte >= 0 &&
    this.reservation.nombrenfant >= 0
  ) {
    const debut = new Date(this.reservation.dateDebut);
    const fin = new Date(this.reservation.dateFin);

    // Vérification que la date de début est inférieure à la date de fin
    if (debut >= fin) {
      alert("❌ La date de début doit être inférieure à la date de fin.");
      this.reservation.prixTotal = 0; // Réinitialiser le prix total en cas de dates invalides
      return;
    }

    let total = 0;
    const date = new Date(debut);
    while (date < fin) {
      const jour = date.getDay(); // 0 = dimanche, 5 = vendredi, 6 = samedi

      let prixAdulte = this.hebergement.price;
      if (jour === 5 || jour === 6 || jour === 0) {
        prixAdulte *= 1.2; // +20% pour les week-ends
      }

      const prixTotalAdulte = this.reservation.nombreadulte * prixAdulte;
      const prixTotalEnfant = this.reservation.nombrenfant * (prixAdulte * 0.5);

      total += prixTotalAdulte + prixTotalEnfant;
      date.setDate(date.getDate() + 1);
    }

    this.reservation.prixTotal = Math.round(total);
  }
}






}
