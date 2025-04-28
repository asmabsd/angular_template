import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetailGastronomy } from '../models/detailgastronomy.model';

@Injectable({
  providedIn: 'root'
})
export class DetailGastronomyService {
  private apiUrl = 'http://localhost:8089/tourisme/detailGastronomy';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DetailGastronomy[]> {
    return this.http.get<DetailGastronomy[]>(`${this.apiUrl}/retrieveAllDetailGastronomies`);
  }

  getById(id: number): Observable<DetailGastronomy> {
    return this.http.get<DetailGastronomy>(`${this.apiUrl}/retrieveDetailGastronomy/${id}`);
  }

  create(detailGastronomy: DetailGastronomy): Observable<DetailGastronomy> {
    return this.http.post<DetailGastronomy>(`${this.apiUrl}/addDetailGastronomy`, detailGastronomy);
  }

  update(detailGastronomy: DetailGastronomy): Observable<DetailGastronomy> {
    return this.http.put<DetailGastronomy>(`${this.apiUrl}/updateDetailGastronomy`, detailGastronomy);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteDetailGastronomy/${id}`);
  }
}
