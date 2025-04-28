import { Component } from '@angular/core';
import { GuideStatsService } from 'src/app/services/guide-stats.service';
import { GuideStats } from 'src/app/models/guide-stats.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statsguide',
  templateUrl: './statsguide.component.html',
  styleUrls: ['./statsguide.component.css']
})
export class StatsguideComponent {
  stats!: GuideStats;

  constructor(private statsService:GuideStatsService) {}

  ngOnInit(): void {
    this.statsService.getStats().subscribe(data => {
      this.stats = data;
    });
  }

  getLabelValues(map: {[key: string]: number}) {
    return {
      labels: Object.keys(map),
      values: Object.values(map)
    };
  }

  

getColorForCircle(): string {
  const colors = ['#36b9cc', '#f6c23e', '#e74a3b', '#1cc88a', '#4e73df'];
  return colors[Math.floor(Math.random() * colors.length)];
}
}
