import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommandLineDTO } from 'src/app/models/GestionSouvenir/CommandLineDTO';
import { Panel } from 'src/app/models/GestionSouvenir/panel';
import { PanelService } from 'src/app/services/GestionSouvenirService/panel.service';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.css']
})
export class ViewCartComponent {
  commandLines: CommandLineDTO[] = [];
  originalTotal: number = 0;
  finalTotal: number = 0;
  isLoading: boolean = true;
  discountCode: string = '';
  discountError: string | null = null;
  availableDiscounts: any[] = [];
  appliedDiscount: { code: string; value: number; type: 'percentage' | 'fixed' | 'bundle' } | null = null;
  @ViewChildren('quantityInput') quantityInputs!: QueryList<ElementRef>;
  isUpdating = false;
  isApplyingDiscount: boolean = false;

  constructor(
    private panelService: PanelService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadActiveDiscounts();
  }

  private loadActiveDiscounts(): void {
    this.panelService.getActiveDiscounts().subscribe({
      next: (discounts) => this.availableDiscounts = discounts,
      error: (err) => console.error('Erreur chargement promotions', err)
    });
  }

  private updateCartData(cart: Panel): void {
    this.commandLines = cart.commandLines;
    this.originalTotal = cart.total + (cart.appliedDiscount?.value || 0);
    this.appliedDiscount = cart.appliedDiscount || null;
    this.finalTotal = cart.total;
    this.cdRef.detectChanges();
  }

  applyDiscount() {
    if (this.appliedDiscount) {
      this.discountError = "Une réduction est déjà active : " + this.appliedDiscount.code;
      return;
    }

    this.panelService.applyDiscount(this.discountCode).subscribe({
      next: (panel) => {
        this.appliedDiscount = panel.appliedDiscount || null;
        this.updateCartData(panel);
      },
      error: (err) => this.handleDiscountError(err)
    });
  }

  removeDiscount() {
    this.panelService.removeDiscount().subscribe({
      next: (panel) => {
        this.appliedDiscount = null;
        this.updateCartData(panel);
      }
    });
  }

  private handleDiscountError(err: HttpErrorResponse) {
    if (err.status === 400) {
      this.discountError = err.error.error || 'Erreur inconnue';
    } else {
      this.discountError = 'Erreur de communication avec le serveur';
    }
  }

  private loadCart(): void {
    this.isLoading = true;
    
    this.panelService.viewPanel().subscribe({
      next: (cart) => {
        this.updateCartData(cart);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement panier', err);
        this.isLoading = false;
      }
    });
  }

  deleteLine(index: number): void {
    if (confirm('Supprimer cet article ?')) {
      this.panelService.removeFromPanel(index).subscribe({
        next: (updatedCart) => this.updateCartData(updatedCart),
        error: (err) => this.handleCartError(err)
      });
    }
  }

  updateCart(): void {
    this.isUpdating = true;
    
    const updates = this.commandLines.map(line => ({
      souvenirId: line.souvenir.id,
      quantity: line.quantity,
      unitPrice: line.unitPrice
    }));

    this.panelService.updateEntireCart(updates).subscribe({
      next: (updatedCart) => {
        this.updateCartData(updatedCart);
        this.isUpdating = false;
      },
      error: (err) => {
        this.handleCartError(err);
        this.isUpdating = false;
      }
    });
  }

  private handleCartError(err: any): void {
    console.error('Erreur opération panier', err);
    this.loadCart();
  }
  onDiscountCodeChange(): void {
    if (!this.discountCode?.trim()) {
      this.discountError = null;
    }
  }
}