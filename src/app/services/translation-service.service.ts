import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = 'https://translate.argosopentech.com/translate'; // ou '/translate' si proxy

  constructor(private http: HttpClient) {}

  translate(text: string, targetLang: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      q: text,
      source: 'auto',
      target: targetLang,
      format: 'text'
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
