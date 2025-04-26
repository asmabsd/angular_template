import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './frontend/pages/home/home.component';


const routes: Routes = [
  
  { path: '', loadChildren: () => import('./frontend/frontend.module').then(m => m.FrontendModule) },
  { path: 'admin', loadChildren: () => import('./backend/backend.module').then(m => m.BackendModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
