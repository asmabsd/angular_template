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
import { EditguideComponent } from './pages/editguide/editguide.component';
import { AppComponent } from '../app.component';
import { MapsComponent } from './pages/maps/maps.component';
import { RegisterComponent } from './pages/register/register.component';
import { TablesComponent } from './pages/tables/tables.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { IconsComponent } from './pages/icons/icons.component';
import { LoginComponent } from './pages/login/login.component';
import { DetailsbackguideComponent } from './pages/detailsbackguide/detailsbackguide.component';
import { StoreListComponent } from './pages/GestionSouvenir/store-list/store-list.component';
import { AddStoreComponent } from './pages/GestionSouvenir/add-store/add-store.component';
import { EditStoreComponent } from './pages/GestionSouvenir/edit-store/edit-store.component';
import { ViewStoreComponent } from './pages/GestionSouvenir/view-store/view-store.component';
import { AddSouvenirComponent } from './pages/GestionSouvenir/add-souvenir/add-souvenir.component';
import { SouvenirListComponent } from './pages/GestionSouvenir/souvenir-list/souvenir-list.component';
import { EditSouvenirComponent } from './pages/GestionSouvenir/edit-souvenir/edit-souvenir.component';
import { ViewSouvenirComponent } from './pages/GestionSouvenir/view-souvenir/view-souvenir.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'editguide/:id', component: EditguideComponent },
      { path: 'detailsbackguide/:id', component: DetailsbackguideComponent },
      { path: 'back', component: BackComponent },
      { path: 'listeguide', component: ListeguideComponent },
      { path: 'addguide', component: AddguideComponent },
      { path: 'adduser', component: AddUserComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'storeList', component: StoreListComponent },
      { path: 'addStore', component: AddStoreComponent },
      { path: 'editStore/:id', component: EditStoreComponent },
      { path: 'viewStore/:id', component: ViewStoreComponent },
      { path: 'viewSouvenir/:id', component: ViewSouvenirComponent },
      { path: 'souvenirList', component: SouvenirListComponent },
      { path: 'addSouvenir', component: AddSouvenirComponent },
      { path: 'editSouvenir/:id', component: EditSouvenirComponent },
    ],
  },
  { path: 'guide', component: GuideComponent },
];

@NgModule({
  declarations: [
    EditguideComponent,
    DashboardComponent,
    AddguideComponent,
    AddUserComponent,
    UserListComponent,
    BackComponent,
    ListeguideComponent,
    MapsComponent,
    RegisterComponent,
    TablesComponent,
    UserProfileComponent,
    IconsComponent,
    LoginComponent,
    DetailsbackguideComponent,
    StoreListComponent,
    EditStoreComponent,
    AddStoreComponent,
    ViewStoreComponent,
    AddSouvenirComponent,
    SouvenirListComponent,
    EditSouvenirComponent,
    ViewSouvenirComponent,
  ],

  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    HttpClientModule,
  ],
  exports: [RouterModule],
})
export class BackendModule {}
