import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PredictionRequest {
  location: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:8089/tourisme/api/predict';

  constructor(private http: HttpClient) {}

  predict(data: { location: string, rating: number }) {
    return this.http.post<string>(this.apiUrl, data, { responseType: 'text' as 'json' });
  }
}
