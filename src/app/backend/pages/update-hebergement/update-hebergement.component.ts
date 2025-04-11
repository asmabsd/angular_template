import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hebergement } from 'src/app/models/hebergement.model';
import { HebergementService } from 'src/app/services/hebergement.service';

@Component({
  selector: 'app-update-hebergement',
  templateUrl: './update-hebergement.component.html',
  styleUrls: ['./update-hebergement.component.css']
})
export class UpdateHebergementComponent {
  hebergementForm: FormGroup;
  hebergement: Hebergement | null = null;
  hebergementId!: string;
  typeHebergementValues: string[] = ['hotel','maison_hote','villa'];

  constructor(
    private hebergementService: HebergementService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.hebergementForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[A-Z][a-zA-Z]*$')  // Commence par une majuscule et ne contient que des lettres
      ]],
      type: ['', Validators.required],
      adresse: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern('^[a-zA-Z0-9\s,]*$') // Contient lettres, chiffres, espaces et virgules
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255),
        Validators.pattern('^[A-Za-z0-9\s]*$')  // Pas de caractères spéciaux, seulement lettres et chiffres
      ]],
      price: ['', [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      availability: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    // Récupérer l'ID de l'hébergement depuis les paramètres de la route (pour l'édition)
    this.hebergementId = this.route.snapshot.paramMap.get('id') as string;

    // Convertir l'ID en nombre avant de récupérer les données
    const hebergementIdNumber = +this.hebergementId;

    // Récupérer les données actuelles de l'hébergement
    this.hebergementService.getHebergementById(hebergementIdNumber).subscribe((data) => {
      this.hebergementForm.patchValue({
        name: data.name,
        type: data.type,
        adresse: data.adresse,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        availability: data.availability
      });

      // Prévisualiser l'image
      this.previewUrl = data.imageUrl;
    });
  }


  updateHebergement(): void {
    if (this.hebergementForm.invalid) {
      this.toastr.error('❌ Veuillez remplir correctement le formulaire.', 'Erreur');
      return;
    }

    const updatedHebergement: Hebergement = { ...this.hebergementForm.value };

    const hebergementIdNumber = +this.hebergementId;  // Convertit l'ID en nombre

    // Envoyer les données mises à jour à l'arrière-plan
    this.hebergementService.updateHebergement(hebergementIdNumber, updatedHebergement).subscribe(
      () => {
        this.toastr.success('✅ Hébergement mis à jour avec succès !', 'Succès');
        this.router.navigate(['/gethebback']);
      },
      (error) => {
        this.toastr.error('❌ Une erreur est survenue, veuillez réessayer.', 'Erreur');
        console.error('Error:', error);
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

      this.hebergementForm.get('imageUrl')?.setValue(this.selectedFile.name);
    }
  }
}
