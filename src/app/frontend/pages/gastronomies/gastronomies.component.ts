import { Component } from '@angular/core';
import { DetailGastronomy } from 'src/app/models/detailgastronomy.model';

import { Gastronomy } from 'src/app/models/gastronomy.model';
import { Menu } from 'src/app/models/menu.model';
import { RatingService } from 'src/app/services/rating.service';
import { GastronomyService } from 'src/app/services/gastronomy.service';
import { MenuService } from 'src/app/services/menu.service';
import * as QRCode from 'qrcode';
import { PredictionService, PredictionRequest } from 'src/app/services/prediction.service'; // importer le service
export enum GastronomyType {
  FAST_FOOD = 'FAST_FOOD',
  RESTAURANT = 'RESTAURANT',
  CAFE = 'CAFE',
  SALON_DE_THE = 'SALON_DE_THE',
  BOULANGERIE = 'BOULANGERIE',
  BAR_A_TAPAS = 'BAR_A_TAPAS'
}

@Component({
  selector: 'app-gastronomies',
  templateUrl: './gastronomies.component.html',
  styleUrls: ['./gastronomies.component.css']
})


export class GastronomiesComponent {
  gastronomies: Gastronomy[] = [];
  baseImageUrl: string = "http://localhost:8089/tourisme/images/";
  errorMessage: string = '';
  searchCriteria = { name: '', type: '', location: ''};
  selectedCurrency: 'TND' | 'EUR' = 'TND'; // Devise sélectionnée
  conversionRate: number = 0.30;
  gastronomyCountByType: { [key: string]: number } = {};
  gastronomyCountByLocation: { [key: string]: number } = {};
  averageRatingByType: { [key: string]: number } = {};
  qrCodes: { [key: number]: string } = {};
  predictionData = { location: '', rating: 0 };
  predictedType: string = '';
  isLoading = false;
  regions: string[] = [];
  gastronomiesFiltered: any[] = []; // Liste filtrée des gastronomies
  gastronomyTypes = Object.values(GastronomyType); // Obtenir toutes les valeurs de l'énumération
  selectedRating: { [gastronomyId: number]: number } = {};


  constructor(private gastronomyService: GastronomyService, private menuService: MenuService,private predictionService: PredictionService, private ratingService: RatingService) {}

  ngOnInit(): void {
    this.getAllGastronomies();
    this.loadStatistics();

  }

  loadStatistics(): void {
    this.gastronomyService.getGastronomyCountByType().subscribe(data => this.gastronomyCountByType = data);
    this.gastronomyService.getGastronomyCountByLocation().subscribe(data => this.gastronomyCountByLocation = data);
    this.gastronomyService.getAverageRatingByType().subscribe(data => this.averageRatingByType = data);
  }

  getAllGastronomies() {
    this.gastronomyService.getAll().subscribe({
      next: (data) => {
        this.gastronomies = data;
        this.gastronomiesFiltered = [...this.gastronomies];
        this.regions = [...new Set(this.gastronomies.map(g => g.location).filter(loc => loc))];

        this.gastronomies.forEach(gastronomy => {
          console.log('Processing gastronomy:', gastronomy.id, gastronomy.name);

          this.menuService.getMenusByGastronomyId(gastronomy.id!).subscribe(
            menus => {
              console.log(`Menus for gastronomy ${gastronomy.id}:`, menus);
              gastronomy.menus = menus;
            },
            error => console.error(`Error fetching menus for gastronomy ${gastronomy.id}:`, error)
          );

          if (gastronomy.id !== undefined) {
            console.log('Generating QR code for gastronomy:', gastronomy.id);
            this.generateQRCode(gastronomy.id);
          }

          if (gastronomy.image && !gastronomy.image.startsWith('http')) {
            gastronomy.image = this.baseImageUrl + gastronomy.image;
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des gastronomies';
        console.error(err);
      }
    });

  }

  generateQRCode(gastronomyId: number): void {
    // Utilisation de l'IP locale pour le QR code
    const url = `http://192.168.1.16:4200/menus-plats/${gastronomyId}`;
    console.log('Generating QR code with URL:', url);
  
    QRCode.toDataURL(url, (err: Error | null, qrCodeUrl: string) => {
      if (err) {
        console.error('Erreur lors de la génération du QR code', err);
      } else {
        console.log('QR code generated successfully for gastronomy:', gastronomyId);
        this.qrCodes[gastronomyId] = qrCodeUrl;
      }
    });
  }

  searchGastronomies() {
    this.gastronomiesFiltered = this.gastronomies.filter(gastronomy => {
      const nameMatch = this.searchCriteria.name ? gastronomy.name.toLowerCase().includes(this.searchCriteria.name.toLowerCase()) : true;
      const typeMatch = this.searchCriteria.type ? gastronomy.type.toLowerCase().includes(this.searchCriteria.type.toLowerCase()) : true;
      const locationMatch = this.searchCriteria.location ? gastronomy.location.toLowerCase().includes(this.searchCriteria.location.toLowerCase()) : true;

      return nameMatch && typeMatch && locationMatch;
    });
  }
  

  getMenusByGastronomy(gastronomyId: number): void {
    this.menuService.getAllMenus().subscribe(
      (menus: Menu[]) => {
        const gastronomy = this.gastronomies.find(g => g.id === gastronomyId);
        if (gastronomy) {
          gastronomy.menus = menus.filter(menu => menu.gastronomy?.id === gastronomyId);
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des menus:', error);
      }
    );
  }

  toggleCurrency(): void {
    this.selectedCurrency = this.selectedCurrency === 'TND' ? 'EUR' : 'TND';
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  predictGastronomyType() {
    this.isLoading = true;
    this.predictionService.predict(this.predictionData).subscribe({
      next: (result) => {
        this.predictedType = result;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la prédiction :', err);
        this.predictedType = "Erreur lors de la prédiction.";
        this.isLoading = false;
      }
    });
  }

  getIconForType(type: string): string {
    switch (type?.toLowerCase()) {
      case 'tunisian': return '🍲';
      case 'italian': return '🍝';
      case 'japanese': return '🍣';
      case 'french': return '🥐';
      case 'indian': return '🍛';
      default: return '🍽️';
    }
  }
  

  // Méthode pour soumettre la note
  setRating(gastronomyId: number, rating: number) {
    this.selectedRating[gastronomyId] = rating;
  }

  // Méthode pour soumettre la note
  submitRating(gastronomyId: number, rating: number) {
    if (!rating) {
      alert("Please select a rating before submitting.");
      return;
    }

    this.ratingService.submitRating(gastronomyId, rating).subscribe({
      next: (updatedDetail) => {
        const gastronomy = this.gastronomies.find(g => g.id === gastronomyId);
        if (gastronomy && gastronomy.detailGastronomy) {
          gastronomy.detailGastronomy.rating = updatedDetail.rating;
        }
        alert('Rating submitted successfully!');
      },
      error: (err) => {
        console.error('Error submitting rating:', err);
        alert('An error occurred while submitting your rating.');
      }
    });
  }
  
  
  
}