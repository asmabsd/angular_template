import { Injectable } from '@angular/core';
import { Discount } from 'src/app/models/GestionSouvenir/discount';
import { Panel } from 'src/app/models/GestionSouvenir/panel';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  constructor() { }

  private discounts: Discount[] = [
    {
      type: 'percentage',
      value: 20,
      code: 'FASCINATE20',
      minAmount: 50,
      expiresAt: new Date('2024-12-31')
    },
    {
      type: 'fixed',
      value: 15,
      code: 'SUMMER15',
      minItems: 3
    },
    {
      type: 'bundle',
      value: 30,
      code: 'BUNDLE3',
      minItems: 3,
      applicableCategory: 'Accessories'
    }
  ];

  calculateDiscount(code: string, cart: Panel): number {
    const discount = this.discounts.find(d => d.code === code);
    
    if (!discount || (discount.expiresAt && new Date() > discount.expiresAt)) {
      return 0;
    }

    if (discount.minAmount && cart.total < discount.minAmount) {
      return 0;
    }

    if (discount.minItems && cart.totalItems < discount.minItems) {
      return 0;
    }

    switch(discount.type) {
      case 'percentage':
        return cart.total * (discount.value / 100);
      case 'fixed':
        return discount.value;
      case 'bundle':
        const applicableItems = cart.commandLines.filter(
          item => item.souvenir.category === discount.applicableCategory
        );
        return applicableItems.length >= (discount.minItems || 0) ? discount.value : 0;
      default:
        return 0;
    }
  }
}
