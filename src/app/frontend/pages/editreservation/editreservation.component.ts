import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationGuideService } from 'src/app/services/reservationguide.service';
import { User } from "src/app/models/user.model";
import { ReservationGuide } from "src/app/models/reservationguide.model";
import { Guide } from "src/app/models/guide.model";

@Component({
  selector: 'app-editreservation',
  templateUrl: './editreservation.component.html',
  styleUrls: ['./editreservation.component.css']
})
export class EditreservationComponent implements OnInit {
  idReservation: number = 0;
  reservationguide: ReservationGuide = { 
    idReservation: 0, 
    guide: {} as Guide,
    user: {} as User,
    dateHour: new Date(), 
    duration: '', 
    status: '', 
    price: 0, 
    comment: '' 
  };
  originalUser: User = {} as User;
  originalGuide: Guide = {} as Guide;

  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private guideReservationService: ReservationGuideService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
  
    if (idParam) {
      this.idReservation = +idParam;
      this.guideReservationService.getReservationGuideById(this.idReservation).subscribe(
        (data: ReservationGuide) => {
          this.reservationguide = {
            ...data,
            dateHour: new Date(this.formatDateForInput(data.dateHour)),
          };
          this.originalUser = data.user as User;
          this.originalGuide = data.guide as Guide;

          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'Reservation not found or error fetching data';
          this.isLoading = false;
          console.error('Error fetching reservation:', error);
        }
      );
    } else {
      this.errorMessage = 'Reservation ID is missing from the route';
      this.isLoading = false;
    }
  }

  private formatDateForInput(dateString: string | Date): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      const localDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return localDateTime.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  updateReservation(): void {
    if (!this.reservationguide.idReservation) {
      this.errorMessage = "Error: Reservation ID is missing!";
      return;
    }

    // Restore original user object
    this.reservationguide.user = this.originalUser;
    this.reservationguide.guide = this.originalGuide;

    // Convert date string back to Date object if needed by backend
    const updateData = {
      ...this.reservationguide,
      dateHour: new Date(this.reservationguide.dateHour)
    };

    this.guideReservationService.editReservationGuide(updateData).subscribe(
      () => {
        console.log("Reservation updated successfully!");
        this.router.navigate(['/listereservationsguide']);
      },
      (error) => {
        console.error("Update failed:", error);
        this.errorMessage = 'Error updating reservation: ' + (error.message || 'Unknown error');
      }
    );
  }

  navigateToList(): void {  
    this.router.navigate(['/listereservationsguide']);
  }


}
