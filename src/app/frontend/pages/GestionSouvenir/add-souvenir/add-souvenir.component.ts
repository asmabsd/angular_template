import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { storeStatus } from 'src/app/models/GestionSouvenir/store-status';
import { IaService } from 'src/app/services/GestionSouvenirService/ia.service';
import { PhotosServiceService } from 'src/app/services/GestionSouvenirService/photo-service.service';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';

@Component({
  selector: 'app-add-souvenir',
  templateUrl: './add-souvenir.component.html',
  styleUrls: ['./add-souvenir.component.css']
})
export class AddSouvenirComponent {
selectedFile: File | null = null;
  imgPreview: string | ArrayBuffer = 'assets/product.png';
  souvenirForm!: FormGroup;
  stores: Store[] = [];
  origin: string | null = null;
  storeId: number | null = null;
selectedStoreName: string | null = null;

  constructor(
    private souvenirService: SouvenirService,
    private fb: FormBuilder,
    private router: Router,
    private photoService: PhotosServiceService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private iaService: IaService
  ) {
    this.souvenirForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      price: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
          Validators.min(0.01),
        ],
      ],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      category: ['', Validators.required],
      storeId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => { // <-- ici, utilisation de paramMap
      const storeIdParam = params.get('id'); // <-- changement ici
      if (storeIdParam) {
        this.storeId = +storeIdParam;
  
        this.storeService.getStoreById(this.storeId).subscribe({
          next: (store) => {
            this.stores = [store];
            this.selectedStoreName = store.name;
            this.souvenirForm.patchValue({ storeId: store.id });
            this.souvenirForm.get('storeId')?.disable(); // <-- désactivation du champ ici
          },
          error: (err) => {
            console.error('Erreur lors du chargement du store unique', err);
          }
        });
      } else {
        this.loadStores();
      }
    });
  }
  

  loadStores() {
    this.storeService.getStoreValide().subscribe({
      next: (stores) => {
        this.stores = stores;
        console.log(stores);
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
      const reader = new FileReader();
      reader.onload = () => {
        this.imgPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.souvenirForm.valid) {
      const storeId = +this.souvenirForm.getRawValue().storeId;
  
      this.storeService.getStoreById(storeId).subscribe({
        next: (store) => {
          // 1. Modifier le status du store
          store.status = storeStatus.LOADING; // ou utiliser l'enum storeStatus.LOADING si tu l'importes
          
          // 2. Mettre à jour le store dans la base
          this.storeService.editStore(store).subscribe({
            next: (updatedStore) => {
              // 3. Créer le nouveau souvenir avec le store mis à jour
              const newSouvenir: Souvenir = {
                ...this.souvenirForm.getRawValue(),
                store: updatedStore
              };
  
              // 4. Ajouter le souvenir
              console.log(newSouvenir.description);
              this.souvenirService.addSouvenir(newSouvenir).subscribe({
                next: (response) => {
                  if (this.selectedFile && response.id) {
                    this.uploadImage(response.id);
                  } else {
                    this.router.navigate(['/storeListOfPartner']);
                  }
                },
                error: (error) => {
                  console.error("Erreur lors de l'ajout du souvenir", error);
                }
              });
            },
            error: (error) => {
              console.error("Erreur lors de la mise à jour du store", error);
            }
          });
        },
        error: (error) => {
          console.error("Erreur lors de la récupération du store", error);
        }
      });
    } else {
      this.validateAllFormFields(this.souvenirForm);
    }
  }
  
  private uploadImage(souvenirId: number): void {
    if (!this.selectedFile) return;

    this.photoService.uploadsouvenirImage(souvenirId, this.selectedFile).subscribe({
      next: () => {
        this.router.navigate(['/storeListOfPartner']);
      },
      error: (err) => {
        console.error('Image upload failed', err);
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

  generateAutoDescription(): void {
    const { name, category, price } = this.souvenirForm.value;
  
    if (!name || !category || !price) {
      alert('Veuillez remplir les champs nom, catégorie et prix avant de générer une description.');
      return;
    }
  
    const request = { name, category, price: parseFloat(price) };
  
    this.iaService.generateDescription(request).subscribe({
      next: (desc) => {
        this.souvenirForm.patchValue({ description: desc });
      },
      error: (err) => {
        console.error('Erreur génération IA', err);
      }
    });
  }
}
