import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SummarizationService {
    private apiUrl = 'http://localhost:8089/tourisme/resume/summarize';

    constructor(private http: HttpClient) {}

    summarize(text: string): Observable<string> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = { text };
    
        return this.http.post(this.apiUrl, body, { headers, responseType: 'text' });
      }
}