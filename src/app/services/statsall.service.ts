import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StatsallService {

  private apiUrl = 'http://localhost:8089/tourisme/api/stats';

  constructor(private http: HttpClient) {}

  getUserCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/users/count`);
  }

  getActivityCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/activities/count`);
  }

  getRestaurantCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/restaurants/count`);
  }

  getStoreCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stores/count`);
  }

  getGuideCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/guides/count`);
  }}
