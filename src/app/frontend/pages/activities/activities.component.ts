import { Component, OnInit } from '@angular/core';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity.model';
import { CategoryA } from 'src/app/models/category-a.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { Blog } from 'src/app/models/blog.model';
import { Region } from 'src/app/models/Region.enum';
import { BlogService } from 'src/app/services/blog.service';
import { catchError, of } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  topLikedActivities: Activity[] = []; // Nouvelle propriété pour les activités les plus likées
  loading: boolean = true;
  selectedRegion: Region | null = null;
  regions: string[] = Object.values(Region);
  errorMessage: string = '';
  categoryFilter: string = 'ALL';
  priceRangeFilter: number = 1000;
  categories = Object.values(CategoryA);

  constructor(
    private blogService: BlogService,
    private activityService: ActivityService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedRegion = params['region'] as Region || null;
      this.loadActivities();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ($ && $.fn.parallax) {
        $('.parallax-window').parallax({
          imageSrc: 'assets/travelix/images/activities_background.jpg',
          speed: 0.8
        });
      } else {
        console.warn('jQuery Parallax n\'est pas chargé.');
      }
    }, 200);
  }

  onRegionChange(region: Region | null): void {
    this.selectedRegion = region;
    this.applyFilters();
    this.updateUrl();
  }

  loadActivities(): void {
    this.loading = true;
    this.errorMessage = '';

    this.activityService.getAllActivities().pipe(
      catchError((error: any) => {
        console.error('Error fetching activities:', error);
        this.errorMessage = 'Failed to load activities. Please try again later.';
        return of([] as Activity[]);
      })
    ).subscribe({
      next: (activities: Activity[]) => {
        this.activities = activities;
        this.applyFilters();
        this.updateTopLikedActivities(); // Appeler la méthode pour trier les activités les plus likées
      },
      error: (error: any) => {
        console.error('Unexpected error:', error);
        this.errorMessage = 'An unexpected error occurred.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredActivities = this.activities.filter(activity => {
      const regionMatches = !this.selectedRegion || activity.region === this.selectedRegion;
      const categoryMatches = this.categoryFilter === 'ALL' || activity.categoryA === this.categoryFilter;
      const priceMatches = activity.price <= this.priceRangeFilter;
      return regionMatches && categoryMatches && priceMatches;
    });
    this.updateTopLikedActivities(); // Mettre à jour les activités les plus likées après filtrage
  }

  updateTopLikedActivities(): void {
    // Trier les activités par nombre de likes (décroissant) et prendre les 3 premières
    this.topLikedActivities = [...this.activities] // Copier le tableau pour éviter de modifier l'original
      .sort((a, b) => (b.likes || 0) - (a.likes || 0)) // Trier par likes (décroissant)
      .slice(0, 3); // Limiter aux 3 premières
  }

  updateUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { region: this.selectedRegion || null },
      queryParamsHandling: 'merge'
    });
  }

  resetFilters(): void {
    this.selectedRegion = null;
    this.categoryFilter = 'ALL';
    this.priceRangeFilter = 1000;
    this.applyFilters();
    this.updateUrl();
  }

  filterByCategory(category: string): void {
    this.categoryFilter = category;
    this.applyFilters();
  }

  updatePriceRange(maxPrice: number): void {
    this.priceRangeFilter = maxPrice;
    this.applyFilters();
  }

  getImageUrl(activity: Activity): string {
    if (activity.imagePath) {
      return this.activityService.getImageUrl(activity.imagePath);
    }
    return 'assets/travelix/images/activity_default.jpg';
  }

  reserveActivity(activityId: number | undefined): void {
    if (!activityId) {
      this.errorMessage = 'Impossible de réserver : ID de l\'activité manquant.';
      return;
    }
    this.router.navigate(['/reservation', activityId]);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'ADVENTURE': 'fa-mountain',
      'CULTURAL': 'fa-landmark',
      'WATER': 'fa-water',
      'OUTDOOR': 'fa-tree',
      'CULINARY': 'fa-utensils',
      'WELLNESS': 'fa-spa',
      'EDUCATIONAL': 'fa-graduation-cap'
    };
    return icons[category] || 'fa-star';
  }

  likeActivity(activity: Activity): void {
    if (!activity.idActivity) {
      console.error('ID de l\'activité manquant');
      this.errorMessage = 'Impossible de liker : ID de l\'activité manquant.';
      return;
    }

    this.activityService.likeActivity(activity.idActivity).subscribe({
      next: (updatedActivity) => {
        const index = this.activities.findIndex(a => a.idActivity === updatedActivity.idActivity);
        if (index !== -1) {
          this.activities[index] = updatedActivity;
        }
        const filteredIndex = this.filteredActivities.findIndex(a => a.idActivity === updatedActivity.idActivity);
        if (filteredIndex !== -1) {
          this.filteredActivities[filteredIndex] = updatedActivity;
        }
        this.applyFilters();
        this.updateTopLikedActivities(); // Mettre à jour après un like
      },
      error: (err) => {
        console.error('Like error:', err);
        this.errorMessage = 'Échec du like. Veuillez réessayer.';
      }
    });
  }

  dislikeActivity(activity: Activity): void {
    if (!activity.idActivity) {
      console.error('ID de l\'activité manquant');
      this.errorMessage = 'Impossible de disliker : ID de l\'activité manquant.';
      return;
    }

    this.activityService.dislikeActivity(activity.idActivity).subscribe({
      next: (updatedActivity) => {
        const index = this.activities.findIndex(a => a.idActivity === updatedActivity.idActivity);
        if (index !== -1) {
          this.activities[index] = updatedActivity;
        }
        const filteredIndex = this.filteredActivities.findIndex(a => a.idActivity === updatedActivity.idActivity);
        if (filteredIndex !== -1) {
          this.filteredActivities[filteredIndex] = updatedActivity;
        }
        this.applyFilters();
        this.updateTopLikedActivities(); // Mettre à jour après un dislike
      },
      error: (err) => {
        console.error('Dislike error:', err);
        this.errorMessage = 'Échec du dislike. Veuillez réessayer.';
      }
    });
  }
}