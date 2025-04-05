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
  constructor(private guideService: GuideService, private fb: FormBuilder,  private router: Router
  ) {
    this.guideForm = this.fb.group({
      name: ['', Validators.required],
      language: ['', Validators.required],
      speciality: ['', Validators.required],
      experience: ['', Validators.required],
      averageRating: ['', Validators.required],
      availability: ['', Validators.required],
      contact: ['', [Validators.required]] // Si tu veux valider l'email
    });
  }

  onSubmit() {
    if (this.guideForm.valid) {
      const newGuide: Guide = this.guideForm.value; // Récupère les données du formulaire
      this.guideService.addGuide(newGuide).subscribe(response => {
        console.log('Guide ajouté avec succès', response);
        this.router.navigate(['/guide']);
      }, error => {
        console.error('Erreur lors de l\'ajout du guide', error);
      });
    }
  }
}
