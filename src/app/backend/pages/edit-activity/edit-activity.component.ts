import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from 'src/app/models/activity.model';
import { Blog } from 'src/app/models/blog.model';
import { CategoryA } from 'src/app/models/category-a.enum';
import { ActivityService } from 'src/app/services/activity.service';
import { BlogService } from 'src/app/services/blog.service';
import { Region } from 'src/app/models/Region.enum'; // ✅ Import Region

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.scss']
})
export class EditActivityComponent implements OnInit {
  activityForm!: FormGroup;
  categoryOptions = Object.values(CategoryA);
  regionOptions = Object.values(Region); //Add Region options

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  loading = false;
  loadingActivity = true;
  errorMessage = '';
  successMessage = '';
  blogs: Blog[] = [];
  isLoadingBlogs = false;
  activityId!: number;
  currentActivity!: Activity;

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBlogs();
    
    // Get the activity ID from the route parameters
    this.route.params.subscribe(params => {
      this.activityId = +params['id'];
      this.loadActivity(this.activityId);
    });
  }

  initForm(): void {
    this.activityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      categoryA: ['', Validators.required],
      location: ['', Validators.required],
      disponibility: [true],
      price: ['', [Validators.required, Validators.min(0)]],
      region: ['', Validators.required], //Add region to form

      blogId: [''] // For blog selection
    });
  }

  loadActivity(id: number): void {
    this.loadingActivity = true;
    this.activityService.getActivityById(id).subscribe({
      next: (activity) => {
        this.currentActivity = activity;
        this.populateForm(activity);
        this.loadingActivity = false;
        
        // Load image preview if exists
        if (activity.imagePath) {
          this.imagePreview = this.activityService.getImageUrl(activity.imagePath);
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load activity. Please try again later.';
        this.loadingActivity = false;
        console.error('Error loading activity:', error);
      }
    });
  }

  populateForm(activity: Activity): void {
    this.activityForm.patchValue({
      name: activity.name,
      categoryA: activity.categoryA,
      location: activity.location,
      disponibility: activity.disponibility,
      price: activity.price,
      region: activity.region, // Set region

      blogId: activity.blog?.idBlog || ''
    });
  }
  
  loadBlogs(): void {
    this.isLoadingBlogs = true;
    this.blogService.getAllBlogs()
      .subscribe({
        next: (blogs) => {
          this.blogs = blogs;
          this.isLoadingBlogs = false;
        },
        error: (error) => {
          console.error('Error loading blogs:', error);
          this.errorMessage = 'Could not load blogs. Please try again later.';
          this.isLoadingBlogs = false;
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.markFormGroupTouched(this.activityForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Get form values
    const blogId = this.activityForm.get('blogId')?.value;
    
    // Create updated activity object
    const updatedActivity: any = {
      idActivity: this.activityId,
      name: this.activityForm.get('name')?.value,
      categoryA: this.activityForm.get('categoryA')?.value,
      location: this.activityForm.get('location')?.value,
      disponibility: this.activityForm.get('disponibility')?.value,
      price: this.activityForm.get('price')?.value,
      region: this.activityForm.get('region')?.value, // ✅ Include region

      user: { id: this.currentActivity.user.id }, // Only send the user ID
      imagePath: this.currentActivity.imagePath
    };

    // Add blog reference if selected
    if (blogId) {
      updatedActivity.blog = {
        idBlog: blogId
      };
    }

    console.log('Submitting activity update:', updatedActivity);

    // Update with or without new image
    if (this.selectedFile) {
      // Update with new image
      this.activityService.updateActivityWithImage(updatedActivity, this.selectedFile)
        .subscribe({
          next: (response) => this.handleSuccess(response),
          error: (error) => this.handleError(error)
        });
    } else {
      // Update without changing the image
      this.activityService.updateActivity(updatedActivity)
        .subscribe({
          next: (response) => this.handleSuccess(response),
          error: (error) => this.handleError(error)
        });
    }
  }

  handleSuccess(response: any): void {
    this.loading = false;
    this.successMessage = 'Activity updated successfully!';
    
    // Navigate after a short delay to show success message
    setTimeout(() => {
      this.router.navigate(['./dashboard/activities']);
    }, 2000);
  }

  handleError(error: any): void {
    this.loading = false;
    this.errorMessage = error.error?.error || 'An error occurred while updating the activity';
    console.error('Error updating activity:', error);
  }

  // Helper method to mark all controls as touched for validation
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['./dashboard/activities']);
  }
}