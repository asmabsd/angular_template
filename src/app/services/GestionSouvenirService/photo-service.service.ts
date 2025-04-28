import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosServiceService {

  apiUrl = 'http://localhost:8089/tourisme/souvenir';

  constructor(private http: HttpClient) {}

  // Upload image for souvenir
  uploadsouvenirImage(souvenirId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(
      `${this.apiUrl}/${souvenirId}/upload-image`,
      formData,
      { responseType: 'text' as 'json' } // Spécifiez que la réponse attendue est du type texte
    );
  }

  // Construct the full URL to access the image
  getFullImageUrl(filename: string): string {
    return `${this.apiUrl}/images/${filename}`;
  }

  // Optionnel : méthode pour récupérer l'image directement sous forme de blob
  getImageBlob(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/images/${filename}`, { responseType: 'blob' });
  }

  // Méthode pour télécharger l'image dans le navigateur (par exemple pour un téléchargement direct)
  downloadImage(filename: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiUrl}/images/${filename}`, {
      headers: new HttpHeaders(),
      responseType: 'blob',
      observe: 'response'
    });
  }
}
