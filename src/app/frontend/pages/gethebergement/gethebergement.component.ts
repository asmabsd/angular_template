import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hebergement } from 'src/app/models/hebergement.model';
import { HebergementService } from 'src/app/services/hebergement.service';

@Component({
  selector: 'app-gethebergement',
  templateUrl: './gethebergement.component.html',
  styleUrls: ['./gethebergement.component.css']
})
export class GethebergementComponent implements OnInit {
  hebergements: Hebergement[] = [];
  premiumHebergements: Hebergement[] = [];
  otherHebergements: Hebergement[] = [];

  tunisianCities = [
    'Tunis', 'Sfax', 'Sousse', 'Ariana', 'Gabès', 'Kairouan', 'Bizerte',
    'Médenine', 'Nabeul', 'Kasserine', 'Jendouba', 'Tataouine', 'Beja',
    'Zaghouan', 'Manouba', 'El Kef', 'Gafsa', 'Mahdia', 'Kebili', 'Siliana'
  ];

  selectedRegion: string = '';

  constructor(
    private hebergementService: HebergementService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.hebergementService.getHebergement().subscribe(
      (data: Hebergement[]) => {
        this.hebergements = data;
        this.sortAndFilterHebergements();
        console.log('Premium Hébergements:', this.premiumHebergements);
        console.log('Autres Hébergements:', this.otherHebergements);
      },
      (error) => {
        console.error('Erreur lors de la récupération des hébergements:', error);
      }
    );
  }

  // Fonction pour trier et filtrer les hébergements
  sortAndFilterHebergements(): void {
    const DISCOUNT_RATE = 0.1; // Remise de 10%

    // Trier par nombreReservations (descendant) et rating (descendant)
    const sortedHebergements = [...this.hebergements].sort((a, b) => {
      if (b.nombreReservations !== a.nombreReservations) {
        return b.nombreReservations - a.nombreReservations;
      }
      return b.rating - a.rating;
    });

    // Séparer les premium (rating >= 4) et appliquer la remise
    this.premiumHebergements = sortedHebergements
      .filter(h => h.rating >= 4)
      .slice(0, 3)
      .map(h => ({
        ...h,
        discountedPrice: h.price * (1 - DISCOUNT_RATE) // Calculer le prix remisé
      }));

    // Récupérer les IDs des hébergements premium pour les exclure des autres
    const premiumIds = this.premiumHebergements.map(h => h.id_hebergement);

    // Les autres hébergements (exclure les premium par ID)
    this.otherHebergements = sortedHebergements.filter(
      h => !premiumIds.includes(h.id_hebergement)
    );
  }

  // Filtrer les hébergements par région
  get filteredPremiumHebergements(): Hebergement[] {
    if (!this.selectedRegion) return this.premiumHebergements;
    return this.premiumHebergements.filter(h => h.region === this.selectedRegion);
  }

  get filteredOtherHebergements(): Hebergement[] {
    if (!this.selectedRegion) return this.otherHebergements;
    return this.otherHebergements.filter(h => h.region === this.selectedRegion);
  }

  reserver(hebergement: Hebergement) {
    this.router.navigate(['/reservationchambre', hebergement.id_hebergement]);
  }

  hoveredRating: number = 0;

  rateHebergement(hebergement: Hebergement, rating: number): void {
    if (rating < 1 || rating > 5) {
      console.error('La note doit être entre 1 et 5');
      return;
    }

    this.hebergementService.rateHebergement(hebergement.id_hebergement, rating).subscribe({
      next: (updatedHebergement) => {
        // Mettre à jour l'hébergement dans la liste principale
        const index = this.hebergements.findIndex(h => h.id_hebergement === hebergement.id_hebergement);
        if (index !== -1) {
          this.hebergements[index] = { ...hebergement, rating: updatedHebergement.rating };
        }
        this.sortAndFilterHebergements(); // Re-trier après mise à jour du rating
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur de notation', err);
      }
    });
  }

  handleStarClick(event: MouseEvent, hebergement: Hebergement, rating: number) {
    event.stopPropagation();
    event.preventDefault();
    console.log('Clic sur étoile', rating);
    this.rateHebergement(hebergement, rating);
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