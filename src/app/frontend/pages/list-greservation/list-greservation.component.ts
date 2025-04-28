import { Component, OnInit } from '@angular/core';
import { ReservationGuideService } from 'src/app/services/reservationguide.service';
import { ReservationGuide } from 'src/app/models/reservationguide.model';
import { Router, ActivatedRoute } from '@angular/router'; // Pour naviguer
import { jsPDF } from 'jspdf'; 
import { HttpClient } from '@angular/common/http';
import { RatingService } from 'src/app/services/rating.service';
import { EmailRequest } from 'src/app/models/emailrequest';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-greservation',
  templateUrl: './list-greservation.component.html',
  styleUrls: ['./list-greservation.component.css']
})
export class ListGReservationComponent implements OnInit {
  showRatingModal: boolean = false;
  currentGuideId: number =0;
  selectedreservationguide: any;
  rating: number= 0;
  route: any;
  setRating(star: number) {
    this.rating = star; // Met à jour la note sélectionnée
  }
  userEmail: string = '';


  

  // Ouvrir le modal de notation
  openRatingModal(ReservationGuide: any) {
    this.currentGuideId = ReservationGuide.guide.id; // ID du guide
    this.showRatingModal = true;
  }

  isPopupVisible: boolean = false;
  
  openRatePopup(reservationGuide: any) {
    this.isPopupVisible = true;
    this.selectedreservationguide = reservationGuide;
  }
  
  closePopup() {
    this.isPopupVisible = false;
  }
  
  submitRating() {
    if (this.rating >= 1 && this.rating <= 5) {
      this.rateservice.rateReservation(this.selectedreservationguide.idReservation, this.rating).subscribe(response => {
        console.log('Rating submitted:', response);
        this.closePopup();
      }, error => {
        console.error('Error submitting rating', error);
      });
    }
  }


  // Fermer le modal de notation
  closeRatingModal() {
    this.showRatingModal = false;
  }
  canRate(ReservationGuide: any): boolean {
    const currentDate = new Date();
    const reservationDate = new Date(ReservationGuide.dateHour);
    return ReservationGuide.status === 'accepted' && reservationDate < currentDate;
  }

  openRatingPage(ReservationGuide: any) {
    const reservationDate = ReservationGuide.dateHour; // Assurez-vous que vous avez la bonne valeur de la date
    const status = ReservationGuide.status;
  
    // Naviguer vers la page de notation en passant les paramètres dans l'URL
    this.router.navigate(['/rateguide', ReservationGuide.guide.id, reservationDate, status]);
  }
  reservationGuides: ReservationGuide[] = [];
  filteredReservations: ReservationGuide[] = [];
  selectedGuideId: number | null = null;
  isLoading: boolean = true;

downloadContract() {
} 



// Fermer le modal de notation

   ReservationGuides: ReservationGuide[] = [];
 
