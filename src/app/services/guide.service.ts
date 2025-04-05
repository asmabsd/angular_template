import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guide } from '../models/guide.model';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  private apiUrl = 'http://localhost:8089/tourisme/Guide/viewGuide';
  private apiUrl2= 'http://localhost:8089/tourisme/Guide/addGuide';


  constructor(private http: HttpClient) {}

  getGuide(): Observable<Guide[]> {
    return this.http.get<Guide[]>(this.apiUrl);
  }
  

  addGuide(guide: Guide): Observable<Guide> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Guide>(this.apiUrl2, guide, { headers });
  }
  
}

