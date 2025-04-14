import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-souvenir',
  templateUrl: './view-souvenir.component.html',
  styleUrls: ['./view-souvenir.component.css']
})
export class ViewSouvenirComponent implements OnInit {
  Souvenir: Souvenir | null = null;
  errorMessage: string = '';
  isLoading: boolean = true;

  // ORIGIN ROUTE
  origin: string | null = null;
  storeId: number | null = null;

  apiUrl: string = 'http://localhost:8089/pidev/souvenir/images';

  constructor(
    private route: ActivatedRoute,
    private souvenirService: SouvenirService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Récupère l'ID du souvenir depuis l'URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      // Appel du service pour obtenir les détails du souvenir
      this.souvenirService.getSouvenirById(id).subscribe({
        next: (data: Souvenir) => {
          this.Souvenir = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la récupération des détails du souvenir.';
          this.isLoading = false;
          console.error('Erreur :', error);
        }
      });
    } else {
      this.errorMessage = 'ID de souvenir manquant dans l\'URL.';
      this.isLoading = false;
    }

    // Récupère les paramètres de l'origine et du storeId
    this.route.queryParamMap.subscribe(params => {
      this.origin = params.get('from');
      const storeIdParam = params.get('storeId');
      if (storeIdParam) {
        this.storeId = +storeIdParam;
      }
    });
  }

  // Fonction pour obtenir l'URL sécurisée de l'image
  getSafeImageUrl(photo: string | undefined): SafeUrl {
    if (!photo) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default-souvenir.jpg');
    }

    if (photo.startsWith('http') || photo.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(photo);
    }

    // Construction du chemin complet pour l'image
    const fullUrl = `${this.apiUrl}/${photo}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }

  // Retourne à la vue précédente (viewStore ou souvenirList)
  goBack(): void {
    if (this.origin === 'viewStore' && this.storeId) {
      this.router.navigate(['/dashboard/viewStore', this.storeId]);
    } else {
      this.router.navigate(['/dashboard/souvenirList']);
    }
  }
}
