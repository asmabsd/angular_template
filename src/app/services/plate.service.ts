import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plate } from '../models/Plate';

@Injectable({
  providedIn: 'root'
})
export class PlateService {
  private apiUrl = 'http://localhost:8089/tourisme/plate';

  constructor(private http: HttpClient) { }

  // Add a new plate
  addPlate(plate: Plate): Observable<Plate> {
    return this.http.post<Plate>(`${this.apiUrl}/addPlate`, plate);
  }
  createPlateWithImage(formData: FormData): Observable<any> {
    return this.http.post<Plate>(`${this.apiUrl}/addPlate`,  formData);

  }
  // Update existing plate
  updatePlate(plate: Plate): Observable<Plate> {
    return this.http.put<Plate>(`${this.apiUrl}/updatePlate`, plate);
  }

  // Get all plates
  getAllPlates(): Observable<Plate[]> {
    return this.http.get<Plate[]>(`${this.apiUrl}/getAllPlates`);
  }

  // Get single plate by ID
  getPlate(id: number): Observable<Plate> {
    return this.http.get<Plate>(`${this.apiUrl}/getPlate/${id}`);
  }
  getPlatesByMenuId(menuId: number): Observable<Plate[]> {
    return this.http.get<Plate[]>(`${this.apiUrl}/getPlatesByMenu/${menuId}`);
  }
  // Delete a plate
  deletePlate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletePlate/${id}`);
  }
}