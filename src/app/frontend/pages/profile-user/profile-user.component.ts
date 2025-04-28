import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service'; // Assurez-vous d'importer AuthService

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {

  profileForm!: FormGroup;
  errorMessage: string = '';
  userId: number = 0; // L'ID de l'utilisateur
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService, // Injection d'AuthService
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur connecté à partir du service AuthService
    const currentUser = this.authService.getCurrentUserEmail
   /* if (currentUser) {
      this.userId = currentUser.id; // On récupère l'ID ici
    }

    // Initialiser le formulaire avec les données de l'utilisateur connecté
    this.profileForm = this.fb.group({
      firstName: [currentUser?.firstName || '', Validators.required],
      lastName: [currentUser?.lastName || '', Validators.required],
      email: [{ value: currentUser?.email || '', disabled: true }, Validators.required],
      nTel: [currentUser?.nTel || '', Validators.required],
      numPasseport: [currentUser?.numPasseport || '', Validators.required],
      password: [''] // Mot de passe optionnel
    });

    this.isLoading = false;
  }*/

 /* updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }
*/
    const formData = this.profileForm.value;
    const updatedUser = {
      id: this.userId, // L'ID de l'utilisateur est maintenant inclus
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email, // L'email ne change pas
      password: formData.password || undefined, // Mot de passe optionnel
      nTel: formData.nTel,
      numPasseport: formData.numPasseport
    };

    this.userService.updateUser(this.userId, updatedUser).subscribe(
      () => {
        this.router.navigate(['/dashboard']); // Rediriger vers le tableau de bord après la mise à jour
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour des données utilisateur';
        console.error(error);
      }
    );
  }
}
