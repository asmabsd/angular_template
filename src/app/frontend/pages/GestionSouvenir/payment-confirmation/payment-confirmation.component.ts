import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { PaymentService } from 'src/app/services/GestionSouvenirService/payment.service';
import { environment } from '../../../../environments/environment';
import { PanelService } from 'src/app/services/GestionSouvenirService/panel.service';
import { PanelCountService } from 'src/app/services/GestionSouvenirService/panel-count.service';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements AfterViewInit {
  commandId!: string;
  stripe: Stripe | null = null;
  card!: StripeCardElement;
  isLoading = true;
  errorMessage = '';
  amount!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private panelService: PanelService,
    private panelCountService: PanelCountService,
    private cdRef: ChangeDetectorRef,
    
  ) { }

  async ngAfterViewInit() {
    this.commandId = this.route.snapshot.params['commandId'];
    this.amount = history.state.amount;

    try {
      // Validation du montant
      if (!this.amount || this.amount <= 0) {
        throw new Error('Montant de paiement invalide');
      }

      // Initialisation Stripe
      const stripeInstance = await loadStripe(environment.stripePublicKey);
      
      if (!stripeInstance) {
        throw new Error('Échec du chargement de Stripe');
      }
      
      this.stripe = stripeInstance;
      const elements = this.stripe.elements();
      
      // Vérification élément DOM
      const cardElement = document.getElementById('card-element');
      if (!cardElement) {
        throw new Error('Élément de carte introuvable');
      }

      // Création élément de carte
      this.card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a'
          }
        }
      });
      
      this.card.mount('#card-element');
      this.isLoading = false;

    } catch (error: any) {
      console.error('Erreur Stripe:', error);
      this.errorMessage = error.message || 'Configuration du paiement échouée';
      this.isLoading = false;
    }
  }

  async confirmPayment() {
    if (!this.stripe) {
      this.errorMessage = 'Système de paiement non initialisé';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      // Création méthode de paiement
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card
      });

      if (error) throw error;

      // Appel API
      this.paymentService.confirmPayment(this.commandId, paymentMethod.id)
        .subscribe({
          next: (res) => this.handlePaymentResponse(res),
          error: (err) => this.handlePaymentError(err)
        });

    } catch (error: any) {
      this.handleStripeError(error);
    }
  }

  private handlePaymentResponse(res: any) {
    switch (res.status) {
      case 'CONFIRMED':
        this.router.navigate(['/payment-success', this.commandId]);
        break;
      case 'REQUIRES_ACTION':
        this.handle3DSecure(res.clientSecret);
        break;
      default:
        this.errorMessage = res.reason || 'Échec du paiement';
        this.isLoading = false;
    }
  }

  private async handle3DSecure(clientSecret: string) {
    if (!this.stripe) return;
  
    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret);
      
      if (error) throw error;
      
      if (paymentIntent?.status === 'succeeded') {
        this.panelService.clearPanel().subscribe({
          next: () => {
            // Forcer la mise à jour synchrone
            this.panelCountService.loadInitialCount();
            this.panelService.viewPanel().subscribe(() => {
              this.cdRef.detectChanges(); // <-- Ajouter cette ligne
            });
          },
          error: (err) => {
            console.error('Erreur nettoyage panier', err);
            this.router.navigate(['/payment-success', this.commandId]);
            this.cdRef.detectChanges(); // <-- Mise à jour forcée

          }
        });
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Échec de l\'authentification 3D Secure';
      this.cdRef.detectChanges(); // <-- Mise à jour forcée

    }
  }
  private handlePaymentError(err: any) {

    this.errorMessage = err.error?.error || 'Erreur serveur';
    this.isLoading = false;
  }

  private handleStripeError(error: any) {
    this.errorMessage = error.message || 'Erreur de traitement de carte';
    this.isLoading = false;
  }
}