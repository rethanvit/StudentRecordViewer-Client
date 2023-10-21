import { HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap, BehaviorSubject, catchError, throwError } from "rxjs";
import { User } from "./UserModel";
import jwtDecode from "jwt-decode";
import { JWTTokenModel } from "./JWTTokenModel";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable({providedIn:'root'})
export class AuthService{

    //setting the expiry to a past date, so that user.token is never returned for the initial value
    dummyUser: User = new User(0, '', '', new Date(-1000), 'Dummy');
    loggedInUser = new BehaviorSubject<User>(this.dummyUser);
    logoutTimer: any;
    constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {
    }
            
    LoginUser(username: string, password: string): Observable<string>{
        const body = {username: username, password: password};
        return this.httpClient.post<string>(`https://localhost:7076/api/Authenticate`, body).pipe(

            catchError(this.handleError),

            //tap doesn't run as the handleError private function added will throw an Error. Had the handleError not threw the error, the tap would still run.
            tap(responseData => {
                let token = responseData;
                let decodedToken = jwtDecode<JWTTokenModel>(token);
                var expiresBy = new Date(decodedToken.exp *1000);
                const user = new User(+decodedToken.sub, decodedToken.userName, responseData, expiresBy, decodedToken.userRole);
                this.loggedInUser.next(user);
                this.cookieService.delete("SRV");
                this.cookieService.set("SRV", JSON.stringify(user));

                //auto logout after the token expires
                this.AutoLogout(expiresBy);
            })
        );
    }

    LogoutUser(){
      this.loggedInUser.next(this.dummyUser);
      this.cookieService.delete("SRV");
      this.router.navigate(['/']);

      //clearing the timer in case the user logs out manually. Otherwise the application would try to auto logout even after the user logs out intentionally.
      if(this.logoutTimer){
        clearTimeout(this.logoutTimer);
      }
      this.logoutTimer = null;
    }

    AutoLogin(){
      if(this.cookieService.get("SRV"))
      {
        var cookieUser:{userId: number, username: string, _token: string, _tokenExpirationDate: string, userRole: string} = JSON.parse(this.cookieService.get("SRV"));

        if(!cookieUser)
          return;
  
        let user = new User(cookieUser.userId, cookieUser.username, cookieUser._token, new Date(cookieUser._tokenExpirationDate), cookieUser.userRole);
        this.loggedInUser.next(user);
  
        //auto logout after the token expires
        this.AutoLogout(new Date(cookieUser._tokenExpirationDate));
      }
    }

    AutoLogout(expiry: Date){
      this.logoutTimer = setTimeout(() => {
        this.LogoutUser();
      }, expiry.getTime() - new Date().getTime());
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage ='';
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          errorMessage =  `'An unknown error occurred:', ${error.message}`;
        } else if (error.status == HttpStatusCode.Unauthorized){
          // The backend returned an unsuccessful response code.
          errorMessage= `Invalid credentials provided. Please try again.`;
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error(errorMessage));
      }
}