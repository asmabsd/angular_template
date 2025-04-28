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
  PlanningForm: FormGroup;
  guides: Guide[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private planningService: PlanningService,
    private guideService: GuideService,
    private router: Router
  ) {
    this.PlanningForm = this.fb.group({
      id: [''], 
      guideId: ['', Validators.required],
      date: ['', Validators.required],
      isReserved: ['true', Validators.required], 
    });
  }

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const isReservedControl = this.PlanningForm.get('isReserved');
    
    if (isReservedControl) {
      isReservedControl.setValue(isChecked);
    }
  }


  ngOnInit(): void {
    this.loadGuides();
  }

  loadGuides(): void {
    this.guideService.getGuide().subscribe({
      next: (guides: Guide[]) => {
        this.guides = guides;
      },
      error: (err) => {
        console.error('Error loading guides:', err);
        this.error = 'Failed to load guides. Please try again.';
      },
    });
  }

  onSubmit(): void {
    if (this.PlanningForm.valid) {
      this.isLoading = true;
      this.error = null;

      const formValue = this.PlanningForm.value;
      const payload: Planning = {
        id: formValue.id || null, // Set to null if not provided
        guide: { id: formValue.guideId } as Guide,
        date: new Date(formValue.date),
        isReserved: formValue.isReserved,
      };

      this.planningService.addPlanning(payload).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Planning created successfully', response);
          this.router.navigate(['/dashboard/afficherplanning'], {
            state: { success: 'Planning created successfully!' },
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error creating planning:', err);
          if (err.status === 400) {
            this.error = 'Invalid data provided. Please check your input.';
          } else if (err.status === 405) {
            this.error = 'Server configuration error. Please contact support.';
          } else {
            this.error = 'Failed to create planning. Please try again later.';
          }
        },
      });
    } else {
      this.error = 'Please fill out all required fields correctly.';
      this.PlanningForm.markAllAsTouched();
    }
  }

  navigateToList(): void {
    this.router.navigate(['/dashboard/afficherplanning']);
  }
}
