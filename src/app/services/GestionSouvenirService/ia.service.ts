import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerationRequest } from 'src/app/models/GestionSouvenir/GenerationRequest';

@Injectable({
  providedIn: 'root'
})
export class IaService {

  constructor(private http: HttpClient) {}


  private apiUrl = 'http://localhost:8089/tourisme/iA'; // adapte si besoin

 
  generateDescription(request: GenerationRequest): Observable<string> {
    return this.http.post(this.apiUrl + '/generateDescription', request, {
      responseType: 'text',
    });
  }
}
