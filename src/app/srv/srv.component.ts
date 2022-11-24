import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { StudentService } from './student-service.service';
import { IStudentWithCourses } from './StudentWithCourses';

@Component({
  selector: 'app-srv',
  templateUrl: './srv.component.html',
  styleUrls: ['./srv.component.css']
})
export class SRVComponent implements OnInit {

  private readonly _studentService! : StudentService;
  private test: string = 'Test'
  studentData!: IStudentWithCourses;
  constructor(studentService: StudentService) { 
    this._studentService = studentService;
  }

  ngOnInit(): void {

  }

}
