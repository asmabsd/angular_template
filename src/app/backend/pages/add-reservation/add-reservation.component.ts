import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hebergement } from 'src/app/models/hebergement.model';
import { ReservationChambre } from 'src/app/models/reservationchambre';
import { HebergementService } from 'src/app/services/hebergement.service';
import { ReservationchambreService } from 'src/app/services/reservationchambre.service';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit {
  idHebergement!: number;
  reservation: ReservationChambre = new ReservationChambre();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationchambreService,
    private hebergementService: HebergementService ,
    private toastr: ToastrService


  ) {}

  ngOnInit(): void {
    this.idHebergement = Number(this.route.snapshot.paramMap.get('id'));
    
    this.hebergementService.getHebergementById(this.idHebergement).subscribe({
      next: (data) => {
        this.hebergement = data;
      },
      error: (err) => {
        console.error("Erreur de chargement de l’hébergement :", err);
      }
    });
  }
  
  onSubmit() {
    this.reservationService.addReservationToHebergement(this.idHebergement, this.reservation).subscribe({
      next: () => {
        this.toastr.success('Réservation ajoutée avec succès ! ✅');
        this.router.navigate(['/gethebback']);
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout :", err);
        this.toastr.error("Erreur lors de l'ajout de la réservation ❌");
      }
    });
  }
  
  today: string = new Date().toISOString().split('T')[0];

  hebergement!: Hebergement;

  calculerPrixTotal(): void {
    if (
      this.reservation.dateDebut &&
      this.reservation.dateFin &&
      this.hebergement &&
      this.reservation.nombreadulte >= 0 &&
      this.reservation.nombrenfant >= 0
    ) {
      const debut = new Date(this.reservation.dateDebut);
      const fin = new Date(this.reservation.dateFin);
  
      if (debut >= fin) {
        this.reservation.prixTotal = 0;
        return;
      }
  
      let total = 0;
      const date = new Date(debut);
      while (date < fin) {
        const jour = date.getDay(); // 0 = dimanche, 5 = vendredi, 6 = samedi
        let prixNuit = this.hebergement.price;
  
        if (jour === 0 || jour === 5 || jour === 6) {
          prixNuit *= 1.2; // Supplément week-end
        }
  
        total += prixNuit;
        date.setDate(date.getDate() + 1);
      }
  
      this.reservation.prixTotal = total;
    } else {
      this.reservation.prixTotal = 0;
    }
  }
  
}
