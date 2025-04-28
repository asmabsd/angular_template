import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  // Permettre à BehaviorSubject de gérer un message de type string ou null
  private messageSubject = new BehaviorSubject<string | null>(''); 
  message$ = this.messageSubject.asObservable();

  setMessage(message: string): void {
    this.messageSubject.next(message); // Publier le message
  }

  clearMessage(): void {
    this.messageSubject.next(null); // Effacer le message
  }
}
