import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hebergement } from 'src/app/models/hebergement.model';
import { ReservationChambre } from 'src/app/models/reservationchambre';
import { HebergementService } from 'src/app/services/hebergement.service';
import { ReservationchambreService } from 'src/app/services/reservationchambre.service';

@Component({
  selector: 'app-hebergement-details',
  templateUrl: './hebergement-details.component.html',
  styleUrls: ['./hebergement-details.component.css']
})
export class HebergementDetailsComponent {
  hebergement!: Hebergement;
  reservations: ReservationChambre[] = [];

  constructor(private route: ActivatedRoute, private hebergementService: HebergementService,  private reservationService: ReservationchambreService
  ) {}

  ngOnInit(): void {
    // Récupérer l'id de l'hébergement dans l'URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Appeler le service pour récupérer les détails de l'hébergement
    this.hebergementService.getHebergementById(id).subscribe(
      (data: Hebergement) => {
        this.hebergement = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails :', error);
      }
    );
    
    // Récupération des réservations associées
    this.reservationService.getReservationsByHebergementId(id).subscribe(
      (data: ReservationChambre[]) => {
        this.reservations = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des réservations :', error);
      }
    );
  }
 
  deleteReservation(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          // Supprimer la réservation localement dans le tableau
          this.reservations = this.reservations.filter(res => res.id_reservation !== id); // Correction ici
          console.log('Réservation supprimée avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
        }
      });
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
