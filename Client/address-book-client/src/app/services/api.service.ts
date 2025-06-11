import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces
export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Job {
  id: number;
  name: string;
  description: string;
  departmentId: number;
}

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface AddressBookEntry {
  id: number;
  fullName: string;
  job: object;
  department: object;
  mobileNumber: string;
  address: string;
  email: string;
  password: string;
  photo: string | null;
  photoPath: string | null;
  dateOfBirth: string;
  birthDateFrom: string;
  birthDateTo: string;
  ageFrom: number;
  ageTo: number;
  age: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Address endpoints
  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrl}/addresses`);
  }

  getAddress(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.baseUrl}/addresses/${id}`);
  }

  addAddress(address: Omit<Address, 'id'>): Observable<Address> {
    return this.http.post<Address>(`${this.baseUrl}/addresses`, address);
  }

  updateAddress(id: number, address: Partial<Address>): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}/addresses/${id}`, address);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/addresses/${id}`);
  }

  // Job endpoints
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.baseUrl}/jobs`);
  }

  getJob(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/jobs/${id}`);
  }

  addJob(job: Omit<Job, 'id'>): Observable<Job> {
    return this.http.post<Job>(`${this.baseUrl}/jobs`, job);
  }

  updateJob(id: number, job: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.baseUrl}/jobs/${id}`, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/jobs/${id}`);
  }

  // Department endpoints
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/departments`);
  }

  getDepartment(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/departments/${id}`);
  }

  addDepartment(department: Omit<Department, 'id'>): Observable<Department> {
    return this.http.post<Department>(`${this.baseUrl}/departments`, department);
  }

  updateDepartment(id: number, department: Partial<Department>): Observable<Department> {
    return this.http.put<Department>(`${this.baseUrl}/departments/${id}`, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/departments/${id}`);
  }

  // Address Book Entry endpoints
  getAddressBookEntries(): Observable<AddressBookEntry[]> {
    return this.http.get<ApiResponse<AddressBookEntry[]>>(`${this.baseUrl}/api/AddressBookEntry/GetAllEntries`, this.httpOptions)
      .pipe(
        map(response => response.data)
      );
  }

  getAddressBookEntry(id: number): Observable<AddressBookEntry> {
    return this.http.get<ApiResponse<AddressBookEntry>>(`${this.baseUrl}/api/AddressBookEntry/GetEntryById/${id}`, this.httpOptions)
      .pipe(
        map(response => response.data)
      );
  }

  addAddressBookEntry(entry: Omit<AddressBookEntry, 'id'>): Observable<AddressBookEntry> {
    return this.http.post<ApiResponse<AddressBookEntry>>(`${this.baseUrl}/api/AddressBookEntry/AddEntry`, entry, this.httpOptions)
      .pipe(
        map(response => response.data)
      );
  }

  updateAddressBookEntry(id: number, entry: Partial<AddressBookEntry>): Observable<AddressBookEntry> {
    return this.http.put<ApiResponse<AddressBookEntry>>(`${this.baseUrl}/api/AddressBookEntry/UpdateEntry/${id}`, entry, this.httpOptions)
      .pipe(
        map(response => response.data)
      );
  }

  deleteAddressBookEntry(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/api/AddressBookEntry/DeleteEntry/${id}`, this.httpOptions)
      .pipe(
        map(() => void 0)
      );
  }

  getFormData() {
    return this.http.get<{ Jobs: any[]; Departments: any[] }>(`${this.baseUrl}/api/AddressBookEntry/formdata`, this.httpOptions)
  }
  
  registerAdmin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Admin/register`, credentials);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Admin/login`, credentials, { responseType: 'text' })
      .pipe(
        map(response => ({ token: response }))
      );
  }

  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/AddressBookEntry/ExportToExcel`, {
      responseType: 'blob'
    });
  }
} 