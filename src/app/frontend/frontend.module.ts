import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { OffersComponent } from './pages/offers/offers.component';
import { NewsComponent } from './pages/news/news.component';
import { ContactComponent } from './pages/contact/contact.component';
import { GuideComponent } from './pages/guide/guide.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../auth.guard';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'src/app/interceptors/jwt.interceptor';
import { ReservationGuideComponent } from './pages/reservationguide/reservationguide.component';
import { ListGReservationComponent } from './pages/list-greservation/list-greservation.component';
import { EditreservationComponent } from './pages/editreservation/editreservation.component';
import { DetailsreservationComponent } from './pages/detailsreservation/detailsreservation.component';
import { DetailsguideComponent } from './pages/detailsguide/detailsguide.component';
import { StoreListComponent } from './pages/GestionSouvenir/store-list/store-list.component';
import { SharedModule } from '../shared/shared.module';
import { SouvenirsByStoreComponent } from './pages/GestionSouvenir/souvenirs-by-store/souvenirs-by-store.component';
import { AddStoreComponent } from './pages/GestionSouvenir/add-store/add-store.component';
import { StoreListOfPartnerComponent } from './pages/GestionSouvenir/store-list-of-partner/store-list-of-partner.component';
import { EditStoreComponent } from './pages/GestionSouvenir/edit-store/edit-store.component';
import { SouvenirListOfPartnerByStoreComponent } from './pages/GestionSouvenir/souvenir-list-of-partner-by-store/souvenir-list-of-partner-by-store.component';
import { EditSouvenirComponent } from './pages/GestionSouvenir/edit-souvenir/edit-souvenir.component';
import { AddSouvenirComponent } from './pages/GestionSouvenir/add-souvenir/add-souvenir.component';
import { PanelCartComponent } from './pages/GestionSouvenir/panel-cart/panel-cart.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent, // Layout parent
    children: [
      { path: 'guide', component: GuideComponent },
      { path: 'guidedetails/:id', component: DetailsguideComponent },

      { path: 'resguide', component: ReservationGuideComponent },
      {
        path: 'reservationguidedetails/:id',
        component: DetailsreservationComponent,
      },

      { path: 'listereservationsguide', component: ListGReservationComponent },
      { path: 'editreservation/:id', component: EditreservationComponent },
      // { path: 'storeList', component: StoreListComponent },
      { path: 'souvenir/store/:id', component: SouvenirsByStoreComponent },
      { path:"addStore", component: AddStoreComponent },
      { path:"addSouvenir/:id", component: AddSouvenirComponent },
      { path:"editStore/:id", component: EditStoreComponent },
      { path:"editSouvenir/:id", component: EditSouvenirComponent },
      { path:"storeListOfPartner", component: StoreListOfPartnerComponent  },
      { path:"souvenirListOfPartnerByStore/:id", component: SouvenirListOfPartnerByStoreComponent},
      { path:"panelCart", component: PanelCartComponent},
      // { path: 'storeList', component : StoreListComponent },
    ],
  },
  { path: 'about', component: AboutComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'news', component: NewsComponent },
  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'contact', component: ContactComponent },

  // À propos
];

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    OffersComponent,
    NewsComponent,
    ContactComponent,
    GuideComponent,
    LoginComponent,
    RegisterComponent,
    ReservationGuideComponent,
    ListGReservationComponent,
    EditreservationComponent,
    DetailsreservationComponent,
    DetailsguideComponent,
    StoreListComponent,
    SouvenirsByStoreComponent,
    AddStoreComponent,
    StoreListOfPartnerComponent,
    EditStoreComponent,
    SouvenirListOfPartnerByStoreComponent,
    EditSouvenirComponent,
    AddSouvenirComponent,
    PanelCartComponent,
  ],

  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    ReactiveFormsModule,
    // Enregistrer les routes pour le frontend
  ],
  /*  providers: [ {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }],*/
})
export class FrontendModule {}
