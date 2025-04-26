import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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


  constructor(private http: HttpClient) {}
  private apiKey = 'de9a15176285f12944884665'; // Remplace par ta clé API
  private apiUrl = 'https://v6.exchangerate-api.com/v6';


  convert(from: string, to: string): Observable<any> {
    const url = `${this.apiUrl}/${this.apiKey}/pair/${from}/${to}`;
    return this.http.get(url);
  }
}
