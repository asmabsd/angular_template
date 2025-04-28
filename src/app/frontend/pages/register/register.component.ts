import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SignupResponseDto } from 'src/app/models/signup-response.dto'; // adjust path if needed

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  qrCodeUri: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nTel: ['', Validators.required],
      numPasseport: ['', Validators.required],
      role: ['user', Validators.required],
      using2FA: [false] // 👈 added checkbox for 2FA
    });
  }

  registerWithOAuth2() {
    window.location.href = 'http://localhost:8089/tourisme/oauth2/authorization/google';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const selectedRole = this.registerForm.value.role;

      this.authService.register(this.registerForm.value).subscribe({
        next: (response: SignupResponseDto | null) => {
          if (!response) return;

          if (response.qrCodeUri) {
            this.qrCodeUri = response.qrCodeUri;
            this.successMessage = 'Inscription avec 2FA réussie. Scannez le QR code pour activer Google Authenticator.';
            return; // Do not redirect immediately
          }

          if (selectedRole === 'guide' || selectedRole === 'partner') {
            this.successMessage = 'Votre inscription est en attente de validation par un administrateur.';
          } else {
            this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          }

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: () => {
          this.errorMessage = 'Échec de l’inscription. Veuillez réessayer.';
        }
      });
    }
  }
}
