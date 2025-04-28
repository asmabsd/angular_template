import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';

@Component({
  selector: 'app-souvenir-list',
  templateUrl: './souvenir-list.component.html',
  styleUrls: ['./souvenir-list.component.css']
})
export class SouvenirListComponent implements OnInit {

  souvenirs: Souvenir[] = [];
  imagePathPreview: string | ArrayBuffer | null = null;
  apiUrl: string = 'http://localhost:8089/tourisme/souvenir/images';

  constructor(
    private souvenirService: SouvenirService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadSouvenirs();
  }

  loadSouvenirs(): void {
    this.souvenirService.getSouvenir().subscribe({
      next: (data) => {
        this.souvenirs = data.map(souvenir => ({
          ...souvenir,
          safeImageUrl: this.getSafeImageUrl(souvenir.photo)
        }));
      },
      error: (error) => {
        console.error('Erreur lors du chargement des souvenirs :', error);
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

  editSouvenir(SouvenirId: number | undefined): void {
    if (SouvenirId !== undefined) {
      console.log(`Editing Souvenir with ID: ${SouvenirId}`);
      // Navigation vers la page de modification si besoin
    } else {
      console.error("Souvenir ID is undefined");
    }
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
