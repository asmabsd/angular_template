import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hebergement, TypeHebergement } from 'src/app/models/hebergement.model';
import { HebergementService } from 'src/app/services/hebergement.service';

@Component({
  selector: 'app-addhebergement',
  templateUrl: './addhebergement.component.html',
  styleUrls: ['./addhebergement.component.css']
})
export class AddhebergementComponent implements OnInit {
  hebergementForm!: FormGroup;
  typeHebergementValues = Object.values(TypeHebergement);  // Pour récupérer les valeurs de l'énum
  hebergement: Hebergement = new Hebergement(); // Instancier un nouvel objet Hebergement
  constructor(
    private fb: FormBuilder,
    private hebergementService: HebergementService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.hebergementForm = new FormGroup({
      name: new FormControl('', [Validators.required, this.nameValidator]),
      type: new FormControl('', [Validators.required]),
      adresse: new FormControl('', [Validators.required, this.addressValidator]),
      description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(500), this.descriptionValidator]),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      imageUrl: new FormControl('', [Validators.required]),
      availability: new FormControl('', [Validators.required])
    });
  }


  
  // Validateur pour le nom (minimum 3 caractères, commence par une majuscule)
  nameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value.length < 3) {
      return { nameTooShort: 'Le nom doit être supérieur à 3 caractères.' };
    }
    if (!/^[A-Z]/.test(value)) {
      return { nameNotCapitalized: 'Le nom doit commencer par une majuscule.' };
    }
    return null;
  };

  // Validateur pour l'adresse (lettres et chiffres, longueur > 7)
  addressValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value.length <= 7) {
      return { addressTooShort: 'L\'adresse doit contenir plus de 7 caractères.' };
    }
    if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
      return { addressInvalid: 'L\'adresse doit contenir des lettres et des chiffres.' };
    }
    return null;
  };

  // Validateur pour la description (minimum 3 caractères, maximum 500, pas de caractères spéciaux)
  descriptionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const specialCharPattern = /[^a-zA-Z0-9\s]/; // regex pour les caractères spéciaux
    if (specialCharPattern.test(value)) {
      return { descriptionInvalid: 'La description ne doit pas contenir de caractères spéciaux.' };
    }
    if (value.length < 10) {
      return { descriptionTooShort: 'La description doit contenir plus de 10 caractères.' };
    }
    return null;
  };



  ajouterHebergement(): void {
    // Vérifier que le formulaire est valide
    if (this.hebergementForm.invalid) {
      this.toastr.error('❌ Veuillez remplir correctement le formulaire.', 'Erreur');
      return;
    }

    // Extraire les valeurs du formulaire et les assigner à l'objet hebergement
    this.hebergement = { ...this.hebergementForm.value };

    // Appel au service pour ajouter l'hébergement
    this.hebergementService.addHebergement(this.hebergement).subscribe(
      (response) => {
        // Notification de succès
        this.toastr.success('✅ Hébergement ajouté avec succès !', 'Succès', {
          timeOut: 10000,
          positionClass: 'toast-bottom-left',
          closeButton: true,
          progressBar: true,
        });

        // Redirection vers la page des hébergements après l'ajout
        this.router.navigate(['/gethebback']);
      },
      (error) => {
        // En cas d'erreur
        console.error('Erreur lors de l\'ajout de l\'hébergement:', error);
        this.toastr.error('❌ Une erreur est survenue, veuillez réessayer.', 'Erreur');
      }
    );
  }
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile!: File;
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
  
      // ✅ Mise à jour du champ 'imageUrl' dans le formulaire
      this.hebergementForm.get('imageUrl')?.setValue(this.selectedFile.name);
    }
  }
  
  
  
}
