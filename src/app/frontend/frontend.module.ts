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
    path: '', component: HomeComponent, // Layout parent
    children: [
      
      { path: 'guide', component: GuideComponent },
      {path: 'guidedetails/:id', component: GuideComponent ,children: [      {path: 'afficherplanning', component: AfficherplanningComponent },
      ]},
      { path: 'gastronomies', component: GastronomiesComponent },
      { path: 'menus-plats/:gastronomyId',  component: MenusPlatsComponent },

      { path: 'resguide', component:ReservationGuideComponent },
      { path: 'reservationguidedetails/:id', component:DetailsreservationComponent },
     
      { path: 'blog/:userId', component: BlogComponent },
      { path: 'partnerdashboard', component: DashboardPartnerComponent },
      { path: 'chat', component: HomeComponent },
      { path: 'verify-otp', component: VerifyOtpComponent },
      { path: 'activities', component: ActivitiesComponent },
      { path: 'reservation/:id', component: ReservationFormComponent },

      { path: '', component: HomeComponent },
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
      },

      { path: 'my-reservations', component: MyReservationsComponent },

      { path: 'listereservationsguide', component:ListGReservationComponent },
      { path: 'editreservation/:id', component:EditreservationComponent },
      { path: 'reservationsbyguide', component: ListereservationsComponent},
      { path: 'hebergement', component: GethebergementComponent},
      { path: 'reservationchambre/:id_hebergement', component: ReservationchambreComponent },
      { path: 'listreservations', component: ReservationChambreListComponent },
      {
        path: 'modifier-reservation/:id',
        component: ModifierReservationComponent  // remplace par le vrai nom du composant
      },



    ]
  },
  { path: 'gastronomies', component: GastronomiesComponent},


  { path: 'about', component: AboutComponent } ,
 { path: 'offers', component: OffersComponent},
 { path: 'news', component: NewsComponent},
 { path: 'login', component: LoginComponent},

 { path: 'register', component: RegisterComponent},

  { path: 'contact', component: ContactComponent},
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
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule ,
    ReactiveFormsModule,
    RecaptchaModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-left', // ou 'toast-top-center', etc.
      timeOut: 3000
    }),
   // Enregistrer les routes pour le frontend
  ],
 /*  providers: [ {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }],*/
})
export class FrontendModule { }
