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
stores: Store[] = [];
  constructor(private storeSerive: StoreService, private router: Router) {}
  ngOnInit(): void {
    this.storeSerive.getStore().subscribe(
      (data) => {
        this.stores = data;
        this.stores.forEach((store) => {
        });
      });
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
            // Remove the store from the list (optimistic UI update)
            this.stores = this.stores.filter(store => store.id !== storeId);
            
            // Navigate to the same route to refresh the page and show the updated list
            this.router.navigateByUrl('/dashboard/storeList', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/dashboard/storeList']);
            });
          },
          error => {
            // You can handle any errors here
          }
        );
      }
    }
}
