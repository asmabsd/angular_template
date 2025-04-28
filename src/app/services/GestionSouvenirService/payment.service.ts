import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http : HttpClient) { }
  private apiUrl = 'http://localhost:8089/tourisme/payment'; // Ne pas inclure '/payment' ici


  createPendingCommand(panel: any) {
    return this.http.post(`${this.apiUrl}/create-pending-command`, panel);
  }

  confirmPayment(commandId: string, paymentMethodId: string) {
    return this.http.post(`${this.apiUrl}/confirm-payment/${commandId}`, {
      paymentMethodId: paymentMethodId
    });
  }
      

  // createPaymentIntent(panel: any) {
  //   return this.http.post<any>(
  //     `${environment.apiUrl}/create-intent`,
  //     panel,
  //     {
  //       observe: 'body',
  //       responseType: 'json'
  //     }
  //   );
  // }
  
}
