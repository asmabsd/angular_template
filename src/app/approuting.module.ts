import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontendModule } from './frontend/frontend.module'; // Importation du module FrontendModule

const routes: Routes = [
  { path: '', loadChildren: () => import('./frontend/frontend.module').then(m => m.FrontendModule) } ,
  { path: '', loadChildren: () => import('./backend/backend.module').then(m => m.BackendModule) } // Chargement du module Frontend
  // Chargement du module Frontend
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Routes principales
  exports: [RouterModule]
})
export class AppRoutingModule { }
