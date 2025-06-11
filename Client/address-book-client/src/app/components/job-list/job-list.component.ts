import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Job } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" href="#" (click)="$event.preventDefault()">
          <i class="bi bi-briefcase"></i> Jobs
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link active" href="#" (click)="$event.preventDefault()">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" (click)="$event.preventDefault()">About</a>
            </li>
          </ul>
          <form class="d-flex" (ngSubmit)="onSearch($event)">
            <div class="input-group">
              <input 
                type="search" 
                class="form-control" 
                placeholder="Search..." 
                [(ngModel)]="searchQuery"
                name="searchQuery"
                aria-label="Search">
              <button class="btn btn-light" type="submit">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </nav>

    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h2">Job List</h1>
        <button (click)="openAddForm()" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Add New Job
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Error</h4>
        <p>{{ error }}</p>
        <div *ngIf="debugInfo" class="mt-2">
          <p class="fw-bold">Debug Info:</p>
          <pre class="bg-light p-2 rounded">{{ debugInfo | json }}</pre>
        </div>
      </div>

      <!-- Data Table -->
      <div *ngIf="!loading && !error" class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Department ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let job of jobs; trackBy: trackByJobId">
              <tr>
                <td>{{ job.id }}</td>
                <td>{{ job.name }}</td>
                <td>{{ job.description }}</td>
                <td>{{ job.departmentId }}</td>
                <td>
                  <button (click)="editJob(job)" class="btn btn-sm btn-outline-primary me-2">
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button (click)="deleteJob(job.id)" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      id="editModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
      [ngClass]="{'show': isEditModalOpen}"
      [ngStyle]="{'display': isEditModalOpen ? 'block' : 'none', 'background': isEditModalOpen ? 'rgba(0,0,0,0.5)' : ''}"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">{{ editingJob ? 'Edit' : 'Add' }} Job</h5>
            <button type="button" class="btn-close" (click)="closeEditModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveJob($event)">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" name="name" [(ngModel)]="editForm.name" required>
              </div>
              <div class="d-flex justify-content-end mt-4">
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
              <div *ngIf="editError" class="alert alert-danger mt-3">{{ editError }}</div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div *ngIf="showUpdateToast" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100;">
      <div class="toast show align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <strong>Success!</strong> Job has been {{ editingJob ? 'updated' : 'added' }}.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="showUpdateToast = false" aria-label="Close"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-blur {
      filter: blur(4px);
      pointer-events: none;
      user-select: none;
      transition: filter 0.3s;
    }
    .modal-backdrop.show {
      opacity: 0.5;
      backdrop-filter: blur(4px);
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  loading = false;
  error: string | null = null;
  debugInfo: any = null;
  searchQuery: string = '';

  // Modal state
  isEditModalOpen = false;
  editingJob: Job | null = null;
  editForm: any = {};
  editError: string | null = null;
  showUpdateToast = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadJobs();
  }

  trackByJobId(index: number, job: Job): number {
    return job.id;
  }

  loadJobs() {
    this.loading = true;
    this.error = null;
    this.debugInfo = null;

    console.log('Loading jobs...');
    this.apiService.getJobs().subscribe({
      next: (jobs) => {
        console.log('Jobs loaded:', jobs);
        this.jobs = jobs;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading jobs:', err);
        this.loading = false;
        this.error = 'Failed to load jobs. Please try again later.';
        this.debugInfo = {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        };
      }
    });
  }

  onSearch(event: Event) {
    event.preventDefault();
    if (!this.searchQuery.trim()) {
      this.loadJobs();
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.jobs = this.jobs.filter(job => 
      job.name.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query)
    );
  }

  openAddForm() {
    this.editingJob = null;
    this.editForm = {
      name: '',
      description: '',
      departmentId: null
    };
    this.isEditModalOpen = true;
  }

  editJob(job: Job) {
    this.editingJob = job;
    this.editForm = {
      name: job.name,
      description: job.description,
      departmentId: job.departmentId
    };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingJob = null;
    this.editForm = {};
    this.editError = null;
  }

  saveJob(event: Event) {
    event.preventDefault();
    if (this.editingJob) {
      // Update existing job - only send the name
      const updateData = {
        id: this.editingJob.id,
        name: this.editForm.name,
        description: this.editingJob.description,
        departmentId: this.editingJob.departmentId
      };
      
      this.apiService.updateJob(this.editingJob.id, updateData).subscribe({
        next: (updatedJob) => {
          // Update the jobs array with the new data
          const index = this.jobs.findIndex(j => j.id === updatedJob.id);
          if (index !== -1) {
            this.jobs[index] = updatedJob;
            this.jobs = [...this.jobs]; // Trigger change detection
          }
          this.closeEditModal();
          this.showUpdateToast = true;
          setTimeout(() => this.showUpdateToast = false, 2000);
        },
        error: (err: HttpErrorResponse) => {
          this.editError = 'Failed to update job: ' + (err.error?.message || err.message);
        }
      });
    } else {
      // Add new job - send all fields
      this.apiService.addJob(this.editForm).subscribe({
        next: (newJob) => {
          this.jobs = [...this.jobs, newJob];
          this.closeEditModal();
          this.showUpdateToast = true;
          setTimeout(() => this.showUpdateToast = false, 2000);
        },
        error: (err: HttpErrorResponse) => {
          this.editError = 'Failed to add job: ' + (err.error?.message || err.message);
        }
      });
    }
  }

  deleteJob(id: number) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.apiService.deleteJob(id).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(j => j.id !== id);
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Failed to delete job. Please try again later.';
          this.debugInfo = {
            status: err.status,
            statusText: err.statusText,
            error: err.error,
            message: err.message
          };
        }
      });
    }
  }
} 