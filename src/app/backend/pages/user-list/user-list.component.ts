import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private userService: UserService, private router: Router) {}  // Inject Router

  ngOnInit(): void {
    this.loadUsers();
  }
    deleteUser(UserId: number) {
    if (confirm('Are you sure you want to delete this User?')) {
      this.userService.deleteUser(UserId).subscribe(
        () => {
          // Remove the User from the list (optimistic UI update)
          this.users= this.users.filter(User => User.id !== UserId);
          
          // Navigate to the same route to refresh the page and show the updated list
          this.router.navigateByUrl('/dashboard/liste-user', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/dashboard/liste-user']);
          });
        },
        error => {
          // You can handle any errors here
        }
      );
    }
  }

  

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. Please try again later.';
        this.isLoading = false;
        console.error('Error loading users:', err);
      }
    });
  }
}
