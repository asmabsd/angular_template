import { RecaptchaModule } from 'ng-recaptcha';
import { GastronomiesComponent } from './pages/gastronomies/gastronomies.component';
import { MenusPlatsComponent } from './pages/menus-plats/menus-plats.component';
import { DashboardPartnerComponent } from '../backend/pages/dashboard-partner/dashboard-partner.component';
import { SetupFaComponent } from './pages/setup-fa/setup-fa.component';
import { GethebergementComponent } from './pages/gethebergement/gethebergement.component';
import { ModifierReservationComponent } from './pages/modifier-reservation/modifier-reservation.component';
import { ReservationChambreListComponent } from './pages/reservation-chambre-list/reservation-chambre-list.component';
import { ReservationchambreComponent } from './pages/reservationchambre/reservationchambre.component';
import { ToastrModule } from 'ngx-toastr';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { MyReservationsComponent } from './pages/my-reservations/my-reservations.component';
import { ReservationFormComponent } from './pages/reservation-form/reservation-form.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { AboutComponent } from './pages/about/about.component';
import { OffersComponent } from './pages/offers/offers.component';
import { NewsComponent } from './pages/news/news.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'src/app/interceptors/jwt.interceptor';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { BlogComponent } from './pages/blog/blog.component';
import { AfficherplanningComponent } from './pages/afficherplanning/afficherplanning.component';
import { ReservationGuideComponent } from './pages/reservationguide/reservationguide.component';
import { DetailsreservationComponent } from './pages/detailsreservation/detailsreservation.component';
import { GuideComponent } from './pages/guide/guide.component';
import { ListGReservationComponent } from './pages/list-greservation/list-greservation.component';
import { EditreservationComponent } from './pages/editreservation/editreservation.component';
import { ListereservationsComponent } from './pages/accessGuide/listereservations/listereservations.component';
import { DetailsguideComponent } from './pages/detailsguide/detailsguide.component';
import { RatingguideComponent } from './pages/ratingguide/ratingguide.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { StoreListComponent } from './pages/GestionSouvenir/store-list/store-list.component';
import { SouvenirsByStoreComponent } from './pages/GestionSouvenir/souvenirs-by-store/souvenirs-by-store.component';
import { StoreListOfPartnerComponent } from './pages/GestionSouvenir/store-list-of-partner/store-list-of-partner.component';
import { EditStoreComponent } from './pages/GestionSouvenir/edit-store/edit-store.component';
import { SouvenirListOfPartnerByStoreComponent } from './pages/GestionSouvenir/souvenir-list-of-partner-by-store/souvenir-list-of-partner-by-store.component';
import { EditSouvenirComponent } from './pages/GestionSouvenir/edit-souvenir/edit-souvenir.component';
import { AddSouvenirComponent } from './pages/GestionSouvenir/add-souvenir/add-souvenir.component';
import { PanelCartComponent } from './pages/GestionSouvenir/panel-cart/panel-cart.component';
import { ViewCartComponent } from './pages/GestionSouvenir/view-cart/view-cart.component';
import { PaymentSuccessComponent } from './pages/GestionSouvenir/payment-success/payment-success.component';
import { PaymentConfirmationComponent } from './pages/GestionSouvenir/payment-confirmation/payment-confirmation.component';
import { StoreSalesComponent } from './pages/GestionSouvenir/store-sales/store-sales.component';
import { NgChartsModule } from 'ng2-charts';
import { AddStorePartnerComponent } from './pages/GestionSouvenir/add-store-partner/add-store-partner.component';
import { AddSouvenirPartnerComponent } from './pages/GestionSouvenir/add-souvenir-partner/add-souvenir-partner.component';
import { EditSouvenirPartnerComponent } from './pages/GestionSouvenir/edit-souvenir-partner/edit-souvenir-partner.component';
import { EditStorePartnerComponent } from './pages/GestionSouvenir/edit-store-partner/edit-store-partner.component';

/*asma
const routes: Routes = [
  
  
  {
    path: '', component: HomeComponent, 
    //path: 'guide/:email', component: GuideComponent,
   // Layout parent
    children: [
    //  { path: '', component: HomeComponent },
      { path: 'guide/:email', component: GuideComponent },
      {path: 'guidedetails/:id', component: DetailsguideComponent ,children: [      {path: 'afficherplanning', component: AfficherplanningComponent },
      ]},
      { path: 'guide', component: GuideComponent },
      { path: 'rateguide/:guideId/:reservationDate/:status', component: RatingguideComponent },
      { path: 'listereservationsguide/byuser/:email', component: ListGReservationComponent },


      { path: 'resguide', component:ReservationGuideComponent },
      {path: 'reservationsbyguide', component: ListereservationsComponent ,children: [      {path: 'afficherplanning', component: AfficherplanningComponent },
      ]},
      { path: 'reservationguidedetails/:id', component:DetailsreservationComponent },

      { path: 'listereservationsguide', component:ListGReservationComponent},
      { path: 'editreservation/:id', component:EditreservationComponent },
      { path: 'reservationsbyguide/:guideId', component: ListereservationsComponent},
      {
        path: 'afficherplanning/:guideId',
        component: AfficherplanningComponent
      }
    ]
  },
*/

