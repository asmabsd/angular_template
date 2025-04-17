import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PanelCountService {

  private countSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.countSubject.asObservable();

  increment() {
    const current = this.countSubject.value;
    this.countSubject.next(current + 1);
  }
}

