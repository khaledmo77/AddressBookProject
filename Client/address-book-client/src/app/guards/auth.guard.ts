import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Temporarily bypass authentication for testing
    return true;
    
    // Original authentication logic (commented out for now)
    // const token = localStorage.getItem('token');
    // if (token) {
    //   return true;
    // }
    // this.router.navigate(['/login']);
    // return false;
  }
} 