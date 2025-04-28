import { Component, OnInit } from '@angular/core';
import { ReservationGuide } from 'src/app/models/reservationguide.model';
import { ReservationGuideService } from 'src/app/services/reservationguide.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listereservations',
  templateUrl: './listereservations.component.html',
  styleUrls: ['./listereservations.component.css']
})
export class ListereservationsComponent implements OnInit {
[x: string]: any;
  goToGuide(guideId: number): void {
    this.router.navigate(['/afficherplanning', guideId]);
  }
  
  

  reservationGuides: ReservationGuide[] = [];
  filteredReservations: ReservationGuide[] = [];
  selectedGuideId: number | null = null;
  isLoading: boolean = true;

  constructor(
    private reservationGuideService: ReservationGuideService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    // Lire l'ID du guide depuis les paramètres de route (ex: /reservationsbyguide/5)
    this.activatedRoute.params.subscribe(params => {
      this.selectedGuideId = params['guideId'] ? +params['guideId'] : null;
      this.loadReservationGuides();
    });
  }

  loadReservationGuides(): void {
    this.isLoading = true;

    this.reservationGuideService.getReservationGuide().subscribe(
      (data: ReservationGuide[]) => {
        this.reservationGuides = data;

        if (this.selectedGuideId !== null) {
          this.filteredReservations = this.reservationGuides.filter(reservation => {
            const guideId = typeof reservation.guide === 'object'
              ? reservation.guide?.id
              : reservation.guide;
            return guideId == this.selectedGuideId;
          });
        } else {
          this.filteredReservations = [];
        }

        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des réservations :', error);
        this.isLoading = false;
      }
    );
  }

  getGuideDisplay(user: any): string {
    if (!user) return 'Aucun';
    if (typeof user === 'object') return user.email;
    return user.toString();
  }
  getGuideId(guide: any): number {
    return typeof guide === 'object' ? guide.id : guide;
  }

  sendEmail(user: any, guide: any) {
    const guideEmail = this.getGuideemail(guide); // Guide's email
    const userEmail = this.getUseremail(user);   // User's email
    
    const payload = { guideEmail, userEmail };
  
    this.http.post('http://localhost:8089/tourisme/email/sendemail', payload).subscribe(response => {
      console.log('Email sent successfully', response);
    }, error => {
      console.error('Error sending email', error);
    });
  }
  getGuideemail(guide: any): string {
    if (!guide) return 'No guide';
    if (typeof guide === 'object') return guide.contact;
    return guide.toString();
  }

  getUseremail(user: any): string {
    if (!user) return 'No guide';
    if (typeof user === 'object') return user.email;
    return user.toString();
  }

  
  goToPlanning(guideId: number): void {
    this.router.navigate(['/afficherplanning', guideId]);
  }

/*  approveReservation(id: number): void {
    this.reservationGuideService.updateStatus(id, 'accepted').subscribe(
      () => this.loadReservationGuides(),
      (error) => console.error('Erreur:', error)
    );
  }*/
  


    approveReservation(id: number): void {
      this.reservationGuideService.updateStatus(id, 'accepted').subscribe(
        () => {
          // Récupère la réservation concernée pour récupérer la date et le guide
          const reservation = this.filteredReservations.find(r => r.idReservation === id);
          if (reservation) {
            const guideId = typeof reservation.guide === 'object' ? reservation.guide.id : reservation.guide;
            const dateTime = reservation.dateHour instanceof Date
              ? reservation.dateHour.toISOString()
              : new Date(reservation.dateHour).toISOString();
    
            this.http.post(`http://localhost:8089/tourisme/Planning/addReservedPlanning?guideId=${guideId}&date=${encodeURIComponent(dateTime)}`, {}, { responseType: 'text' })
              .subscribe(
                () => {
                  console.log('Planning mis à jour avec succès');
                  this.loadReservationGuides();
                },
                error => console.error('Erreur lors de la mise à jour du planning :', error)
              );
          } else {
            this.loadReservationGuides();
          }
        },
        (error) => console.error('Erreur:', error)
      );
    }
    

  rejectReservation(id: number): void {
    this.reservationGuideService.updateStatus(id, 'rejected').subscribe(
      () => this.loadReservationGuides(),
      (error) => console.error('Erreur:', error)
    );
  }

  deleteReservationGuide(guideReservationId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      this.reservationGuideService.deleteReservationGuide(guideReservationId).subscribe(
        () => {
          this.filteredReservations = this.filteredReservations.filter(r => r.idReservation !== guideReservationId);
        },
        error => {
          console.error('Erreur de suppression :', error);
        }
      );
    }
  }

 
  reserver(reservation: ReservationGuide): void {
    // Action éventuelle de réservation
  }

  downloadContract(): void {
    // À implémenter
  }
}
