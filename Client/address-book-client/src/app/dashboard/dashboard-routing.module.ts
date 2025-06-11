import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { AddressListComponent } from '../components/address-list/address-list.component';
import { JobListComponent } from '../components/job-list/job-list.component';
import { DepartmentListComponent } from '../components/department-list/department-list.component';
import { AddressForm } from '../address-book/address-form/address-form';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'addresses',
        pathMatch: 'full'
      },
      {
        path: 'addresses',
        component: AddressListComponent
      },
      {
        path: 'addresses/add',
        component: AddressForm
      },
      {
        path: 'jobs',
        component: JobListComponent
      },
      {
        path: 'departments',
        component: DepartmentListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { } 