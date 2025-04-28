import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { LoginResponse } from '../models/loginresponse';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8089/tourisme/auth/login';
  private add = 'http://localhost:8089/tourisme/api/users';
 private get ='http://localhost:8089/tourisme/api/users';
 private update ='http://localhost:8089/tourisme/api/users';
 private getone ='http://localhost:8089/tourisme/api/users';
 private delete ='http://localhost:8089/tourisme/api/users';


  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.get);
  } 
  
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.update}/${id}`, user);
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.getone}/${id}`);
  }
  deleteUser(userId: number): Observable<any> {
    const url = `${this.delete}/${userId}`;
    return this.http.delete(url);
  }
  

  // Corrected addUser method
  adduser(guide: User): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<User>(this.add, guide, { headers }); // Fixed "guide" reference
  }

  private apiUrl4 = 'http://localhost:8089/tourisme/auth/login'; // URL du backend



  login(credentials: User): Observable<any> {
    return this.http.post(this.apiUrl4, credentials);
  }

  logout(): void {
    localStorage.removeItem('token'); // Clear stored token
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if token exists
  }
}
