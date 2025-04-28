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
import { GastronomiesComponent } from './pages/gastronomies/gastronomies.component';
import { MenusPlatsComponent } from './pages/menus-plats/menus-plats.component';
import { PredictionComponent } from './pages/prediction/prediction.component';
const routes: Routes = [
  {
    path: '', component: HomeComponent, // Layout parent
    children: [
      { path: 'guide', component: GuideComponent },
      { path: 'gastronomies', component: GastronomiesComponent },
      { path: 'menus-plats/:gastronomyId', component: MenusPlatsComponent },
      { path: 'prediction', component: PredictionComponent },
    ]
  },
  { path: 'about', component: AboutComponent },
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
    GastronomiesComponent,
    MenusPlatsComponent,
    PredictionComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule ,
    ReactiveFormsModule
   // Enregistrer les routes pour le frontend
  ],
 /*  providers: [ {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }],*/
})
export class FrontendModule { }
