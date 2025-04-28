import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { GastronomyService } from 'src/app/services/gastronomy.service';
import { Gastronomy } from 'src/app/models/gastronomy.model';
import { GastronomyType } from 'src/app/models/gastronomy-type.model'; // <-- ajout
import { Router } from '@angular/router';  // Importer Router
import { Menu } from 'src/app/models/menu.model';
import { Plate } from 'src/app/models/Plate';
import { MenuService } from 'src/app/services/menu.service';
import { PlateService } from 'src/app/services/plate.service';
import { forkJoin } from 'rxjs';
import { CurrencyService } from 'src/app/services/currency.service';



@Component({
  selector: 'app-gastronomy',
  templateUrl: './gastronomy.component.html',
  styleUrls: ['./gastronomy.component.css']
})
export class GastronomyComponent implements OnInit {
  gastronomyForm!: FormGroup;
  gastronomies: Gastronomy[] = [];

  plates: Plate[] = [];
  baseImageUrl: string = "http://localhost:8089/tourisme/images/";
  errorMessage: string = '';
    selectedGastronomy: Gastronomy | null = null;
  gastronomyTypes = Object.values(GastronomyType);
gastronomy: any;
selectedImage: File | null=null ;
imagePreview: any;
  http: any;

  constructor(private fb: FormBuilder, 
    private gastronomyService: GastronomyService, 
    private menuService: MenuService,
    private plateService: PlateService,

     private router: Router,  // Injecter Router ici
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllGastronomies();
  }
  goToStatistics(): void {
    this.router.navigate(['/dashboard/gastronomy-stats']); // Assure-toi que '/statistics' est le chemin de ta page de statistiques
  }
  initForm() {
    this.gastronomyForm = this.fb.group({
      name: ['', Validators.required],
      type: [''],
      location: ['', Validators.required],
      image: [null, Validators.required],
      detailGastronomy: this.fb.group({
        description: ['', Validators.required],
        rating: [0, Validators.required]
      }),
      menus: this.fb.array([this.createMenu()]) // Ajouter un menu vide par défaut
    });
  }
  
  createMenu() {
    return this.fb.group({
      nameMenu: ['', Validators.required],
      descriptionMenu: ['', Validators.required],
      prixMenu: [0, Validators.required],
      plates: this.fb.array([])

    });
  }
  
  
  
  getPlatesControls(menuIndex: number): FormArray {
    return (this.menus.at(menuIndex).get('plates') as FormArray);
  }
  
  addPlate(menuIndex: number): void {
    const plates = this.getPlatesControls(menuIndex);
    plates.push(this.fb.group({
      namePlate: [''],
      descriptionPlate: [''],
      pricePlate: [0],
     // imagePlate: [null]
    }));
  }
  onPlateImageSelected(event: any, menuIndex: number, plateIndex: number): void {
    const file = event.target.files[0];
    if (file) {
      const platesArray = this.getPlatesControls(menuIndex);
      const plateGroup = platesArray.at(plateIndex) as FormGroup;
      plateGroup.patchValue({ imagePlate: file });
      plateGroup.get('imagePlate')?.updateValueAndValidity();
    }
  }
  
  removePlate(menuIndex: number, plateIndex: number): void {
    const plates = this.getPlatesControls(menuIndex);
    plates.removeAt(plateIndex);
  }
  
  get menusValid(): boolean {
    return this.menus.controls.every(menu => menu.valid); // Vérifie si chaque menu est valide
  }
  
  get menus(): FormArray {
    return this.gastronomyForm.get('menus') as FormArray;
  }


    getAllGastronomies() {
      forkJoin([
        this.gastronomyService.getAll(),
        this.plateService.getAllPlates()
      ]).subscribe({
        next: ([gastronomiesData, platesData]) => {
          // Traiter les gastronomies
          this.gastronomies = gastronomiesData;
          this.gastronomies.forEach(gastronomy => {
            if (gastronomy.image && !gastronomy.image.startsWith('http')) {
              gastronomy.image = this.baseImageUrl + gastronomy.image;
            }
          });
    
          // Traiter les plats
          this.plates = platesData;
          this.plates.forEach(plate => {
            if (plate.imagePlate && !plate.imagePlate.startsWith('http')) {
              plate.imagePlate = this.baseImageUrl + plate.imagePlate;
            }
          });
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des données';
          console.error(err);
        }
      });
    }
    getAllPlates() {
      this.plateService.getAllPlates().subscribe({
        next: (data) => {
          this.plates = data;
    
          this.plates.forEach(plate => {
            if (plate.imagePlate && !plate.imagePlate.startsWith('http')) {
              plate.imagePlate = this.baseImageUrl + plate.imagePlate;
            }
          });
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des plats';
          console.error(err);
        }
      });
    }
  
