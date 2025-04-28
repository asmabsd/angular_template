import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = 'http://localhost:8089/tourisme/reservation';

  constructor(private http: HttpClient) { }
// /reservation/getAllReservations
  // Get all reservations
  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAllReservations`);
  }

  // Get a specific reservation by ID
  getReservationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getReservation/${id}`);
  }

  // Create a new reservation
  createReservation(reservation: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, reservation);
  }

  // Update an existing reservation
  updateReservation(reservation: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updateReservation`, reservation);
  }

  // Delete a reservation
  deleteReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }

  // Get reservations for a specific user
  getReservationsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`);
  }

  // Get reservations for a specific activity
  getReservationsByActivityId(activityId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/activity/${activityId}`);
  }
}