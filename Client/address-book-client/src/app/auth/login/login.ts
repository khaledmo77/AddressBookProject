import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.error = '';
    this.loading = true;

    this.api.loginAdmin(this.loginForm.value).subscribe({
      next: (token: any) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          this.error = 'Invalid email or password';
        } else {
          this.error = 'An error occurred. Please try again.';
        }
      }
    });
  }
}
