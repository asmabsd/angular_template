import { Component } from '@angular/core';
import { GuideService } from 'src/app/services/guide.service';
import { Guide } from 'src/app/models/guide.model';
import { ActivatedRoute, Routes } from '@angular/router';
import { Router } from '@angular/router'; // Pour naviguer
@Component({
  selector: 'app-listeguide',
  templateUrl: './listeguide.component.html',
  styleUrls: ['./listeguide.component.css']
})
export class ListeguideComponent {
blockGuide(arg0: number) {
throw new Error('Method not implemented.');
}
 guides: Guide[] = [];

  constructor(private guideService: GuideService, private router: Router) {}
  reserver(guide: Guide) {
    alert(`Réservation effectuée pour le guide ${guide.id} (${guide.speciality})`);
  }
  ngOnInit(): void {
    this.guideService.getGuide().subscribe(
      (data) => {
        this.guides = data;
        this.guides.forEach((guide) => {
        });
      });
    }
  editGuide(guideId: number | undefined): void {
    if (guideId !== undefined) {
      // Proceed with using the guideId here, e.g., navigate to edit page
      console.log(`Editing guide with ID: ${guideId}`);
    } else {
      console.error("Guide ID is undefined");
    }
  }
  deleteGuide(guideId: number) {
    if (confirm('Are you sure you want to delete this guide?')) {
      this.guideService.deleteGuide(guideId).subscribe(
        () => {
          // Remove the guide from the list (optimistic UI update)
          this.guides = this.guides.filter(guide => guide.id !== guideId);
          
          // Navigate to the same route to refresh the page and show the updated list
          this.router.navigateByUrl('/dashboard/listeguide', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/dashboard/listeguide']);
          });
        },
        error => {
          // You can handle any errors here
        }
      );
    }
  }

}
  

