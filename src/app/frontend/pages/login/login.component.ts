import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { GuideService } from 'src/app/services/guide.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  recaptchaResponse = ''; // ✅ Ajout du token reCAPTCHA
  errorMessage = '';
  successMessage = ''; // Declare successMessage property
  // Removed duplicate declaration of tokenKey
  userSubject = new BehaviorSubject<string | null>(null); // Initialize userSubject
  tokenKey = 'authToken'; // Define the token key used for localStorage
  
  // Add missing properties here
  showOtpInput = false; // Controls visibility of OTP input
  otp = ''; // Stores OTP input from user

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private guideService: GuideService
  ) {}

  ngOnInit(): void {
    this.messageService.message$.subscribe((message: string | null) => {
      if (message) {
        this.successMessage = message;
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      }
    });
  }

  // ✅ Cette méthode est appelée par <re-captcha (resolved)="onCaptchaResolved($event)">
  onCaptchaResolved(token: string) {
    this.recaptchaResponse = token;
  }

  login(): void {
    if (!this.recaptchaResponse) {
      this.errorMessage = 'Veuillez valider le reCAPTCHA.';
      return;
    }
  
    this.authService.login(this.email, this.password, this.recaptchaResponse).subscribe((response: boolean) => {
      if (response === false) {
        // If 2FA is enabled, show OTP input field
        localStorage.setItem('tempEmail', this.email);  // Save email temporarily
        this.showOtpInput = true;  // Show OTP input field
      } else {
        // If login is successful without 2FA
        const role = localStorage.getItem('role');

        switch (role) {
          case 'ADMIN':
            this.router.navigate(['/dashboard']);
            break;
          case 'GUIDE':
              this.guideService.getGuideByContact(this.email).subscribe({
                next: (guide) => {
                  this.router.navigate(['/reservationsbyguide', guide.id]);
                },
                error: (err) => {
                  console.error('Erreur lors de la récupération du guide:', err);
                }
              });
              break;

          case 'PARTNER':
            this.router.navigate(['/partnerdashboard']);
            break;
          case 'USER':
          default:
            this.router.navigate(['/blog']);
            break;
        }
      }
    }, (err) => {
      this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
      console.error('Erreur de connexion :', err);
    });
  }

  // Update the verifyOtp method to handle OTP verification and response
  verifyOtp(): void {
    console.log('Verifying OTP:', this.otp); // Debugging message

    if (!this.otp || this.otp.trim() === '') {
      this.errorMessage = 'Veuillez entrer le code OTP.';
      return;
    }

    // Call the service to verify OTP
    this.authService.verifyOtp(this.email, this.otp).subscribe(
      (response) => {
        console.log('OTP Verification response:', response);

        // Check if the response contains a valid token
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('role', response.user.role);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('partner', JSON.stringify(response.user));
          localStorage.setItem('guide', JSON.stringify(response.user));



          // Set the logged-in user
          this.userSubject.next(response.token);

          // Navigate to the dashboard or other appropriate page based on the role
          switch (response.user.role) {
            case 'ADMIN':
              this.router.navigate(['/dashboard']);
              break;
            case 'USER':
            default:
              this.router.navigate(['/blog']);
              break;
          }
        } else {
          this.errorMessage = 'Le code OTP est incorrect. Veuillez réessayer.';
        }
      },
      (error) => {
        console.error('OTP verification failed:', error);
        this.errorMessage = 'Erreur lors de la vérification du code OTP.';
      }
    );
  }
}
