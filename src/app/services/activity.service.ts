import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';
import { CategoryA } from '../models/category-a.enum';
import { Region } from '../models/Region.enum';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:8089/tourisme/activity';

  constructor(private http: HttpClient) {}

  // GET all activities
  getAllActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/getAllActivitiesss`);
  }

  // GET activity by ID
  getActivityById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/getActivity/${id}`);
  }

  // Helper method to sanitize activity for sending to backend
  private sanitizeActivityForBackend(activity: any): any {
    // Create a deep copy to avoid modifying the original
    const sanitizedActivity = { ...activity };
    
    // Only keep the user ID or a minimal user object
    if (sanitizedActivity.user) {
      sanitizedActivity.user = {
        id: sanitizedActivity.user.id
      };
    }
    
    // Simplify blog reference if it exists
    if (sanitizedActivity.blog && typeof sanitizedActivity.blog !== 'number') {
      sanitizedActivity.blog = {
        idBlog: sanitizedActivity.blog.idBlog
      };
    }
    
    return sanitizedActivity;
  }

  // POST create new activity (without image)
  addActivity(activity: Activity): Observable<any> {
    const sanitizedActivity = this.sanitizeActivityForBackend(activity);
    return this.http.post<any>(`${this.apiUrl}/addactivity`, sanitizedActivity);
  }

  // POST upload image only
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<any>(`${this.apiUrl}/uploadImage`, formData);
  }

  // POST create activity with image
  addActivityWithImage(activity: Activity, image: File): Observable<any> {
    const sanitizedActivity = this.sanitizeActivityForBackend(activity);
    const formData = new FormData();
    formData.append('activityJson', JSON.stringify(sanitizedActivity));
    formData.append('image', image);
    
    return this.http.post<any>(`${this.apiUrl}/addActivityWithImage`, formData);
  }

  // POST create activity with image and blog
  addActivityWithImageBlog(activity: Activity, image: File, blogId: number): Observable<any> {
    const sanitizedActivity = this.sanitizeActivityForBackend(activity);
    const formData = new FormData();
    formData.append('activityJson', JSON.stringify(sanitizedActivity));
    formData.append('image', image);
    formData.append('blogId', blogId.toString());
    
    return this.http.post<any>(`${this.apiUrl}/addActivityWithImageBlog`, formData);
  }

  // PUT update activity (without image)
  updateActivity(activity: Activity): Observable<any> {
    const sanitizedActivity = this.sanitizeActivityForBackend(activity);
    console.log('Sanitized activity for update:', sanitizedActivity);
    return this.http.put<any>(`${this.apiUrl}/updateactivity`, sanitizedActivity);
  }

  // PUT update activity with image
  updateActivityWithImage(activity: Activity, image: File | null): Observable<any> {
    const sanitizedActivity = this.sanitizeActivityForBackend(activity);
    const formData = new FormData();
    formData.append('activityJson', JSON.stringify(sanitizedActivity));
    
    if (image) {
      formData.append('image', image);
    }
    
    return this.http.put<any>(`${this.apiUrl}/updateActivityWithImage`, formData);
  }

  // DELETE activity by ID
  deleteActivity(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  // GET activities by partner (user) ID
  getActivitiesByPartnerId(partnerId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/partner/${partnerId}`);
  }

  // GET activities by category
  getActivitiesByCategory(category: CategoryA): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/category/${category}`);
  }

  // GET available activities by disponibility (true/false)
  getAvailableActivities(disponibility: boolean): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/available/${disponibility}`);
  }

  // GET activities by max price
  getActivitiesByMaxPrice(maxPrice: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/price/${maxPrice}`);
  }

  // POST create activity with blog association
  createActivity(activity: Activity, blogId: number): Observable<any> {
    const sanitizedActivity = this.sanitizeActivityForBackend(activity);
    return this.http.post<any>(`${this.apiUrl}/create/${blogId}`, sanitizedActivity);
  }
  
  // Helper method to get image URL
  getImageUrl(filename: string): string {
    return `${this.apiUrl}/image/${filename}`;
  }

  // Exemple d’appel


  
  getActivities(region?: string): Observable<Activity[]> {
    let url = `${this.apiUrl}/activities`;
    if (region) {
      url += `?region=${region}`;
    }
    return this.http.get<Activity[]>(url);
  }
  
  getAllRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/regions`);
  }

  getActivitiesByRegion(region: Region): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/byRegion?region=${region}`);
  }

  getActivitiesAndBlogsByRegion(region: Region): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/byRegionWithBlogs?region=${region}`);
  }


  likeActivity(activityId: number): Observable<Activity> {
    return this.http.post<Activity>(
      `${this.apiUrl}/${activityId}/like`, 
      {},
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  dislikeActivity(activityId: number): Observable<Activity> {
    return this.http.post<Activity>(
      `${this.apiUrl}/${activityId}/dislike`, 
      {},
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  getUserReaction(activityId: number): Observable<{ reaction: 'LIKE' | 'DISLIKE' | null }> {
    return this.http.get<{ reaction: 'LIKE' | 'DISLIKE' | null }>(
      `${this.apiUrl}/${activityId}/reaction`
    );
  }
  getRecommendedActivity(): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/recommended`);
  }


}