import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';

@Injectable({
  providedIn: 'root'
})
export class SouvenirService {
private apiUrlAdd = 'http://localhost:8089/pidev/souvenir/addSouvenir'
  private apiUrlUpdate = 'http://localhost:8089/pidev/souvenir/updateSouvenir'
  private apiUrlRetrieve = 'http://localhost:8089/pidev/souvenir/retrieveSouvenir'
  private apiUrlRetrieveAll ='http://localhost:8089/pidev/souvenir/retrieveAllSouvenir'
  private apiUrlDelete ='http://localhost:8089/pidev/souvenir/deleteSouvenir'
  constructor(private http: HttpClient) {}
  getSouvenir(): Observable<Souvenir[]> {
    return this.http.get<Souvenir[]>(this.apiUrlRetrieveAll)
  }
  addSouvenir(Souvenir: Souvenir): Observable<Souvenir> {
    return this.http.post<Souvenir>(`${this.apiUrlAdd}`, Souvenir)
  }

  getSouvenirById(id: number): Observable<Souvenir> {
    return this.http.get<Souvenir>(`${this.apiUrlRetrieve}/${id}`)// Replace the path with the correct API
  }

  // Update the Souvenir

  editSouvenir(Souvenir: Souvenir): Observable<Souvenir> {
    console.log(
      'Sending PUT request to: ',
      `${this.apiUrlUpdate}`,  // Ne pas ajouter "/updateSouvenir" une deuxième fois
      'with data: ',
      Souvenir
    );
    return this.http.put<Souvenir>(`${this.apiUrlUpdate}`, Souvenir, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
  
  
  
  // Update the Souvenir
  deleteSouvenir(SouvenirId: number): Observable<any> {
    const url = `${this.apiUrlDelete}?id=${SouvenirId}`
    return this.http.delete(url) // Use http.delete() for the DELETE request
  }
}
