import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService, AddressBookEntry } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="bi bi-book"></i> Address Book
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link active" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">About</a>
            </li>
          </ul>
          <form class="d-flex" (ngSubmit)="onSearch()">
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
        <h1 class="h2">Address Book Entries</h1>
        <div class="d-flex gap-2">
          <button (click)="exportToExcel()" class="btn btn-success">
            <i class="bi bi-file-excel"></i> Export to Excel
          </button>
          <button (click)="addEntry()" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Add New Entry
          </button>
        </div>
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
              <th>Job</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let entry of entries">
              <td>{{ entry.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <img *ngIf="entry.photoPath" 
                       [src]="getPhotoUrl(entry.photoPath)" 
                       [alt]="entry.fullName"
                       class="rounded-circle me-2" 
                       style="width: 40px; height: 40px; object-fit: cover;"
                       (error)="handleImageError($event)"
                       onerror="this.onerror=null; this.src='assets/default-avatar.png';">
                  <div>
                    <div class="fw-bold">{{ entry.fullName }}</div>
                    <div class="text-muted small">{{ entry.email }}</div>
                  </div>
                </div>
              </td>
              <td>{{ getName(entry.job) }}</td>
              <td>{{ getName(entry.department) }}</td>
              <td>
                <div>{{ entry.mobileNumber }}</div>
                <div class="text-muted small">{{ entry.address }}</div>
              </td>
              <td>
                <div>{{ entry.age }} years</div>
                <div class="text-muted small">{{ entry.dateOfBirth | date }}</div>
              </td>
              <td>
                <button (click)="editEntry(entry)" class="btn btn-sm btn-outline-primary me-2">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button (click)="deleteEntry(entry.id)" class="btn btn-sm btn-outline-danger">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      id="editModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
      [ngClass]="{'show': isEditModalOpen}"
      [ngStyle]="{'display': isEditModalOpen ? 'block' : 'none', 'background': isEditModalOpen ? 'rgba(0,0,0,0.5)' : ''}"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Edit Entry</h5>
            <button type="button" class="btn-close" (click)="closeEditModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-3">
              <img *ngIf="editForm.photoPath" [src]="getPhotoUrl(editForm.photoPath)" alt="Current Photo" class="img-thumbnail" style="max-width: 120px; max-height: 120px;" />
            </div>
            <form (ngSubmit)="saveEdit()">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="fullName" class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="fullName" name="fullName" [(ngModel)]="editForm.fullName" required>
                </div>
                <div class="col-md-6">
                  <label for="job" class="form-label">Job</label>
                  <select class="form-select" id="job" name="jobId" [(ngModel)]="editForm.jobId" required>
                    <option *ngFor="let job of jobs" [value]="job.id">{{ job.name }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="department" class="form-label">Department</label>
                  <select class="form-select" id="department" name="departmentId" [(ngModel)]="editForm.departmentId" required>
                    <option *ngFor="let department of departments" [value]="department.id">{{ department.name }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="mobileNumber" class="form-label">Mobile Number</label>
                  <input type="text" class="form-control" id="mobileNumber" name="mobileNumber" [(ngModel)]="editForm.mobileNumber" required>
                </div>
                <div class="col-md-6">
                  <label for="address" class="form-label">Address</label>
                  <input type="text" class="form-control" id="address" name="address" [(ngModel)]="editForm.address" required>
                </div>
                <div class="col-md-6">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" name="email" [(ngModel)]="editForm.email" required>
                </div>
                <div class="col-md-6">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" name="password" [(ngModel)]="editForm.password">
                </div>
                <div class="col-md-12">
                  <label for="photoFile" class="form-label">Photo</label>
                  <input type="file" class="form-control" id="photoFile" name="photoFile" (change)="onEditFileChange($event)">
                </div>
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

    <div *ngIf="showUpdateToast" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100;">
      <div class="toast show align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <strong>Updated</strong>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="showUpdateToast = false" aria-label="Close"></button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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
    `
  ]
})
export class AddressListComponent implements OnInit {
  entries: AddressBookEntry[] = [];
  loading = false;
  error: string | null = null;
  debugInfo: any = null;
  searchQuery: string = '';
  private baseUrl = 'https://localhost:7003';
  private failedImages = new Set<string>();

  // Modal state for editing
  editingEntry: AddressBookEntry | null = null;
  editForm: any = {};
  editLoading = false;
  editError: string | null = null;

  jobs: any[] = [];
  departments: any[] = [];

  // Add a property to track modal open state for blur effect
  isEditModalOpen = false;

  // Add a property for showing the update toast
  showUpdateToast = false;

  constructor(private apiService: ApiService, private router: Router) {}

  getName(obj: any): string {
    return obj?.name || 'N/A';
  }

  handleImageError(event: any): void {
    const img = event.target as HTMLImageElement;
    const currentSrc = img.src;
    
    // If this image has already failed once, don't try again
    if (this.failedImages.has(currentSrc)) {
      return;
    }
    
    // Mark this image as failed
    this.failedImages.add(currentSrc);
    console.log('Image failed to load:', currentSrc);
  }

  getPhotoUrl(photoPath: string | null): string {
    if (!photoPath) return '';
    // Remove all leading slashes (forward and backward) and prepend backend URL
    return `${this.baseUrl}/${photoPath.replace(/^[/\\]+/, '')}`;
  }
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.loadEntries();
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.entries = this.entries.filter(entry => 
      entry.fullName.toLowerCase().includes(query) ||
      entry.email.toLowerCase().includes(query) ||
      this.getName(entry.job).toLowerCase().includes(query) ||
      this.getName(entry.department).toLowerCase().includes(query) ||
      entry.mobileNumber.includes(query)
    );
  }

  ngOnInit(): void {
    this.apiService.getFormData().subscribe({
      next: (data: any) => {
        this.jobs = data.jobs?.data || [];
        this.departments = data.departments?.data || [];
      },
      error: () => {
        // fallback: just load entries
      }
    });
    this.loadEntries();
  }

  loadEntries(): void {
    this.loading = true;
    this.error = null;
    this.debugInfo = null;

    this.apiService.getAddressBookEntries().subscribe({
      next: (entries: AddressBookEntry[]) => {
        this.entries = entries;
        console.log('Loaded entries:', entries);
        if (entries.length > 0) {
          console.log('First entry photo path:', entries[0]?.photoPath);
          console.log('First entry photo URL:', this.getPhotoUrl(entries[0]?.photoPath));
        }
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = 'Failed to load entries. Please try again later.';
        this.debugInfo = {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        };
      }
    });
  }

  addEntry(): void {
    this.router.navigate(['/dashboard/addresses/add']);
  }

  editEntry(entry: AddressBookEntry): void {
    this.editingEntry = entry;
    this.editError = null;
    this.isEditModalOpen = true;
    // Deep copy to avoid mutating the table directly
    this.editForm = {
      ...entry,
      jobId: (entry.job as any)?.id || '',
      departmentId: (entry.department as any)?.id || ''
    };
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingEntry = null;
    this.editForm = {};
    this.editError = null;
  }

  saveEdit(): void {
    if (!this.editingEntry) return;
    this.editLoading = true;
    this.editError = null;
    const formData = new FormData();
    formData.append('fullName', this.editForm.fullName);
    formData.append('JobId', String(this.editForm.jobId));
    formData.append('DepartmentId', String(this.editForm.departmentId));
    formData.append('mobileNumber', this.editForm.mobileNumber);
    formData.append('address', this.editForm.address);
    formData.append('email', this.editForm.email);
    formData.append('password', this.editForm.password || '');
    formData.append('dateOfBirth', this.editForm.dateOfBirth || '');
    // Only append Photo if a new file is selected
    if (this.editForm.photoFile) {
      formData.append('Photo', this.editForm.photoFile);
    }
    this.sendUpdateRequest(formData);
  }

  sendUpdateRequest(formData: FormData) {
    if (!this.editingEntry) return;
    fetch(`https://localhost:7003/api/AddressBookEntry/UpdateEntry/${this.editingEntry.id}`, {
      method: 'PUT',
      body: formData
    })
      .then(async response => {
        this.editLoading = false;
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
        this.loadEntries();
        this.closeEditModal();
        this.showUpdateToast = true;
        setTimeout(() => this.showUpdateToast = false, 2000);
      })
      .catch(err => {
        this.editLoading = false;
        this.editError = 'Failed to update entry: ' + (err.message || err);
      });
  }

  onEditFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.editForm.photoFile = input.files[0];
    } else {
      this.editForm.photoFile = null;
    }
  }

  deleteEntry(id: number): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.apiService.deleteAddressBookEntry(id).subscribe({
        next: () => {
          this.entries = this.entries.filter(entry => entry.id !== id);
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Failed to delete entry. Please try again later.';
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

  exportToExcel(): void {
    this.apiService.exportToExcel().subscribe({
      next: (blob: Blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'AddressBookEntries.xlsx';
        // Append to the document
        document.body.appendChild(link);
        // Trigger the download
        link.click();
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to export to Excel. Please try again later.';
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