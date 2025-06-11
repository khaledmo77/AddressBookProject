import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  success: string = '';

  constructor(private api: ApiService, private router: Router) {}

  onRegister() {
    this.error = '';
    this.success = '';
    this.api.registerAdmin({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.success = 'Registration successful! You can now log in.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.error = 'Registration failed';
      }
    });
  }
}
