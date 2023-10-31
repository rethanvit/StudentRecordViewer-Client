import { HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase, HttpStatusCode } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { AuthService } from "./auth.service";
import { User } from "./UserModel";

describe('AuthService.LoginUser', () => {
  let mockHttpService;
  let mockRouter;
  let mockCookieService;
  let fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwidXNlck5hbWUiOiJhZG1pbjEiLCJ1c2VyUm9sZSI6IkFETU4iLCJuYmYiOjE2OTg2MzMzODEsImV4cCI6MTY5ODYzNjk4MSwiaXNzIjoiU3R1ZGVudFJlY29yZFZpZXdlckFwaSIsImF1ZCI6IlN0dWRlbnRSZWNvcmRWaWV3ZXJBcGkifQ.Ogb5ZRQDzmQUBjDquA1Tm23bzgS8dfxqQ39Gec4ilTM";

  beforeEach(async () => {
    mockHttpService = jasmine.createSpyObj(["post"]);
    mockRouter = jasmine.createSpyObj(["navigate"]);
    mockCookieService = jasmine.createSpyObj(["delete", "set", "get"]);
  });

  it("should store logged in user: admin1", async () => {

    mockHttpService.post.and.returnValue(of(fakeToken))
    let service = new AuthService(mockHttpService, mockRouter, mockCookieService);

    var result = service.LoginUser("admin1", "Test3").subscribe();

    let user = service.loggedInUser.getValue();
    expect(user.username).toBe("admin1");
    expect(user.userRole).toBe("ADMN");

  });

  it("should store clear the old cookie and set a new cookie for user: admin1", async () => {

    //Arrange
    mockHttpService.post.and.returnValue(of(fakeToken))
    let service = new AuthService(mockHttpService, mockRouter, mockCookieService);

    //Act
    service.LoginUser("admin1", "Test3").subscribe();

    //Assert
    let user = service.loggedInUser.getValue();
    expect(mockCookieService.delete).toHaveBeenCalledWith("SRV");
    expect(mockCookieService.set).toHaveBeenCalledWith("SRV", JSON.stringify(user));

  });

  it("should return error message when invalid credentials are provided", async () => {

    mockHttpService.post.and.returnValue(of());
    let service = new AuthService(mockHttpService, mockRouter, mockCookieService);

    service.LoginUser("admin1", "Test3").subscribe();

    let user = service.loggedInUser.getValue();
    expect(mockCookieService.delete).toHaveBeenCalledTimes(0);
    expect(mockCookieService.set).toHaveBeenCalledTimes(0);

  });
});

describe('AuthService.LogoutUser', () => {
  let mockHttpService;
  let mockRouter;
  let mockCookieService;

  beforeEach(async () => {
    mockHttpService = jasmine.createSpyObj(["post"]);
    mockRouter = jasmine.createSpyObj(["navigate"]);
    mockCookieService = jasmine.createSpyObj(["delete", "set", "get"]);
  });

  it("user should be logged out, when LogoutUser function is called", async () => {

    let service = new AuthService(mockHttpService, mockRouter, mockCookieService);

    service.LogoutUser();

    let user = service.loggedInUser.getValue();
    expect(user.username).toBe("");
    expect(user.userRole).toBe("Dummy");
    expect(user.token).toBeNull();

  });

  it("the SRV cookie is cleared, when user is logged out", async () => {

    let service = new AuthService(mockHttpService, mockRouter, mockCookieService);

    service.LogoutUser();

    expect(mockCookieService.delete).toHaveBeenCalledWith("SRV");
  });

  it("the logout timer is cleared and null, when user is logged out", async () => {

    let service = new AuthService(mockHttpService, mockRouter, mockCookieService);

    service.LogoutUser();

    expect(service.logoutTimer).toBeNull();
  });

  it("the user is navigated to Root, when user is logged out", async () => {

    let service = new AuthService(mockHttpService, mockRouter, mockCookieService);

    service.LogoutUser();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});

describe("AuthService.AutoLogin", () => {
  let mockHttpService;
  let mockRouter;
  let mockCookieService;
  let fakeUser = new User(1, "admin1", "testToken", new Date(100), "ADMN");
  beforeEach(async() => {
    mockHttpService = jasmine.createSpyObj(["post"]);
    mockRouter = jasmine.createSpyObj(["navigate"]);
    mockCookieService = jasmine.createSpyObj(["delete", "set", "get"]);
  });

  it("should store already loggedin user information, when SRV cookie is found on the bowser", async() => {
    
    //Arrange
    mockCookieService.get.and.returnValue(JSON.stringify(fakeUser));
    let authService = new AuthService(mockHttpService, mockRouter, mockCookieService);

    //Act
    authService.AutoLogin();

    //Assert
    let expectedUser = authService.loggedInUser.getValue();
    expect(expectedUser.username).toBe("admin1");
    expect(mockCookieService.get).toHaveBeenCalledTimes(2);

  });

  it("should not store already loggedin user information, when SRV cookie is not found on the bowser", async() => {
    
    //Arrange
    mockCookieService.get.and.returnValue(null);
    let authService = new AuthService(mockHttpService, mockRouter, mockCookieService);

    //Act
    authService.AutoLogin();

    //Assert
    let expectedUser = authService.loggedInUser.getValue();
    expect(expectedUser.username).toBe("");
    expect(expectedUser.userRole).toBe("Dummy");
    expect(mockCookieService.get).toHaveBeenCalledTimes(1);
  });
});
