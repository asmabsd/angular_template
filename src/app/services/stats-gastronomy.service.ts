import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsGastronomyService {

  private apiUrl = 'http://localhost:8089/tourisme/api/statistics';

  constructor(private http: HttpClient) { }

  // Récupérer les statistiques du nombre de gastronomies par type
  getCountByType(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count-by-type`);
  }

  // Récupérer les statistiques du nombre de gastronomies par région
  getCountByLocation(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count-by-location`);
  }

  // Récupérer la note moyenne par type
  getAverageRatingByType(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/average-rating-by-type`);
  }
  getAverageRatingByLocationAndType(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      'http://localhost:8089/tourisme/api/statistics/average-rating-by-location-and-type'
    );
  }
  
  
}
