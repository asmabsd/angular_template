import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';
import { StoreSelectionService } from 'src/app/services/GestionSouvenirService/store-selection.service';

@Component({
  selector: 'app-souvenirs-by-store',
  templateUrl: './souvenirs-by-store.component.html',
  styleUrls: ['./souvenirs-by-store.component.css']
})
export class SouvenirsByStoreComponent implements OnInit {

  
    storeId!: number;
    souvenirs: Souvenir[] = [];
    constructor(
      private souvenirService: SouvenirService,
      private storeSelectionService: StoreSelectionService

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
        next: (data) => this.souvenirs = data,
        error: (err) => console.error('Erreur chargement souvenirs', err)
      });
    }
  }
  
