import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Panel } from 'src/app/models/GestionSouvenir/panel';
import { catchError, throwError } from 'rxjs'; // Add these imports
import { CommandLineDTO } from 'src/app/models/GestionSouvenir/CommandLineDTO';
@Injectable({
  providedIn: 'root',
})
export class PanelService {
  private apiUrl = 'http://localhost:8089/tourisme/panel'; // Base URL pour le panel
  constructor(private http: HttpClient) {}

  // Ajouter un article au panel
  // panel.service.ts
  addToPanel(souvenirId: number, quantity: number = 1): Observable<Panel> {
    const params = new HttpParams()
      .set('souvenirId', souvenirId.toString())
      .set('quantity', quantity.toString());

    return this.http.post<Panel>(
      `${this.apiUrl}/add`,
      {}, // pas besoin de body ici
      {
        params: params,
        withCredentials: true, // pour la gestion de session
      }
    );
  }

  applyDiscount(code: string): Observable<Panel> {
    return this.http.post<Panel>(
      `${this.apiUrl}/apply-discount`,
      { code },
      { withCredentials: true }
    );
  }

  removeDiscount(): Observable<Panel> {
    return this.http.post<Panel>(
      `${this.apiUrl}/remove-discount`,
      {},
      { withCredentials: true }
    );
  }
  updatePanelQuantity(index: number, quantity: number): Observable<Panel> {
    return this.http
      .patch<Panel>(`${this.apiUrl}/update/${index}/${quantity}`, {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      })
      .pipe(
        catchError((error) => {
          console.error('Error updating panel quantity:', error);
          return throwError(error);
        })
      );
  }

  // updateEntirePanel(
  //   updates: Array<{ souvenirId: number; quantity: number }>
  // ): Observable<Panel> {
  //   return this.http.patch<Panel>(`${this.apiUrl}/updatepanel`, updates, {
  //     withCredentials: true,
  //   });
  // }
  // Modifier l'interface des paramètres
  updateEntireCart(
    updates: { souvenirId: number; quantity: number }[]
  ): Observable<Panel> {
    return this.http.put<Panel>(`${this.apiUrl}/update`, updates, {
      withCredentials: true, // pour la gestion de session
    });
  }

  // Visualiser le panel
  viewPanel(): Observable<Panel> {
    return this.http.get<Panel>(`${this.apiUrl}`, {
      withCredentials: true, // pour la gestion de session
    });
  }

  // panel.service.ts
 
  // Supprimer un article du panel
  removeFromPanel(index: number): Observable<Panel> {
    return this.http.delete<Panel>(`${this.apiUrl}/remove/${index}`, {
      withCredentials: true, // pour la gestion de session
    });
  }

  // Vider le panel
  clearPanel(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`, {
      withCredentials: true, // pour la gestion de session
    });
  }

  getActiveDiscounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/discounts`);
  }
}
