import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8089/tourisme/auth/login';
  private registerUrl = 'http://localhost:8089/tourisme/auth/signup';
  private Reset = 'http://localhost:8089/tourisme/api/users';

  private tokenKey = 'authToken';
  private userSubject = new BehaviorSubject<string | null>(this.getToken());
  user$ = this.userSubject.asObservable();

  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}
  getCurrentUserEmail(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.email || null;
    }
    return null;
  }
  
  updateCurrentUser(updatedData: any): void {
    const currentUser = this.getCurrentUser();
    const updatedUser = { ...currentUser, ...updatedData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }


  login(email: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, password }).pipe(
      map(response => {
        if (response.token && response.user) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('role', response.user.role);
          localStorage.setItem('user', JSON.stringify(response.user));

          this.userSubject.next(response.token);
          return true;
        }
        return false;
      }),
      catchError(err => {
        this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
        console.error('Erreur lors de la connexion :', err);
        return observableOf(false);
      })
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.Reset}/forgot-password`, null, {
      params: { email }
    }).pipe(
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get(`${this.Reset}/validate-token`, {
      params: { token }
    });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.Reset}/reset-password`, {
      token,
      newPassword
    });
  }

  registerWithOAuth2(): Observable<any> {
    return this.http.get<any>('http://localhost:8089/tourisme/oauth2/authorization/google', { observe: 'response' }).pipe(
      map(response => {
        console.log('Réponse du serveur : ', response);
        if (response.body && response.body.message) {
          alert(response.body.message);
        } else {
          alert('Compte créé avec succès !');
        }

        this.messageService.setMessage(
          'Compte créé avec succès. Un email avec un mot de passe temporaire a été envoyé. Veuillez vérifier votre email et vous connecter avec ce mot de passe. Une fois connecté, vous pourrez modifier votre mot de passe.'
        );

        this.router.navigate(['/login']);
      }),
      catchError(err => {
        this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        console.error('Erreur :', err);
        return observableOf(null);
      })
    );
  }
  getCurrentUser(): any {
    const userString = localStorage.getItem('currentUser');
    
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
        return this.getDefaultUser(); // Retourne un utilisateur par défaut si nécessaire
      }
    }
    
    return this.getDefaultUser(); // Ou throw une erreur selon votre besoin
  }

  private getDefaultUser(): any {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      nTel: '',
      numPasseport: ''
    };
  }
  handleOAuth2Response(message: string): void {
    alert(message);
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('user'); // si tu stockes les infos de l’utilisateur
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData).pipe(
      catchError(err => {
        this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        console.error('Erreur lors de l\'inscription :', err);
        return observableOf(null);
      })
    );
  }
}
