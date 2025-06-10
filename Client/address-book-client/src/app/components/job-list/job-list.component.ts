import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Job } from '../../services/api.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="job-list">
      <h2>Jobs</h2>
      <div class="actions">
        <button (click)="openAddForm()">Add New Job</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Department ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let job of jobs">
            <td>{{job.title}}</td>
            <td>{{job.description}}</td>
            <td>{{job.departmentId}}</td>
            <td>
              <button (click)="editJob(job)">Edit</button>
              <button (click)="deleteJob(job.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .job-list {
      padding: 20px;
    }
    .actions {
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f8f9fa;
    }
    button {
      padding: 8px 16px;
      margin-right: 8px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.apiService.getJobs().subscribe(
      jobs => this.jobs = jobs,
      error => console.error('Error loading jobs:', error)
    );
  }

  openAddForm() {
    // TODO: Implement add form
  }

  editJob(job: Job) {
    // TODO: Implement edit form
  }

  deleteJob(id: number) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.apiService.deleteJob(id).subscribe(
        () => {
          this.jobs = this.jobs.filter(j => j.id !== id);
        },
        error => console.error('Error deleting job:', error)
      );
    }
  }
} 