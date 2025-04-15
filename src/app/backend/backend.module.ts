import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';

import { GuideComponent } from '../frontend/pages/guide/guide.component';
import { AddUserComponent } from './pages/adduser/adduser.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { BackComponent } from './pages/back/back.component';

import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { DetailsbackguideComponent } from './pages/detailsbackguide/detailsbackguide.component';
import { AddplanningComponent } from './pages/addplanning/addplanning.component';
import { AuthGuard } from '../auth.guard'; 
import { ListeguideComponent } from './pages/listeguide/listeguide.component';
import { AddguideComponent } from './pages/addguide/addguide.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


import { RouterModule, Routes } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ Both modules are already imported
import { AppComponent } from '../app.component';

import { AfficherplanningComponent } from './pages/afficherplanning/afficherplanning.component';   
import { EditguideComponent } from './pages/editguide/editguide.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    

    canActivate: [AuthGuard], 
    children: [
      {path: 'editguide/:id', component: EditguideComponent },
      {path: 'detailsbackguide/:id', component: DetailsbackguideComponent },
      {path: 'addplanning', component: AddplanningComponent },
      {path: 'afficherplanning', component: AddplanningComponent },
  
      {path: 'back',component : BackComponent},
      {path: 'listeguide',component : ListeguideComponent},
  
      { path: 'addguide', component: AddguideComponent },  // ✅ AddGuideComponent should be correctly declared
     
      { path: 'adduser', component: AddUserComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'edit-user/:id', component: EditUserComponent }
    ]
  },
  { path: 'guide', component: GuideComponent }
];

@NgModule({
  declarations: [
    EditguideComponent,
    DashboardComponent,
    AddUserComponent,
    UserListComponent,
    EditUserComponent,
    DetailsbackguideComponent,
    AddplanningComponent,
    EditUserComponent,
    AddguideComponent,   // ✅ Ensure AddGuideComponent is declared here
    ListeguideComponent,
    BackComponent,
  ],
  imports: [
    FullCalendarModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),  // ✅ Correct usage of RouterModule
    ReactiveFormsModule,  // ✅ Ensure ReactiveFormsModule is added here
    HttpClientModule,
    NgxChartsModule // ✅ Ajout ici

    
  ],
  exports: [RouterModule]
})
export class BackendModule {}
