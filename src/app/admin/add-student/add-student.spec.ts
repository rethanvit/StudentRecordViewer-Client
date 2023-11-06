import { Department } from "../../srv/DepartmentModel";
import { Organization } from "../../srv/OrganizationModel";
import { AddStudentComponent } from "./add-student.component";
import { TestBed, async, inject } from "@angular/core/testing";
import { StudentMetadataService } from "./student.metadata.service";
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";
import { Program } from "../../srv/ProgramModel";
import { AcademicCalendarDetailsOptions } from "../../srv/AcademicCalendarDetailOptionsModel";

describe("AddStudentComponent", async() => {
    
    let mockStudentMetadataService;
    let fixture;

    beforeEach(async() => {
        mockStudentMetadataService = jasmine.createSpyObj(["getDepartments", "getPrograms", "getAcademicCalendarDetailsForProgram"]);
        TestBed.configureTestingModule({

            declarations:[AddStudentComponent],
            providers:[{provide: StudentMetadataService, useValue: mockStudentMetadataService}],
            imports:[FormsModule]
        });

        fixture = TestBed.createComponent(AddStudentComponent);
    });

    it("should populate departments when organization was chosen", async() => {

        //Arrange
        let fakeDepartments: Department[] = [
            {departmentId:1 , code: "DP1", name: "DPName1", startDate: new Date(), stopDate: new Date()},
            {departmentId:2 , code: "DP2", name: "DPName2", startDate: new Date(), stopDate: new Date()}
        ];
        mockStudentMetadataService.getDepartments.and.returnValue(of(fakeDepartments));

        //Act
        fixture.componentInstance.organizationIdChosen = 123;
        fixture.componentInstance.onOrganizationSelect();

        //Assert
        expect(fixture.componentInstance.departments.length).toBe(2);
    });

    it("should populate programs when department was chosen", async() => {

        //Arrange
        let fakePrograms: Program[] = [
            {programId: 1, code: "P1", name: "Program1"},
            {programId: 2, code: "P2", name: "Program2"}
        ];
        mockStudentMetadataService.getPrograms.and.returnValue(of(fakePrograms));

        //Act
        fixture.componentInstance.departmentIdChosen = 12;
        fixture.componentInstance.onDepartmentSelect();

        //Assert
        expect(fixture.componentInstance.programs.length).toBe(2);
    });

    it("should populate academicCalendarDetailsOptions when program was chosen", async() => {

        //Arrange
        let fakeAcademicCalendarDetailOptions: AcademicCalendarDetailsOptions[] = [
            {academicCalendarDetailId: 1, startDate: new Date(), year: 2022, term: "Spring"},
            {academicCalendarDetailId: 2, startDate: new Date(), year: 2023, term: "Fall"}
        ];

        mockStudentMetadataService.getAcademicCalendarDetailsForProgram.and.returnValue(of(fakeAcademicCalendarDetailOptions));

        //Act
        fixture.componentInstance.programIdChosen = 12;
        fixture.componentInstance.onProgramSelect();

        //Assert
        expect(fixture.componentInstance.academicCalendarDetailsOptions.length).toBe(2);
    });

    xit("copies studentId to clipboard on click", async() => {

        //Arrange
        

        //Act
        fixture.componentInstance.newlyAddedStudentId = 12;
        fixture.componentInstance.copyStudentId();

        //Assert
        //TODO: Skipping this test because, yet to figure out how to validate data in clipboard
        expect((await navigator.clipboard.readText()).toString()).toBe("12");
    });
});