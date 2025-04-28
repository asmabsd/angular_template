import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuideService } from 'src/app/services/guide.service';
import { Guide } from 'src/app/models/guide.model';  

@Component({
  selector: 'app-editguide',
  templateUrl: './editguide.component.html',
  styleUrls: ['./editguide.component.css']
})
export class EditguideComponent implements OnInit {

  guideId: number = 0; // Initialize guideId to a default value (0 or another appropriate value)
  guide: Guide = { id: 0, availability:'',name: '', experience: '', language: '', speciality: '', contact: '', averageRating: '' ,phone:''};  // Initialize guide with default empty values
  errorMessage: string = ''; // Initialize with an empty string
  isLoading: boolean = true;  // Flag to manage loading state

  constructor(
    private route: ActivatedRoute,
    private guideService: GuideService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
  
    if (idParam) {
      this.guideId = +idParam;  // Convert to number
      this.guideService.getGuideById(this.guideId).subscribe(
        (data: Guide) => {
          this.guide = data;
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'Guide not found or error fetching data';
          this.isLoading = false;
        }
      );
    } else {
      this.errorMessage = 'Guide ID is missing from the route';
      this.isLoading = false;
    }
  }

  // Method to update the guide
 

  updateGuide(): void {
    console.log("Updating guide:", this.guide); // Debug
    if (!this.guide.id) {
      console.error("Error: Guide ID is missing!");
      this.errorMessage = "Error: Guide ID is missing!";
      return;
    }
  
    this.guideService.editGuide(this.guide).subscribe(
      () => {
        console.log("Guide updated successfully!");
        this.router.navigate(['/dashboard/listeguide']);
      },
      (error) => {
        console.error("Update failed:", error);
        this.errorMessage = 'Error updating guide';
      }
    );
  }
  navigateToList(): void {  
    this.router.navigate(['/dashboard/listeguide']);
  }
  
}
