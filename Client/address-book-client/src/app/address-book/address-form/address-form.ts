import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Job, Department } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.html',
  styleUrl: './address-form.scss',
  standalone: true,

  imports: [CommonModule, FormsModule] 
})
export class AddressForm implements OnInit {
  fullName = '';
  jobId: number | null = null;
  departmentId: number | null = null;
  mobileNumber = '';
  address = '';
  email = '';
  dateOfBirth = '';
  photoFile: File | null = null;
  photoPreview: string | null = null;
  jobs: Job[] = [];
  departments: Department[] = [];
  loading = false;
  error: string | null = null;
  success = false;
  password = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getFormData().subscribe({
      next: (data: any) => {
        this.jobs = data.jobs && Array.isArray(data.jobs.data) ? data.jobs.data : [];
        this.departments = data.departments && Array.isArray(data.departments.data) ? data.departments.data : [];
        console.log('Jobs:', this.jobs);
        console.log('Departments:', this.departments);
      },
      error: (err) => {
        this.error = 'Failed to load form data';
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result as string;
      reader.readAsDataURL(this.photoFile);
    } else {
      this.photoFile = null;
      this.photoPreview = null;
    }
  }

  onSubmit() {
    this.error = null;
    this.success = false;
    this.loading = true;

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append('fullName', this.fullName);
    formData.append('jobId', String(this.jobId));
    formData.append('departmentId', String(this.departmentId));
    formData.append('mobileNumber', this.mobileNumber);
    formData.append('address', this.address);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('dateOfBirth', this.dateOfBirth);
    if (this.photoFile) {
      formData.append('photo', this.photoFile);
    }

    // Use fetch for multipart/form-data (since ApiService expects JSON)
    fetch('https://localhost:7003/api/AddressBookEntry/AddEntry', {
      method: 'POST',
      body: formData
    })
      .then(async response => {
        this.loading = false;
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
        this.success = true;
        setTimeout(() => this.router.navigate(['/dashboard/addresses']), 1200);
      })
      .catch(err => {
        this.loading = false;
        this.error = 'Failed to add entry: ' + (err.message || err);
      });
  }
}
