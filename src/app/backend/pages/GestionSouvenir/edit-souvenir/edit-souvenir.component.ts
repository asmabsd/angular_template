import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';
import { PhotosServiceService } from 'src/app/services/GestionSouvenirService/photo-service.service';

@Component({
  selector: 'app-edit-souvenir',
  templateUrl: './edit-souvenir.component.html',
  styleUrls: ['./edit-souvenir.component.css']
})
export class EditSouvenirComponent implements OnInit {
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
    // Récupération de l’origine via queryParams
    this.route.queryParamMap.subscribe(params => {
      this.origin = params.get('from');
      const storeIdParam = params.get('storeId');
  
      if (storeIdParam) {
        this.storeId = +storeIdParam;
  
        // Charger uniquement ce store
        this.storeService.getStoreById(this.storeId).subscribe({
          next: (store) => {
            this.selectedStoreName = store.name;
            this.stores = [store]; // pour garder une liste cohérente
            this.souvenirForm.patchValue({ storeId: store.id });
          },
          error: (err) => {
            console.error('Erreur lors du chargement du store', err);
          }
        });
      } else {
        // Charger tous les stores si pas de storeId dans l’URL
        this.loadStores();
      }
    });
  
    // Charger le souvenir
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
  
        // Si le storeId est défini, retrouver le nom du store pour affichage
        if (this.storeId) {
          const found = stores.find(s => s.id === this.storeId);
          this.selectedStoreName = found?.name || null;
        }
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
        if (souvenir.photo) {
          this.existingPhoto = souvenir.photo; // 🔥 Sauvegarde la photo existante
          this.currentImageUrl = this.photosService.getFullImageUrl(souvenir.photo);
        }
      },
      error: (error) => {
        alert("Souvenir introuvable. Il se peut qu’il ait été supprimé ou que l’ID soit incorrect.");
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
      const selectedStore = this.stores.find(store => store.id === +this.souvenirForm.value.storeId);
      const updatedSouvenir: Souvenir = {
        id: this.souvenirId,
        ...this.souvenirForm.value,
        store: selectedStore,
        photo: this.existingPhoto // 🔥 Conserve l'image existante par défaut
      };

      if (this.selectedFile) {
        this.photosService.uploadsouvenirImage(updatedSouvenir.id, this.selectedFile).subscribe({
          next: (filename) => {
            updatedSouvenir.photo = filename; // 🔁 Remplace si nouvelle image
            this.updateSouvenir(updatedSouvenir);
          },
          error: (error) => {
            console.error("Erreur lors de l'upload de l'image", error);
          }
        });
      } else {
        this.updateSouvenir(updatedSouvenir); // ✅ Mise à jour sans nouvelle image
      }
    } else {
      this.validateAllFormFields(this.souvenirForm);
    }
  }

  private updateSouvenir(souvenir: Souvenir) {
    this.souvenirService.editSouvenir(souvenir).subscribe({
      next: (response) => {
        console.log('Souvenir mis à jour avec succès', response);
        if (this.origin === 'viewStore' && this.storeId) {
          this.selectedStoreName = this.stores.find(store => store.id === this.storeId)?.name || null;
          this.router.navigate(['/dashboard/viewStore', this.storeId]);
        } else {
          this.selectedStoreName=null; 
          this.router.navigate(['/dashboard/souvenirList']);
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
