import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FrontendModule } from './frontend/frontend.module';  // Import du module FrontendModule
import { HttpClientModule } from '@angular/common/http';
import { BackendModule } from './backend/backend.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Ajout du ReactiveFormsModule
import { Chart } from 'chart.js';
import { NgxStarsModule } from 'ngx-stars';

@NgModule({
  declarations: [
    AppComponent,
  

  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule, // Routes principales de l'application
    FrontendModule, // Importation du module Frontend
    BackendModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxStarsModule,
    
    // Importation du module Frontend
  ],
 
  bootstrap: [AppComponent]
})
export class AppModule { }
