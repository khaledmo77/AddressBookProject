import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, AddressBookEntry } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Address Book Entries</h1>
        <button 
          (click)="addEntry()"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Entry
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-4">
        <p class="text-gray-600">Loading entries...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p class="font-bold">Error</p>
        <p>{{ error }}</p>
        <div *ngIf="debugInfo" class="mt-2">
          <p class="font-bold">Debug Info:</p>
          <pre class="bg-gray-100 p-2 rounded text-xs">{{ debugInfo | json }}</pre>
        </div>
      </div>

      <!-- Data Table -->
      <div *ngIf="!loading && !error" class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let entry of entries">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div *ngIf="entry.photoUrl" class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" [src]="entry.photoUrl" [alt]="entry.fullName">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ entry.fullName }}</div>
                    <div class="text-sm text-gray-500">{{ entry.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ entry.jobTitle || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ entry.departmentName || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ entry.mobileNumber }}</div>
                <div class="text-sm text-gray-500">{{ entry.address }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ entry.age }} years</div>
                <div class="text-sm text-gray-500">{{ entry.dateOfBirth | date }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  (click)="editEntry(entry)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4">
                  Edit
                </button>
                <button 
                  (click)="deleteEntry(entry.id)"
                  class="text-red-600 hover:text-red-900">
                  Delete
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.loading = true;
    this.error = null;
    this.debugInfo = null;

    console.log('Loading entries...');
    this.apiService.getAddressBookEntries().subscribe({
      next: (entries: AddressBookEntry[]) => {
        console.log('Entries loaded:', entries);
        this.entries = entries;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading entries:', err);
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
    // TODO: Implement add entry functionality
    console.log('Add entry clicked');
  }

  editEntry(entry: AddressBookEntry): void {
    // TODO: Implement edit entry functionality
    console.log('Edit entry clicked:', entry);
  }

  deleteEntry(id: number): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.apiService.deleteAddressBookEntry(id).subscribe({
        next: () => {
          console.log('Entry deleted successfully');
          this.entries = this.entries.filter(entry => entry.id !== id);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting entry:', err);
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