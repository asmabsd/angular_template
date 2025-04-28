import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Menu } from 'src/app/models/menu.model';
import { Plate } from 'src/app/models/Plate';
import { MenuService } from 'src/app/services/menu.service';
import { PlateService } from 'src/app/services/plate.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {
  menus: Menu[] = [];
  plates: Plate[] = [];
  menuForm!: FormGroup;
  plateForm!: FormGroup;
  selectedMenu: Menu | null = null;
  shownPlatesMenus = new Set<number>();

  menuIdToAddPlate?: number;
  isPlateOnlyMode = false;
  constructor(
    private menuService: MenuService, 
    private plateService: PlateService, 
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMenus(); // Chargement des menus à l'initialisation
  }

  initForm() {
    this.menuForm = this.fb.group({
      nameMenu: ['', Validators.required],
      descriptionMenu: ['', Validators.required],
      prixMenu: [0, [Validators.required]],
      plates: this.fb.array([]) // FormArray pour les plats
    });
  }

  get platesArray(): FormArray {
    return this.menuForm.get('plates') as FormArray;
  }

  addPlateField() {
    const plateForm = this.fb.group({
      namePlate: ['', Validators.required],
      descriptionPlate: ['', Validators.required],
      pricePlate: [0, Validators.required],
      imagePlate: ['']
    });
    this.platesArray.push(plateForm);
  }

  removePlateField(index: number) {
    this.platesArray.removeAt(index);
  }

  // Charger les menus depuis l'API
  loadMenus() {
    this.menuService.getAllMenus().subscribe(data => {
      this.menus = data.map(menu => ({
        ...menu,
        plates: menu.plates || [] // Si plates est undefined, on initialise en tant que tableau vide
      }));
    });
  }

  // Charger les plats d'un menu
  loadPlates(menuId: number) {
    if (menuId) {
      this.plateService.getPlatesByMenuId(menuId).subscribe(data => {
        const menu = this.menus.find(m => m.id === menuId);
        if (menu) {
          menu.plates = data;
          this.shownPlatesMenus.add(menuId); // 🔥 on active l'affichage pour ce menu
        }
      });
    }
  }
  

  // Soumettre le formulaire pour créer ou mettre à jour un menu
 // Soumettre le formulaire pour créer ou mettre à jour un menu
 submitForm() {
  if (this.menuForm.valid) {
    const menu: Menu = this.menuForm.value;

    if (this.selectedMenu) {
      menu.id = this.selectedMenu.id;
      this.menuService.updateMenu(menu).subscribe(() => {
        this.loadMenus();
        this.resetForm();
      });
    } else {
      this.menuService.createMenu(menu).subscribe((newMenu) => {
        if (newMenu.id) {
          this.addPlatesToMenu(newMenu.id); // ✅ Ajouter les plats avant de reset le form
        }
        this.loadMenus();
        this.resetForm(); // ✅ Déplacé ici
      });
    }
  }
}



  // Ajouter les plats au menu après sa création ou mise à jour
  addPlatesToMenu(menuId: number) {
    this.platesArray.controls.forEach((plateForm: any) => {
      const plate: Plate = plateForm.value;
      plate.menu = { id: menuId }; 
      console.log("Adding plate:", plate); // 👀 Voir la structure envoyée
      this.plateService.addPlate(plate).subscribe(() => {
        this.loadPlates(menuId);
      });
    });
  }
  

  // Modifier un menu existant
  editMenu(menu: Menu) {
    this.selectedMenu = menu;
    this.menuForm.patchValue({
      nameMenu: menu.nameMenu,
      descriptionMenu: menu.descriptionMenu,
      prixMenu: menu.prixMenu
    });

    // Réinitialiser les plats et ajouter ceux du menu sélectionné
    this.platesArray.clear();
    this.plateService.getPlatesByMenuId(menu.id!).subscribe(data => {
      data.forEach(plate => {
        const plateForm = this.fb.group({
          namePlate: [plate.namePlate, Validators.required],
          descriptionPlate: [plate.descriptionPlate, Validators.required],
          pricePlate: [plate.pricePlate, Validators.required],
          imagePlate: [plate.imagePlate]
        });
        this.platesArray.push(plateForm);
      });
    });
  }

  // Supprimer un menu
  deleteMenu(id: number | undefined) {
    if (id) {
      this.menuService.deleteMenu(id).subscribe(() => {
        this.loadMenus();  // Recharger les menus après la suppression
      });
    }
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.menuForm.reset();
    this.selectedMenu = null;
    this.platesArray.clear();
  }
}