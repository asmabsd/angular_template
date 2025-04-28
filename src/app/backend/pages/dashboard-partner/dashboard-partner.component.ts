import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Adjust the path as needed

@Component({
  selector: 'app-dashboard-partner',
  templateUrl: './dashboard-partner.component.html',
  styleUrls: ['./dashboard-partner.component.css']
})
export class DashboardPartnerComponent {

  email: string | null = null;
  isSidebarOpen = true;
  userId: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.email = this.authService.getCurrentUserEmail();
    if (this.email) {
      this.authService.getUserIdByEmail(this.email).subscribe(id => {
        this.userId = id.toString();
        console.log("User ID:", this.userId);
      });
    }
  
  }

  get isUserManagementPage(): boolean {
    return this.router.url.includes('/list-users') || 
           this.router.url.includes('/add-user');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}