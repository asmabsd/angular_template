import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.css']
})
export class ViewStoreComponent {
  goBack() {
    this.router.navigate(['/dashboard/storeList']);
 
  }
   Store: Store | null = null;
    errorMessage: string = '';
    isLoading: boolean = true;

    constructor(
      private route: ActivatedRoute,
      private StoreService: StoreService,
      private router: Router
    ) {}
   ngOnInit(): void {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        const id = +idParam;
        this.StoreService.getStoreById(id).subscribe({
          next: (data: Store) => {
            this.Store = data;
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
