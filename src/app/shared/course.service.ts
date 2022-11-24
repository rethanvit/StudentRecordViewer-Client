import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnrolledCourse } from '../srv/StudentEnrolledCourses';
import { Student } from '../srv/studentModel';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  selectedCourse: Subject<EnrolledCourse>  = new Subject<EnrolledCourse>();
  constructor(private http: HttpClient) { 
  }
  
  getCorrespondingAcademicYearsForAnEnrolledCourse(student: Student, enrolledCourse: EnrolledCourse): Observable<void>{
    const body = {student: student, enrolledCourse: enrolledCourse};
    return this.http.post<void>(`https://localhost:7076/api/students/${1}/${student.studentId}/EnrolledCourse/${1}`,body);
  }
 
}