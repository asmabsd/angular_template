import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Blog } from 'src/app/models/blog.model';
import { CategoryA } from 'src/app/models/category-a.enum';
import { Region } from 'src/app/models/Region.enum';
import { ActivityService } from 'src/app/services/activity.service';
import { BlogService } from 'src/app/services/blog.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent implements OnInit, AfterViewInit, OnDestroy {
  activityForm!: FormGroup;
  categoryOptions = Object.values(CategoryA);
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  blogs: Blog[] = [];
  isLoadingBlogs = false;
  regionOptions = Object.values(Region);
  currentUserId = 1;
  private map!: L.Map;
  private marker: L.Marker | null = null;
  private http: HttpClient; // Déclarer la propriété http

  private regionCoordinates: { [key in Region]: { lat: number; lng: number; zoom: number } } = {
    [Region.Tunis]: { lat: 36.8065, lng: 10.1815, zoom: 12 },
    [Region.Gabes]: { lat: 33.8815, lng: 10.0982, zoom: 12 },
    [Region.Beja]: { lat: 36.7256, lng: 9.1817, zoom: 12 },
    [Region.BenArous]: { lat: 36.7537, lng: 10.2320, zoom: 12 },
    [Region.Bizerte]: { lat: 37.2744, lng: 9.8739, zoom: 12 },
    [Region.Gafsa]: { lat: 34.4250, lng: 8.7842, zoom: 12 },
    [Region.Jendouba]: { lat: 36.5011, lng: 8.7803, zoom: 12 },
    [Region.Kairouan]: { lat: 35.6781, lng: 10.0963, zoom: 12 },
    [Region.Kasserine]: { lat: 35.1676, lng: 8.8365, zoom: 12 },
    [Region.Ariana]: { lat: 36.8601, lng: 10.1934, zoom: 12 },
    [Region.Kebili]: { lat: 33.7051, lng: 8.9751, zoom: 12 },
    [Region.Manouba]: { lat: 36.8103, lng: 10.0607, zoom: 12 },
    [Region.Kef]: { lat: 36.1822, lng: 8.7148, zoom: 12 },
    [Region.Mahdia]: { lat: 35.5047, lng: 11.0622, zoom: 12 },
    [Region.Medenine]: { lat: 33.3549, lng: 10.5055, zoom: 12 },
    [Region.Monastir]: { lat: 35.7643, lng: 10.8113, zoom: 12 },
    [Region.Nabeul]: { lat: 36.4561, lng: 10.7357, zoom: 12 },
    [Region.Sfax]: { lat: 34.7406, lng: 10.7603, zoom: 12 },
    [Region.SidiBouzid]: { lat: 35.0382, lng: 9.4839, zoom: 12 },
    [Region.Siliana]: { lat: 36.0849, lng: 9.3708, zoom: 12 },
    [Region.Sousse]: { lat: 35.8256, lng: 10.6412, zoom: 12 },
    [Region.Tataouine]: { lat: 32.9297, lng: 10.4518, zoom: 12 },
    [Region.Tozeur]: { lat: 33.9197, lng: 8.1337, zoom: 12 },
    [Region.Zaghouan]: { lat: 36.4029, lng: 10.1429, zoom: 12 }
  };

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private blogService: BlogService,
    private router: Router,
    http: HttpClient // Injecter HttpClient
  ) {
    this.http = http; // Initialiser la propriété
  }

  ngOnInit(): void {
    this.initForm();
    this.loadBlogs();
    this.activityForm.get('region')?.valueChanges.subscribe((region: string) => {
      if (region && this.map) {
        const regionKey = Object.keys(Region).find(
          key => Region[key as keyof typeof Region] === region
        ) as keyof typeof Region;
        if (regionKey) {
          this.centerMapOnRegion(Region[regionKey]);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  initForm(): void {
    this.activityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      categoryA: ['', Validators.required],
      location: ['', Validators.required],
      disponibility: [true],
      price: ['', [Validators.required, Validators.min(0)]],
      region: ['', Validators.required],
      blogId: ['']
    });
  }

  initMap(): void {
    // Fix pour les icônes Leaflet
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'assets/leaflet-images/marker-icon-2x.png',
    iconUrl: 'assets/leaflet-images/marker-icon.png',
    shadowUrl: 'assets/leaflet-images/marker-shadow.png',
  });
    this.map = L.map('map').setView([36.8065, 10.1815], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.setMarker(lat, lng);
      this.reverseGeocode(lat, lng).subscribe({
        next: (response: any) => {
          const address = response.display_name || 'Adresse inconnue';
          this.activityForm.get('location')?.setValue(address);
        },
        error: (error) => {
          console.error('Erreur de géocodage inverse:', error);
          this.activityForm.get('location')?.setValue('Erreur lors de la récupération de l\'adresse');
        }
      });
    });
  }

  private reverseGeocode(lat: number, lng: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    return this.http.get(url, {
      headers: {
        'User-Agent': 'YourAppName/1.0 (your.email@example.com)' // Remplacer par un User-Agent valide
      }
    });
  }

  centerMapOnRegion(region: Region): void {
    const coords = this.regionCoordinates[region];
    if (coords) {
      this.map.setView([coords.lat, coords.lng], coords.zoom);
    } else {
      console.warn(`No coordinates found for region: ${region}`);
    }
  }

  setMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  loadBlogs(): void {
    this.isLoadingBlogs = true;
    this.blogService.getAllBlogs().subscribe({
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

    const selectedBlogId = this.activityForm.get('blogId')?.value;
    const selectedRegion = this.activityForm.get('region')?.value;
    const regionKey = Object.keys(Region).find(
      key => Region[key as keyof typeof Region] === selectedRegion
    ) as keyof typeof Region;

    const activity: any = {
      name: this.activityForm.get('name')?.value,
      categoryA: this.activityForm.get('categoryA')?.value,
      location: this.activityForm.get('location')?.value,
      disponibility: this.activityForm.get('disponibility')?.value,
      price: this.activityForm.get('price')?.value,
      region: regionKey || selectedRegion,
      user: {
        id: this.currentUserId
      }
    };

    if (selectedBlogId) {
      activity.blog = {
        idBlog: selectedBlogId
      };
    }

    if (this.selectedFile) {
      if (selectedBlogId) {
        this.activityService.addActivityWithImageBlog(activity, this.selectedFile, selectedBlogId).subscribe({
          next: (response) => this.handleSuccess(response),
          error: (error) => this.handleError(error)
        });
      } else {
        this.activityService.addActivityWithImage(activity, this.selectedFile).subscribe({
          next: (response) => this.handleSuccess(response),
          error: (error) => this.handleError(error)
        });
      }
    } else {
      if (selectedBlogId) {
        this.activityService.createActivity(activity, selectedBlogId).subscribe({
          next: (response) => this.handleSuccess(response),
          error: (error) => this.handleError(error)
        });
      } else {
        this.activityService.addActivity(activity).subscribe({
          next: (response) => this.handleSuccess(response),
          error: (error) => this.handleError(error)
        });
      }
    }
  }

  handleSuccess(response: any): void {
    this.loading = false;
    this.successMessage = 'Activity added successfully!';
    this.activityForm.reset({
      disponibility: true
    });
    this.selectedFile = null;
    this.imagePreview = null;
    setTimeout(() => {
      this.router.navigate(['/dashboard/activities']);
    }, 2000);
  }

  handleError(error: any): void {
    this.loading = false;
    this.errorMessage = error.error?.error || 'An error occurred while adding the activity';
    console.error('Error adding activity:', error);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}