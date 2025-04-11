import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AddguideComponent } from './pages/addguide/addguide.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GuideComponent } from '../frontend/pages/guide/guide.component';
import { AddUserComponent } from '../backend/pages/adduser/adduser.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { BackComponent } from './pages/back/back.component';
import { ListeguideComponent } from './pages/listeguide/listeguide.component';
import { AddhebergementComponent } from './pages/addhebergement/addhebergement.component';
import { HebergementComponent } from './pages/hebergement/hebergement.component';
import { UpdateHebergementComponent } from './pages/update-hebergement/update-hebergement.component';
import { HebergementDetailsComponent } from './pages/hebergement-details/hebergement-details.component';
import { ReservationChambreComponent } from './pages/reservation-chambre/reservation-chambre.component';
import { AddReservationComponent } from './pages/add-reservation/add-reservation.component';
import { ToastrModule } from 'ngx-toastr';
import { ReservationEditComponent } from './pages/reservation-edit/reservation-edit.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, children: [
    {path: 'back',component : BackComponent},
    {path: 'listeguide',component : ListeguideComponent},

    { path: 'addguide', component: AddguideComponent },
    { path: 'adduser', component: AddUserComponent },
    { path: 'user-list', component: UserListComponent }

  ]},
  { path: 'guide', component: GuideComponent },
  { path: 'gethebback', component: HebergementComponent },
  { path: 'addhebergement', component: AddhebergementComponent },
  { path: 'updatehebergement/:id', component: UpdateHebergementComponent },
  { path: 'hebergement-details/:id', component: HebergementDetailsComponent },
  { path: 'reserver-chambre/:id', component: ReservationChambreComponent },
  { path: 'modifier-reservation/:id', component: ReservationEditComponent },
  { path: 'addreserver/:id', component: AddReservationComponent }


];

@NgModule({
  declarations: [
    DashboardComponent,
    AddguideComponent,
    AddUserComponent,
    UserListComponent,
    BackComponent,
    ListeguideComponent,
    AddhebergementComponent,
    HebergementComponent,
    UpdateHebergementComponent,
    HebergementDetailsComponent,
    ReservationChambreComponent,
    AddReservationComponent,
    ReservationEditComponent,
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule ,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', // ou 'toast-top-center', etc.
      timeOut: 3000
    }),
    

  ],
  exports: [RouterModule]
})
export class BackendModule { }