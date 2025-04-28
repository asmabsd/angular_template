import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { Activity } from 'src/app/models/activity.model';
import { Reservation } from 'src/app/models/Reservation';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup;
  activity!: Activity;
  activityId!: number;
  loading: boolean = true;
  submitted: boolean = false;
  success: boolean = false;
  error: string = '';
  
  minDate: string;
  
  // Static user ID as requested
  readonly userId: number = 1;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public activityService: ActivityService,
    private reservationService: ReservationService
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    // Initialize form
    this.reservationForm = this.fb.group({
      numberOfPeople: [1, [Validators.required, Validators.min(1)]],
      dateReservation: [this.minDate, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.activityId = +params['id']; // Convert string to number with +
      this.loadActivity();
    });
  }

  loadActivity(): void {
    this.loading = true;
    this.activityService.getActivityById(this.activityId).subscribe({
      next: (data) => {
        this.activity = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading activity:', error);
        this.error = 'Failed to load activity details. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Getter for easy access to form fields
  get f() { return this.reservationForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.reservationForm.invalid) {
      return;
    }

    const reservation: Reservation = {
      numberOfPeople: this.f['numberOfPeople'].value,
      dateReservation: this.f['dateReservation'].value,
      user: {
        id: this.userId // Using static user ID
      },
      activity: {
        idActivity: this.activityId
      }
    };

    this.loading = true;
    this.reservationService.createReservation(reservation).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/my-reservations']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating reservation:', error);
        this.error = 'Failed to create reservation. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Calculate total price based on number of people
  calculateTotalPrice(): number {
    if (!this.activity || !this.f['numberOfPeople'].value) return 0;
    return this.activity.price * this.f['numberOfPeople'].value;
  }
}