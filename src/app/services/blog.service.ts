import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Blog } from '../models/blog.model';
import { map, Observable } from 'rxjs';
import { Activity } from '../models/activity.model';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8089/tourisme/blog/getAllBlogs';
  private apiUrl2 = 'http://localhost:8089/tourisme/blog/addblog';

  constructor(private http: HttpClient) { }

  // GET all blogs
  
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }
  
  // GET blog by ID
  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }

  

  // POST create a new blog
  createBlog(blog: Blog): Observable<Blog> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<Blog>(this.apiUrl2, blog, { headers });
  }

  // PUT update blog
  updateBlog(id: number, blog: Blog): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, blog);
  }

  // DELETE blog by ID
  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET blogs by user ID
  getBlogsByUserId(userId: number): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/user/${userId}`);
  }

  // PUT affect activity(ies) to blog by blog ID
  affectActivityToBlog(idBlog: number, idActivities: number[]): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/affectActivityToBlog/${idBlog}/${idActivities.join(',')}`, null);
  }

  // PUT affect activities to blog using request body
  affectActivitiesToBlog(idBlog: number, idActivities: number[]): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/affectActivitiesToBlog/${idBlog}`, idActivities);
  }

  // POST add blog and affect activities
  addBlogAndAffectActivity(blog: Blog, idActivities: number[]): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/addBlogAndAffectActivity/${idActivities.join(',')}`, blog);
  }
}
