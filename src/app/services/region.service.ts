import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Region } from '../models/Region.enum';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private selectedRegionSource = new BehaviorSubject<Region>(Region.TUNIS); // Valeur par défaut
  selectedRegion$ = this.selectedRegionSource.asObservable();

  setRegion(region: Region): void {
    this.selectedRegionSource.next(region);
  }

  getCurrentRegion(): Region {
    return this.selectedRegionSource.value;
  }
}
