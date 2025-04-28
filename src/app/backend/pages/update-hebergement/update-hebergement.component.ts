import { Component, OnInit } from '@angular/core';
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
export class UpdateHebergementComponent implements OnInit {
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
        Validators.minLength(3),
        Validators.pattern('^[A-Z][a-zA-Z]*$')  // Commence par une majuscule et ne contient que des lettres
      ]],
      type: ['', Validators.required],
      adresse: ['', [
        Validators.required,
        Validators.minLength(7),
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
      ]],
      price: ['', [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      availability: ['', Validators.required],
      telephone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{8}$') // Format de numéro de téléphone (10 chiffres)
      ]],
      region: ['', Validators.required],
      totalSingleChambres: ['', Validators.required],
      totalDoubleChambres: ['', Validators.required],
      totalSuiteChambres: ['', Validators.required],
      totalDelexueChambres: ['', Validators.required]

    });
  }
  regions: string[] = [
    'Tunis', 'Ariana', 'La Marsa', 'Ben Arous', 'Ezzahra', 'Mornag', 'Nabeul', 'Hammamet',
    'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Gabès', 'Gafsa', 'Tozeur',
    'Kébili', 'Tataouine', 'Médenine', 'Djerba', 'Zarzis', 'Le Kef', 'Jendouba',
    'Beja', 'Siliana', 'Zaghouan', 'Sidi Bouzid', 'Kasserine', 'Manouba', 'Bizerte','SidiBouzid'
  ];
  

  ngOnInit(): void {
    this.hebergementId = this.route.snapshot.paramMap.get('id') as string;

    const hebergementIdNumber = +this.hebergementId;

    this.hebergementService.getHebergementById(hebergementIdNumber).subscribe((data) => {
      this.hebergementForm.patchValue({
        name: data.name,
        type: data.type,
        adresse: data.adresse,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        availability: data.availability,
        telephone: data.telephone,
        region: data.region,
        totalSingleChambres: data.totalSingleChambres,
        totalDoubleChambres: data.totalDoubleChambres,
        totalSuiteChambres: data.totalSuiteChambres,
        totalDelexueChambres: data.totalDelexueChambres


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
        this.router.navigate(['/dashboard/gethebback']);
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
