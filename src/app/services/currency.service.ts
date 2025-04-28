// src/app/services/currency.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private tauxChange = 0.30; // Exemple : 1 TND = 0.30 EUR (à ajuster dynamiquement éventuellement)

  convertToEuro(tnd: number): number {
    return +(tnd * this.tauxChange).toFixed(2); // conversion et arrondi à 2 décimales
  }

  setTaux(taux: number) {
    this.tauxChange = taux;
  }

  getTaux(): number {
    return this.tauxChange;
  }
}
