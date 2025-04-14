import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.css'],
})
export class AddStoreComponent implements OnInit, OnDestroy {
  storeForm!: FormGroup;
  private destroy$ = new Subject<void>();
  addressSuggestions: any[] = [];
  showSuggestions = false;

  @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;

  // Remplacez par votre clé API LocationIQ
  private readonly LOCATION_IQ_API_KEY = 'pk.1c37fe75e8f460c4608ede78d77b611f'; 
  private readonly AUTOCOMPLETE_URL = 'https://api.locationiq.com/v1/autocomplete';

  constructor(
    private storeService: StoreService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.storeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]], // Correction ici      address: ['', Validators.required],
      status: ['LOADING', Validators.required],
      address: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(150)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    });
  }

  ngOnInit() {
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

  onSubmit() {
    if (this.storeForm.valid) {
      const newStore: Store = this.storeForm.value;
      this.storeService.addStore(newStore).subscribe({
        next: (response) => {
          console.log('Store ajouté avec succès', response);
          this.router.navigate(['/dashboard/storeList']);
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout du Store", error);
        },
      });
    } else {
      this.validateAllFormFields(this.storeForm);
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