    addGastronomy() {
      if (this.gastronomyForm.valid && this.menusValid && this.selectedImage) {
        this.errorMessage = "Veuillez remplir tous les champs requis et sélectionner une image.";
        const formData = new FormData();
    
        const gastronomy = {
          name: this.gastronomyForm.value.name,
          type: this.gastronomyForm.value.type,
          location: this.gastronomyForm.value.location
        };
    
        // Ajouter les données gastronomie au FormData
        formData.append('gastronomy', new Blob([JSON.stringify(gastronomy)], { type: 'application/json' }));
    
        // Ajouter l'image au FormData
        formData.append('image', this.selectedImage);
    
        // Étape 1 : Ajouter la gastronomie avec l'image
        this.gastronomyService.createWithImage(formData).subscribe((createdGastronomy: any) => {
          console.log('Gastronomy added:', createdGastronomy);
          const gastronomyId: number = createdGastronomy.id;
    
          // Étape 2 : Ajouter les détails
          const detail = this.gastronomyForm.value.detailGastronomy;
          this.gastronomyService.addDetailGastronomyAndAffectGastronomy(gastronomyId, detail).subscribe((resDetail) => {
            console.log('Detail added and linked:', resDetail);
          });
    
          // Étape 3 : Ajouter les menus
          const menusToAdd = this.gastronomyForm.value.menus;
          const menuObservables = menusToAdd.map((menu: any) => {
            return this.gastronomyService.createMenu({
              nameMenu: menu.nameMenu,
              descriptionMenu: menu.descriptionMenu,
              prixMenu: menu.prixMenu,
              plates: menu.plates, // 👈 Ici on ajoute bien les plats
              gastronomy: { id: gastronomyId }
            }).toPromise();  // Convert Observable to Promise
          });
    
          // Exécuter les ajouts de menus
          Promise.all(menuObservables).then((menuResponses) => {
            console.log('Menus added and linked:', menuResponses);
            this.getAllGastronomies();
            this.gastronomyForm.reset();
            this.selectedImage = null;
          });
    
        }, (error) => {
          console.error('Erreur lors de l’ajout de la gastronomie :', error);
        });
      } else {
        console.warn('Formulaire invalide ou image non sélectionnée.');
      }
    }
    
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.gastronomyForm.patchValue({ image: file });
      this.gastronomyForm.get('image')?.updateValueAndValidity();
    }
  }
  

  editGastronomy(gastronomy: Gastronomy) {
    console.log('Gastronomy reçue:', gastronomy);
  
    this.selectedGastronomy = gastronomy;
  
    // Afficher l'image si elle existe
    this.selectedImage = null;
    this.imagePreview = gastronomy.image ? gastronomy.image : null;
  
    this.gastronomyForm.patchValue({
      name: gastronomy.name,
      type: gastronomy.type,
      location: gastronomy.location,
      image: gastronomy.image, // ← pas obligatoire car image = input type=file
      detailGastronomy: {
        description: gastronomy.detailGastronomy?.description || '',
        rating: gastronomy.detailGastronomy?.rating || 0
      }
    });
  
    this.menus.clear();
    if (gastronomy.menus) {
      gastronomy.menus.forEach(menu => {
        this.menus.push(this.fb.group({
          nameMenu: [menu.nameMenu, Validators.required],
          descriptionMenu: [menu.descriptionMenu, Validators.required],
          prixMenu: [menu.prixMenu, Validators.required],
          plates: this.fb.array(menu.plates?.map(plate => this.fb.group({
            namePlate: [plate.namePlate],
            descriptionPlate: [plate.descriptionPlate],
            pricePlate: [plate.pricePlate],
          })) || [])
        }));
      });
    }
  }
  
  
  

  updateGastronomy() {
    if (this.gastronomyForm.valid && this.selectedGastronomy) {
      const updatedGastronomy: Gastronomy = {
        ...this.selectedGastronomy,
        ...this.gastronomyForm.value
      };
      this.gastronomyService.update(updatedGastronomy).subscribe(response => {
        console.log('Gastronomy updated:', response);
        this.getAllGastronomies();
        this.selectedGastronomy = null;
        this.gastronomyForm.reset(); // Réinitialiser après mise à jour
      });
    }
  }

  deleteGastronomy(id?: number) {
    if (id !== undefined) {
      this.gastronomyService.delete(id).subscribe(() => {
        console.log('Gastronomy deleted');
        this.getAllGastronomies();
      });
    }
  }

 
    addMenu() {
      const menuGroup = this.createMenu();
      this.menus.push(menuGroup);
    }
  
    goToAddPlate(menuId: number) {
      this.router.navigate(['/dashboard/menu'], { queryParams: { menuId } });
    }

  removeMenu(index: number) {
    this.menus.removeAt(index);
  }

  // Ajout de menus à une gastronomie
  addMenusToGastronomy(gastronomy: Gastronomy, menuIds: number[]) {
    if (gastronomy.id !== undefined) {
      this.gastronomyService.affectMenuToGastronomy(gastronomy.id, menuIds).subscribe(response => {
        console.log('Menus affectés:', response);
        // Effectuer d'autres actions après la réussite de l'appel
      });
    } else {
      console.error('ID de la gastronomie non défini');
    }
  }

  // Ajout de détails à la gastronomie
  addDetailToGastronomy(gastronomy: Gastronomy, detailGastronomy: any) {
    if (gastronomy.id !== undefined) {
      this.gastronomyService.addDetailGastronomyAndAffectGastronomy(gastronomy.id, detailGastronomy).subscribe(response => {
        console.log('Détails de la gastronomie ajoutés et affectés:', response);
        // Effectuer d'autres actions après la réussite de l'appel
      });
    } else {
      console.error('ID de la gastronomie non défini');
    }
  }

  showDetailIds: number[] = [];
showMenuIds: number[] = [];

toggleDetails(gastronomyId: number) {
  if (this.showDetailIds.includes(gastronomyId)) {
    this.showDetailIds = this.showDetailIds.filter(id => id !== gastronomyId);
  } else {
    // Option : recharger les données complètes (avec details)
    this.gastronomyService.getById(gastronomyId).subscribe(gastronomy => {
      const index = this.gastronomies.findIndex(g => g.id === gastronomyId);
      if (index !== -1) {
        this.gastronomies[index] = gastronomy;
        this.showDetailIds.push(gastronomyId);
      }
    });
  }
}


toggleMenus(id: number) {
  // Même logique pour les menus
  const index = this.showMenuIds.indexOf(id);
  if (index === -1) {
    this.showMenuIds.push(id);
  } else {
    this.showMenuIds.splice(index, 1);
  }
}

}

