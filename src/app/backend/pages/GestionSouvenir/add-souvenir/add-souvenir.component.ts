import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { PhotosServiceService } from 'src/app/services/GestionSouvenirService/photo-service.service';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';

@Component({
  selector: 'app-add-souvenir',
  templateUrl: './add-souvenir.component.html',
  styleUrls: ['./add-souvenir.component.css'],
})
export class AddSouvenirComponent {
  selectedFile: File | null = null;
  imgPreview: string | ArrayBuffer = 'assets/product.png';
  souvenirForm!: FormGroup; // Changed souvenirFrom to souvenirForm
  stores: Store[] = []; // Liste des stores

  constructor(
    private souvenirService: SouvenirService,
    private fb: FormBuilder,
    private router: Router,
    private photoService: PhotosServiceService,
    private storeService: StoreService
  ) {
    this.souvenirForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      price: [
        '',
        [
          Validators.required, // Champ requis
          Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'), // Doit être un nombre avec jusqu'à deux décimales
          Validators.min(0.01), // Doit être supérieur à 0
        ],
      ],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      category: ['', Validators.required],
      storeId: ['', Validators.required], // Ajoutez un champ pour le store
    });
  }
  ngOnInit() {
    this.loadStores(); // Chargez les stores lors de l'initialisation
  }

  loadStores() {
    this.storeService.getStore().subscribe({
      next: (stores) => {
        this.stores = stores;
        console.log(stores) // Assignez la liste des stores
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stores', error);
      },
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
  onSubmit() {
    if (this.souvenirForm.valid) {
      const selectedStore = this.stores.find(store => store.id === +this.souvenirForm.value.storeId);
  
      const newSouvenir: Souvenir = {
        ...this.souvenirForm.value,
        store: selectedStore // maintenant un vrai Store complet
      };
  
      console.log('Objet Souvenir avant envoi:', newSouvenir);
  
      this.souvenirService.addSouvenir(newSouvenir).subscribe({
        next: (response) => {

          if (this.selectedFile && response.id) {
            this.uploadImage(response.id);
            this.router.navigate(['/dashboard/souenirList']);
          } else {
            this.router.navigate(['/dashboard/souvenirList']);
          }
        //  console.log('Souvenir ajouté avec succès', response);
          //this.router.navigate(['/dashboard/souvenirList']);
         
          
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout du souvenir", error);
        }
      });
    } else {
      this.validateAllFormFields(this.souvenirForm);
    }
  }
  private uploadImage(souvenirId: number): void {
    if (!this.selectedFile) return;

    this.photoService.uploadsouvenirImage(souvenirId, this.selectedFile).subscribe({
      next: (filename) => {
        console.log('Image uploaded:', filename);
        this.router.navigate(['/dashboard/souvenirList']);
      },
      error: (err) => {
        console.error('Image upload failed', err);
        this.router.navigate(['/dashboard/souvenirList']);
      }
    });
  }
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
}
