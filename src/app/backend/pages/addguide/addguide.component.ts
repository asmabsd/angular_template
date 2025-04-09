import { Component } from '@angular/core';
import { GuideService } from 'src/app/services/guide.service';
import { Guide } from 'src/app/models/guide.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addguide',
  templateUrl: './addguide.component.html',
  styleUrls: ['./addguide.component.css']
})

export class AddguideComponent {
  guideForm!: FormGroup; 
  stars = [1, 2, 3, 4, 5];
  languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'Arabe', flag: '🇸🇦' },
    { code: 'es', label: 'Espagnol', flag: '🇪🇸' },
    { code: 'de', label: 'Allemand', flag: '🇩🇪' },
    { code: 'ru', label: 'Russe', flag: '🇷🇺' },
    { code: 'en', label: 'Anglais', flag: '🇬🇧' },
    { code: 'it', label: 'Italien', flag: '🇮🇹' },
  ];
  constructor(
    private guideService: GuideService, 
    private fb: FormBuilder,  
    private router: Router
  ) {
    this.guideForm = this.fb.group({
      name: ['', [Validators.required]],
      language: ['', Validators.required],
      speciality: ['', Validators.required],
      experience: ['', Validators.required],
      averageRating: [0, Validators.required],
      availability: ['', Validators.required],
      contact: ['', [Validators.required]],
      image: [null] // Ajoute un champ image
      // Validation de l'email
    });
  }

  // Fonction pour la note (étoiles)
  rate(rating: number): void {
    this.guideForm.patchValue({ averageRating: rating });
  }

  // Fonction de soumission du formulaire
  // Image file selection handler
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string); // full string with data:image/jpeg;base64,...
        this.guideForm.patchValue({
          image: base64String // Send entire base64 string (backend will handle split)
        });
      };
      reader.readAsDataURL(file); // Trigger base64 conversion
    }
  }

  // Submit handler
  onSubmit() {
    if (this.guideForm.valid) {
      const newGuide: Guide = this.guideForm.value;

      this.guideService.addGuide(newGuide).subscribe({
        next: (response) => {
          console.log('Guide ajouté avec succès', response);
          this.router.navigate(['/dashboard/listeguide']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du guide', error);
        }
      });
    } else {
      this.validateAllFormFields(this.guideForm);
    }
  }

  // Recursive field validation
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  // Getter for form fields
  get f() {
    return this.guideForm.controls;
  }
}
  

 
 
  
  
  
