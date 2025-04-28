  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
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
      private storeService: StoreService
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
      this.route.queryParamMap.subscribe(params => {
        this.origin = params.get('from');
        const storeIdParam = params.get('storeId');
        if (storeIdParam) {
          this.storeId = +storeIdParam;
          // Charger uniquement le store concerné
          this.storeService.getStoreById(this.storeId).subscribe({
            next: (store) => {
              this.stores = [store]; // On met dans le tableau unique
              this.selectedStoreName = store.name
              this.souvenirForm.patchValue({ storeId: store.id });
            },
            error: (err) => {
              console.error('Erreur lors du chargement du store unique', err);
            }
          });
        } else {
          this.loadStores(); // Si pas de storeId, on charge tous les stores valides
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
        const selectedStore = this.stores.find(store => store.id === +this.souvenirForm.value.storeId);

        const newSouvenir: Souvenir = {
          ...this.souvenirForm.value,
          store: selectedStore
        };

        this.souvenirService.addSouvenir(newSouvenir).subscribe({
          next: (response) => {
            if (this.selectedFile && response.id) {
              this.uploadImage(response.id);
            } else {
              this.redirectAfterAction();
            }
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
        next: () => {
          this.redirectAfterAction();
        },
        error: (err) => {
          console.error('Image upload failed', err);
          this.redirectAfterAction();
        }
      });
    }

    private redirectAfterAction(): void {
      if (this.origin === 'viewStore' && this.storeId) {
        this.router.navigate(['/dashboard/viewStore', this.storeId]);
      } else {
        this.router.navigate(['/dashboard/souvenirList']);
      }
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
