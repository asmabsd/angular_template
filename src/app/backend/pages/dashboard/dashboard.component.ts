import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Ajuste le chemin si besoin

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  email: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.email = this.authService.getCurrentUserEmail();
  }

  get isUserManagementPage(): boolean {
    return this.router.url.includes('/list-users') || 
           this.router.url.includes('/add-user');
  }
  get isTransportManagementPage(): boolean {
    return this.router.url.includes('/listetransport') || 
           this.router.url.includes('/addtransport');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirection après déconnexion
  }
}
