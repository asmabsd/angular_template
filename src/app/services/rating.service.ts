//import { Injectable } from '@angular/core';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RatingService {



  constructor(private http: HttpClient) { }

  rateReservation(guideId: number, rating: number): Observable<any> {
    return this.http.post(`http://localhost:8089/tourisme/Guide/rate/${guideId}`, { rating });
  }
}



