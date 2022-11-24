import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from './studentModel';
import { IStudentWithCourses } from './StudentWithCourses';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly _http: HttpClient;

  constructor(http: HttpClient) { 

    this._http = http;
  }

  getStudentName(studentId: number, organizationId: number):Observable<Student> {
    return this._http.get<Student>(`https://localhost:7076/api/students/${organizationId}/${studentId}`);
  }

  getStudentDetailsWithCoursesEnrolled(studentId: number, organizationId: number): Observable<IStudentWithCourses>{
    return this._http.get<IStudentWithCourses>(`https://localhost:7076/api/students/${organizationId}/${studentId}/withCourses`);
  }
}
