import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Activity } from 'src/app/models/activity.model';
import { Blog } from 'src/app/models/blog.model';
import { Region } from 'src/app/models/Region.enum';
import { ActivityService } from 'src/app/services/activity.service';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss']
})
export class EditBlogComponent implements OnInit {
  blogForm!: FormGroup;
  regions = Object.values(Region);
  blogId!: number;
  currentBlog!: Blog;
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  
  // Activities management
  allActivities: Activity[] = [];
  selectedActivities: Activity[] = [];
  loadingActivities = false;
  activitySearchTerm = '';
  filteredActivities: Activity[] = [];

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private activityService: ActivityService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Get blog ID from route parameters
    this.route.params.subscribe(params => {
      this.blogId = +params['id'];
      
      // Load blog details and available activities in parallel
      forkJoin({
        blog: this.blogService.getBlogById(this.blogId),
        activities: this.activityService.getAllActivities()
      }).subscribe({
        next: (result) => {
          this.currentBlog = result.blog;
          this.allActivities = result.activities;
          this.populateForm(this.currentBlog);
          this.initSelectedActivities();
          this.filterActivities();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load blog data. Please try again later.';
          this.loading = false;
          console.error('Error loading data:', error);
        }
      });
    });
  }

  initForm(): void {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      publication: [new Date().toISOString().split('T')[0]], // Current date as default
      region: ['', [Validators.required]] // Region ajoutée
    });
  }

  populateForm(blog: Blog): void {
    // Format the publication date if needed
    let publicationDate = blog.publication;
    if (publicationDate && publicationDate.includes('T')) {
      publicationDate = publicationDate.split('T')[0];
    }
    
    this.blogForm.patchValue({
      title: blog.title,
      content: blog.content,
      publication: publicationDate || new Date().toISOString().split('T')[0],
      region: blog.region || ''  // Peupler la région
    });
  }
  
  initSelectedActivities(): void {
    // Initialize selected activities from current blog
    if (this.currentBlog.activities && this.currentBlog.activities.length > 0) {
      // Find the full activity objects from allActivities
      this.selectedActivities = this.currentBlog.activities.map(blogActivity => {
        const fullActivity = this.allActivities.find(a => a.idActivity === blogActivity.idActivity);
        return fullActivity || blogActivity;
      });
    }
  }
  
  filterActivities(): void {
    if (!this.activitySearchTerm) {
      this.filteredActivities = this.allActivities.filter(activity => 
        !this.selectedActivities.some(selected => selected.idActivity === activity.idActivity)
      );
      return;
    }
    
    const searchTerm = this.activitySearchTerm.toLowerCase();
    this.filteredActivities = this.allActivities.filter(activity => 
      (activity.name.toLowerCase().includes(searchTerm) || 
       activity.location.toLowerCase().includes(searchTerm)) && 
      !this.selectedActivities.some(selected => selected.idActivity === activity.idActivity)
    );
  }

  onSearchActivities(): void {
    this.filterActivities();
  }

  addActivity(activity: Activity): void {
    this.selectedActivities.push(activity);
    this.filterActivities();
  }

  removeActivity(activity: Activity): void {
    this.selectedActivities = this.selectedActivities.filter(a => a.idActivity !== activity.idActivity);
    this.filterActivities();
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.markFormGroupTouched(this.blogForm);
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Prepare blog object
    const updatedBlog: Blog = {
      idBlog: this.blogId,
      title: this.blogForm.get('title')?.value,
      content: this.blogForm.get('content')?.value,
      publication: this.blogForm.get('publication')?.value,
      region: this.blogForm.get('region')?.value,  // Inclure la région
      user: this.currentBlog.user,
      activities: this.selectedActivities
    };

    // Update the blog
    this.blogService.updateBlog(updatedBlog)
      .subscribe({
        next: (response) => {
          this.successMessage = 'Blog updated successfully!';
          this.submitting = false;
          
          // Wait a bit before redirecting
          setTimeout(() => {
            this.router.navigate(['./blog']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to update blog. Please try again.';
          this.submitting = false;
          console.error('Error updating blog:', error);
        }
      });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['./blog']);
  }

  // Category display name formatter
  getCategoryDisplayName(category: string): string {
    return category ? category.replace(/_/g, ' ') : 'Unknown';
  }
}