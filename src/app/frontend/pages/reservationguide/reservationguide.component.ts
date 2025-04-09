import { Component } from '@angular/core';
import { ReservationGuideService } from 'src/app/services/reservationguide.service';
import { UserService } from 'src/app/services/user.service';
import { ReservationGuide } from 'src/app/models/reservationguide.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Guide } from 'src/app/models/guide.model';
import { GuideService } from 'src/app/services/guide.service';

@Component({
  selector: 'app-ReservationGuide',
  templateUrl: './ReservationGuide.component.html',
  styleUrls: ['./ReservationGuide.component.css']
})
export class ReservationGuideComponent {
  ReservationReservationGuideForm!: FormGroup;
  users: any[] = [];
  allUsers: any[] = []; // Stocke tous les utilisateurs complets
  guides: any[] = [];
  allGuides: any[] = [];
  constructor(
    private ReservationGuideService: ReservationGuideService,
    private userService: UserService,
    private guideService: GuideService,

    private fb: FormBuilder,  
    public router: Router
  ) {
    this.ReservationReservationGuideForm = this.fb.group({
      duration: ['', Validators.required],
      status: ['', Validators.required],
      userId: ['', Validators.required], 
      guideId: ['', Validators.required], // On utilise userId dans le formulaire
      // On utilise userId dans le formulaire
      price: [0, Validators.required],
      comment: ['', [Validators.required]],
      dateHour: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadGuides();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (users: any[]) => {
        this.allUsers = users; // Stocke tous les utilisateurs complets
        this.users = users.map(user => ({
          id: user.id,
          email: user.email
        }));
        
      },
      error => {
        console.error('Error loading users', error);
      }
    );
  }
  loadGuides() {
    this.guideService.getGuide().subscribe(
      (guides: any[]) => {
        this.allGuides = guides; // Stocke tous les utilisateurs complets
        this.guides = guides.map(guide=> ({
          id: guide.id,
          name:guide.name
        }));
        
      },
      error => {
        console.error('Error loading users', error);
      }
    );
  }

  onSubmit() {
    if (this.ReservationReservationGuideForm.valid) {
      const formValue = this.ReservationReservationGuideForm.value;
      
      const payload = {
        duration: formValue.duration,
        status: formValue.status,
        price: formValue.price,
        comment: formValue.comment,
        dateHour: new Date(formValue.dateHour),
        user: { id: formValue.userId } as User, // Type assertion
        guide: { id: formValue.guideId } as Guide, // Type assertion

      } as ReservationGuide; // Full type assertion
      
      this.ReservationGuideService.addReservationGuide(payload).subscribe(
        response => {
          console.log('Reservation created successfully', response);
          this.router.navigate(['/listereservationsguide']);
        },
        error => {
          console.error('Error creating reservation', error);
          // Add user-friendly error handling here
        }
      );
    }
  }
  navigateToList() {
    this.router.navigate(['/listereservationsguide']);
  }

  // ... autres méthodes
}