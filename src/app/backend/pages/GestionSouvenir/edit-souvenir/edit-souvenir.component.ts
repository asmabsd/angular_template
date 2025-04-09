import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { Store } from 'src/app/models/GestionSouvenir/store';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';
import { StoreService } from 'src/app/services/GestionSouvenirService/store.service';

@Component({
  selector: 'app-edit-souvenir',
  templateUrl: './edit-souvenir.component.html',
  styleUrls: ['./edit-souvenir.component.css'],
})
export class EditSouvenirComponent implements OnInit {
  souvenirForm!: FormGroup;
  stores: Store[] = [];
  souvenirId!: number;

  constructor(
    private souvenirService: SouvenirService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService
  ) {
    this.souvenirForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
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
          storeId: souvenir.store?.id // 🔥 important
        });
      },
      error: (error) => {
        alert("Souvenir introuvable. Il se peut qu’il ait été supprimé ou que l’ID soit incorrect.");
        console.error('Erreur lors du chargement du souvenir', error);
      },
    });
  }
  
  

  onSubmit() {
    if (this.souvenirForm.valid) {
      const selectedStore = this.stores.find(store => store.id === +this.souvenirForm.value.storeId);
      const updatedSouvenir: Souvenir = {
        id: this.souvenirId, // 👈 cette ligne est incorrecte (et inutile ici)
        ...this.souvenirForm.value,
        store: selectedStore // Assurez-vous que le store est bien associé
      };

      // Utilisez la méthode editSouvenir pour mettre à jour le souvenir
      this.souvenirService.editSouvenir(updatedSouvenir).subscribe({
        next: (response) => {
          console.log('Souvenir mis à jour avec succès', response);
          this.router.navigate(['/dashboard/souvenirList']);
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour du souvenir", error);
        }
      });
    } else {
      this.validateAllFormFields(this.souvenirForm);
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