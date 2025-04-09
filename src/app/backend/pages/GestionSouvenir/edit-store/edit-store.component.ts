import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';
import { Store } from 'src/app/models/GestionSouvenir/store';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.css']
})
export class EditStoreComponent implements OnInit {
  storeForm: FormGroup;  // Déclaration du FormGroup
  storeId!: number;  // Déclaration de la variable pour l'ID du store

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialisation du FormGroup
    this.storeForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]] // Numéro de téléphone valide
    });
  }

  ngOnInit(): void {
    // Récupération de l'ID du store depuis les paramètres de la route
    this.storeId = +this.route.snapshot.paramMap.get('id')!;
    
    // Récupération des informations du store à partir de l'ID
    this.storeService.getStoreById(this.storeId).subscribe(store => {
      // Prémplissage du formulaire avec les données du store
      this.storeForm.patchValue(store);
    });
  }

  onSubmit(): void {
    if (this.storeForm.valid) {
      const updatedStore: Store = { 
       
        id: this.storeId ,
        ...this.storeForm.value // Ajouter l'ID du store à l'objet mis à jour
      };
      
      // Appel au service pour modifier le store avec l'ID et les nouvelles données
      this.storeService.editStore(updatedStore).subscribe(() => {
        this.router.navigate(['/dashboard/storeList']); // Navigation après mise à jour
      });
    } else {
      this.validateAllFormFields(this.storeForm); // Validation du formulaire si invalide
    }
  }

  // Méthode pour marquer tous les champs comme touchés afin de valider le formulaire
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
}
