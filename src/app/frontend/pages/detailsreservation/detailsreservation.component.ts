import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationGuideService } from 'src/app/services/reservationguide.service';
import { ReservationGuide } from 'src/app/models/reservationguide.model';
@Component({
  selector: 'app-detailsreservation',
  templateUrl: './detailsreservation.component.html',
  styleUrls: ['./detailsreservation.component.css']
})
export class DetailsreservationComponent implements OnInit {
downloadContract() {
throw new Error('Method not implemented.');
}
  reservationguide: ReservationGuide | null = null;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private reservationGuideService: ReservationGuideService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.reservationGuideService.getReservationGuideById(id).subscribe({
        next: (data: ReservationGuide) => {
          this.reservationguide = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la récupération des détails de la réservation.';
          this.isLoading = false;
          console.error('Erreur :', error);
        }
      });
    } else {
      this.errorMessage = 'ID de réservation manquant dans l\'URL.';
      this.isLoading = false;
    }
  }

  navigateBack(): void {
    this.router.navigate(['/listereservationsguide']); // Remplacez par le bon chemin
  }
  
}
