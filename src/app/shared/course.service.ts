import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnrolledCourse } from '../srv/StudentEnrolledCourses';
import { Student } from '../srv/studentModel';
import { UpdateCourseArgs } from '../srv/UpdateCourseDetailsModel';
import { YearAndTerm } from './course-edit/YearTermOptions';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  selectedCourse: Subject<EnrolledCourse>  = new Subject<EnrolledCourse>();
  constructor(private http: HttpClient) { 
  }
  
  getCorrespondingAcademicYearsForAnEnrolledCourse(organizationId: number, studentId: number, courseCode: string, courseLevel:number): Observable<YearAndTerm[]>{
    return this.http.get<YearAndTerm[]>(`https://localhost:7076/api/students/${organizationId}/${studentId}/EnrolledCourse/${courseCode}/${courseLevel}`);
  }

  updateEnrolledCourse(organizationId: number, studentId: number, updateCourseArgs: UpdateCourseArgs): Observable<void>{
    return this.http.put<void>(`https://localhost:7076/api/students/${organizationId}/${studentId}/EnrolledCourse`, {updateCourseArgs});
  }
}