import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';

@Injectable({
  providedIn: 'root'
})
export class SouvenirService {
private apiUrlAdd = 'http://localhost:8089/tourisme/souvenir/addSouvenir'
  private apiUrlUpdate = 'http://localhost:8089/tourisme/souvenir/updateSouvenir'
  private apiUrlRetrieve = 'http://localhost:8089/tourisme/souvenir/retrieveSouvenir'
  private apiUrlRetrieveAll ='http://localhost:8089/tourisme/souvenir/retrieveAllSouvenir'
  private apiUrlDelete ='http://localhost:8089/tourisme/souvenir/deleteSouvenir'
  private apiUrlretrieveSouvenirsByStore ='http://localhost:8089/tourisme/souvenir/store'
  constructor(private http: HttpClient) {}
  getSouvenir(): Observable<Souvenir[]> {
    return this.http.get<Souvenir[]>(this.apiUrlRetrieveAll)
  }
  getSouvenirByStore(id :number): Observable<Souvenir[]> {
    return this.http.get<Souvenir[]>(`${this.apiUrlretrieveSouvenirsByStore}/${id}`)
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


  uploadImage(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<string>(`http://localhost:8089/tourisme/souvenir/${id}/uploadImage`, formData);
  }
  private apiUrl = 'http://localhost::8089/tourisme/souvenir';
// In your Angular GuideService, you will retrieve the image path from the backend
getImage(imageName: string): Observable<Blob> {
const imageUrl = `${this.apiUrl}/uploads/${imageName}`;
return this.http.get(imageUrl, { responseType: 'blob' });
}

}
