import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login";
import { RegisterComponent } from "./auth/register/register";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AddressListComponent } from "./components/address-list/address-list.component";
import { JobListComponent } from "./components/job-list/job-list.component";
import { DepartmentListComponent } from "./components/department-list/department-list.component";
import { AuthGuard } from "./guards/auth.guard";
import { AddressForm } from './address-book/address-form/address-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // optional
    children: [
      { path: 'addresses', component: AddressListComponent },
      { path: 'addresses/add', component: AddressForm },
      { path: 'jobs', component: JobListComponent },
      { path: 'departments', component: DepartmentListComponent },
    ]
  },
];
