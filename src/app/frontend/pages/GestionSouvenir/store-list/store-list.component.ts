import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { StoreSelectionService } from 'src/app/services/GestionSouvenirService/store-selection.service';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  @ViewChild('slider', { static: true }) slider!: ElementRef<HTMLElement>;
  stores: Store[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private storeService: StoreService,private storeSelectionService: StoreSelectionService) {}

  ngOnInit(): void {
    this.loadStores();
  }
  selectStore(id: number): void {
    this.storeSelectionService.setStoreId(id);
  }
  loadStores(): void {
    this.storeService.getStoreValide().subscribe({
      next: (data) => {
        this.stores = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load stores. Please try again later.';
        this.isLoading = false;
        console.error('Error loading stores:', err);
      }
    });
  }
  

  scroll(offset: number): void {
    const element = this.slider.nativeElement;
    const cardWidth = element.querySelector('.store-card')?.clientWidth || 300;
    const gap = 24; // Doit correspondre au CSS (1.5rem)
    
    element.scrollBy({
      left: (cardWidth + gap) * Math.sign(offset),
      behavior: 'smooth'
    });
  }
  
}