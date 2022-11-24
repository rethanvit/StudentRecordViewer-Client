import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeleteCourse } from '../srv/DeleteCourseModel';
import { Student } from '../srv/studentModel';
import { IStudentWithCourses } from '../srv/StudentWithCourses';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly _http: HttpClient;

  constructor(http: HttpClient) { 

    this._http = http;
  }

  getStudentMetadata(organizationId: number, studentId: number):Observable<Student> {
    return this._http.get<Student>(`https://localhost:7076/api/students/${organizationId}/${studentId}`);
  }

  getStudentDetailsWithCoursesEnrolled(organizationId: number, studentId: number): Observable<IStudentWithCourses>{
    return this._http.get<IStudentWithCourses>(`https://localhost:7076/api/students/${organizationId}/${studentId}/withCourses`);
  }

  deleteEnrolledCoursesOfAStudent(organizationId: number, studentId: number, deleteCourseDetails: DeleteCourse):Observable<void>{
    return this._http.delete<void>(`https://localhost:7076/api/students/${organizationId}/${studentId}/EnrolledCourse`, {body: deleteCourseDetails});
  }
  
}
