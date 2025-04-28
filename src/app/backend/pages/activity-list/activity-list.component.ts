import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Activity } from 'src/app/models/activity.model';
import { CategoryA } from 'src/app/models/category-a.enum';
import { Region } from 'src/app/models/Region.enum';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  loading = true;
  error = '';
  successMessage = '';
  selectedRegion: Region | null = null;
  regionOptions = Object.values(Region);
  recommendedActivity: Activity | null = null; // Pour stocker l'activité recommandée
  recommendedRegion: Region | null = null; // Région avec le plus faible pourcentage

  // Filters
  searchTerm = '';
  selectedCategory: string = '';
  categoryOptions = Object.values(CategoryA);
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Sorting
  sortBy = 'name';
  sortDirection = 'asc';

  // Pagination
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  Math = Math;

  // Données pour la visualisation
  regionStats: { region: Region, count: number, percentage: number }[] = [];
  conicGradient: string = ''; // Pour stocker les stops du conic-gradient

  // Couleurs pour les tranches du cercle
  circleColors: string[] = [
    '#ff9900',
    '#ff5500',
    '#ffbb33',
    '#ffcc66',
    '#ffd699',
    '#ffebcc',
    '#ffe0b2',
    '#ffcc80'
  ];

  constructor(
    private activityService: ActivityService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.loading = true;
    this.activityService.getAllActivities()
      .subscribe({
        next: (data) => {
          this.activities = data;
          this.applyFilters();
          this.calculateRegionStats();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load activities. Please try again later.';
          this.loading = false;
          console.error('Error loading activities:', err);
        }
      });
  }

  calculateRegionStats(): void {
    const regionCounts: { [key in Region]?: number } = {};

    // Initialiser les compteurs pour chaque région
    this.regionOptions.forEach(region => {
      regionCounts[region] = 0;
    });

    // Compter le nombre d'activités par région
    this.activities.forEach(activity => {
      if (activity.region) {
        regionCounts[activity.region] = (regionCounts[activity.region] || 0) + 1;
      }
    });

    // Calculer le total pour les pourcentages
    const totalActivities = this.activities.length;

    // Préparer les données pour l'affichage
    this.regionStats = Object.entries(regionCounts)
      .map(([region, count]) => ({
        region: region as Region,
        count: count as number,
        percentage: totalActivities > 0 ? (count as number / totalActivities) * 100 : 0
      }));

    // Trouver la région avec le plus faible pourcentage
    if (this.regionStats.length > 0) {
      const minStat = this.regionStats.reduce((min, stat) =>
        stat.percentage < min.percentage ? stat : min
      );
      this.recommendedRegion = minStat.region;

      // Sélectionner une activité aléatoire dans la région recommandée
      const activitiesInRegion = this.activities.filter(
        activity => activity.region === this.recommendedRegion
      );
      if (activitiesInRegion.length > 0) {
        const randomIndex = Math.floor(Math.random() * activitiesInRegion.length);
        this.recommendedActivity = activitiesInRegion[randomIndex];
      } else {
        this.recommendedActivity = null;
      }
    } else {
      this.recommendedRegion = null;
      this.recommendedActivity = null;
    }

    // Calculer les stops pour le conic-gradient
    this.calculateConicGradient();
  }

  // Nouvelle méthode pour exposer l'activité recommandée
  getRecommendedActivity(): Activity | null {
    return this.recommendedActivity;
  }

  calculateConicGradient(): void {
    let stops: string[] = [];
    let currentAngle = 0;

    this.regionStats.forEach((stat, index) => {
      const percentage = stat.percentage;
      const startAngle = currentAngle;
      const endAngle = startAngle + (percentage / 100) * 360;
      const color = this.circleColors[index % this.circleColors.length];
      stops.push(`${color} ${startAngle}deg ${endAngle}deg`);
      currentAngle = endAngle;
    });

    this.conicGradient = stops.join(', ');
  }

  applyFilters(): void {
    let filtered = [...this.activities];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchLower) ||
        activity.location.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(activity =>
        activity.categoryA === this.selectedCategory
      );
    }

    if (this.minPrice !== null) {
      filtered = filtered.filter(activity =>
        activity.price >= this.minPrice!
      );
    }

    if (this.maxPrice !== null) {
      filtered = filtered.filter(activity =>
        activity.price <= this.maxPrice!
      );
    }

    if (this.selectedRegion) {
      filtered = filtered.filter(activity =>
        activity.region === this.selectedRegion
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location);
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredActivities = filtered;
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredActivities.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
  }

  getCurrentPageItems(): Activity[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredActivities.slice(startIndex, startIndex + this.pageSize);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onPriceFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedRegion = null;
    this.currentPage = 1;
    this.applyFilters();
  }

  editActivity(id: number): void {
    this.router.navigate(['activities/edit', id], { relativeTo: this.route.parent });
  }

  deleteActivity(id: number): void {
    const confirmation = confirm('Are you sure you want to delete this activity? This action cannot be undone.');
    if (confirmation) {
      this.activityService.deleteActivity(id)
        .subscribe({
          next: () => {
            this.successMessage = 'Activity deleted successfully!';
            this.loadActivities();
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
          error: (error) => {
            this.error = 'Failed to delete activity: ' + (error.error?.message || 'Unknown error');
            console.error('Error deleting activity:', error);
            setTimeout(() => {
              this.error = '';
            }, 3000);
          }
        });
    }
  }

  addNewActivity(): void {
    this.router.navigate(['activities/add'], { relativeTo: this.route.parent });
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'assets/images/activity-placeholder.jpg';
    }
    return this.activityService.getImageUrl(imagePath);
  }

  getCategoryDisplayName(category: string): string {
    return category.replace(/_/g, ' ');
  }

  onRegionChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
}