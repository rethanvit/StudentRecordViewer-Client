import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Organization } from "../../srv/OrganizationModel";
import { Observable } from "rxjs";
import { Department } from "../../srv/DepartmentModel";
import { Program } from "../../srv/ProgramModel";
import { AcademicCalendarDetailsOptions } from "../../srv/AcademicCalendarDetailOptionsModel";
import { AddStudent } from "../../srv/AddStudentModel";

@Injectable({providedIn:'root'})

export class StudentMetadataService{

    constructor(private _httpClient: HttpClient) {

    }

    getOrganizations(): Observable<Organization[]>{
        return this._httpClient.get<Organization[]>(`https://localhost:7076/api/students/organizations`);
    }

    getDepartments(organizationId: number): Observable<Department[]>{
        return this._httpClient.get<Department[]>(`https://localhost:7076/api/students/organization/${organizationId}/departments`);
    }

    getPrograms(departmentId: number): Observable<Program[]>{
        return this._httpClient.get<Program[]>(`https://localhost:7076/api/students/department/${departmentId}/programs`);
    }

    getAcademicCalendarDetailsForProgram(programId: number): Observable<AcademicCalendarDetailsOptions[]>{
        return this._httpClient.get<AcademicCalendarDetailsOptions[]>(`https://localhost:7076/api/students/academiccalendardetails/${programId}`);
    }

    addStudent(addStudent: AddStudent): Observable<number>{
        return this._httpClient.post<number>(`https://localhost:7076/api/students/addStudent`, addStudent);
    }
}
