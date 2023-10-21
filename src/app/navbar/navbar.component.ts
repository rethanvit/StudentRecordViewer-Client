import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/Auth/auth.service';
import { User } from '../shared/Auth/UserModel';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = 'Student Academics Report';
  isUserLoggedIn: boolean = false;
  user: User;
  isUserAdmin: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.loggedInUser.subscribe(user => {
      if(user.token)
      {
        this.isUserLoggedIn = true;
        this.user = user;
        this.isUserAdmin = user.userRole === 'ADMN'
      }
      else{
        this.isUserLoggedIn = false;
      }
    })
  }

  Logout(){
    this.authService.LogoutUser();
    if(!this.authService.loggedInUser.value.token)
        this.isUserLoggedIn = false;
  }

}
