import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Souvenir } from 'src/app/models/GestionSouvenir/souvenir';
import { SouvenirService } from 'src/app/services/GestionSouvenirService/souvenir.service';

@Component({
  selector: 'app-souvenir-list',
  templateUrl: './souvenir-list.component.html',
  styleUrls: ['./souvenir-list.component.css']
})
export class SouvenirListComponent {
souvenirs: Souvenir[] = [];
  constructor(private souvenirService: SouvenirService, private router: Router) {}
  ngOnInit(): void {
    this.souvenirService.getSouvenir().subscribe(
      (data) => {
        this.souvenirs = data;
        this.souvenirs.forEach((Souvenir) => {
        });
      });
    }

    editSouvenir(SouvenirId: number | undefined): void {
      if (SouvenirId !== undefined) {
        // Proceed with using the SouvenirId here, e.g., navigate to edit page
        console.log(`Editing Souvenir with ID: ${SouvenirId}`);
      } else {
        console.error("Souvenir ID is undefined");
      }
    }
    deleteSouvenir(SouvenirId: number) {
      if (confirm('Are you sure you want to delete this Souvenir?')) {
        this.souvenirService.deleteSouvenir(SouvenirId).subscribe(
          () => {
            // Remove the Souvenir from the list (optimistic UI update)
            this.souvenirs = this.souvenirs.filter(Souvenir => Souvenir.id !== SouvenirId);
            
            // Navigate to the same route to refresh the page and show the updated list
            this.router.navigateByUrl('/dashboard/SouvenirList', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/dashboard/SouvenirList']);
            });
          },
          error => {
            // You can handle any errors here
          }
        );
      }
    }
}
