import { Component, OnInit } from '@angular/core';
import { GuideService } from 'src/app/services/guide.service';
import { Guide } from 'src/app/models/guide.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit {

  ratingStars = [1, 2, 3, 4, 5];
  selectedRating: number = 0;
  imagePathPreview: string | ArrayBuffer | null = null;

getCountryCode(arg0: string) {
throw new Error('Method not implemented.');
}
   guides: Guide[] = [];
   isLoading = true;
   error: string | null = null;
 
   constructor(private guideService: GuideService) {}
 
   ngOnInit(): void {
    this.loadguides();
  }

  loadguides(): void {
    this.isLoading = true;
    this.error = null;

    this.guideService.getGuide().subscribe({
      next: (guides: Guide[]) => {
        this.guides = guides;
        this.isLoading = false;
        this.guides.forEach(guide => {
          if (guide.imagePath) {
            this.convertimagePathToBase64(guide);
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load guides. Please try again later.';
        this.isLoading = false;
        console.error('Error loading guides:', err);
      }
    });
  }

  convertimagePathToBase64(guide: Guide): void {

    if (guide.imagePath && guide.imagePath.startsWith('uploads')) {
      guide.imagePath = `assets/frontend/images/${guide.imagePath}`; // Adjust path
    }
    // Check if the imagePath is a URL and convert it to base64
    if (typeof guide.imagePath === 'string' && guide.imagePath.startsWith('http')) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          guide.imagePath = canvas.toDataURL(); // Convert imagePath to base64 string
        }
      };
      img.src = guide.imagePath;
    }
  }
  getImagePath(imagePath: string | undefined): string {
    if (imagePath && imagePath.startsWith('uploads')) {
      return `assets/frontend/images/${imagePath}`; // Prepend assets path if needed
    }
    return 'assets/frontend/images/default-image.png'; // Provide a default image if imagePath is undefined or invalid
  }
  
}