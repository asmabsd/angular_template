import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeepgramService {
  private apiUrl = 'https://api.deepgram.com/v1/listen';
  private apiKey = '038a7c4340bb7a68b230788d365a0c61068bc21c'; // my Deepgram API key

  constructor(private http: HttpClient) {}

  transcribeAudio(audioBlob: Blob): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.apiKey}`,
      'Content-Type': 'audio/webm' // Deepgram supports webm, adjust if needed
    });

    return this.http.post(this.apiUrl, audioBlob, { headers });
  }
}