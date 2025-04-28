import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Importer Router également
import { RatingService } from 'src/app/services/rating.service';
@Component({
  selector: 'app-ratingguide',
  templateUrl: './ratingguide.component.html',
  styleUrls: ['./ratingguide.component.css']
})
export class RatingguideComponent {
  guideId!: number;
  reservationDate!: string;
  status!: string;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  
  rating: number = 0;
  isEligibleForRating: boolean = false;
  route: any;

  constructor(
    private activatedRoute: ActivatedRoute, // Injecter ActivatedRoute
    private ratingService: RatingService,
    private router: Router,                  // Injecter Router

    
  ) {}

  ngOnInit(): void {
    // Récupérer les paramètres de la route
    this.activatedRoute.params.subscribe(params => {
      this.guideId = +params['guideId']; // Récupérer l'ID du guide
      this.reservationDate = params['reservationDate']; // Assurez-vous que cette valeur est passée dans l'URL
      this.status = params['status']; // Assurez-vous que le statut est aussi passé dans l'URL
      this.checkEligibilityForRating();
    });
  }

  // Vérifie si la réservation peut être notée
  checkEligibilityForRating() {
    const currentDate = new Date();
    const reservationDate = new Date(this.reservationDate);

    if (reservationDate < currentDate && this.status === 'accepted') {
      this.isEligibleForRating = true;
    }
  }

  // Gère le changement de note (étoiles)
  handleRatingChange(newRating: number) {
    this.rating = newRating;
  }

  // Envoie la note au backend
  handleSubmit() {
    this.ratingService.rateReservation(this.guideId, this.rating).subscribe(() => {
      this.closeModal.emit();
      this.router.navigate(['/listereservationsguide']); // Rediriger vers la liste des réservations

    });
  }

  // Fermer le modal
  close() {
    this.closeModal.emit();
    this.router.navigate(['/listereservationsguide']); // Rediriger vers la liste des réservations
  }
}