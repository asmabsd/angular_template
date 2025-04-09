import { Component, OnInit } from '@angular/core';
import { ReservationGuideService } from 'src/app/services/reservationguide.service';
import { ReservationGuide } from 'src/app/models/reservationguide.model';
import { Router } from '@angular/router'; // Pour naviguer
@Component({
  selector: 'app-list-greservation',
  templateUrl: './list-greservation.component.html',
  styleUrls: ['./list-greservation.component.css']
})
export class ListGReservationComponent implements OnInit {
downloadContract() {
} 
 
   ReservationGuides: ReservationGuide[] = [];
 
   constructor(private ReservationGuideService: ReservationGuideService, private router: Router) {}
   reserver(ReservationGuide: ReservationGuide) {
 
     }
   ngOnInit(): void {
     this.ReservationGuideService.getReservationGuide().subscribe(
       (data: ReservationGuide[]) => {
         this.ReservationGuides = data;
       },
       (error) => {
         console.error('Erreur lors de la récupération des ReservationGuides:', error);
       }
     );
   }
 editReservationGuide(guideReservationId: number | undefined): void {
    if (guideReservationId !== undefined) {
      // Proceed with using the guideId here, e.g., navigate to edit page
      console.log(`Editing guide with ID: ${guideReservationId}`);
    } else {
      console.error("GuideReservation ID is undefined");
    }
  }
  deleteReservationGuide(guideReservationId: number) {
    if (confirm('Are you sure you want to delete this guide?')) {
      this.ReservationGuideService.deleteReservationGuide(guideReservationId).subscribe(
        () => {
          // Remove the guide from the list (optimistic UI update)
          this.ReservationGuides = this.ReservationGuides.filter(guide => guide.idReservation !== guideReservationId);
          
          // Navigate to the same route to refresh the page and show the updated list
          this.router.navigateByUrl('/listereservationsguide', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/listereservationsguide']);
          });
        },
        error => {
          // You can handle any errors here
        }
      );
    }
  }
  navigateToGuide(): void {  
    this.router.navigate(['/guide']);
  }
   
 }
   
 