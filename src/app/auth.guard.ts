import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (token && role === 'ADMIN') {
      return true;
    }

    // Rediriger l'utilisateur vers l'accueil ou une page d'erreur
    this.router.navigate(['/home']);
    return false;
  }
}