   constructor(private ReservationGuideService: ReservationGuideService, private router: Router, private activatedRoute: ActivatedRoute, private http:HttpClient, private rateservice : RatingService) {}
   reserver(ReservationGuide: ReservationGuide) {
 
     }
   ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.selectedGuideId = params['guideId'] ? +params['guideId'] : null;
      this.loadReservationGuides();
    });


     this.ReservationGuideService.getReservationGuide().subscribe(
       (data: ReservationGuide[]) => {
         this.ReservationGuides = data;
       },
       (error) => {
         console.error('Erreur lors de la récupération des ReservationGuides:', error);
       }
     );

     
   }
    /* ngOnInit(): void {
      // Récupérer l'email ou l'ID du guide via paramMap (URL)
      this.userEmail = this.route.snapshot.paramMap.get('email') || '';  // Utiliser l'email dans l'URL
    
      // Récupérer les réservations par email ou ID de l'utilisateur
      this.ReservationGuideService.getReservationGuide().subscribe(
        (data: ReservationGuide[]) => {
          // Filtrer les réservations par email de l'utilisateur connecté
          if (this.userEmail) {
            this.ReservationGuides = data.filter(
              reservation => reservation.user.toString() === this.userEmail
            );
          } else {
            this.ReservationGuides = data;  // Afficher toutes les réservations si aucun email spécifié
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des réservations:', error);
        }
      );
    }*/
    

    



   sendEmail(guide: any, user: any) {
    const guideEmail = this.getGuideemail(guide); // Guide's email
    const userEmail = this.getUseremail(user);   // User's email
    
    const payload = { guideEmail, userEmail };
  
    this.http.post('http://localhost:8089/tourisme/email/sendemail', payload).subscribe(response => {
      console.log('Email sent successfully', response);
    }, error => {
      console.error('Error sending email', error);
    });
  }




   loadReservationGuides(): void {
    this.isLoading = true;

    this.ReservationGuideService.getReservationGuide().subscribe(
      (data: ReservationGuide[]) => {
        this.ReservationGuides = data;
        
        // Filtrer les réservations si un guideId est spécifié
        if (this.selectedGuideId) {
          this.filteredReservations = this.reservationGuides.filter(
            reservation => typeof reservation.guide === 'object' && reservation.guide?.id === this.selectedGuideId
          );
        } else {
          this.filteredReservations = [...this.reservationGuides];
        }
        
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des réservations:', error);
        this.isLoading = false;
      }
    );
  }

  getGuideDisplay(guide: any): string {
    if (!guide) return 'No guide';
    if (typeof guide === 'object') return guide.name;
    return guide.toString();
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

 editReservationGuide(guideReservationId: number ): void {
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
  canCancel(reservation: any): boolean {
    const today = new Date();
    const reservationDate = new Date(reservation.dateHour);
    const diffTime = reservationDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
  
    return (reservation.status === 'pending' || reservation.status === 'accepted') && diffDays >= 3;
  }
  canDelete(reservation: any): boolean {
    const today = new Date();
    const reservationDate = new Date(reservation.dateHour);
    const isPast = reservationDate.getTime() < today.getTime();
  
    return reservation.status === 'rejected' || isPast;
  }

  // Generate PDF with styled layout and digital signature
  generatePDF(reservation: ReservationGuide) {
    const doc = new jsPDF();

    // Set font styles and general document properties
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50); // Dark gray text color

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204); // Blue title color
    doc.text('Reservation Contract', 105, 20,);
    doc.setDrawColor(0, 102, 204); // Blue line color
    doc.line(20, 25, 190, 25); // Horizontal line below title

    // Add reservation details with spacing and formatting
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text for details
    doc.text(`Date: ${reservation.dateHour}`, 20, 40);
    doc.text(`Duration: ${reservation.duration}`, 20, 50);
    doc.text(`Price: ${reservation.price} USD`, 20, 60);
    doc.text(`Status: ${reservation.status}`, 20, 70);
    doc.text(`Comment: ${reservation.comment}`, 20, 80);

    // Add a line for separation between sections
    doc.setDrawColor(200, 200, 200); // Light gray line color
    doc.line(20, 90, 190, 90);

    // Add Guide Information
    if (reservation.guide) {
      doc.text(`Guide Name: ${reservation.guide.toString}`, 20, 100);
    }

    // Add a line for separation before the signature
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 120, 190, 120);

    // Add Digital Signature section
    const signatureY = 140;
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204); // Signature text in blue
    doc.text('Customer Signature:', 20, signatureY);
    doc.setDrawColor(0, 102, 204); // Blue line for signature
    doc.line(20, signatureY + 5, 180, signatureY + 5); // Signature line
    doc.text('Customer Signature (Your Name Here)', 105, signatureY + 10,  );

    // Date and time of signature
    const date = new Date();
    doc.text(`Signed on: ${date.toLocaleString()}`, 20, signatureY + 20);

    // Save the PDF
    doc.save(`reservation_contract_${reservation.idReservation}.pdf`);
  }

  // Check if the reservation status is "accepted"



  // Check if the reservation status is "accepted"
  canDownloadContract(reservation: ReservationGuide) {
    return reservation.status === 'accepted';
  }



 


  
   
 }
   
 