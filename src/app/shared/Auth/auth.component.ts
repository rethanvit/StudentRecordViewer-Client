import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { User } from "./UserModel";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
  })
  export class AuthComponent implements OnInit{

    user: User;
    error: any;
    constructor(private authService: AuthService, private router: Router) {
        
    }
    ngOnInit(): void {
    }

    onAuthSubmit(form: NgForm){

      if(form.invalid) return ;

      const username = form.value.username;
      const password = form.value.password;
        this.authService.LoginUser(username,password).subscribe({
            next: (response) => {},
            error: (errorMessage) => {
              this.error = errorMessage;
            }});
      
      this.authService.loggedInUser.subscribe(user => {
        this.user = user;
        if(user.token){
          this.router.navigate(['/search']);
        }
      });

      form.reset();


    }
  }