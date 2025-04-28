import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  error: string = '';
  isValidToken: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    
    if (!this.token) {
      this.error = 'Aucun token fourni';
      return;
    }

    this.authService.validateResetToken(this.token).subscribe({
      next: (response: any) => {
        this.isValidToken = response.valid;
        if (!this.isValidToken) {
          this.error = response.message || 'Token invalide';
        }
      },
      error: (err) => {
        this.error = 'Erreur lors de la validation du token';
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.message = 'Mot de passe réinitialisé avec succès';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la réinitialisation';
      }
    });
  }
}