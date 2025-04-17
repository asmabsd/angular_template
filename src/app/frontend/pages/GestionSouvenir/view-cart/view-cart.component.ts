  import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
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
    totalItems: number = 0;
    totalPrice: number = 0;
    isLoading: boolean = false;
    @ViewChildren('quantityInput') quantityInputs!: QueryList<ElementRef>;
  isUpdating = false;


    constructor(private panelService: PanelService) {}

    ngOnInit(): void {
      this.loadCart();
    }

    loadCart(): void {
      this.isLoading = true;

      this.panelService.viewPanel().subscribe({
        next: (cart: Panel) => {
          this.commandLines = cart.commandLines;
          this.totalItems = cart.totalItems;
          this.totalPrice = cart.total;
          this.isLoading = false;

        },
        error: (err) => {
          this.isLoading = false;
          console.error("Erreur lors de la récupération du panier :", err);
        }
      });
    }

    deleteLine(index: number) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
        this.panelService.removeFromPanel(index).subscribe({
          next: (updatedCart: Panel) => {
            this.commandLines = updatedCart.commandLines;
            this.totalItems = updatedCart.totalItems;
            this.totalPrice = updatedCart.total;
          },
          error: (err) => {
            console.error("Erreur lors de la suppression :", err);
            this.loadCart();
          }
        });
      }
    }
    updateCart(): void {
      this.isUpdating = true;
    
      // Créer une structure simplifiée
      const updates = this.commandLines.map(line => ({
        souvenirId: line.souvenir.id,
        quantity: line.quantity,
        unitPrice: line.unitPrice
      }));
    
      this.panelService.updateEntireCart(updates).subscribe({
        next: (updatedCart: Panel) => {
          this.commandLines = updatedCart.commandLines;
          this.totalPrice = updatedCart.total;
          this.isUpdating = false;
        },
        error: (err) => {
          console.error('Erreur de mise à jour', err);
          this.isUpdating = false;
          this.loadCart();
        }
      });
    }

  }
