import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-panel-cart',
  templateUrl: './panel-cart.component.html',
  styleUrls: ['./panel-cart.component.css']
})
export class PanelCartComponent {
  @Input() cartCount: number = 0;
}
