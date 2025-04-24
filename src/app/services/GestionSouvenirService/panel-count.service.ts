import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PanelService } from './panel.service';

@Injectable({
  providedIn: 'root',
})
export class PanelCountService {
  private countSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.countSubject.asObservable();

  constructor(private panelService: PanelService) {
    this.loadInitialCount();
  }
  // Observable pour le nombre d'articles dans le panier

   loadInitialCount() {
    this.panelService.viewPanel().subscribe({
      next: (panel) => this.countSubject.next(panel.totalItems || 0),
      error: (err) => console.error('Erreur chargement panier', err),
    });
  }
}
