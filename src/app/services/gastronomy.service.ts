import { Injectable } from '@angular/core';
import { HttpClient , HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gastronomy } from '../models/gastronomy.model';
import { DetailGastronomy } from '../models/detailgastronomy.model';

@Injectable({
  providedIn: 'root'
})
export class GastronomyService {
  private apiUrl = 'http://localhost:8089/tourisme/gastronomy';
  private baseUrl = 'http://localhost:8089/tourisme/detailGastronomy/getDetailGastronomy';

  constructor(private http: HttpClient) {}
  
  createMenu(menu: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addMenu`, menu);
  }
  
  getAll(): Observable<Gastronomy[]> {
    return this.http.get<Gastronomy[]>(`${this.apiUrl}/retrieveAllGastronomies`);
  }
  createWithImage(data: FormData) {
    return this.http.post<Gastronomy>('http://localhost:8089/tourisme/gastronomy/addGastronomy', data);
  }
  

  getById(id: number): Observable<Gastronomy> {
    return this.http.get<Gastronomy>(`${this.apiUrl}/retrieveGastronomy/${id}`);
  }

  create(gastronomy: Gastronomy): Observable<Gastronomy> {
    return this.http.post<Gastronomy>(`${this.apiUrl}/addGastronomy`, gastronomy);
  }

  update(gastronomy: Gastronomy): Observable<Gastronomy> {
    return this.http.put<Gastronomy>(`${this.apiUrl}/updateGastronomy`, gastronomy);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteGastronomy/${id}`);
  }

  affectMenuToGastronomy(idGastronomy: number, idMenus: number[]): Observable<Gastronomy> {
    return this.http.put<Gastronomy>(`${this.apiUrl}/affectMenuToGastronomy/${idGastronomy}`, idMenus);
  }

  addDetailGastronomyAndAffectGastronomy(idGastronomy: number, detailGastronomy: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addDetailGastronomyAndAffectGastronomy/${idGastronomy}`, detailGastronomy);
  }
  search(criteria: {name?: string, type?: string, location?: string, minRating?: number, plateKeyword?: string}): Observable<Gastronomy[]> {
    let params = new HttpParams();
    if (criteria.name) params = params.set('name', criteria.name);
    if (criteria.type) params = params.set('type', criteria.type);
    if (criteria.location) params = params.set('location', criteria.location);
    if (criteria.minRating) params = params.set('minRating', criteria.minRating.toString());
    if (criteria.plateKeyword) params = params.set('plateKeyword', criteria.plateKeyword);

    return this.http.get<Gastronomy[]>(`${this.apiUrl}/search`, { params });
  }
  getGastronomyCountByType() {
    return this.http.get<any>('http://localhost:8089/tourisme/api/statistics/count-by-type');
  }
  
  getGastronomyCountByLocation() {
    return this.http.get<any>('http://localhost:8089/tourisme/api/statistics/count-by-location');
  }
  
  getAverageRatingByType() {
    return this.http.get<any>('http://localhost:8089/tourisme/api/statistics/average-rating-by-type');
  }
  getAverageRatingByLocation() {
    return this.http.get<any>('http://localhost:8089/tourisme/api/statistics/average-rating-by-location');
  }

  generateAdvice(gastronomyDTO: any) {
    return this.http.post<string>('http://localhost:8089/tourisme/gastronomy/generateAdvice', gastronomyDTO);
  }
  getDetailById(id: number): Observable<DetailGastronomy> {
    return this.http.get<DetailGastronomy>(`${this.baseUrl}/${id}`);
  }
}
