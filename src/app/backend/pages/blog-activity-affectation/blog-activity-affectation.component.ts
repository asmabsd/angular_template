import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Activity } from 'src/app/models/activity.model';
import { Blog } from 'src/app/models/blog.model';
import { ActivityService } from 'src/app/services/activity.service';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-activity-affectation',
  templateUrl: './blog-activity-affectation.component.html',
  styleUrls: ['./blog-activity-affectation.component.scss']
})
export class BlogActivityAffectationComponent implements OnInit {
  affectationForm!: FormGroup;
  blogs: Blog[] = [];
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  selectedActivities: Activity[] = [];
  
  loading = false;
  submitting = false;
  loadingData = true;
  errorMessage = '';
  successMessage = '';
  
  activitySearchTerm = '';
  
  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private activityService: ActivityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.affectationForm = this.fb.group({
      blogId: ['', Validators.required],
      affectationType: ['replace', Validators.required] // 'replace' or 'add'
      
    });
    
    // Listen for blog selection changes
    this.affectationForm.get('blogId')?.valueChanges.subscribe(blogId => {
      if (blogId) {
        this.onBlogSelected(blogId);
      } else {
        this.selectedActivities = [];
      }
    });
  }

  loadData(): void {
    this.loadingData = true;
    
    // Load blogs and activities in parallel
    forkJoin({
      blogs: this.blogService.getAllBlogs(),
      activities: this.activityService.getAllActivities()
    }).subscribe({
      next: (result) => {
        this.blogs = result.blogs;
        this.activities = result.activities;
        this.filterActivities();
        this.loadingData = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load data. Please try again later.';
        this.loadingData = false;
        console.error('Error loading data:', error);
      }
    });
  }
  
  onBlogSelected(blogId: number): void {
    // Find selected blog
    const selectedBlog = this.blogs.find(b => b.idBlog === +blogId);
    
    if (selectedBlog && selectedBlog.activities) {
      // Initialize selected activities from chosen blog
      this.selectedActivities = [...selectedBlog.activities];
    } else {
      this.selectedActivities = [];
    }
    
    this.filterActivities();
  }
  
  filterActivities(): void {
    if (!this.activitySearchTerm) {
      // Show only activities that are not already selected
      this.filteredActivities = this.activities.filter(activity => 
        !this.selectedActivities.some(selectedActivity => 
          selectedActivity.idActivity === activity.idActivity
        )
      );
      return;
    }
    
    const searchTerm = this.activitySearchTerm.toLowerCase();
    
    // Filter by search term and exclude already selected activities
    this.filteredActivities = this.activities.filter(activity => 
      (activity.name.toLowerCase().includes(searchTerm) || 
       activity.location.toLowerCase().includes(searchTerm)) &&
      !this.selectedActivities.some(selectedActivity => 
        selectedActivity.idActivity === activity.idActivity
      )
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
    this.selectedActivities = this.selectedActivities.filter(
      a => a.idActivity !== activity.idActivity
    );
    this.filterActivities();
  }

  onSubmit(): void {
    if (this.affectationForm.invalid || this.selectedActivities.length === 0) {
      return;
    }
    
    const blogId = +this.affectationForm.get('blogId')?.value;
    const affectationType = this.affectationForm.get('affectationType')?.value;
    
    // Get IDs of selected activities
    const activityIds = this.selectedActivities.map(activity => activity.idActivity!);
    
    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    // Use the appropriate method based on affection type
    if (affectationType === 'replace') {
      // Replace all activities for this blog
      this.blogService.affectActivityToBlog(blogId, activityIds)
        .subscribe({
          next: (response) => this.handleSuccess(response),
          error: (error) => this.handleError(error)
        });
    } else {
      // Add activities to existing ones
      this.blogService.affectActivitiesToBlog(blogId, activityIds)
        .subscribe({
          next: (response) => this.handleSuccess(response),
          error: (error) => this.handleError(error)
        });
    }
  }
  
  handleSuccess(response: any): void {
    this.submitting = false;
    this.successMessage = 'Activities successfully associated with the blog!';
    
    // Reset form after a delay
    setTimeout(() => {
      this.affectationForm.get('blogId')?.setValue('');
      this.selectedActivities = [];
      this.successMessage = '';
    }, 3000);
  }
  
  handleError(error: any): void {
    this.submitting = false;
    this.errorMessage = 'Failed to associate activities with the blog. Please try again.';
    console.error('Error in affectation:', error);
  }
  
  goBack(): void {
    this.router.navigate(['/backoffice/blog']);
  }
  
  // Helper methods for display
  getCategoryDisplayName(category: string): string {
    return category ? category.replace(/_/g, ' ') : '';
  }
  
  getBlogTitle(blogId: number): string {
    const blog = this.blogs.find(b => b.idBlog === blogId);
    return blog ? blog.title! : '';
  }
  
  clearSearch(): void {
    this.activitySearchTerm = '';
    this.filterActivities();
  }
}