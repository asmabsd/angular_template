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
import { GastronomyComponent } from './pages/gastronomy/gastronomy.component';
import { MenusComponent } from './pages/menus/menus.component';
import { GastronomyStatsComponent } from './pages/statistics/gastronomy-stats/gastronomy-stats.component';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safeHtml.pipe';  // Chemin d'importation du pipe

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, children: [
    {path: 'back',component : BackComponent},
    {path: 'listeguide',component : ListeguideComponent},
    { path: 'menu', component: MenusComponent },

    { path: 'addguide', component: AddguideComponent },
    { path: 'adduser', component: AddUserComponent },
    { path: 'user-list', component: UserListComponent },
    { path: 'gastronomy', component: GastronomyComponent },
    { path: 'gastronomy-stats', component: GastronomyStatsComponent }  // Si tu veux ajouter un accès direct aux stats dans le backoffice

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
    GastronomyComponent,
   MenusComponent,
   GastronomyStatsComponent,  
   SafeHtmlPipe,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    HttpClientModule
  ],
  exports: [RouterModule]
})
export class BackendModule { }