import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Blog } from 'src/app/models/blog.model';
import { BlogService } from 'src/app/services/blog.service';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-addblog',
  templateUrl: './addblog.component.html',
  styleUrls: ['./addblog.component.css']
})
export class AddblogComponent implements OnInit {
  users: any[] = [];
  allUsers: any[] = []; // Stocke tous les utilisateurs complets

  blogForm!: FormGroup;
  isSubmitting = false;
  blogs: Blog[] = [];
  activities: Activity[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  router: any;

  constructor(
    private blogService: BlogService,
    private userService: UserService,
    private activityService: ActivityService,
    private fb: FormBuilder,  
    // Removed duplicate router declaration
  ) { 

 
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      userId: ['', Validators.required], // On utilise userId dans le formulaire

      publication: ['', Validators.required],
    
      });}
  
  
  ngOnInit(): void {
    this.loadUsers();
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
  onSubmit() {
    if (this.blogForm.valid) {
      const formValue = this.blogForm.value;
      
      const payload = {
        title: formValue.title,
        content: formValue.content,
        publication: formValue.publication,
        user: { id: formValue.userId } as User, // Type assertion
      } as Blog; // Full type assertion
      
      this.blogService.createBlog(payload).subscribe(
        response => {
          console.log('Reservation created successfully', response);
          this.router.navigate(['/']);
        },
        error => {
          console.error('Error creating reservation', error);
          // Add user-friendly error handling here
        }
      );
    }
  }
  navigateToList() {
    this.router.navigate(['/']);
  }

/*  onSubmit() {
    if (this.blogForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const blogData: Blog = this.blogForm.value;

    this.blogService.createBlog(blogData).subscribe({
      next: (response) => {
        console.log('Blog ajouté avec succès', response);
        this.blogForm.reset(); // Réinitialiser le formulaire
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du blog', err);
        this.errorMessage = 'Erreur lors de l’ajout du blog';
        this.isSubmitting = false;
      }
    });
  }*/

    /* onSubmit() {
    if (this.ReservationReservationGuideForm.valid) {
      const formValue = this.ReservationReservationGuideForm.value;
      
      const payload = {
        duration: formValue.duration,
        status: formValue.status,
        price: formValue.price,
        comment: formValue.comment,
        dateHour: new Date(formValue.dateHour),
        user: { id: formValue.userId } as User, // Type assertion
        guides: []
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
    }*/

 /* fetchBlogs(): void {
    this.isLoading = true;
    this.errorMessage = null;
  
    this.blogService.getAllBlogs().subscribe({
      next: (data) => {
        console.log('Données reçues:', data); // Ajout
        this.blogs = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur dans fetchBlogs():', error); // Affichage complet
        this.errorMessage = 'Erreur lors du chargement des blogs';
        this.blogs = [];
        this.isLoading = false;
      }
    });
  }
*/
  /*fetchActivities(): void {
    this.isLoading = true;
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des blogs';
        this.isLoading = false;
      }
    });
  }

  navigateToActivities(blogId: number): void {
    // Redirige vers une page d'activités où l'utilisateur peut voir et ajouter des activités
    this.router.navigate(['/activities', blogId]);
  }*/

}
