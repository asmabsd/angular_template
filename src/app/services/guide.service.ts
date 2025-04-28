import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guide } from '../models/guide.model';
import { EmailRequest } from '../models/emailrequest';


export interface GuideStatsResponse {
  totalGuides: number;
  guidesByLanguage: { [key: string]: number };
  guidesBySpeciality: { [key: string]: number };
  averageRatingsByGuide: { [key: string]: number };
  reservationsByGuide: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  private apiUrl = 'http://localhost:8089/tourisme/Guide/viewGuide';
  private apiUrl2= 'http://localhost:8089/tourisme/Guide/addGuide';
  private apiUrl3 = 'http://localhost:8089/tourisme/Guide/updateGuide';
  private apiUrl4 = 'http://localhost:8089/tourisme/Guide/getOne';   constructor(private http: HttpClient) {}
  private apiUrl5= 'http://localhost:8089/tourisme/Guide/deleteGuide';

  getGuide(): Observable<Guide[]> {
    return this.http.get<Guide[]>(this.apiUrl);
  }
  

 /* addGuide(guide: Guide): Observable<Guide> {

    if (guide.image) {
      const base64String = guide.image.split(',')[1]; // Enlève le préfixe
      guide.image = base64String; // Assure-toi que c'est une chaîne Base64 pure
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Guide>(this.apiUrl2, guide, { headers });
  }*/
   /* addGuide(guide: Guide): Observable<Guide> {
      // Process image if it exists
      if (guide.image && guide.image.startsWith('data:image')) {
        guide.image = guide.image.split(',')[1]; // Remove the data URL prefix
      }
    
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
    
      return this.http.post<Guide>(this.apiUrl2, guide, { headers });
    }*/

    addGuide(guide: Guide): Observable<Guide> {
    return this.http.post<Guide>(`${this.apiUrl2}`, guide);
  }
  
  getGuideById(id: number): Observable<Guide> {
    return this.http.get<Guide>(`${this.apiUrl4}/${id}`);  // Replace the path with the correct API
  }

  // Update the guide
  editGuide(guide: Guide): Observable<Guide> {
    console.log("Sending PUT request to:", `${this.apiUrl3}/${guide.id}`, "with data:", guide);
    return this.http.put<Guide>(`${this.apiUrl3}/${guide.id}`, guide, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
  
    // Update the guide
    deleteGuide(guideId: number): Observable<any> {
      const url = `${this.apiUrl5}/${guideId}`;
      return this.http.delete(url);  // Use http.delete() for the DELETE request
    }
    uploadImage(guideId: number, file: File): Observable<string> {
      const formData = new FormData();
      formData.append('file', file);
      
      return this.http.post<string>(`http://localhost:8089/tourisme/Guide/${guideId}/uploadImage`, formData);
    }
    private apiUrl8 = 'http://localhost::8089/tourisme/Guide';
 // In your Angular GuideService, you will retrieve the image path from the backend
 getImage(imageName: string): Observable<Blob> {
  const imageUrl = `${this.apiUrl}/uploads/${imageName}`;
  return this.http.get(imageUrl, { responseType: 'blob' });
}




private apiUrl9 = 'http://localhost:8089/tourisme/Guide/searchGuides';  // Remplacez par l'URL de votre API


// Méthode pour récupérer les guides filtrés
getGuides(searchParams: any): Observable<any[]> {
  let params = new HttpParams();

  // Ajout des paramètres de recherche
  if (searchParams.name) params = params.set('name', searchParams.name);
  if (searchParams.language) params = params.set('language', searchParams.language);
  if (searchParams.experience) params = params.set('experience', searchParams.experience);
  if (searchParams.speciality) params = params.set('speciality', searchParams.speciality);
  if (searchParams.averageRating) params = params.set('averageRating', searchParams.averageRating.toString());
  if (searchParams.availability) params = params.set('availability', searchParams.availability);
  if (searchParams.contact) params = params.set('contact', searchParams.contact);

  return this.http.get<any[]>(this.apiUrl, { params });
}
getGuideByContact(contact: string): Observable<Guide> {
  return this.http.get<Guide>(`${this.url11}/${encodeURIComponent(contact)}`);
}

url11 ='http://localhost:8089/tourisme/Guide/contact';
/*getGuideByContact(email: string): Observable<Guide> {
  return this.http.get<Guide>(`${this.url11}/${email}`);
}*/
url18='http://localhost:8089/tourisme/Guide/language'


getLanguageByGuide(id: number): Observable<string> {
  return this.http.get(`${this.url18}/${id}`, { responseType: 'text' });
}





}
