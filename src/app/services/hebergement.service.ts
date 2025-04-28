import { Injectable } from '@angular/core';
import { Hebergement } from '../models/hebergement.model';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HebergementService {
  private apiUrl = 'http://localhost:8089/tourisme/hebergement/addhebergement';
  private apiUrl2= 'http://localhost:8089/tourisme/hebergement/getallh';
  private apiUrl3= 'http://localhost:8089/tourisme/hebergement/getoneh/{{idHebergement}}';
  private baseUrl = 'http://localhost:8089/tourisme/hebergement';
  private apiUrl4 = 'http://localhost:8089/tourisme/hebergement/modifyhebergement';
  private UrlResidence = 'http://localhost:8089/tourisme/hebergement/modifyhebergement';
  private apiUrl5 = 'http://localhost:8089/tourisme/hebergement/getoneh';

  constructor(private http: HttpClient) {}

  getHebergement(): Observable<Hebergement[]> {
    return this.http.get<Hebergement[]>(this.apiUrl2);
  }

  getHebergementById(id: number): Observable<Hebergement> {
    return this.http.get<Hebergement>(`${this.apiUrl5}/${id}`);
  }

  addHebergement(hebergement: any): Observable<any> {
    return this.http.post(this.apiUrl, hebergement, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

 updateHebergement(id: number, hebergement: Hebergement): Observable<Hebergement> {
    return this.http.put<Hebergement>(`${this.apiUrl4}/${id}`, hebergement, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  deleteHebergement(id: number) {
    return this.http.delete(`http://localhost:8089/tourisme/hebergement/removehebergement/${id}`);
  }

  rateHebergement(id: number, rating: number): Observable<Hebergement> {
    return this.http.put<Hebergement>(
      `${this.baseUrl}/rate/${id}`, 
      null, // Body vide car on utilise des params
      {
        params: { rating: rating.toString() }, // Envoie le rating comme paramètre d'URL
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }


  
  
}
