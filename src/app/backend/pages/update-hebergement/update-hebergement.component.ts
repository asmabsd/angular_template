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
  hebergementId!: string;
  typeHebergementValues: string[] = ['hotel', 'maison_hote', 'villa'];
  regions: string[] = [
    'Tunis', 'Ariana', 'La Marsa', 'Ben Arous', 'Ezzahra', 'Mornag', 'Nabeul', 'Hammamet',
    'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Gabès', 'Gafsa', 'Tozeur',
    'Kébili', 'Tataouine', 'Médenine', 'Djerba', 'Zarzis', 'Le Kef', 'Jendouba',
    'Beja', 'Siliana', 'Zaghouan', 'Sidi Bouzid', 'Kasserine', 'Manouba', 'Bizerte', 'SidiBouzid'
  ];
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private hebergementService: HebergementService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.hebergementForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Pattern simplifié
      type: ['', Validators.required],
      adresse: ['', [Validators.required, Validators.minLength(7)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      availability: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      region: ['', Validators.required],
      totalSingleChambres: ['', [Validators.required, Validators.min(0)]],
      totalDoubleChambres: ['', [Validators.required, Validators.min(0)]],
      totalSuiteChambres: ['', [Validators.required, Validators.min(0)]],
      totalDelexueChambres: ['', [Validators.required, Validators.min(0)]]
    });
    console.log('Formulaire initialisé:', this.hebergementForm);
  }

  ngOnInit(): void {
    this.hebergementId = this.route.snapshot.paramMap.get('id') as string;
    const hebergementIdNumber = +this.hebergementId;
    this.hebergementService.getHebergementById(hebergementIdNumber).subscribe({
      next: (data) => {
        this.hebergementForm.patchValue({
          name: data.name,
          type: data.type,
          adresse: data.adresse,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl,
          availability: data.availability,
          telephone: data.telephone ? data.telephone.replace(/\D/g, '').slice(-8) : '', // Normaliser le téléphone
          region: data.region,
          totalSingleChambres: Number(data.totalSingleChambres),
          totalDoubleChambres: Number(data.totalDoubleChambres),
          totalSuiteChambres: Number(data.totalSuiteChambres),
          totalDelexueChambres: Number(data.totalDelexueChambres)
        });
        this.previewUrl = data.imageUrl;
        console.log('Données chargées:', data);
      },
      error: (error) => {
        console.error('Erreur chargement données:', error);
        this.toastr.error('❌ Erreur lors du chargement des données.', 'Erreur');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.selectedFile);
      this.hebergementForm.get('imageUrl')?.setValue(this.selectedFile.name);
      console.log('Fichier sélectionné:', this.selectedFile.name);
    }
  }

  logSubmit(): void {
    console.log('Soumission du formulaire déclenchée');
  }

  updateHebergement(): void {
    if (this.hebergementForm.invalid) {
      console.log('Erreurs des contrôles:');
      Object.keys(this.hebergementForm.controls).forEach((key) => {
        const control = this.hebergementForm.get(key);
        if (control?.invalid) {
          console.log(`Champ ${key} invalide:`, control.errors);
        }
      });
      this.toastr.error('❌ Veuillez remplir correctement le formulaire.', 'Erreur');
      return;
    }
    const updatedHebergement: Hebergement = {
      ...this.hebergementForm.value,
      price: Number(this.hebergementForm.get('price')?.value),
      totalSingleChambres: Number(this.hebergementForm.get('totalSingleChambres')?.value),
      totalDoubleChambres: Number(this.hebergementForm.get('totalDoubleChambres')?.value),
      totalSuiteChambres: Number(this.hebergementForm.get('totalSuiteChambres')?.value),
      totalDelexueChambres: Number(this.hebergementForm.get('totalDelexueChambres')?.value),
      imageUrl: this.selectedFile ? this.selectedFile.name : this.hebergementForm.get('imageUrl')?.value
    };
    const hebergementIdNumber = +this.hebergementId;
    console.log('Envoi des données:', updatedHebergement, 'ID:', hebergementIdNumber);
    this.hebergementService.updateHebergement(hebergementIdNumber, updatedHebergement).subscribe({
      next: (response) => {
        console.log('Réponse API:', response);
        this.toastr.success('✅ Hébergement mis à jour avec succès !', 'Succès');
        this.router.navigate(['/dashboard/gethebback']);
      },
      error: (error) => {
        console.error('Erreur API:', error);
        this.toastr.error('❌ Une erreur est survenue, veuillez réessayer.', 'Erreur');
      },
      complete: () => {
        console.log('Appel API terminé');
      }
    });
  }
}