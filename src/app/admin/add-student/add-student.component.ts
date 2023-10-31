import { Component, OnInit } from "@angular/core";
import { StudentMetadataService } from "./student.metadata.service";
import { Organization } from "../../srv/OrganizationModel";
import { Department } from "../../srv/DepartmentModel";
import { Program } from "../../srv/ProgramModel";
import { NgForm } from "@angular/forms";
import { AcademicCalendarDetailsOptions } from "../../srv/AcademicCalendarDetailOptionsModel";
import { AddStudent } from "../../srv/AddStudentModel";
import { Router } from "@angular/router";

@Component({
    selector: 'add-student',
    templateUrl: './add-student.component.html',
    styleUrls: ['./add-student.component.css']
})

export class AddStudentComponent implements OnInit {

    organizations:Organization[] = [];
    organizationIdChosen: number;
    departmentIdChosen: number;
    programIdChosen: number;
    newlyAddedStudentId: number;
    academicCalendarDetailsOptionChosen: number;
    departments:Department[] = [];
    programs:Program[] = [];
    academicCalendarDetailsOptions:AcademicCalendarDetailsOptions[] = [];

    constructor(private studentMetadataService: StudentMetadataService) {
        
    }

    ngOnInit(): void {
        this.studentMetadataService.getOrganizations().subscribe(orgs => {
            this.organizations = this.organizations.concat(orgs);
        });

    }

    addStudentSubmit(form: NgForm){
        var studentToBeAdded= new AddStudent();
        studentToBeAdded.AcademicDetailsStartId = this.academicCalendarDetailsOptionChosen;
        studentToBeAdded.FirstName= form.controls['firstName'].value;
        studentToBeAdded.LastName= form.controls['lastName'].value;
        studentToBeAdded.ProgramId= this.programIdChosen;

        this.studentMetadataService.addStudent(studentToBeAdded).subscribe(result => {
            if(!isNaN(result))
            {
                this.newlyAddedStudentId = result;
                form.resetForm();
                //this.router.navigate(['/search']);
            }
        });
    }

    onOrganizationSelect(){
        this.departments = [];
        this.studentMetadataService.getDepartments(this.organizationIdChosen).subscribe(deps => {
            this.departments = deps;
        });
    }

    onDepartmentSelect(){

        this.studentMetadataService.getPrograms(this.departmentIdChosen).subscribe(progs => {
            this.programs = progs
        });
    }

    onProgramSelect(){
        this.studentMetadataService.getAcademicCalendarDetailsForProgram(this.programIdChosen).subscribe(acdos => {
            this.academicCalendarDetailsOptions = acdos
        });
    }

    copyStudentId(){
        //let copyText = document.getElementById("StudentAddSuccessMessage");
      //let studentId = copyText?.innerText.substring(copyText?.innerText.indexOf(':')+1).trim();
      if (this.newlyAddedStudentId !== 0)
        navigator.clipboard.writeText(`${this.newlyAddedStudentId}`);
    }
    
}
