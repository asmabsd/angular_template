import { Component, Input } from '@angular/core';
import { PanelCountService } from 'src/app/services/GestionSouvenirService/panel-count.service';

@Component({
  selector: 'app-panel-cart',
  templateUrl: './panel-cart.component.html',
  styleUrls: ['./panel-cart.component.css']
})
export class PanelCartComponent {
  @Input() cartCount: number = 0;
  constructor(private panelCountService: PanelCountService) {}

ngOnInit() {
  this.panelCountService.cartCount$.subscribe(count => {
    this.cartCount = count;
  });
}
}
