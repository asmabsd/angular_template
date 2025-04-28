import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandLine } from 'src/app/models/GestionSouvenir/CommandLine';
import { MonthlySales } from 'src/app/models/GestionSouvenir/MonthlySales';
import { TopSellingSouvenir } from 'src/app/models/GestionSouvenir/TopSellingSouvenir';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:8089/tourisme/sales'; // Replace with your backend URL
  constructor(private http: HttpClient) {}
  
  getMonthlySalesByStore(id : number): Observable<MonthlySales[]> {
  return this.http.get<MonthlySales[]>(`${this.apiUrl}/monthly/${id}`);
  }
  
  getTopSellingSouvenirsByStore(id : number): Observable<TopSellingSouvenir[]> {
  return this.http.get<TopSellingSouvenir[]>(`${this.apiUrl}/top-souvenirs/${id}`);
  }
  
  getDetailedSalesByStore(id : number): Observable<CommandLine[]> {
  return this.http.get<CommandLine[]>(`${this.apiUrl}/detailsales/${id}`);
  }
}
