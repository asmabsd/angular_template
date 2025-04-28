import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { PlateService } from 'src/app/services/plate.service';
import { GastronomyService } from 'src/app/services/gastronomy.service'; // Assurez-vous que le service est importé
import { Menu } from 'src/app/models/menu.model';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-menus-plats',
  templateUrl: './menus-plats.component.html',
  styleUrls: ['./menus-plats.component.css']
})
export class MenusPlatsComponent implements OnInit {
  menus: Menu[] = [];
  gastronomyId!: number;
  gastronomyName: string = ''; // Variable pour stocker le nom de la gastronomie
  showConvertedPrices: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private plateService: PlateService,
    private currencyService: CurrencyService,
    private gastronomyService: GastronomyService // Injection du service gastronomy
  ) {}

  ngOnInit(): void {
    this.gastronomyId = +this.route.snapshot.paramMap.get('gastronomyId')!;
    
    // Appel du service pour récupérer le nom de la gastronomie
    this.gastronomyService.getById(this.gastronomyId).subscribe((gastronomy) => {
      this.gastronomyName = gastronomy.name; // Récupère le nom de la gastronomie
    });

    this.loadMenus();
  }

  loadMenus(): void {
    this.menuService.getMenusByGastronomyId(this.gastronomyId).subscribe(data => {
      this.menus = data;
      this.menus.forEach(menu => {
        this.plateService.getPlatesByMenuId(menu.id!).subscribe(plates => {
          menu.plates = plates;
        });
      });
    });
  }
  convertTndToEur(tnd: number): string {
    const eur = this.currencyService.convertToEuro(tnd);
    return `${eur} €`;
  }
  toggleConversion() {
    this.showConvertedPrices = !this.showConvertedPrices;
  }
}
