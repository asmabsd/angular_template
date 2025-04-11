import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReservationChambre } from 'src/app/models/reservationchambre';
import { ReservationchambreService } from 'src/app/services/reservationchambre.service';

@Component({
  selector: 'app-reservation-chambre-list',
  templateUrl: './reservation-chambre-list.component.html',
  styleUrls: ['./reservation-chambre-list.component.css']
})
export class ReservationChambreListComponent {
  reservations: ReservationChambre[] = [];

  constructor(private reservationService: ReservationchambreService,  private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.reservationService.getreservation().subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations', err);
      }
    });
  }
  calculateDuration(startDate: string | Date, endDate: string | Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

annulerReservation(id: number): void {
  if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        this.reservations = this.reservations.filter(r => r.id_reservation !== id);
        this.toastr.success("Réservation annulée avec succès ✅", "Succès");
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
        this.toastr.error("Une erreur est survenue lors de la suppression ❌", "Erreur");
      }
    });
  }
}

}
