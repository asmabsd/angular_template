import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hebergement } from 'src/app/models/hebergement.model';
import { HebergementService } from 'src/app/services/hebergement.service';

@Component({
  selector: 'app-hebergement',
  templateUrl: './hebergement.component.html',
  styleUrls: ['./hebergement.component.css']
})
export class HebergementComponent {
hebergements: Hebergement[] = [];

constructor(private hebergementService: HebergementService ,private router: Router,  private toastr: ToastrService
) {}

reserver(hebergement: Hebergement) {
  alert(`Réservation effectuée pour l'hébergement ${hebergement.id_hebergement} (${hebergement.type})`);
}

ngOnInit(): void {
  this.hebergementService.getHebergement().subscribe(
    (data: Hebergement[]) => {
      this.hebergements = data;
    },
    (error) => {
      console.error('Erreur lors de la récupération des hébergements:', error);
    }
  );
}
goToAddHebergement() {
  this.router.navigate(['/addhebergement']);
}
updateHebergement(hebergement: Hebergement) {
  this.router.navigate(['/updatehebergement', hebergement.id_hebergement]);
}

id_hebergement!: number;
deleteHebergement(id: number) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet hébergement ?")) {
    this.hebergementService.deleteHebergement(id).subscribe(
      () => {
        this.hebergements = this.hebergements.filter(h => h.id_hebergement !== id);
        this.toastr.success("Hébergement supprimé avec succès !");
      },
      (error) => {
        console.error("Erreur lors de la suppression :", error);
        this.toastr.error("Erreur lors de la suppression.");
      }
    );
  }
}
viewHebergementDetails(id?: number) {
  if (id !== undefined) {
    this.router.navigate(['/hebergement-details', id]);
  } else {
    this.toastr.error("ID de l'hébergement invalide.");
  }
}


}
