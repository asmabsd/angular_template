import { Component } from '@angular/core';
import { Gastronomy } from 'src/app/models/gastronomy.model';
import { Menu } from 'src/app/models/menu.model';
import { GastronomyService } from 'src/app/services/gastronomy.service';
import { MenuService } from 'src/app/services/menu.service';
import * as QRCode from 'qrcode';

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

  constructor(private gastronomyService: GastronomyService, private menuService: MenuService) {}

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
  
        this.gastronomies.forEach(gastronomy => {
          if (gastronomy.id !== undefined) {
            this.generateQRCode(gastronomy.id); // Only call if id is defined
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
    const url = `http://192.168.1.8:4200/menus-plats/${gastronomyId}`;
  
    QRCode.toDataURL(url)
      .then(qrCodeUrl => {
        this.qrCodes[gastronomyId] = qrCodeUrl;
      })
      .catch(error => {
        console.error('Erreur lors de la génération du QR code', error);
      });
  }
  
  

  searchGastronomies() {
    this.gastronomyService.search(this.searchCriteria).subscribe({
      next: (data) => {
        this.gastronomies = data;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la recherche des gastronomies';
        console.error(err);
      }
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
}  