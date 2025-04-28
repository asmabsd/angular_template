import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Pour naviguer
import { Store } from 'src/app/models/GestionSouvenir/store';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent {
  storesValides: Store[] = [];
  storesInvalides: Store[] = [];

  constructor(private storeSerive: StoreService, private router: Router) {}
  ngOnInit(): void {
    this.storeSerive.getStoreValide().subscribe(
      (data) => {
        this.storesValides = data;
      },
      (error) => console.error('Erreur chargement stores valides', error)
    );
  
    this.storeSerive.getStoreInvalide().subscribe(
      (data) => {
        this.storesInvalides = data;
      },
      (error) => console.error('Erreur chargement stores invalides', error)
    );
  }
  
  validateStore(storeId: number) {
    this.storeSerive.updateStoreStatusById(storeId).subscribe(
      (updatedStore) => {
        // Supprimer le store des deux listes, puis le remettre dans la bonne
        this.storesInvalides = this.storesInvalides.filter(store => store.id !== storeId);
        this.storesValides = this.storesValides.filter(store => store.id !== storeId);
  
        if (updatedStore.status === 'VALIDE') {
          this.storesValides.push(updatedStore);
        } else {
          this.storesInvalides.push(updatedStore);
        }
  
        console.log(`Statut du store mis à jour vers : ${updatedStore.status}`);
      },
      error => {
        console.error('Erreur lors de la mise à jour du statut du store', error);
      }
    );
  }
  
    editstore(storeId: number | undefined): void {
      if (storeId !== undefined) {
        // Proceed with using the storeId here, e.g., navigate to edit page
        console.log(`Editing store with ID: ${storeId}`);
      } else {
        console.error("store ID is undefined");
      }
    }
    deletestore(storeId: number) {
      if (confirm('Are you sure you want to delete this store?')) {
        this.storeSerive.deleteStore(storeId).subscribe(
          () => {
            // Supprime le store du tableau des valides s’il s’y trouve
            this.storesValides = this.storesValides.filter(store => store.id !== storeId);
    
            // Supprime aussi du tableau des invalides si besoin
            this.storesInvalides = this.storesInvalides.filter(store => store.id !== storeId);
    
            // Pas besoin de forcer le reload
            console.log('Store supprimé avec succès');
          },
          error => {
            console.error('Erreur lors de la suppression du store', error);
          }
        );
      }
    }
}
