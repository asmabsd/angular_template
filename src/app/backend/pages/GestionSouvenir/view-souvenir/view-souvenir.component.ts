import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';

@Component({
  selector: 'app-view-souvenir',
  templateUrl: './view-souvenir.component.html',
  styleUrls: ['./view-souvenir.component.css']
})
export class ViewSouvenirComponent {
goBack() {
    this.router.navigate(['/dashboard/souvenirList']);
 
  }
   Souvenir: Souvenir | null = null;
    errorMessage: string = '';
    isLoading: boolean = true;

    constructor(
      private route: ActivatedRoute,
      private SouvenirService: SouvenirService,
      private router: Router
    ) {}

    ngOnInit(): void {
          const idParam = this.route.snapshot.paramMap.get('id');
          if (idParam) {
            const id = +idParam;
            this.SouvenirService.getSouvenirById(id).subscribe({
              next: (data: Souvenir) => {
                this.Souvenir = data;
                this.isLoading = false;
              },
              error: (error) => {
                this.errorMessage = 'Erreur lors de la récupération des détails de la réservation.';
                this.isLoading = false;
                console.error('Erreur :', error);
              }
            });
          } else {
            this.errorMessage = 'ID de réservation manquant dans l\'URL.';
            this.isLoading = false;
          }
        }
}
