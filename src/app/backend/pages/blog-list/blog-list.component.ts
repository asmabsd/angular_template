import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Blog} from 'src/app/models/blog.model'; // Importer l'énumération Region
import { Region } from 'src/app/models/Region.enum';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

  Math = Math;
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  loading = true;
  error = '';
  successMessage = '';
  
  // Search and filter
  searchTerm = '';
  selectedRegion = '';
  
  // Sorting
  sortBy = 'title';
  sortDirection = 'asc';
  
  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  
  // Utiliser l'énumération Region pour les valeurs disponibles
  regions: string[] = Object.values(Region);

  constructor(
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.blogService.getAllBlogs()
      .subscribe({
        next: (data) => {
          this.blogs = data;
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load blogs. Please try again later.';
          this.loading = false;
          console.error('Error loading blogs:', err);
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.blogs];
    
    // Apply search term filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        (blog.title?.toLowerCase().includes(searchLower) || 
         blog.content?.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply region filter
    if (this.selectedRegion) {
      filtered = filtered.filter(blog => blog.region === this.selectedRegion);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'date':
          comparison = (a.publication || '').localeCompare(b.publication || '');
          break;
        case 'author':
          comparison = (a.user?.firstName || '').localeCompare(b.user?.firstName || '');
          break;
        case 'region': // Ajout du tri par région
          comparison = (a.region || '').localeCompare(b.region || '');
          break;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    this.filteredBlogs = filtered;
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredBlogs.length / this.pageSize);
    // Adjust current page if needed
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
  }

  getCurrentPageItems(): Blog[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredBlogs.slice(startIndex, startIndex + this.pageSize);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onRegionChange(): void {
    this.currentPage = 1; // Reset to first page
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRegion = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  editBlog(id: number): void {
    // Using relative navigation because we're in a child route
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deleteBlog(id: number): void {
    if (confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      this.blogService.deleteBlog(id)
        .subscribe({
          next: () => {
            this.successMessage = 'Blog deleted successfully!';
            this.blogs = this.blogs.filter(blog => blog.idBlog !== id);
            this.applyFilters();
            
            // Clear success message after 3 seconds
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
          error: (err) => {
            this.error = 'Failed to delete blog. Please try again.';
            console.error('Error deleting blog:', err);
            
            // Clear error message after 3 seconds
            setTimeout(() => {
              this.error = '';
            }, 3000);
          }
        });
    }
  }

  addNewBlog(): void {
    this.router.navigate(['/dashboard/blog/add']);
  }

  // Get number of activities associated with blog
  getActivityCount(blog: Blog): number {
    return blog.activities?.length || 0;
  }

  // Format date for display
  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }

  // Truncate content for preview
  truncateContent(content?: string, maxLength: number = 100): string {
    if (!content) return '';
    
    if (content.length <= maxLength) {
      return content;
    }
    
    return content.substring(0, maxLength) + '...';
  }
  getRegionDisplay(blog: Blog): string {
    return blog.region || 'Non défini';
  }
}