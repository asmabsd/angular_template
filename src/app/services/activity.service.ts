import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';
import { CategoryA } from '../models/category-a.enum';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:8089/tourisme/activity';

  constructor(private http: HttpClient) {}

  // GET all activities
  getAllActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}`);
  }

  // GET activity by ID
  getActivityById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  // POST create new activity
  /*createActivityy(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}`, activity);
  }*/

  // PUT update activity by ID
  updateActivity(id: number, activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${id}`, activity);
  }

  // DELETE activity by ID
  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
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

  createActivity(activity: Activity, blogId: number): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}/create/${blogId}`, activity);
  }
}
