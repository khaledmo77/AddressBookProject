import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    this.error = '';
    this.loading = true;
    
    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }

    const { email, password } = this.loginForm.value;
    
    this.api.login({ email, password }).subscribe({
      next: (response) => {
        if (response && response.token) {
          // Store the token in localStorage
          localStorage.setItem('token', response.token);
          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Invalid response from server';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.error = error.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