const routes: Routes = [
  {
    path: '',
    component: HomeComponent, // Layout parent
    children: [
      { path: 'guide', component: GuideComponent },
      {
        path: 'guidedetails/:id',
        component: GuideComponent,
        children: [
          { path: 'afficherplanning', component: AfficherplanningComponent },
        ],
      },
      { path: 'gastronomies', component: GastronomiesComponent },
      { path: 'menus-plats/:gastronomyId', component: MenusPlatsComponent },

      { path: 'resguide', component: ReservationGuideComponent },
      {
        path: 'reservationguidedetails/:id',
        component: DetailsreservationComponent,
      },

      { path: 'blog/:userId', component: BlogComponent },
      { path: 'chat', component: HomeComponent },
      { path: 'verify-otp', component: VerifyOtpComponent },
      { path: 'activities', component: ActivitiesComponent },
      { path: 'reservation/:id', component: ReservationFormComponent },

      { path: '', component: HomeComponent },
      { path: 'guide/:email', component: GuideComponent },
      {
        path: 'guidedetails/:id',
        component: DetailsguideComponent,
        children: [
          { path: 'afficherplanning', component: AfficherplanningComponent },
        ],
      },
      { path: 'guide', component: GuideComponent },
      {
        path: 'rateguide/:guideId/:reservationDate/:status',
        component: RatingguideComponent,
      },
      {
        path: 'listereservationsguide/byuser/:email',
        component: ListGReservationComponent,
      },

      { path: 'resguide', component: ReservationGuideComponent },
      {
        path: 'reservationsbyguide',
        component: ListereservationsComponent,
        children: [
          { path: 'afficherplanning', component: AfficherplanningComponent },
        ],
      },
      {
        path: 'reservationguidedetails/:id',
        component: DetailsreservationComponent,
      },

      { path: 'listereservationsguide', component: ListGReservationComponent },
      { path: 'editreservation/:id', component: EditreservationComponent },
      {
        path: 'reservationsbyguide/:guideId',
        component: ListereservationsComponent,
      },
      {
        path: 'afficherplanning/:guideId',
        component: AfficherplanningComponent,
      },

      { path: 'my-reservations', component: MyReservationsComponent },

      { path: 'listereservationsguide', component: ListGReservationComponent },
      { path: 'editreservation/:id', component: EditreservationComponent },
      { path: 'reservationsbyguide', component: ListereservationsComponent },
      { path: 'hebergement', component: GethebergementComponent },
      {
        path: 'reservationchambre/:id_hebergement',
        component: ReservationchambreComponent,
      },
      { path: 'listreservations', component: ReservationChambreListComponent },
      {
        path: 'modifier-reservation/:id',
        component: ModifierReservationComponent, // remplace par le vrai nom du composant
      },
      // { path: 'storeList', component: StoreListComponent },
      { path: 'souvenir/store/:id', component: SouvenirsByStoreComponent },
      { path: 'panelCart', component: PanelCartComponent },
      { path: 'viewCart', component: ViewCartComponent },
      { path: 'store-sales/:id', component: StoreSalesComponent },
      {
        path: 'payment-success/:commandId',
        component: PaymentSuccessComponent,
      },
      {
        path: 'payment/:commandId',
        component: PaymentConfirmationComponent,
      },
    ],
  },
  { path: 'gastronomies', component: GastronomiesComponent },

  { path: 'about', component: AboutComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'news', component: NewsComponent },
  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'contact', component: ContactComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile/:userId', component: ProfileComponent },

  // À propos
];

@NgModule({
  declarations: [
    RatingguideComponent,
    EditreservationComponent,
    ListGReservationComponent,
    GuideComponent,
    HomeComponent,
    DetailsguideComponent,
    ListereservationsComponent,
    ListGReservationComponent,
    DetailsreservationComponent,
    EditreservationComponent,
    AfficherplanningComponent,
    EditreservationComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    HomeComponent,
    AboutComponent,
    OffersComponent,
    NewsComponent,
    ContactComponent,
    GuideComponent,
    LoginComponent,
    BlogComponent,
    DetailsreservationComponent,
    ReservationGuideComponent,
    AfficherplanningComponent,
    RatingguideComponent,

    ListereservationsComponent,
    ListGReservationComponent,
    DetailsreservationComponent,
    EditreservationComponent,
    AfficherplanningComponent,
    EditreservationComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    HomeComponent,
    AboutComponent,
    OffersComponent,
    NewsComponent,
    ContactComponent,
    GuideComponent,
    LoginComponent,
    BlogComponent,
    DetailsreservationComponent,
    BlogComponent,
    ReservationGuideComponent,
    BlogComponent,
    AfficherplanningComponent,
    BlogComponent,
    GastronomiesComponent,
    MenusPlatsComponent,
    SetupFaComponent,
    GethebergementComponent,
    ModifierReservationComponent,
    ReservationChambreListComponent,
    ReservationchambreComponent,
    VerifyOtpComponent,
    ActivitiesComponent,
    MyReservationsComponent,
    ReservationFormComponent,
    ProfileComponent,
    // GestionSouvenir
    StoreListComponent,
    SouvenirsByStoreComponent,
    AddStorePartnerComponent,
    StoreListOfPartnerComponent,
    EditStoreComponent,
    SouvenirListOfPartnerByStoreComponent,
    EditSouvenirComponent,
    AddSouvenirComponent,
    PanelCartComponent,
    ViewCartComponent,
    PaymentSuccessComponent,
    PaymentConfirmationComponent,
    StoreSalesComponent,
    AddStorePartnerComponent,
    AddSouvenirPartnerComponent,
    EditSouvenirPartnerComponent,
    EditStorePartnerComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    ReactiveFormsModule,
    RecaptchaModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-left', // ou 'toast-top-center', etc.
      timeOut: 3000,
    }),
    SharedModule,
    NgChartsModule,
    // Enregistrer les routes pour le frontend
  ],
  /*  providers: [ {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }],*/
})
export class FrontendModule {}
