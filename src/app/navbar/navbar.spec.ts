import { TestBed } from "@angular/core/testing";
import { NavbarComponent } from "./navbar.component";
import { StudentMetadataService } from "../admin/add-student/student.metadata.service";
import { of } from "rxjs";
import { User } from "../shared/Auth/UserModel";
import { HttpClient, HttpClientModule } from "@angular/common/http";

describe("NavbarComponent", async() => {
    let mockAuthService;
    let fixture;

    beforeEach(async() => {
        mockAuthService = jasmine.createSpyObj(["loggedInUser"]);

        TestBed.configureTestingModule({
            declarations:[NavbarComponent],
            providers:[{provide: StudentMetadataService, useValue: mockAuthService}],
            imports:[HttpClientModule]
        });

    });

    it("isUserLoggedIn should be set to false, when there is no valid user token", async() => {

        //Arrange
        let user = new User(1, "Test", "TestToken", new Date(-100), "DUMN");
        mockAuthService.loggedInUser.and.returnValue(of(user));

        //Act
        fixture = TestBed.createComponent(NavbarComponent);
        fixture.detectChanges();

        //Assert
        expect(fixture.componentInstance.isUserLoggedIn).toBe(false);
    });

    xit("isUserLoggedIn should be set to true, when there is a valid user token", async() => {

        //Arrange
        let user = new User(1, "Test", "TestToken", new Date(100), "DUMN");
        mockAuthService.loggedInUser.and.returnValue(of(user));
        //TODO: skipped this test because, yet to figure out how to mock loggedInUser in AuthService. The above mock statement doesn't work.

        //Act
        fixture = TestBed.createComponent(NavbarComponent);
        fixture.detectChanges();

        //Assert
        expect(fixture.componentInstance.isUserLoggedIn).toBe(true);
    });
});