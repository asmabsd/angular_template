import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Blog } from '../models/blog.model';
import { catchError, map, Observable, of } from 'rxjs';
import { Activity } from '../models/activity.model';
import { Region } from '../models/Region.enum';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = 'http://localhost:8089/tourisme/blog';

  constructor(private http: HttpClient) { }

  // GET all blogs
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.baseUrl}/getAllBlogs`);
  }
  
  // GET blog by ID - Updated to match controller
  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.baseUrl}/${id}`);
  }

  // POST create a new blog
  createBlog(blog: Blog): Observable<Blog> {
    const sanitizedBlog = this.sanitizeBlog(blog);
    return this.http.post<Blog>(`${this.baseUrl}/addblog`, sanitizedBlog);
  }

  // PUT update blog
  updateBlog(blog: Blog): Observable<Blog> {
    const sanitizedBlog = this.sanitizeBlog(blog);
    return this.http.put<Blog>(`${this.baseUrl}/updateblog`, sanitizedBlog);
  }

  // DELETE blog by ID - Updated to match controller
  deleteBlog(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // GET blogs by user ID
  getBlogsByUserId(userId: number): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.baseUrl}/user/${userId}`);
  }

  // PUT affect activities to blog by ID - Updated to match controller
  affectActivityToBlog(idBlog: number, idActivities: number[]): Observable<Blog> {
    const idActivitiesString = idActivities.join(',');
    return this.http.put<Blog>(`${this.baseUrl}/affectActivityToBlog/${idBlog}/${idActivitiesString}`, null);
  }

  // PUT affect activities to blog using request body
  affectActivitiesToBlog(idBlog: number, idActivities: number[]): Observable<Activity> {
    return this.http.put<Activity>(`${this.baseUrl}/affectActivitiesToBlog/${idBlog}`, idActivities);
  }

  // POST add blog and affect activities
  addBlogAndAffectActivity(blog: Blog, idActivities: number[]): Observable<Blog> {
    const sanitizedBlog = this.sanitizeBlog(blog);
    const idActivitiesString = idActivities.join(',');
    return this.http.post<Blog>(`${this.baseUrl}/addBlogAndAffectActivity/${idActivitiesString}`, sanitizedBlog);
  }

  // Helper method to sanitize blog before sending to backend
  private sanitizeBlog(blog: Blog): any {
    // Create a deep copy of the blog object
    const sanitizedBlog: any = { ...blog };
    
    // Only send user id if user exists
    if (sanitizedBlog.user) {
      sanitizedBlog.user = {
        id: sanitizedBlog.user.id
      };
    }
    
    // Sanitize activities if they exist
    if (sanitizedBlog.activities && Array.isArray(sanitizedBlog.activities)) {
      sanitizedBlog.activities = sanitizedBlog.activities.map((activity: any) => {
        if (typeof activity === 'object') {
          return { idActivity: activity.idActivity };
        }
        return activity;
      });
    }
    
    return sanitizedBlog;
  }


  getBlogsByRegion(region: string): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.baseUrl}/blogs?region=${region}`);
  }
  
  
}