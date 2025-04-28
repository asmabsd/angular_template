import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Blog } from 'src/app/models/blog.model';
import { BlogService } from 'src/app/services/blog.service';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Region } from 'src/app/models/Region.enum';

@Component({
  selector: 'app-addblog',
  templateUrl: './addblog.component.html',
  styleUrls: ['./addblog.component.css']
})
export class AddblogComponent implements OnInit {
  blogForm!: FormGroup;
  users: any[] = [];
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  currentUserId = 1;
  
  // Liste des régions disponibles
  regions: string[] = [
    'Gabes', 'Tunis', 'Beja', 'BenArous', 'Bizerte', 'Gafsa', 'Jendouba',
    'Kairouan', 'Kasserine', 'Kebili', 'Ariana', 'Manouba', 'Kef',
    'Mahdia', 'Medenine', 'Monastir', 'Nabeul', 'Sfax', 'SidiBouzid',
    'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Zaghouan'
  ];

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    // Initialize the form with today's date as default
    const today = new Date().toISOString().split('T')[0];
    
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      userId: ['', Validators.required],
      publication: [today, Validators.required],
      region: ['', Validators.required] // Ajout du champ région avec validation
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: any[]) => {
        this.users = users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }));
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.errorMessage = 'Failed to load users. Please try again.';
      }
    });
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.markFormGroupTouched(this.blogForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.blogForm.value;
    
    const blogPayload: Blog = {
      title: formValue.title,
      content: formValue.content,
      publication: formValue.publication,
      region: formValue.region as Region, // Ajout de la région
      user: {
        id: this.currentUserId,
        email: '', // Provide default or fetched email
        password: '' // Provide default or fetched password
      }
    };

    this.blogService.createBlog(blogPayload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Blog created successfully!';
        console.log('Blog created:', response);
        
        // Redirect after a short delay
        setTimeout(() => {
          this.router.navigate(['/backoffice/blog']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create blog. Please try again.';
        console.error('Error creating blog:', error);
      }
    });
  }

  resetForm(): void {
    // Preserve the current date when resetting
    const currentDate = this.blogForm.get('publication')?.value;
    
    this.blogForm.reset({
      publication: currentDate
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/blog']);
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}