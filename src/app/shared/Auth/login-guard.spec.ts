import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { LoginGuard } from "./login-guard";
import { User } from "./UserModel";

describe('login-guard', () => {

  let mockAuthService;
  let mockRouter;

  beforeEach(async () => {
    
  });

  it("should return true when token is null", async () => {
    mockAuthService = jasmine.createSpyObj("AuthService", ["loggedInUser"]);
    let fakeUserWithExpiredToken = new User(1, "Test", "testToken", new Date(100), "ADMN");
    //mockAuthService.loggedInUser = new BehaviorSubject(fakeUserWithExpiredToken);


    ////spyOnProperty(mockAuthService, 'loggedInUser', "get").and.returnValue({
    ////  pipe: () => { fakeUserWithExpiredToken }
    ////});
    ////mockAuthService.loggedInUser.and.returnValue(of(fakeUserWithExpiredToken));
    //mockRouter = jasmine.createSpyObj(["createUrlTree"]);
    //let activatedRouteSnapshot = new ActivatedRouteSnapshot();
    //let state = jasmine.createSpyObj<RouterStateSnapshot>("RouterStateSnapshot", ['toString']);
    //let service = new LoginGuard(mockAuthService, mockRouter);

    //let result = service.canActivate(activatedRouteSnapshot, state);

    //console.log(typeof (result));
    //console.log(result.valueOf());
    //console.log(result);

    const subjectMock = new BehaviorSubject(fakeUserWithExpiredToken);
    mockAuthService = {
      loggedInUser: subjectMock.asObservable()
    };

    mockRouter = jasmine.createSpyObj(["createUrlTree"]);
    let activatedRouteSnapshot = new ActivatedRouteSnapshot();
    let state = jasmine.createSpyObj<RouterStateSnapshot>("RouterStateSnapshot", ['toString']);
    let service = new LoginGuard(mockAuthService, mockRouter);

    var test = mockAuthService.loggedInUser.subscribe();
    test.next(fakeUserWithExpiredToken);
    let result = service.canActivate(activatedRouteSnapshot, state);
    expect(result).toBeTruthy();
  });
});
