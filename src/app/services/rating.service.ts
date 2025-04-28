// src/app/services/rating.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetailGastronomy } from '../models/detailgastronomy.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:8089/tourisme/gastronomy/rating';

  constructor(private http: HttpClient) {}

  submitRating(gastronomyId: number, rating: number) {
    return this.http.post<DetailGastronomy>(`${this.apiUrl}/${gastronomyId}`, { rating });
  }
}
