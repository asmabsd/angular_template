import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { storeStatus } from 'src/app/models/GestionSouvenir/store-status';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';
import { StoreSelectionService } from 'src/app/services/GestionSouvenirService/store-selection.service';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';

@Component({
  selector: 'app-souvenir-list-of-partner-by-store',
  templateUrl: './souvenir-list-of-partner-by-store.component.html',
  styleUrls: ['./souvenir-list-of-partner-by-store.component.css'],
})
export class SouvenirListOfPartnerByStoreComponent {
  storeId!: number;
  souvenirs: Souvenir[] = [];
  imagePathPreview: string | ArrayBuffer | null = null;
  apiUrl: string = 'http://localhost:8089/pidev/souvenir/images'; // Ajout du http

  constructor(
    private souvenirService: SouvenirService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.storeId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSouvenirs(this.storeId);
  }

  loadSouvenirs(storeId: number): void {
    this.souvenirService.getSouvenirByStore(storeId).subscribe({
      next: (data) => {
        this.souvenirs = data.map((souvenir) => ({
          ...souvenir,
          safeImageUrl: this.getSafeImageUrl(souvenir.photo),
        }));
      },
      error: (err) => console.error('Erreur chargement souvenirs', err),
    });
  }
  convertPhotoToBase64(souvenir: Souvenir): void {
    if (
      souvenir.photo &&
      typeof souvenir.photo === 'string' &&
      souvenir.photo.startsWith('http')
    ) {
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

  deleteSouvenir(souvenirId: number): void {
    if (confirm('Are you sure you want to delete this Souvenir?')) {
  
      // Étape 1 : récupérer le store actuel par son ID
      this.storeService.getStoreById(this.storeId).subscribe({
        next: (store) => {
          // Étape 2 : forcer le statut à LOADING
         store.status = storeStatus.LOADING;
  
          // Étape 3 : envoyer la mise à jour du store
          this.storeService.editStore(store).subscribe({
            next: () => {
              console.log('Store status updated to LOADING');
  
              // Étape 4 : supprimer le souvenir
              this.souvenirService.deleteSouvenir(souvenirId).subscribe({
                next: () => {
                  this.souvenirs = this.souvenirs.filter((s) => s.id !== souvenirId);
                  this.router
                    .navigateByUrl('/souvenirListByPartnerOfStore', {
                      skipLocationChange: true,
                    })
                    .then(() => {
                      this.router.navigate(['/souvenirListByPartnerOfStore']);
                    });
                },
                error: (error) => {
                  console.error('Erreur lors de la suppression :', error);
                  alert('Une erreur est survenue lors de la suppression du souvenir.');
                }
              });
            },
            error: (err) => {
              console.error('Erreur lors de la mise à jour du store :', err);
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du store :', err);
        }
      });
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
