import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8089/tourisme/auth/login';
  private tokenKey = 'authToken';
  private userSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.userSubject.next(this.getToken());
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, password }).pipe(
      map(response => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.userSubject.next(response.token);
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  
}
