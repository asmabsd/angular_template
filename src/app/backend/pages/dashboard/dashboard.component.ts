import { Component, OnInit } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { UserStatsService } from 'src/app/services/user-stats.service';
import { User } from 'src/app/models/user.model';
import { DashboardStats, TrendData } from 'src/app/models/stats.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
  

})
export class DashboardComponent implements OnInit {
  email: string | null = null;
  pendingUsers: (Partial<User> & { status?: string })[] = [];
  showPendingUsers: boolean = false;

  // Stats
  stats?: DashboardStats;
  statsLoading: boolean = true;
  statsError: string | null = null;

  // Chart
  view: [number, number] = [1000, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Registrations';
  colorScheme = {
    name: 'cool',
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    selectable: true,
    group: ScaleType.Ordinal // Utilise ScaleType.Ordinals ou une autre valeur valide
  
  
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    private statsService: UserStatsService
  ) {}

  ngOnInit() {
    this.email = this.authService.getCurrentUserEmail();
    this.loadPendingUsers();
    this.loadDashboardStats();
  }

  get isUserManagementPage(): boolean {
    return this.router.url.includes('/list-users') || 
           this.router.url.includes('/add-user');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  togglePendingUsers() {
    this.showPendingUsers = !this.showPendingUsers;
    if (this.showPendingUsers && this.pendingUsers.length === 0) {
      this.loadPendingUsers();
    }
  }

  loadPendingUsers() {
    this.adminService.getPendingUsers().subscribe(
      users => this.pendingUsers = users,
      error => console.error('Error loading pending users', error)
    );
  }

  approveUser(userId: number) {
    this.adminService.approveUser(userId).subscribe(
      () => this.pendingUsers = this.pendingUsers.filter(user => user.id !== userId),
      error => console.error('Error approving user', error)
    );
  }

  rejectUser(userId: number) {
    this.adminService.rejectUser(userId).subscribe(
      () => this.pendingUsers = this.pendingUsers.filter(user => user.id !== userId),
      error => console.error('Error rejecting user', error)
    );
  }

  loadDashboardStats(): void {
    this.statsLoading = true;
    this.statsError = null;
    this.statsService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.statsLoading = false;
      },
      error: (err) => {
        this.statsError = 'Failed to load dashboard statistics';
        this.statsLoading = false;
        console.error(err);
      }
    });
  }

  formatTrendData(trendData: TrendData[]): any[] {
    return trendData?.map(item => ({
      name: item.month,
      value: item.count
    })) || [];
  }

  refreshStats(): void {
    this.loadDashboardStats();
  }
}
