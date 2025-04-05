import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AddguideComponent } from './pages/addguide/addguide.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GuideComponent } from '../frontend/pages/guide/guide.component';
import { AddUserComponent } from '../backend/pages/adduser/adduser.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { BackComponent } from './pages/back/back.component';
import { ListeguideComponent } from './pages/listeguide/listeguide.component';
import { AddactivityComponent } from './pages/addactivity/addactivity.component';
import { AddblogComponent } from './pages/addblog/addblog.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, children: [
    {path: 'back',component : BackComponent},
    {path: 'listeguide',component : ListeguideComponent},

    { path: 'addguide', component: AddguideComponent },
    { path: 'adduser', component: AddUserComponent },
    { path: 'blog', component: AddblogComponent },
    { path: 'user-list', component: UserListComponent }
    

  ]},
  { path: 'guide', component: GuideComponent }
];

@NgModule({
  declarations: [
    DashboardComponent,
    AddguideComponent,
    AddUserComponent,
    UserListComponent,
    BackComponent,
    ListeguideComponent,
    AddactivityComponent,
    AddblogComponent,
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    HttpClientModule
  ],
  exports: [RouterModule]
})
export class BackendModule { }