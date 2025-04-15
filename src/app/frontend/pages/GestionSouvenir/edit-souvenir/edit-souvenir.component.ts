import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { storeStatus } from 'src/app/models/GestionSouvenir/store-status';
import { PhotosServiceService } from 'src/app/services/GestionSouvenirService/photo-service.service';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';

@Component({
  selector: 'app-edit-souvenir',
  templateUrl: './edit-souvenir.component.html',
  styleUrls: ['./edit-souvenir.component.css']
})
export class EditSouvenirComponent {
  souvenirForm!: FormGroup;

  stores: Store[] = [];
  souvenirId!: number;
  selectedFile: File | null = null;
  currentImageUrl: string | null = null;
  existingPhoto: string | null = null; // 🔥 Pour conserver l'image actuelle
///Routing ORigin
  origin: string | null = null;
  storeId: number | null = null;
  selectedStoreName: string | null = null;

  constructor(
    private souvenirService: SouvenirService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private photosService: PhotosServiceService
  ) {
    this.souvenirForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(150)]],
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
    this.loadStores();
    // Récupération de l'origine via queryParams
  this.route.queryParamMap.subscribe(params => {
    this.origin = params.get('from');
    const storeIdParam = params.get('storeId');
    if (storeIdParam) {
      this.storeId = +storeIdParam;
    }
  });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.souvenirId = +idParam;
      this.loadSouvenir(this.souvenirId);
    } else {
      console.error('Aucun ID trouvé dans l’URL');
    }
  }

  loadStores() {
    this.storeService.getStore().subscribe({
      next: (stores) => {
        this.stores = stores;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stores', error);
      },
    });
  }

  loadSouvenir(id: number) {
    this.souvenirService.getSouvenirById(id).subscribe({
      next: (souvenir) => {
        this.souvenirForm.patchValue({
          name: souvenir.name,
          description: souvenir.description,
          price: souvenir.price,
          quantity: souvenir.quantity,
          category: souvenir.category,
          storeId: souvenir.store?.id
        });
  
        // 👉 Désactiver le champ storeId pour empêcher la modification
        this.souvenirForm.get('storeId')?.disable();
  
        // 👉 Récupérer le nom du store pour affichage
        this.selectedStoreName = souvenir.store?.name || null;
  
        if (souvenir.photo) {
          this.existingPhoto = souvenir.photo;
          this.currentImageUrl = this.photosService.getFullImageUrl(souvenir.photo);
        }
      },
      error: (error) => {
        alert("Souvenir introuvable.");
        console.error('Erreur lors du chargement du souvenir', error);
      },
    });
  }
  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.souvenirForm.valid) {
      const formValues = this.souvenirForm.getRawValue(); // ✅ Inclut les champs désactivés
  
      const selectedStore = this.stores.find(store => store.id === +formValues.storeId);
      this.storeId = selectedStore?.id || null;
  
      const updatedSouvenir: Souvenir = {
        id: this.souvenirId,
        ...formValues,
        store: selectedStore,
        
        photo: this.existingPhoto
      };
  
      if (this.selectedFile) {
        this.photosService.uploadsouvenirImage(updatedSouvenir.id, this.selectedFile).subscribe({
          next: (filename) => {
            updatedSouvenir.photo = filename;
            this.updateSouvenir(updatedSouvenir);
          },
          error: (error) => {
            console.error("Erreur lors de l'upload de l'image", error);
          }
        });
      } else {
        this.updateSouvenir(updatedSouvenir);
      }
    } else {
      this.validateAllFormFields(this.souvenirForm);
    }
  }
  

  private updateSouvenir(souvenir: Souvenir) {
    this.souvenirService.editSouvenir(souvenir).subscribe({
      next: (response) => {
        console.log('Souvenir mis à jour avec succès', response);
        console.log('StoreId:', this.storeId);
  
        // 🛠 Mettre à jour le statut du store à LOADING
        if (this.storeId) {
          const updatedStore: Store = {
            id: this.storeId,
            name: souvenir.store?.name || '',
            address: souvenir.store?.address || '',
            description: souvenir.store?.description || '',
            phone: souvenir.store?.phone || '',
            status: storeStatus.LOADING
          };
  
          this.storeService.editStore(updatedStore).subscribe({
            next: () => {
              console.log('Statut du store mis à jour à LOADING');
              this.router.navigate(['/storeListOfPartner']);
            },
            error: (error) => {
              console.error('Erreur lors de la mise à jour du store', error);
              // Même s'il y a une erreur ici, on peut toujours naviguer
              this.router.navigate(['/storeListOfPartner']);
            }
          });
        } else {
          this.router.navigate(['/souvenirListOfPartnerByStore']);
        }
      },
      error: (error) => {
        console.error("Erreur lors de la mise à jour du souvenir", error);
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
