import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.css'],
})
export class EditStoreComponent implements OnInit , OnDestroy{
  storeForm: FormGroup; // Déclaration du FormGroup
  storeId!: number; // Déclaration de la variable pour l'ID du store
  private destroy$ = new Subject<void>();
  addressSuggestions: any[] = [];
  showSuggestions = false;
  @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;
  // Remplacez par votre clé API LocationIQ
  private readonly LOCATION_IQ_API_KEY = 'pk.1c37fe75e8f460c4608ede78d77b611f';
  private readonly AUTOCOMPLETE_URL =
    'https://api.locationiq.com/v1/autocomplete';
  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialisation du FormGroup
    this.storeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]], // Correction ici      address: ['', Validators.required],
      status: ['LOADING', Validators.required],
      address: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(150)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    });
  }

  ngOnInit(): void {
    // Récupération de l'ID du store depuis les paramètres de la route
    this.storeId = +this.route.snapshot.paramMap.get('id')!;

    // Récupération des informations du store à partir de l'ID
    this.storeService.getStoreById(this.storeId).subscribe((store) => {
      // Prémplissage du formulaire avec les données du store
      this.storeForm.patchValue(store);
    });
    this.setupAddressAutocomplete();

  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
private setupAddressAutocomplete() {
    this.storeForm.get('address')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        if (query && query.length > 2) {
          this.getAddressSuggestions(query);
        } else {
          this.addressSuggestions = [];
          this.showSuggestions = false;
        }
      });
  }

  private getAddressSuggestions(query: string) {
    const params = new URLSearchParams({
      key: this.LOCATION_IQ_API_KEY,
      q: query,
      limit: '5',
      countrycodes: 'tn', // Filtre pour la Tunisie
      format: 'json'
    });

    fetch(`${this.AUTOCOMPLETE_URL}?${params}`)
      .then(response => response.json())
      .then(data => {
        this.addressSuggestions = data;
        this.showSuggestions = data.length > 0;
      })
      .catch(error => {
        console.error('Erreur de l\'API LocationIQ:', error);
        this.addressSuggestions = [];
        this.showSuggestions = false;
      });
  }

  selectAddress(suggestion: any) {
    const fullAddress = suggestion.display_name;
    this.storeForm.get('address')?.setValue(fullAddress);
    this.showSuggestions = false;
  }

  onSubmit(): void {
    if (this.storeForm.valid) {
      const updatedStore: Store = {
        id: this.storeId,
        ...this.storeForm.value, // Ajouter l'ID du store à l'objet mis à jour
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
