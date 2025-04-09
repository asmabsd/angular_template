import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationGuide } from 'src/app/models/reservationguide.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationGuideService {
  private apiUrl = 'http://localhost:8089/pidev/ReservationGuide/viewReservationGuide'  ;
  private apiUrl2= 'http://localhost:8089/pidev/ReservationGuide/addReservationGuide';
  private apiUrl3 = 'http://localhost:8089/pidev/ReservationGuide/updateReservationGuide';
  private apiUrl4 = 'http://localhost:8089/pidev/ReservationGuide/getOne';   constructor(private http: HttpClient) {}
  private apiUrl5= 'http://localhost:8089/pidev/ReservationGuide/deleteReservationGuide';
  getReservationGuide(): Observable<ReservationGuide[]> {
    return this.http.get<ReservationGuide[]>(this.apiUrl);
  }
  

  addReservationGuide(ReservationGuide: ReservationGuide): Observable<ReservationGuide> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ReservationGuide>(this.apiUrl2, ReservationGuide, { headers });
  }
  
  getReservationGuideById(id: number): Observable<ReservationGuide> {
    return this.http.get<ReservationGuide>(`${this.apiUrl4}/${id}`);  // Replace the path with the correct API
  }

  // Update the ReservationGuide
  editReservationGuide(ReservationGuide: ReservationGuide): Observable<ReservationGuide> {
    console.log("Sending PUT request to:", `${this.apiUrl3}/${ReservationGuide.idReservation}`, "with data:", ReservationGuide);
    return this.http.put<ReservationGuide>(`${this.apiUrl3}/${ReservationGuide.idReservation}`, ReservationGuide, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
    
    // Update the ReservationGuide
    deleteReservationGuide(ReservationGuideId: number): Observable<any> {
      const url = `${this.apiUrl5}/${ReservationGuideId}`;
      return this.http.delete(url);  // Use http.delete() for the DELETE request
    }
   
}

