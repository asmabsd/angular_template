import { Component, OnInit } from '@angular/core';
import { GuideService } from 'src/app/services/guide.service';
import { Guide } from 'src/app/models/guide.model';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit {
 
  guides: Guide[] = [];

  constructor(private guideService: GuideService) {}
  reserver(guide: Guide) {
    alert(`Réservation effectuée pour le guide ${guide.id} (${guide.speciality})`);
  }
  ngOnInit(): void {
    this.guideService.getGuide().subscribe(
      (data: Guide[]) => {
        this.guides = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des guides:', error);
      }
    );
  }

}


