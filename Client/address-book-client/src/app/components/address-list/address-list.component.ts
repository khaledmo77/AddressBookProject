import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
        <button (click)="addEntry()" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Add New Entry
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
  `,
  styles: []
})
export class AddressListComponent implements OnInit {
  entries: AddressBookEntry[] = [];
  loading = false;
  error: string | null = null;
  debugInfo: any = null;
  searchQuery: string = '';
  private baseUrl = 'https://localhost:7003';
  private failedImages = new Set<string>();

  constructor(private apiService: ApiService) {}

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
    console.log('Add entry clicked');
  }

  editEntry(entry: AddressBookEntry): void {
    console.log('Edit entry clicked:', entry);
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
}