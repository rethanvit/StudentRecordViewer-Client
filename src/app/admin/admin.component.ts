import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CourseService } from '../shared/course.service';
import { CourseDetail } from '../srv/CourseDetailModel';
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

  adminSearchForm: FormGroup
  studentDetailsShown: StudentWithCourses;
  studentMetadata: Student;
  studentMetadataSubscription: Subscription;
  studentWithCoursesSubscription: Subscription;
  deleteEnrolledCourseSubscription: Subscription;
  isUserWantToEditEnrolledCourse: boolean = false;
  isEnrolledCourseEditComplete: boolean = false;
  isSaveComplete: boolean = false;
  modalCautionUserAboutDeletion: boolean = false;
  emitSelectedCourseByUser: { organizationId: number, studentId: number, courseDetails: CourseDetail };

  constructor(private adminService: AdminService, private courseService: CourseService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.adminSearchForm = new FormGroup({
      'studentId': new FormControl(null, [Validators.required, Validators.pattern('^[1-9]\d*$')]),
      'organizationId': new FormControl(null, [Validators.required, Validators.pattern('^[1-9]\d*$')])
    });
  }

  private updateStudentEnrolledCourses(organizationId: number, studentId: number) {
    this.studentWithCoursesSubscription = this.adminService.getStudentDetailsWithCoursesEnrolled(organizationId, studentId).subscribe((studentWithCourses: IStudentWithCourses) => {
      this.studentDetailsShown = studentWithCourses;
    });
  }

  onSubmit() {
    const studentIDSearched = +this.adminSearchForm.controls['studentId'].value;
    const organizationIDGiven = +this.adminSearchForm.controls['organizationId'].value;
    this.updateStudentEnrolledCourses(organizationIDGiven, studentIDSearched);
    this.studentMetadataSubscription = this.adminService.getStudentMetadata(organizationIDGiven, studentIDSearched).subscribe((studentMetadata: Student) => {
      this.studentMetadata = studentMetadata;
    });
  }

  onDeleteEnrolledCourse(organizationId: number, studentId: number, courseArgs: DeleteCourse) {

    this.isUserWantToEditEnrolledCourse = false;
    const deleteCourseDetails = new DeleteCourse();
    deleteCourseDetails.courseCode = courseArgs.courseCode,
      deleteCourseDetails.courseLevel = courseArgs.courseLevel,
      deleteCourseDetails.academicYear = courseArgs.academicYear,
      deleteCourseDetails.academicTerm = courseArgs.academicTerm

    this.deleteEnrolledCourseSubscription = this.adminService.deleteEnrolledCoursesOfAStudent(organizationId, studentId, deleteCourseDetails).subscribe(() => {
      this.updateStudentEnrolledCourses(organizationId, this.studentMetadata.studentId);
    });
  }

  onEnrolledCourseEdit(organizationId: number, studentId: number, courseArgs: CourseDetail) {

    const selectedCourseDetail = new CourseDetail();
    selectedCourseDetail.courseName = courseArgs.courseName;
    selectedCourseDetail.courseCode = courseArgs.courseCode;
    selectedCourseDetail.courseLevel = courseArgs.courseLevel;
    selectedCourseDetail.departmentName = courseArgs.departmentName;
    selectedCourseDetail.marks = courseArgs.marks;
    selectedCourseDetail.academicTerm = courseArgs.academicTerm;
    selectedCourseDetail.academicYear = courseArgs.academicYear;

    this.emitSelectedCourseByUser = { organizationId: organizationId, studentId: studentId, courseDetails: selectedCourseDetail };
    this.isUserWantToEditEnrolledCourse = true;
  }

  hideSaveFormAndReloadCourses(event: boolean) {
    this.isUserWantToEditEnrolledCourse = !event;
    this.updateStudentEnrolledCourses(1, this.studentMetadata.studentId); //TODO: do not force the org Id to 1
  }

  ngOnDestroy(): void {
    this.studentMetadataSubscription?.unsubscribe();
    this.studentWithCoursesSubscription?.unsubscribe();
  }

  loadModal(courseName: string, departmentName: string, academicYear: number, academicTerm: string): void {
    const str = `${courseName} - ${departmentName} enrolled in ${academicYear} - ${academicTerm}`;
    document.getElementById("attentionCourseDetail").innerText = str;
  }
}
