import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreSelectionService {

  private selectedStoreId = new BehaviorSubject<number | null>(null);
  selectedStoreId$ = this.selectedStoreId.asObservable();

  setStoreId(id: number) {
    this.selectedStoreId.next(id);
  }
}
