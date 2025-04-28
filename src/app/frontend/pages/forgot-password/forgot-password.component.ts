import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.authService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        this.message = response.message || 'Email envoyé avec succès';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Erreur lors de la demande';
        this.message = '';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}