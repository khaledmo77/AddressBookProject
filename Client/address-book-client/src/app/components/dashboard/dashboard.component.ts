import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <nav class="sidebar">
        <ul>
          <li><a routerLink="addresses" routerLinkActive="active">Addresses</a></li>
          <li><a routerLink="jobs" routerLinkActive="active">Jobs</a></li>
          <li><a routerLink="departments" routerLinkActive="active">Departments</a></li>
        </ul>
      </nav>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      height: 100vh;
    }
    .sidebar {
      width: 200px;
      background-color: #f8f9fa;
      padding: 20px;
      border-right: 1px solid #dee2e6;
    }
    .sidebar ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .sidebar li {
      margin-bottom: 10px;
    }
    .sidebar a {
      display: block;
      padding: 10px;
      color: #495057;
      text-decoration: none;
      border-radius: 4px;
    }
    .sidebar a:hover {
      background-color: #e9ecef;
    }
    .sidebar a.active {
      background-color: #007bff;
      color: white;
    }
    .content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
  `]
})
export class DashboardComponent {} 