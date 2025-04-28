import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { ToastrService } from 'ngx-toastr';
import { Hebergement } from 'src/app/models/hebergement.model';
import { HebergementService } from 'src/app/services/hebergement.service';

@Component({
  selector: 'app-hebergement',
  templateUrl: './hebergement.component.html',
  styleUrls: ['./hebergement.component.css']
})
export class HebergementComponent implements OnInit {
  hebergements: Hebergement[] = [];
  statistiques: any[] = [];
  chart: any;

  constructor(
    private hebergementService: HebergementService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.hebergementService.getHebergement().subscribe(
      (data: Hebergement[]) => {
        this.hebergements = data;
        console.log('Hébergements chargés:', data); // Log pour débogage
        this.generateChartData();
      },
      (error) => {
        console.error('Erreur lors de la récupération des hébergements:', error);
        this.toastr.error('Erreur lors du chargement des hébergements.');
      }
    );
    this.loadKommunicateScript(); 
  }

  generateChartData() {
    setTimeout(() => {
      const labels = this.hebergements.map(h => h.name);
      const reservations = this.hebergements.map(h => h.nombreReservations || 0);
      const ratings = this.hebergements.map(h => h.rating || 0);

      const canvas = document.getElementById('statChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Réservations',
                data: reservations,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              },
              {
                label: 'Note (Rating)',
                data: ratings,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
                type: 'line'
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top'
              },
              title: {
                display: true,
                text: 'Statistiques des Hébergements'
              }
            }
          }
        });
      }
    }, 500);
  }

  getRatingStars(rating: number): any[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    return Array(5).fill(0).map((_, i) => ({
      filled: i < fullStars,
      half: i === fullStars && hasHalfStar
    }));
  }

  goToAddHebergement() {
    this.router.navigate(['/dashboard/addhebergement']);
  }

  updateHebergement(hebergement: Hebergement) {
    this.router.navigate(['/dashboard/updatehebergement', hebergement.id_hebergement]);
  }

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
      this.router.navigate(['/dashboard/hebergement-details', id]);
    } else {
      this.toastr.error("ID de l'hébergement invalide.");
    }
  }

  isHebergementAvailable(hebergement: Hebergement): boolean {
    return (
      hebergement.totalSingleChambres > 0 ||
      hebergement.totalDoubleChambres > 0 ||
      hebergement.totalSuiteChambres > 0 ||
      hebergement.totalDelexueChambres > 0
    );
  }
  loadKommunicateScript() {
    (function(d, m){
      var kommunicateSettings = {
        "appId": "3aac26fab9b5df15758a92d08aea0c6c5",
        "popupWidget": true,
        "automaticChatOpenOnNavigation": true,
        "widgetPosition": "left" // ⬅️ Affichage à gauche
      };
      var s = document.createElement("script"); 
      s.type = "text/javascript"; 
      s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0]; 
      h.appendChild(s);
      (window as any).kommunicate = m; 
      m._globals = kommunicateSettings;
    })(document, (window as any).kommunicate || {});
  }
}


declare global {
  interface Window {
    ethereum?: any;
    fil?: any;
    kommunicate: Kommunicate;
    
  }
}