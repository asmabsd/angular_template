// src/app/services/user-stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats, UserCounts, TrendData } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class UserStatsService {
  private apiUrl = 'http://localhost:8089/tourisme/api/statistics'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  getUserCounts(): Observable<UserCounts> {
    return this.http.get<UserCounts>(`${this.apiUrl}/users/summary`);
  }

  getRegistrationTrend(): Observable<TrendData[]> {
    return this.http.get<TrendData[]>(`${this.apiUrl}/users/trend`);
  }
}