import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GuideStats } from '../models/guide-stats.model';

@Injectable({
  providedIn: 'root'
})
export class GuideStatsService {

 
  private baseUrl = 'http://localhost:8089/tourisme/Guide/guidestats';

  constructor(private http: HttpClient) {}

  getStats(): Observable<GuideStats> {
    return this.http.get<GuideStats>(`${this.baseUrl}`);
  }
}
