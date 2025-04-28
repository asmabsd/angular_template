import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { PlateService } from 'src/app/services/plate.service';
import { GastronomyService } from 'src/app/services/gastronomy.service';
import { Menu } from 'src/app/models/menu.model';
import { CurrencyService } from 'src/app/services/currency.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-menus-plats',
  templateUrl: './menus-plats.component.html',
  styleUrls: ['./menus-plats.component.css']
})
export class MenusPlatsComponent implements OnInit {
  menus: Menu[] = [];
  gastronomyId!: number;
  gastronomyName: string = '';
  showConvertedPrices: boolean = false;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private plateService: PlateService,
    private currencyService: CurrencyService,
    private gastronomyService: GastronomyService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('gastronomyId');
    console.log('Received gastronomyId from route:', id);
    
    if (!id) {
      this.error = 'ID de gastronomie non trouvé';
      return;
    }
    
    this.gastronomyId = +id;
    this.loadGastronomyData();
  }

  loadGastronomyData(): void {
    this.loading = true;
    this.error = null;
    console.log('Loading gastronomy data for ID:', this.gastronomyId);

    this.gastronomyService.getById(this.gastronomyId).pipe(
      tap(gastronomy => {
        console.log('Gastronomy data received:', gastronomy);
      }),
      catchError(error => {
        console.error('Error loading gastronomy:', error);
        this.error = 'Erreur lors du chargement des données de la gastronomie';
        return of(null);
      })
    ).subscribe(gastronomy => {
      if (gastronomy) {
        this.gastronomyName = gastronomy.name;
        this.loadMenus();
      } else {
        this.error = 'Gastronomie non trouvée';
        this.loading = false;
      }
    });
  }

  loadMenus(): void {
    console.log('Loading menus for gastronomy ID:', this.gastronomyId);
    
    this.menuService.getMenusByGastronomyId(this.gastronomyId).pipe(
      tap(menus => {
        console.log('Menus received:', menus);
      }),
      catchError(error => {
        console.error('Error loading menus:', error);
        this.error = 'Erreur lors du chargement des menus';
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
        console.log('Menu loading completed');
      })
    ).subscribe(menus => {
      this.menus = menus;
      if (menus.length > 0) {
        console.log('Found menus, loading plates...');
        this.loadPlatesForMenus();
      } else {
        console.log('No menus found for this gastronomy');
      }
    });
  }

  loadPlatesForMenus(): void {
    this.menus.forEach(menu => {
      if (menu.id) {
        console.log('Loading plates for menu:', menu.id);
        this.plateService.getPlatesByMenuId(menu.id).pipe(
          tap(plates => {
            console.log('Plates received for menu', menu.id, ':', plates);
          }),
          catchError(error => {
            console.error(`Error loading plates for menu ${menu.id}:`, error);
            return of([]);
          })
        ).subscribe(plates => {
          menu.plates = plates;
        });
      }
    });
  }

  convertTndToEur(tnd: number): string {
    const eur = this.currencyService.convertToEuro(tnd);
    return `${eur} €`;
  }

  toggleConversion(): void {
    this.showConvertedPrices = !this.showConvertedPrices;
  }
}
