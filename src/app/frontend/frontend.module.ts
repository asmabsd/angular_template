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
import { GethebergementComponent } from './pages/gethebergement/gethebergement.component';
import { ReservationchambreComponent } from './pages/reservationchambre/reservationchambre.component';
import { ReservationChambreListComponent } from './pages/reservation-chambre-list/reservation-chambre-list.component';
import { ModifierReservationComponent } from './pages/modifier-reservation/modifier-reservation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
const routes: Routes = [
  
  
  {
    path: '', component: HomeComponent, // Layout parent
    children: [
      { path: 'guide', component: GuideComponent },
      { path: 'hebergement', component: GethebergementComponent},
      { path: 'reservationchambre/:id_hebergement', component: ReservationchambreComponent },
      { path: 'listreservations', component: ReservationChambreListComponent },
      {
        path: 'modifier-reservation/:id',
        component: ModifierReservationComponent  // remplace par le vrai nom du composant
      }
     
    ]
  },
  { path: 'about', component: AboutComponent } ,
 { path: 'offers', component: OffersComponent},
 { path: 'news', component: NewsComponent},
 { path: 'login', component: LoginComponent},

 { path: 'register', component: RegisterComponent},

  { path: 'contact', component: ContactComponent},
 
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
    GethebergementComponent,
    ReservationchambreComponent,
    ReservationChambreListComponent,
    ModifierReservationComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule ,
    ReactiveFormsModule,
    
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', // ou 'toast-top-center', etc.
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
