import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent {
  commandId!: string;
  paymentStatus: string = 'Chargement...';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.commandId = this.route.snapshot.params['commandId'];
    const paymentIntent = this.route.snapshot.queryParams['payment_intent'];
    if (paymentIntent) {
      this.paymentStatus = 'Succès (vérifié via Stripe)';
    }
  }
}
