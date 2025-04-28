import { Component, OnInit } from '@angular/core';
import { GuideService } from 'src/app/services/guide.service';
import { Guide } from 'src/app/models/guide.model';
import {  GuideStatsResponse } from 'src/app/services/guide.service';
import { ActivatedRoute } from '@angular/router';
import { PhotosServiceService } from 'src/app/services/photos-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GuideStatsService } from 'src/app/services/guide-stats.service';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit {
  guides: Guide[] = [];
  filteredGuides: Guide[] = [];
  stats: GuideStatsResponse | null = null;
  suggestedGuides: { name: string, rating: number }[] = [];
  showSuggestions: boolean = false;
  searchParams = {
    filter: '',
    searchTerm: ''
  };

  userId: string = '';
  selectedCriteria: string = 'name';
  ratingStars = [1, 2, 3, 4, 5];
  selectedRating: number = 0;
  imagePathPreview: string | ArrayBuffer | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private guideService: GuideService,
    private route: ActivatedRoute,
    private photoServiceService: PhotosServiceService,
    private sanitizer: DomSanitizer,
    private guidestatsservice: GuideStatsService
  ) {}



 
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    this.loadguides();
    this.loadGuideStats();
  }

  loadguides(): void {
    this.isLoading = true;
    this.error = null;

    this.guideService.getGuide().subscribe({
      next: (guides: Guide[]) => {
        this.guides = guides;
        this.isLoading = false;
        this.guides.forEach(guide => {
          safeImageUrl: this.getSafeImageUrl(guide.photo)
         
        });
        this.filteredGuides = [...this.guides]; // Initialize filteredGuides with all guides
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load guides. Please try again later.';
        this.isLoading = false;
        console.error('Error loading guides:', err);
      }
    });
  }

  loadGuideStats(): void {
    this.guidestatsservice.getStats().subscribe({
      next: (stats: GuideStatsResponse) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Error loading guide stats:', err);
        this.stats = null;
      }
    });
  }

  getBotImagePath(): string {
    const imageName = 'bot.png';
    const path = `assets/frontend/${imageName}`;
    // Check if the file exists or use a fallback
    return path; // Or use a fallback like 'assets/frontend/default-guide.jpg'
  }

  onBotClick(): void {
    if (this.stats && this.stats.reservationsByGuide) {
      this.suggestedGuides = Object.entries(this.stats.reservationsByGuide)
        .filter(([guideName]) => {
          const rating = this.stats!.averageRatingsByGuide[guideName] || 0;
          return rating >= 3.0;
        })
        .sort(([, countA], [, countB]) => (countA as number) - (countB as number))
        .slice(0, 1)
        .map(([guideName]) => ({
          name: guideName,
          rating: this.stats!.averageRatingsByGuide[guideName] || 0
        }));

      if (this.suggestedGuides.length === 0) {
        this.suggestedGuides = [{ name: 'Aucun guide disponible avec ces critères', rating: 0 }];
      }
    } else {
      this.suggestedGuides = [{ name: 'Aucune donnée disponible', rating: 0 }];
    }
    this.showSuggestions = true;
  }

  closeSuggestions(): void {
    this.showSuggestions = false;
    this.suggestedGuides = [];
  }

  getSafeImageUrl(photo: string | undefined): SafeUrl {
    if (!photo) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('assets/frontend/images/default-guide.jpg');
    }
    if (photo.startsWith('http') || photo.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(photo);
    }
    const fullUrl = `http://localhost:8089/tourisme/Guide/images/${photo}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }

  convertphotoToBase64(guide: Guide): void {
    if (guide.photo && guide.photo.startsWith('uploads')) {
      guide.photo = `assets/frontend/images/${guide.photo}`;
    }
    if (typeof guide.photo === 'string' && guide.photo.startsWith('http')) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          guide.photo = canvas.toDataURL();
        }
      };
      img.src = guide.photo;
    }
  }

  getImagePath(imageName: string | undefined | null): string {
    if (!imageName) {
      return 'assets/frontend/images/default-guide.jpg';
    }
    if (imageName.startsWith('http') || imageName.startsWith('data:image')) {
      return imageName;
    }
    return `http://localhost:8089/tourisme/Guide/images/${imageName}`;
  }

  apiUrl: string = 'http://localhost:8089/tourisme/Guide';
  getImageUrl(photo: string | undefined): string {
    return `${this.apiUrl}/images/${photo}?t=${new Date().getTime()}`;
  }

  searchGuides(): void {
    if (!this.searchParams.filter || !this.searchParams.searchTerm.trim()) {
      this.filteredGuides = this.guides;
      return;
    }

    const filter = this.searchParams.filter;
    const searchTerm = this.searchParams.searchTerm.toLowerCase();

    this.filteredGuides = this.guides.filter((guide) => {
      const fieldValue = (guide[filter as keyof Guide] || '').toString().toLowerCase();
      return fieldValue.includes(searchTerm);
    });
  }

  filterGuide(guide: Guide): boolean {
    switch (this.searchParams.filter) {
      case 'name':
        return guide.name.toLowerCase().includes(this.searchParams.searchTerm.toLowerCase());
      case 'category':
      case 'speciality':
        return guide.speciality.toLowerCase().includes(this.searchParams.searchTerm.toLowerCase());
      case 'experience':
        return guide.experience.toLowerCase().includes(this.searchParams.searchTerm.toLowerCase());
      case 'language':
        return guide.language.toLowerCase().includes(this.searchParams.searchTerm.toLowerCase());
        case 'rating':
          return Number(guide.averageRating) === Number(this.searchParams.searchTerm);
      default:
        return true;
    }
  }

  getCountryCode(arg0: string): void {
    throw new Error('Method not implemented.');
  }
}