import { Component } from '@angular/core';
import { GuideService } from 'src/app/services/guide.service';
import { Guide } from 'src/app/models/guide.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotosServiceService } from 'src/app/services/photos-service.service';

@Component({
  selector: 'app-addguide',
  templateUrl: './addguide.component.html',
  styleUrls: ['./addguide.component.css']
})

export class AddguideComponent {
  navigateToList() {
    this.router.navigate(['/listereservationsguide']);
  }
  selectedFile: File | null = null;
  imgPreview: string | ArrayBuffer = 'assets/product.png';
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
    private router: Router,
    private photoService: PhotosServiceService

  ) {
    this.guideForm = this.fb.group({
      name: ['', [Validators.required]],
      language: ['', Validators.required],
      speciality: ['', Validators.required],
      experience: ['', Validators.required],
      averageRating: [0, Validators.required],
      availability: ['', Validators.required],
      contact: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      // Validation de l'email
    });
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imgPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Fonction pour la note (étoiles)
  rate(rating: number): void {
    this.guideForm.patchValue({ averageRating: rating });
  }

  // Fonction de soumission du formulaire
  // Image file selection handler
  

  // Submit handler
  onSubmit() {
    if (this.guideForm.valid) {
      const newGuide: Guide = this.guideForm.value;

      this.guideService.addGuide(newGuide).subscribe({
        next: (response) => {
          if (this.selectedFile && response.id) {
            this.uploadImage(response.id);
          } else {
            this.router.navigate(['/dashboard/listeguide']);
          }
        },
        error: (error) => console.error(error)
      });
    }
  }

  private uploadImage(guideId: number): void {
    if (!this.selectedFile) return;

    this.photoService.uploadGuideImage(guideId, this.selectedFile).subscribe({
      next: (filename) => {
        console.log('Image uploaded:', filename);
        this.router.navigate(['/dashboard/listeguide']);
      },
      error: (err) => {
        console.error('Image upload failed', err);
        this.router.navigate(['/dashboard/listeguide']);
      }
    });
  }

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
  // Recursive field validation
  

  

 
 
  
  
  