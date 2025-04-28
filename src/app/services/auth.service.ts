import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of as observableOf, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
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
  message?: string; // Optional message property
  using2FA?: boolean; // Optional property to indicate 2FA usage
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8089/tourisme/auth/login';
  private registerUrl = 'http://localhost:8089/tourisme/auth/signup';
  private resetUrl = 'http://localhost:8089/tourisme/api/users';

  private tokenKey = 'authToken'; // The key for the stored JWT token
  private userSubject = new BehaviorSubject<any>(this.getUserFromLocalStorage()); // Holds the current user data
  user$ = this.userSubject.asObservable(); // Observable to expose the current user

  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}

  // Get the currently logged-in user's email
  getCurrentUserEmail(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.email || null;
    }
    return null;
  }

  // Get user ID based on the email
  getUserIdByEmail(email: string): Observable<number> {
    const params = new HttpParams().set('email', email);
    return this.http.get<number>('http://localhost:8089/tourisme/auth/user-id', { params });
  }

  // Login method
  login(email: string, password: string, recaptchaResponse: string): Observable<boolean> {
    return this.http.post<LoginResponse>(this.loginUrl, {
      email,
      password,
      recaptchaResponse
    }).pipe(
      map(response => {
        if (response.message) {
          this.errorMessage = response.message;
          console.warn('Login message:', response.message);

          if (response.using2FA) {
            localStorage.setItem('tempEmail', email); // Temporarily store the email for 2FA
          }

          return false;
        }

        if (response.token && response.user) {
          this.saveTokenAndUser(response.token, response.user);
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

  // OTP verification
  verifyOtp(email: string, otpCode: string): Observable<any> {
    return this.http.post<LoginResponse>('http://localhost:8089/tourisme/auth/verify-otp', {
      email,
      otpCode
    }).pipe(
      tap(response => {
        if (response.token && response.user) {
          // Store the JWT token and user data in local storage
          this.saveTokenAndUser(response.token, response.user);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error properly
        console.error('OTP verification failed', error);
        this.errorMessage = 'Erreur de vérification du code OTP.';
        return throwError(() => error); // Propagate error
      })
    );
  }

  // Request password reset
  requestPasswordReset(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.resetUrl}/forgot-password`, null, { params }).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  // Validate the reset token
  validateResetToken(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.get(`${this.resetUrl}/validate-token`, { params });
  }

  // Reset password
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.resetUrl}/reset-password`, { token, newPassword });
  }

  // OAuth2 registration (Google)
  registerWithOAuth2(): Observable<any> {
    return this.http.get<any>('http://localhost:8089/tourisme/oauth2/authorization/google', { observe: 'response' }).pipe(
      map(response => {
        console.log('Réponse du serveur : ', response);
        if (response.body?.message) {
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

  // Handle the response after OAuth2 login
  handleOAuth2Response(message: string): void {
    alert(message);
    this.router.navigate(['/login']);
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    this.userSubject.next(null); // Reset the user state
    this.router.navigate(['/login']);
  }

  // Get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if the user is authenticated (based on token presence)
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Register a new user
  register(userData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData).pipe(
      catchError(err => {
        this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        console.error('Erreur lors de l\'inscription :', err);
        return observableOf(null);
      })
    );
  }

  // Save the token and user data to localStorage and update user state
  private saveTokenAndUser(token: string, user: any): void {
    localStorage.setItem(this.tokenKey, token); // Store token
    localStorage.setItem('role', user.role); // Store user role
    localStorage.setItem('user', JSON.stringify(user)); // Store user data

    this.userSubject.next(user); // Update the user subject to notify other parts of the app
  }

  // Helper function to get user data from localStorage on initial load
  private getUserFromLocalStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
