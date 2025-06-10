import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Department } from '../../services/api.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="department-list">
      <h2>Departments</h2>
      <div class="actions">
        <button (click)="openAddForm()">Add New Department</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let department of departments">
            <td>{{department.name}}</td>
            <td>{{department.description}}</td>
            <td>
              <button (click)="editDepartment(department)">Edit</button>
              <button (click)="deleteDepartment(department.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .department-list {
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
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.apiService.getDepartments().subscribe(
      departments => this.departments = departments,
      error => console.error('Error loading departments:', error)
    );
  }

  openAddForm() {
    // TODO: Implement add form
  }

  editDepartment(department: Department) {
    // TODO: Implement edit form
  }

  deleteDepartment(id: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.apiService.deleteDepartment(id).subscribe(
        () => {
          this.departments = this.departments.filter(d => d.id !== id);
        },
        error => console.error('Error deleting department:', error)
      );
    }
  }
} 