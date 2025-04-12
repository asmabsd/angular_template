import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';
import { StoreSelectionService } from 'src/app/services/GestionSouvenirService/store-selection.service';
import { PhotosServiceService } from 'src/app/services/GestionSouvenirService/photo-service.service';

@Component({
  selector: 'app-souvenirs-by-store',
  templateUrl: './souvenirs-by-store.component.html',
  styleUrls: ['./souvenirs-by-store.component.css']
})
export class SouvenirsByStoreComponent implements OnInit {

  storeId!: number;
  souvenirs: Souvenir[] = [];
  imagePathPreview: string | ArrayBuffer | null = null;

  apiUrl: string = 'http://localhost:8089/pidev/souvenir/images'; // Ajout du http

  constructor(
    private souvenirService: SouvenirService,
    private storeSelectionService: StoreSelectionService,
    private photoServiceService: PhotosServiceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.storeSelectionService.selectedStoreId$.subscribe(storeId => {
      if (storeId !== null) {
        this.loadSouvenirs(storeId);
      }
    });
  }

  loadSouvenirs(storeId: number): void {
    this.souvenirService.getSouvenirByStore(storeId).subscribe({
      next: (data) => {
        this.souvenirs = data.map(souvenir => ({
          ...souvenir,
          safeImageUrl: this.getSafeImageUrl(souvenir.photo)
        }));
      },
      error: (err) => console.error('Erreur chargement souvenirs', err)
    });
  }
  convertPhotoToBase64(souvenir: Souvenir): void {
    if (souvenir.photo && typeof souvenir.photo === 'string' && souvenir.photo.startsWith('http')) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        souvenir.photo = canvas.toDataURL(); // En base64
      };
      img.src = souvenir.photo;
    }
  }
  
  getSafeImageUrl(photo: string | undefined): SafeUrl {
    if (!photo) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/default-souvenir.jpg'
      );
    }

    if (photo.startsWith('http') || photo.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(photo);
    }

    const fullUrl = `${this.apiUrl}/${photo}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }
  getImagePath(imageName: string | undefined | null): string {
    // Si pas de nom d'image
    if (!imageName) {
      return 'assets/frontend/images/sidibou.jpg';
    }
  
    // Si c'est déjà une URL complète ou base64
    if (imageName.startsWith('http') || imageName.startsWith('data:image')) {
      return imageName;
    }
  
    // Construction de l'URL selon votre configuration backend
    return `http://localhost:8089/pidev/souvenir/images/${imageName}`;
  }
  getImageUrl(photo: string | undefined): string {
    if (!photo) return 'assets/images/default-souvenir.jpg';
    return `${this.apiUrl}/${photo}?t=${new Date().getTime()}`;
  }
}
