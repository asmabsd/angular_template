import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanningService } from 'src/app/services/planning.service';
import { Planning } from '../../../models/planning.model';

import { Guide } from 'src/app/models/guide.model';
import { GuideService } from 'src/app/services/guide.service';

@Component({
  selector: 'app-addplanning',
  templateUrl: './addplanning.component.html',
  styleUrls: ['./addplanning.component.css']
})
export class AddplanningComponent {
  PlanningForm!: FormGroup;
  guides: any[] = [];
  allGuides: any[] = [];
  constructor(private PlanningService: PlanningService, private guideService: GuideService, private fb: FormBuilder, private router: Router) {
    this.PlanningForm = this.fb.group({
      id: ['',Validators.required],
      date: ['',Validators.required],
      guideId: ['',Validators.required],
      isReserved: [false, Validators.required],
    });
  }




   
  

  ngOnInit() {
    this.loadGuides();
  }

  
  loadGuides() {
    this.guideService.getGuide().subscribe(
      (guides: any[]) => {
        this.allGuides = guides; // Stocke tous les utilisateurs complets
        this.guides = guides.map(guide=> ({
          id: guide.id,
          name:guide.name,
        }));
        
      },
      error => {
        console.error('Error loading users', error);
      }
    );
  }

  onSubmit() {
    if (this.PlanningForm.valid) {
      const formValue = this.PlanningForm.value;
      
      const payload = {
        id: formValue.id,
        guide: { id: formValue.guideId } as Guide, // Type assertion
        date: new Date(formValue.date),
        isReserved: formValue.isReserved,
      } as Planning; // Full type assertion
      
      this.PlanningService.addPlanning(payload).subscribe(
        response => {
          console.log('Reservation created successfully', response);
          this.router.navigate(['/dashboard/afficherplanning']);
        },
        error => {
          console.error('Error creating reservation', error);
          // Add user-friendly error handling here
        }
      );
    }
  }
  navigateToList() {
    this.router.navigate(['/dashboard/afficherplanning']);
  }

  // ... autres méthodes
}

  

