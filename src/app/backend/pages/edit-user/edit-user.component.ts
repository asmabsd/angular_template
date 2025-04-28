import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  userId: number = 0;
  userForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;  // Convert to number

      // Initialize the form
      this.userForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [''],  // optional
        nTel: ['', Validators.required],
        numPasseport: ['', Validators.required],
        role: ['', Validators.required]
      });

      this.userService.getUserById(this.userId).subscribe(
        (data: User) => {
          this.userForm.patchValue({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            nTel: data.nTel,
            numPasseport: data.numPasseport,
            role: data.role ? data.role.name : ''
          });
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'User not found or error fetching data';
          this.isLoading = false;
        }
      );
    } else {
      this.errorMessage = 'User ID is missing from the route';
      this.isLoading = false;
    }
  }

  updateUser(): void {
    if (this.userForm.invalid) {
      return;
    }

    const formData = this.userForm.value;
    const updatedUser: User = {
      id: this.userId, // Include the user ID
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password || undefined,  // optional
      nTel: formData.nTel,
      numPasseport: formData.numPasseport,
      role: { id: 0, name: formData.role } // Replace '0' with the appropriate role ID if available
    };

    this.userService.updateUser(this.userId, updatedUser).subscribe(
      () => {
        this.router.navigate(['/dashboard/user-list']);  // Redirect after update
      },
      (error) => {
        this.errorMessage = 'Error updating user';
      }
    );
  }

  navigateToList(): void {
    this.router.navigate(['/dashboard/user-list']);
  }

}
