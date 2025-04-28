import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation.service';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss']
})
export class MyReservationsComponent implements OnInit {
  reservations: any[] = [];
  loading: boolean = true;
  error: string = '';
  
  // Static user ID as requested
  readonly userId: number = 1;
  
  constructor(
    private router: Router,
    private reservationService: ReservationService,
    private activityService: ActivityService
  ) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getReservationsByUserId(this.userId).subscribe({
      next: (data) => {
        // Data already contains the activity details, so we can use them directly
        this.reservations = data;
        console.log(this.reservations);
        // We don't need the separate API calls to get activity details
        // since they're already included in the response
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.error = 'Failed to load your reservations. Please try again later.';
        this.loading = false;
      }
    });
  }

  cancelReservation(reservationId: number): void {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      this.loading = true;
      this.reservationService.deleteReservation(reservationId).subscribe({
        next: () => {
          // Remove the cancelled reservation from the list
          this.reservations = this.reservations.filter(r => r.idReservation !== reservationId);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cancelling reservation:', error);
          this.error = 'Failed to cancel reservation. Please try again later.';
          this.loading = false;
        }
      });
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/travelix/images/activity_default.jpg'; // Default image if imagePath is null or undefined
    }
    return this.activityService.getImageUrl(imagePath);
  }

  formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString(undefined, options);
}
}