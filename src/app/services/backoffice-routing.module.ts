import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AddActivityComponent } from './components/add-activity/add-activity.component';
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { AddblogComponent } from './components/addblog/addblog.component';
import { EditActivityComponent } from './components/edit-activity/edit-activity.component';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogActivityAffectationComponent } from './components/blog-activity-affectation/blog-activity-affectation.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,children: [

      { path: 'activities/add', component: AddActivityComponent },
      { path: 'activities', component: ActivityListComponent },
      { path: 'blog/add', component: AddblogComponent },
      { path: 'activities/edit/:id', component: EditActivityComponent }, 
      { path: 'blog/edit/:id', component: EditBlogComponent }, 
      { path: 'blog', component: BlogListComponent }, // Add this route
      { path: 'blog/activity-affectation', component: BlogActivityAffectationComponent },
      { path: 'home', component: HomeComponent }, // Add this route


    ]},
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
