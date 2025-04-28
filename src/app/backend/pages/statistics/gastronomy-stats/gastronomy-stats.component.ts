import { Component, AfterViewInit } from '@angular/core';
import { StatsGastronomyService } from 'src/app/services/stats-gastronomy.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-gastronomy-stats',
  templateUrl: './gastronomy-stats.component.html',
  styleUrls: ['./gastronomy-stats.component.css']
})
export class GastronomyStatsComponent implements AfterViewInit {

  public countByType: any[] = [];
  public countByLocation: any[] = [];
  public averageRatingByType: any[] = [];
  public averageRatingByLocationAndType: { [key: string]: number } = {};

  constructor(private statsService: StatsGastronomyService) { }

  ngAfterViewInit() {
    this.loadStats();
  }

  loadStats() {
    this.statsService.getCountByType().subscribe(data => {
      this.countByType = data;
      this.createBarChart();
    });

    this.statsService.getCountByLocation().subscribe(data => {
      this.countByLocation = data;
      this.createPieChart();
    });

    this.statsService.getAverageRatingByType().subscribe(data => {
      this.averageRatingByType = data;
      this.createRadarChart();
    });

    this.statsService.getAverageRatingByLocationAndType().subscribe(data => {
      this.averageRatingByLocationAndType = data;
      this.createCombinedBarChart();
    });
  }

  createBarChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('typeChart');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.countByType.map(item => item[0]),
          datasets: [{
            label: 'Nombre de gastronomies',
            data: this.countByType.map(item => item[1]),
            backgroundColor: '#4e73df',
            borderColor: '#4e73df',
            borderWidth: 1
          }]
        }
      });
    }
  }

  createPieChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('locationChart');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.countByLocation.map(item => item[0]),
          datasets: [{
            data: this.countByLocation.map(item => item[1]),
            backgroundColor: ['#ff5733', '#33c3ff', '#33ff57', '#f1c40f', '#e74c3c'],
            borderColor: ['#ff5733', '#33c3ff', '#33ff57', '#f1c40f', '#e74c3c'],
            borderWidth: 1
          }]
        }
      });
    }
  }

  createRadarChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('ratingChart');
    if (ctx) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: this.averageRatingByType.map(item => item[0]),
          datasets: [{
            label: 'Note moyenne par type',
            data: this.averageRatingByType.map(item => item[1]),
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            borderColor: '#007bff',
            borderWidth: 1
          }]
        }
      });
    }
  }

  createCombinedBarChart() {
    const ctx = <HTMLCanvasElement>document.getElementById('combinedChart');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(this.averageRatingByLocationAndType),
          datasets: [{
            label: 'Note moyenne (par région et type)',
            data: Object.values(this.averageRatingByLocationAndType),
            backgroundColor: '#17a2b8',
            borderColor: '#138496',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              callbacks: {
                label: (context) => `Note: ${context.raw}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 5
            }
          }
        }
      });
    }
  }
}
