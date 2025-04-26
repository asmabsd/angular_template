import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationGuide } from 'src/app/models/reservationguide.model';
import { map } from 'rxjs/operators';
import { EmailRequest } from '../models/emailrequest';

@Injectable({
  providedIn: 'root'
})
export class ReservationGuideService {
  private apiUrl = 'http://localhost:8089/tourisme/ReservationGuide/viewReservationGuide'  ;
  private apiUrl2= 'http://localhost:8089/tourisme/ReservationGuide/addReservationGuide';
  private apiUrl3 = 'http://localhost:8089/tourisme/ReservationGuide/updateReservationGuide';
  private apiUrl4 = 'http://localhost:8089/tourisme/ReservationGuide/getOne';   constructor(private http: HttpClient) {}
  private apiUrl5= 'http://localhost:8089/tourisme/ReservationGuide/deleteReservationGuide';
  getReservationGuide(): Observable<ReservationGuide[]> {
    return this.http.get<ReservationGuide[]>(this.apiUrl);
  }
  

  addReservationGuide(ReservationGuide: ReservationGuide): Observable<ReservationGuide> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ReservationGuide>(this.apiUrl2, ReservationGuide, { headers });
  }
  
  getReservationGuideById(id: number): Observable<ReservationGuide> {
    return this.http.get<ReservationGuide>(`${this.apiUrl4}/${id}`);  // Replace the path with the correct API
  }

  // Update the ReservationGuide
  editReservationGuide(ReservationGuide: ReservationGuide): Observable<ReservationGuide> {
    console.log("Sending PUT request to:", `${this.apiUrl3}/${ReservationGuide.idReservation}`, "with data:", ReservationGuide);
    return this.http.put<ReservationGuide>(`${this.apiUrl3}/${ReservationGuide.idReservation}`, ReservationGuide, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
    
  private baseUrl = 'http://localhost:8089/tourisme/email/sendemail';


  sendEmail(emailData: EmailRequest): Observable<any> {
    return this.http.post(this.baseUrl, emailData);
  }


    // Update the ReservationGuide
    deleteReservationGuide(ReservationGuideId: number): Observable<any> {
      const url = `${this.apiUrl5}/${ReservationGuideId}`;
      return this.http.delete(url);  // Use http.delete() for the DELETE request
    }

    private apiUrl10 = 'http://localhost:8089/tourisme/ReservationGuide';


  getGuideReservations() {
    return this.http.get(`${this.apiUrl}/guide`);
  }

  updateStatus(reservationId: number, status: string) {
    return this.http.put(`${this.apiUrl10}/${reservationId}/status?status=${status}`, {});
  }
   

  addPlanningAsReserved(guideId: number, date: string) {
    const url = `http://localhost:8089/tourisme/Planning/addReservedPlanning?guideId=${guideId}&date=${encodeURIComponent(date)}`;
    return this.http.post(url, {}); // corps vide car les infos sont dans les paramètres
  }



  getReservationsByUser(email: string): Observable<ReservationGuide[]> {
    return this.http.get<ReservationGuide[]>(`http://localhost:8089/tourisme/ReservationGuide/byuser/'${email}`);
}




private apiUrl12 = 'http://localhost:8089/tourisme/ReservationGuide/translate'; // URL de votre backend Spring



translateText(text: string, targetLang: string): Observable<string> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  const params = new URLSearchParams();
  params.set('text', text);
  params.set('targetLang', targetLang);

  return this.http.post<{outputs: {output: string}[]}>(
    this.apiUrl12,
    params.toString(),
    { headers }
  ).pipe(
    map(response => response.outputs[0].output) // Extraction de "مرحبا"
  );
}

}


