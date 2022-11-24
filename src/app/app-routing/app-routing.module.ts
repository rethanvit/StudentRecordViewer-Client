import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { CourseEditComponent } from '../shared/course-edit/course-edit.component';

const routes: Route[] = [
  {path:"admin", component:AdminComponent},
  {path:"**", component:AdminComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
