import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SearchComponent } from '../admin/search.component';
import { CourseEditComponent } from '../shared/course-edit/course-edit.component';
import { AuthComponent } from '../shared/Auth/auth.component';
import { AddStudentComponent } from '../admin/add-student/add-student.component';
import { AuthGaurd } from '../shared/Auth/auth-gaurd';
import { LoginGuard } from '../shared/Auth/login-guard';

const routes: Route[] = [
  {path:"search", component:SearchComponent, canActivate: [AuthGaurd]},
  {path:"auth", component:AuthComponent, canActivate: [LoginGuard]},
  {path:"addStudent", component:AddStudentComponent,  canActivate: [AuthGaurd]},
  {path:"**", component:AuthComponent, canActivate:[LoginGuard]}
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
