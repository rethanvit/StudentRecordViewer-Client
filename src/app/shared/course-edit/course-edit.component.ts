import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EnrolledCourse } from 'src/app/srv/StudentEnrolledCourses';
import { Student } from 'src/app/srv/studentModel';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent implements OnInit, OnChanges, OnDestroy {

  courseEnrolled:EnrolledCourse;
  courseEnrolledSubscription: Subscription;
  courseEditOptionsSubscription: Subscription;
  courseEditForm: number[];
  @Input() selectedCourseToBeEdited: {student: Student, enrolledCourse: EnrolledCourse};
  editableCourseDetails: {year: number, term: string, marks:number};
  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    // this.courseEnrolledSubscription = this.courseService.selectedCourse.subscribe((test: EnrolledCourse) => {
    //   this.courseEnrolled = test;
    //   console.log('test');
    // });
    // this.courseEditForm = 
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.editableCourseDetails = {
                                 year: this.selectedCourseToBeEdited.enrolledCourse.academicYear, 
                                 term: this.selectedCourseToBeEdited.enrolledCourse.academicTerm, 
                                 marks: this.selectedCourseToBeEdited.enrolledCourse.marks
                                };
    
    
    this.courseEditOptionsSubscription =this.courseService.getCorrespondingAcademicYearsForAnEnrolledCourse(this.selectedCourseToBeEdited.student, this.selectedCourseToBeEdited.enrolledCourse).subscribe();
  }

  onEnrolledCourseEditSubmit(form:NgForm){
    console.log(form);
  }

  isSameYearAsCurrent(year:number){
    return year === this.editableCourseDetails.year;
  }

  ngOnDestroy(): void {
    this.courseEnrolledSubscription.unsubscribe();
  }

}
