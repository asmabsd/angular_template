import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../models/menu.model';
import { Plate } from '../models/Plate';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  private apiUrl = 'http://localhost:8089/tourisme/menu';

  constructor(private http: HttpClient) {}

  getAllMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}/retrieveAllMenus`);
  }

  getMenu(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}/retrieveMenu/${id}`);
  }

  createMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(`${this.apiUrl}/addMenu`, menu);
  }

  updateMenu(menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/updateMenu`, menu);
  }

  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteMenu/${id}`);
  }
  getPlatesByMenuId(menuId: number): Observable<Plate[]> {
    return this.http.get<Plate[]>(`http://localhost:8089/tourisme/plate/getPlatesByMenu/${menuId}`);
  }
  getMenusByGastronomyId(gastronomyId: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}/getMenusByGastronomy/${gastronomyId}`);
  }
  
}