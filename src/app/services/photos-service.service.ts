import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosServiceService {




  apiUrl = 'http://localhost:8089/tourisme/Guide';

  constructor(private http: HttpClient) {}

  uploadGuideImage(guideId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.apiUrl}/${guideId}/upload-image`,
      formData,
      { responseType: 'text' }
    );
  }



  getFullImageUrl(filename: string): string {
    return `${this.apiUrl}/images/${filename}`;
  }
}
