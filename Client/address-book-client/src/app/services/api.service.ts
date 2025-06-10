import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';

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
  private baseUrl = 'https://localhost:7003/api';
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
    console.log('Making GET request to:', `${this.baseUrl}/AddressBookEntry/GetAllEntries`);
    return this.http.get<ApiResponse<AddressBookEntry[]>>(`${this.baseUrl}/AddressBookEntry/GetAllEntries`, this.httpOptions)
      .pipe(
        tap(response => console.log('API Response:', response)),
        map(response => response.data),
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  getAddressBookEntry(id: number): Observable<AddressBookEntry> {
    return this.http.get<ApiResponse<AddressBookEntry>>(`${this.baseUrl}/AddressBookEntry/GetEntry/${id}`, this.httpOptions)
      .pipe(
        tap(response => console.log('API Response:', response)),
        map(response => response.data),
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  addAddressBookEntry(entry: Omit<AddressBookEntry, 'id'>): Observable<AddressBookEntry> {
    return this.http.post<ApiResponse<AddressBookEntry>>(`${this.baseUrl}/AddressBookEntry/CreateEntry`, entry, this.httpOptions)
      .pipe(
        tap(response => console.log('API Response:', response)),
        map(response => response.data),
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  updateAddressBookEntry(id: number, entry: Partial<AddressBookEntry>): Observable<AddressBookEntry> {
    return this.http.put<ApiResponse<AddressBookEntry>>(`${this.baseUrl}/AddressBookEntry/UpdateEntry/${id}`, entry, this.httpOptions)
      .pipe(
        tap(response => console.log('API Response:', response)),
        map(response => response.data),
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  deleteAddressBookEntry(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/AddressBookEntry/DeleteEntry/${id}`, this.httpOptions)
      .pipe(
        tap(response => console.log('API Response:', response)),
        map(() => void 0),
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  getFormData() {
    return this.http.get<{ Jobs: any[]; Departments: any[] }>(`${this.baseUrl}/AddressBookEntry/formdata`, this.httpOptions)
    
  }
  
} 