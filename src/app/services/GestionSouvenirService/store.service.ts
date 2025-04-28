import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Store } from 'src/app/models/GestionSouvenir/store'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private apiUrlAdd = 'http://localhost:8089/tourisme/store/addStore'
  private apiUrlUpdate = 'http://localhost:8089/tourisme/store/updateStore'
  private apiUrlRetrieve = 'http://localhost:8089/tourisme/store/retrieveStore'
  private apiUrlUpdateStoreStatusById = 'http://localhost:8089/tourisme/store/';
  private apiUrlRetrieveAll ='http://localhost:8089/tourisme/store/retrieveAllStore'
  private apiUrlRetrieveAllInvalide ='http://localhost:8089/tourisme/store/retrieveAllStoreInvalide'
  private apiUrlRetrieveAllValide ='http://localhost:8089/tourisme/store/retrieveAllStoreValide'
  private apiUrlDelete ='http://localhost:8089/tourisme/store/deleteStore'
  constructor(private http: HttpClient) {}
  getStore(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrlRetrieveAll)
  }
  getStoreInvalide(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrlRetrieveAllInvalide)
  }
  getStoreValide(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrlRetrieveAllValide)
  }
  addStore(Store: Store): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrlAdd}`, Store)
  }

  getStoreById(id: number): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrlRetrieve}/${id}`)// Replace the path with the correct API
  }
 updateStoreStatusById(id: number): Observable<Store> {
  return this.http.put<Store>(`${this.apiUrlUpdateStoreStatusById}${id}/status`, null);
}

  // Update the Store

  editStore(store: Store): Observable<Store> {
    console.log(
      'Sending PUT request to: ',
      `${this.apiUrlUpdate}`,  // Ne pas ajouter "/updateStore" une deuxième fois
      'with data: ',
      store
    );
    return this.http.put<Store>(`${this.apiUrlUpdate}`, store, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
  
  
  
  // Update the Store
  deleteStore(StoreId: number): Observable<any> {
    const url = `${this.apiUrlDelete}?id=${StoreId}`
    return this.http.delete(url) // Use http.delete() for the DELETE request
  }
  // uploadImage(StoreId: number, file: File): Observable<string> {
  //   const formData = new FormData()
  //   formData.append('file', file)

  //   return this.http.post<string>(
  //     `http://localhost:8089/tourisme/Store/${StoreId}/uploadImage`,
  //     formData
  //   )
  // }
  // private apiUrl8 = 'http://localhost::8089/tourisme/Store'
  // // In your Angular StoreService, you will retrieve the image path from the backend
  // getImage(imageName: string): Observable<Blob> {
  //   const imageUrl = `${this.apiUrl}/uploads/${imageName}`
  //   return this.http.get(imageUrl, { responseType: 'blob' })
  // }
}
