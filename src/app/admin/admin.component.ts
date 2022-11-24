import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CourseService } from '../shared/course.service';
import { DeleteCourse } from '../srv/DeleteCourseModel';
import { EnrolledCourse } from '../srv/StudentEnrolledCourses';
import { Student } from '../srv/studentModel';
import { IStudentWithCourses, StudentWithCourses } from '../srv/StudentWithCourses';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  adminSearchForm:FormGroup
  studentDetailsShown:StudentWithCourses;
  studentMetadata:Student;
  studentMetadataSubscription:Subscription;
  studentWithCoursesSubscription:Subscription;
  deleteEnrolledCourseSubscription:Subscription;
  isUserWantToEditEnrolledCourse: boolean = false;
  isEnrolledCourseEditComplete: boolean = false;
  emitSelectedCourseByUser: {student: Student, enrolledCourse: EnrolledCourse};

  constructor(private adminService: AdminService, private courseService: CourseService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.adminSearchForm = new FormGroup({
      'studentId': new FormControl(null,[Validators.required, Validators.pattern('^[1-9]\d*$')]),
      'organizationId': new FormControl(null,[Validators.required, Validators.pattern('^[1-9]\d*$')])
    });
  }

  private updateStudentEnrolledCourses(organizationId: number, studentId: number){
    this.studentWithCoursesSubscription = this.adminService.getStudentDetailsWithCoursesEnrolled(organizationId, studentId).subscribe((studentWithCourses:IStudentWithCourses) => {
      this.studentDetailsShown = studentWithCourses;
    });
  }

  onSubmit(){
    const studentIDSearched = +this.adminSearchForm.controls['studentId'].value;
    const organizationIDGiven = +this.adminSearchForm.controls['organizationId'].value;
    this.updateStudentEnrolledCourses(organizationIDGiven, studentIDSearched);
    this.studentMetadataSubscription = this.adminService.getStudentMetadata(organizationIDGiven,studentIDSearched).subscribe((studentMetadata:Student) => {
      this.studentMetadata = studentMetadata;
    });
  }

  onDeleteEnrolledCourse(organizationId:number, studentId: number, courseArgs: {courseCode: string, courseLevel: number, academicYear: number, academicTerm: string}){
    
    let deleteCourseDetails = new DeleteCourse();
    deleteCourseDetails.courseCode= courseArgs.courseCode,
    deleteCourseDetails.courseLevel= courseArgs.courseLevel, 
    deleteCourseDetails.academicYear= courseArgs.academicYear, 
    deleteCourseDetails.academicTerm= courseArgs.academicTerm
    
    this.deleteEnrolledCourseSubscription = this.adminService.deleteEnrolledCoursesOfAStudent(organizationId, studentId, deleteCourseDetails).subscribe(() => {
      this.updateStudentEnrolledCourses(organizationId, this.studentMetadata.studentId);
    });
  }

  onEnrolledCourseEdit(studentData: Student, enrolledCourse: EnrolledCourse){
    this.emitSelectedCourseByUser = {student: studentData, enrolledCourse:enrolledCourse};
    this.isUserWantToEditEnrolledCourse = true;
  }

  ngOnDestroy(): void {
    this.studentMetadataSubscription?.unsubscribe();
    this.studentWithCoursesSubscription?.unsubscribe();
  }
}
