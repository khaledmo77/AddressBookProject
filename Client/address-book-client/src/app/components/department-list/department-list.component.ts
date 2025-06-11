import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Department } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" href="#" (click)="$event.preventDefault()">
          <i class="bi bi-building"></i> Departments
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
        <h1 class="h2">Department List</h1>
        <button (click)="openAddForm()" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Add New Department
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let department of departments; trackBy: trackByDepartmentId">
              <tr>
                <td>{{ department.id }}</td>
                <td>{{ department.name }}</td>
                <td>{{ department.description }}</td>
                <td>
                  <button (click)="editDepartment(department)" class="btn btn-sm btn-outline-primary me-2">
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button (click)="deleteDepartment(department.id)" class="btn btn-sm btn-outline-danger">
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
            <h5 class="modal-title" id="editModalLabel">{{ editingDepartment ? 'Edit' : 'Add' }} Department</h5>
            <button type="button" class="btn-close" (click)="closeEditModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveDepartment($event)">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" name="name" [(ngModel)]="editForm.name" required>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" name="description" [(ngModel)]="editForm.description" rows="3"></textarea>
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
            <strong>Success!</strong> Department has been {{ editingDepartment ? 'updated' : 'added' }}.
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
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  loading = false;
  error: string | null = null;
  debugInfo: any = null;
  searchQuery: string = '';

  // Modal state
  isEditModalOpen = false;
  editingDepartment: Department | null = null;
  editForm: any = {};
  editError: string | null = null;
  showUpdateToast = false;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDepartments();
  }

  trackByDepartmentId(index: number, department: Department): number {
    return department.id;
  }

  loadDepartments() {
    this.loading = true;
    this.error = null;
    this.debugInfo = null;

    this.apiService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = 'Failed to load departments. Please try again later.';
        this.debugInfo = {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        };
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(event: Event) {
    event.preventDefault();
    if (!this.searchQuery.trim()) {
      this.loadDepartments();
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.departments = this.departments.filter(department => 
      department.name.toLowerCase().includes(query) ||
      department.description.toLowerCase().includes(query)
    );
    this.cdr.detectChanges();
  }

  openAddForm() {
    this.editingDepartment = null;
    this.editForm = {
      name: '',
      description: ''
    };
    this.isEditModalOpen = true;
  }

  editDepartment(department: Department) {
    this.editingDepartment = department;
    this.editForm = {
      name: department.name,
      description: department.description
    };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingDepartment = null;
    this.editForm = {};
    this.editError = null;
  }

  saveDepartment(event: Event) {
    event.preventDefault();
    if (this.editingDepartment) {
      // Update existing department
      this.apiService.updateDepartment(this.editingDepartment.id, this.editForm).subscribe({
        next: (updatedDepartment) => {
          // Force reload the departments to ensure table updates
          this.loadDepartments();
          this.closeEditModal();
          this.showUpdateToast = true;
          setTimeout(() => this.showUpdateToast = false, 2000);
        },
        error: (err: HttpErrorResponse) => {
          this.editError = 'Failed to update department: ' + (err.error?.message || err.message);
        }
      });
    } else {
      // Add new department
      this.apiService.addDepartment(this.editForm).subscribe({
        next: (newDepartment) => {
          this.departments = [...this.departments, newDepartment];
          this.closeEditModal();
          this.showUpdateToast = true;
          setTimeout(() => this.showUpdateToast = false, 2000);
        },
        error: (err: HttpErrorResponse) => {
          this.editError = 'Failed to add department: ' + (err.error?.message || err.message);
        }
      });
    }
  }

  deleteDepartment(id: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.apiService.deleteDepartment(id).subscribe({
        next: () => {
          this.departments = this.departments.filter(d => d.id !== id);
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Failed to delete department. Please try again later.';
          this.debugInfo = {
            status: err.status,
            statusText: err.statusText,
            error: err.error,
            message: err.message
          };
          this.cdr.detectChanges();
        }
      });
    }
  }
} 