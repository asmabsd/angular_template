import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';
import { PhotosServiceService } from 'src/app/services/GestionSouvenirService/photo-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { storeStatus } from 'src/app/models/GestionSouvenir/store-status';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.css']
})
export class ViewStoreComponent implements OnInit {
  store: Store | null = null;
  errorMessage: string = '';
  storeStatusEnum = storeStatus;
  isLoading: boolean = true;
  souvenirs: Souvenir[] = [];
  imagePathPreview: string | ArrayBuffer | null = null;
  apiUrl: string = 'http://localhost:8089/tourisme/souvenir/images';
  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private souvenirService: SouvenirService,
    private photoService: PhotosServiceService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.loadStore(id);
      this.loadSouvenirsByStore(id);
    } else {
      this.errorMessage = 'ID de magasin manquant dans l\'URL.';
      this.isLoading = false;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/storeList']);
  }

  loadStore(id: number): void {
    this.storeService.getStoreById(id).subscribe({
      next: (data: Store) => {
        this.store = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des détails du magasin.';
        this.isLoading = false;
        console.error('Erreur :', error);
      }
    });
  }

  loadSouvenirsByStore(storeId: number): void {
    this.souvenirService.getSouvenirByStore(storeId).subscribe({
      next: (data: Souvenir[]) => {
        this.souvenirs = data.map(s => ({
          ...s,
          safeImageUrl: this.photoService.getFullImageUrl(s.photo)
        }));
      },
      error: (err) => {
        console.error('Erreur chargement souvenirs', err);
      }
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
        return `http://localhost:8089/tourisme/souvenir/images/${imageName}`;
      }
      getImageUrl(photo: string | undefined): string {
        if (!photo) return 'assets/images/default-souvenir.jpg';
        return `${this.apiUrl}/${photo}?t=${new Date().getTime()}`;
      }
      deleteSouvenir(SouvenirId: number): void {
        if (confirm('Are you sure you want to delete this Souvenir?')) {
          this.souvenirService.deleteSouvenir(SouvenirId).subscribe({
            next: () => {
              this.souvenirs = this.souvenirs.filter(s => s.id !== SouvenirId);
              this.router.navigateByUrl('/dashboard/SouvenirList', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/dashboard/SouvenirList']);
              });
            },
            error: (error) => {
              console.error("Erreur lors de la suppression :", error);
            }
          });
        }
      }
}
