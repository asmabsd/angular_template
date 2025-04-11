import { Component } from '@angular/core';
import { Router } from '@angular/router'; // ⬅️ Importation du Router
import { Hebergement } from 'src/app/models/hebergement.model';
import { HebergementService } from 'src/app/services/hebergement.service';

@Component({
  selector: 'app-gethebergement',
  templateUrl: './gethebergement.component.html',
  styleUrls: ['./gethebergement.component.css']
})
export class GethebergementComponent {
 hebergements: Hebergement[] = [];

  constructor(private hebergementService: HebergementService ,private router: Router) {}
  reserver(hebergement: Hebergement) {
    // Rediriger vers une page spécifique, par exemple "/reservation"
    this.router.navigate(['/reservationchambre', hebergement.id_hebergement]);  
  }
  ngOnInit(): void {
    this.hebergementService.getHebergement().subscribe(
      (data: Hebergement[]) => {
        this.hebergements = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des guides:', error);
      }
    );
  }
  getStars(rating: number): number[] 
  {
    return Array(Math.round(rating)).fill(0);
  }
}
