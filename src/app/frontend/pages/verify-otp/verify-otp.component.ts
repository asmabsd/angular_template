import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent {
  otpCode = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  verifyOtp() {
    const email = localStorage.getItem('tempEmail');  // Récupérer l'email temporaire
    if (email && this.otpCode) {
      this.authService.verifyOtp(email, this.otpCode).subscribe({
        next: (response) => {
          // Si le code OTP est correct, rediriger vers la page d'accueil ou tableau de bord
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = 'Code OTP invalide ou expiré.';
          console.error('Erreur de vérification OTP :', err);
        }
      });
    }
  }
}
