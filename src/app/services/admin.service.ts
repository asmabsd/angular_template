import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8089/tourisme/api/admin'; // Adjust port if needed

  constructor(private http: HttpClient) { }

  // Get pending users
  getPendingUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/pending-users`);
  }

  // Approve a user
  approveUser(userId: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/approve-user/${userId}`, null);
  }

  // Reject a user
  rejectUser(userId: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/reject-user/${userId}`, null);
  }
}