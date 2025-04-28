import { Injectable } from '@angular/core';
import { ReservationChambre } from '../models/reservationchambre';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationchambreService {

  private apiUrl = 'http://localhost:8089/tourisme/reservationchambre/addreservationchambre';
  private apiUrl2= 'http://localhost:8089/tourisme/reservationchambre/getallr';
  private apiUrlUpdate = 'http://localhost:8089/tourisme/reservationchambre/modifyreservationchambre';  // URL pour mettre à jour
  private apiUrl4 = 'http://localhost:8089/tourisme/reservationchambre/getonereservationchambre';  // URL pour mettre à jour
  
  constructor(private http: HttpClient) {}
  getreservation(): Observable<ReservationChambre[]> {
    return this.http.get<ReservationChambre[]>(this.apiUrl2);
  }
  
  
  addreservation(reservation: ReservationChambre): Observable<ReservationChambre> {
    const headers = new HttpHeaders
    ({
      'Content-Type': 'application/json'
    });

    return this.http.post<ReservationChambre>(this.apiUrl, reservation, { headers });
  }
  addReservationToHebergement(idHebergement: number, reservation: ReservationChambre): Observable<ReservationChambre> {
    const url = `http://localhost:8089/tourisme/hebergement/ajouterReservation/${idHebergement}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<ReservationChambre>(url, reservation, { headers });
  }
  
  updateReservation(id: number, reservation: ReservationChambre): Observable<ReservationChambre> {
    const url = `${this.apiUrlUpdate}/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<ReservationChambre>(url, reservation, { headers });
  }


  getReservationsByHebergementId(idHebergement: number): Observable<ReservationChambre[]> {
    const url = `http://localhost:8089/tourisme/hebergement/reservations/${idHebergement}`;
    return this.http.get<ReservationChambre[]>(url);
  }
  
  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8089/tourisme/reservationchambre/removereservationchambre/${id}`);
  }
  getReservationById(id: number): Observable<ReservationChambre> {
    const url = `${this.apiUrl4}/${id}`;  // Remplacez apiUrl2 par l'URL qui récupère les détails d'une réservation
    return this.http.get<ReservationChambre>(url);
  }
  
}
