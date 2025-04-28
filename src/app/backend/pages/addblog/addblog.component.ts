import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Blog } from 'src/app/models/blog.model';
import { BlogService } from 'src/app/services/blog.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Region } from 'src/app/models/Region.enum';
import { SummarizationService } from 'src/app/services/summarization.service';
import { AuthService } from 'src/app/services/auth.service'; // <-- NEW import
import { catchError, of } from 'rxjs';

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
  currentUserId: number | null = null;
  isSummarizing = false;

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
    private router: Router,
    private summarizationService: SummarizationService,
    private authService: AuthService // <-- Inject it
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.loadCurrentUser(); // <-- Load current user here
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      userId: ['', Validators.required],
      publication: [today, Validators.required],
      region: ['', Validators.required]
    });
  }

  loadUsers(): void {
    this.userService.getUsers().pipe(
      catchError(error => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users.';
        return of([]);
      })
    ).subscribe({
      next: (users: any[]) => {
        this.users = users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }));
      }
    });
  }

  loadCurrentUser(): void {
    const email = this.authService.getCurrentUserEmail();
    if (email) {
      this.authService.getUserIdByEmail(email).subscribe({
        next: (id: number) => {
          this.currentUserId = id;
          console.log('Fetched current user ID:', this.currentUserId);
        },
        error: (error) => {
          console.error('Error fetching current user ID:', error);
          this.errorMessage = 'Failed to fetch current user.';
        }
      });
    } else {
      this.errorMessage = 'User is not logged in.';
    }
  }

  onSubmit(): void {
    if (this.blogForm.invalid || this.currentUserId === null) {
      this.markFormGroupTouched(this.blogForm);
      this.errorMessage = 'Please complete the form correctly.';
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
      region: formValue.region as Region,
      user: {
        id: this.currentUserId,
        email: '',   // You can remove these if your backend doesn't need them
        password: '' // Same here
      }
    };

    this.blogService.createBlog(blogPayload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Blog created successfully!';
        console.log('Blog created:', response);
        setTimeout(() => {
          this.router.navigate(['/backoffice/blog']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating blog:', error);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create blog. Please try again.';
      }
    });
  }

  resetForm(): void {
    const currentDate = this.blogForm.get('publication')?.value;
    this.blogForm.reset({
      publication: currentDate
    });
  }

  goBack(): void {
    this.router.navigate(['/backoffice/blog']);
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

  onSummarizeContent(): void {
    const content = this.blogForm.value.content;
    if (!content) {
      this.errorMessage = 'Veuillez entrer du contenu avant de résumer.';
      return;
    }

    this.isSummarizing = true;
    this.errorMessage = null;

    this.summarizationService.summarize(content).subscribe({
      next: (summarizedText: string) => {
        this.blogForm.patchValue({ content: summarizedText });
        this.successMessage = 'Contenu résumé avec succès !';
        this.isSummarizing = false;
      },
      error: (error) => {
        console.error('Erreur de résumé:', error);
        this.errorMessage = 'Erreur lors du résumé du contenu.';
        this.isSummarizing = false;
      }
    });
  }
}