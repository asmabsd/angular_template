import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.css'],
})
export class AddStoreComponent {
  storeForm!: FormGroup;  // Changed storeFrom to storeForm

  constructor(
    private storeService: StoreService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.storeForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', Validators.required],
      description: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // Only numbers
    });
  }

  onSubmit() {
    if (this.storeForm.valid) {  // Changed storeFrom to storeForm
      const newStore: Store = this.storeForm.value;  // Changed storeFrom to storeForm

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
      this.validateAllFormFields(this.storeForm);  // Changed storeFrom to storeForm
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
