import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn:'root'})
export class AuthGaurd implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {

        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.loggedInUser.pipe(take(1), map(user => {
            if(user.token)
                return true;
            return this.router.createUrlTree(['/auth']);
        }));
    }

}