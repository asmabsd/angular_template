import { Component, AfterViewInit } from '@angular/core';
import { StatsGastronomyService } from 'src/app/services/stats-gastronomy.service'; // Assure-toi que le chemin est correct
import { Chart, registerables } from 'chart.js';

// Enregistre les éléments nécessaires pour les graphiques dans Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-gastronomy-stats',
  templateUrl: './gastronomy-stats.component.html',
  styleUrls: ['./gastronomy-stats.component.css']
})
export class GastronomyStatsComponent implements AfterViewInit {

  // Variables pour stocker les données
  public countByType: any[] = [];
  public countByLocation: any[] = [];
  public averageRatingByType: any[] = [];

  constructor(private statsService: StatsGastronomyService) { }

  ngAfterViewInit() {
    // Appel des méthodes du service pour récupérer les données
    this.loadStats();
  }

  loadStats() {
    // Récupère les données du nombre de gastronomies par type
    this.statsService.getCountByType().subscribe(data => {
      this.countByType = data;
      this.createBarChart();
    });

    // Récupère les données du nombre de gastronomies par région
    this.statsService.getCountByLocation().subscribe(data => {
      this.countByLocation = data;
      this.createPieChart();
    });

    // Récupère les données de la note moyenne par type
    this.statsService.getAverageRatingByType().subscribe(data => {
      this.averageRatingByType = data;
      this.createRadarChart();
    });
  }

// Création du graphique bar (nombre de gastronomies par type)
createBarChart() {
  const ctx = <HTMLCanvasElement>document.getElementById('typeChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.countByType.map(item => item[0]), // Par exemple, les types
        datasets: [{
          label: 'Nombre de gastronomies',
          data: this.countByType.map(item => item[1]), // Par exemple, les comptes
          backgroundColor: '#4e73df',
          borderColor: '#4e73df',
          borderWidth: 1
        }]
      }
    });
  }
}

// Création du graphique pie (nombre de gastronomies par région)
createPieChart() {
  const ctx = <HTMLCanvasElement>document.getElementById('locationChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.countByLocation.map(item => item[0]), // Par exemple, les régions
        datasets: [{
          data: this.countByLocation.map(item => item[1]), // Par exemple, les comptes
          backgroundColor: ['#ff5733', '#33c3ff', '#33ff57', '#f1c40f', '#e74c3c'],
          borderColor: ['#ff5733', '#33c3ff', '#33ff57', '#f1c40f', '#e74c3c'],
          borderWidth: 1
        }]
      }
    });
  }
}

// Création du graphique radar (note moyenne par type)
createRadarChart() {
  const ctx = <HTMLCanvasElement>document.getElementById('ratingChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.averageRatingByType.map(item => item[0]), // Par exemple, les types
        datasets: [{
          label: 'Note moyenne',
          data: this.averageRatingByType.map(item => item[1]), // Par exemple, les notes
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          borderColor: '#007bff',
          borderWidth: 1
        }]
      }
    });
  }
}
}