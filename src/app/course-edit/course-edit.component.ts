import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, NgForm, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CourseDetail } from 'src/app/srv/CourseDetailModel';
import { EnrolledCourse } from 'src/app/srv/StudentEnrolledCourses';
import { UpdateCourseArgs } from 'src/app/srv/UpdateCourseDetailsModel';
import { CourseService } from './course.service';

import { YearAndTerm } from './YearTermOptions';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent implements OnInit, OnChanges, OnDestroy {

  courseEnrolled:EnrolledCourse;
  courseEditOptionsSubscription: Subscription;
  courseEditSubscription: Subscription;
  courseEditYearAndTermOptions: YearAndTerm[]=[];
  @Input() selectedCourseToBeEdited: {organizationId: number, studentId: number, courseDetails: CourseDetail};
  @Output() SaveComplete: EventEmitter<boolean> = new EventEmitter<boolean>();
  editableCourseDetails: {year: number, term: string, marks:number};
  academicYearSelected:number;
  academicTermSelected:string;
  marks:number;
  currentAndUpdatedDetailsOfTheCourse:UpdateCourseArgs;
  AcademicTermsOptionsForAcademicYear:string[]=[];
  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.SaveComplete.emit(false);
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    this.editableCourseDetails = {
                                 year: this.selectedCourseToBeEdited.courseDetails.academicYear, 
                                 term: this.selectedCourseToBeEdited.courseDetails.academicTerm, 
                                 marks: this.selectedCourseToBeEdited.courseDetails.marks
                                };
    
    this.courseEditYearAndTermOptions = [];
    this.currentAndUpdatedDetailsOfTheCourse = new UpdateCourseArgs();
    this.AcademicTermsOptionsForAcademicYear=[];
    this.courseEditOptionsSubscription =this.courseService.getCorrespondingAcademicYearsForAnEnrolledCourse(this.selectedCourseToBeEdited.organizationId, 
                                                                                                            this.selectedCourseToBeEdited.studentId, 
                                                                                                            this.selectedCourseToBeEdited.courseDetails.courseCode, 
                                                                                                            this.selectedCourseToBeEdited.courseDetails.courseLevel
                                                                                                            ).subscribe((yearAndTerms) => {
                                                                                                              this.courseEditYearAndTermOptions = yearAndTerms;

                                                                                                              this.currentAndUpdatedDetailsOfTheCourse.courseCode = this.selectedCourseToBeEdited.courseDetails.courseCode;;
                                                                                                              this.currentAndUpdatedDetailsOfTheCourse.courseLevel = this.selectedCourseToBeEdited.courseDetails.courseLevel;
                                                                                                              this.currentAndUpdatedDetailsOfTheCourse.currentAcademicYear = this.selectedCourseToBeEdited.courseDetails.academicYear;
                                                                                                              this.currentAndUpdatedDetailsOfTheCourse.currentAcademicTerm = this.selectedCourseToBeEdited.courseDetails.academicTerm;
                                                                                                              this.currentAndUpdatedDetailsOfTheCourse.currentMarks = this.selectedCourseToBeEdited.courseDetails.marks;

                                                                                                              this.academicYearSelected = this.selectedCourseToBeEdited.courseDetails.academicYear;
                                                                                                              this.academicTermSelected = this.selectedCourseToBeEdited.courseDetails.academicTerm;
                                                                                                              this.marks = this.selectedCourseToBeEdited.courseDetails.marks;

                                                                                                              this.AcademicTermsOptionsForAcademicYear = this.courseEditYearAndTermOptions.filter(yearAndTerm => yearAndTerm.academicYear === +this.selectedCourseToBeEdited.courseDetails.academicYear).at(0).academicTerms;
                                                                                                            });
  }

  onEnrolledCourseEditSubmit(){
    this.currentAndUpdatedDetailsOfTheCourse.updatedAcademicYear = +this.academicYearSelected;
    this.currentAndUpdatedDetailsOfTheCourse.updatedAcademicTerm = this.academicTermSelected;
    this.currentAndUpdatedDetailsOfTheCourse.updatedMarks = +this.marks;

    this.courseEditSubscription = this.courseService.updateEnrolledCourse(this.selectedCourseToBeEdited.organizationId, this.selectedCourseToBeEdited.studentId, this.currentAndUpdatedDetailsOfTheCourse).subscribe(() => {
      this.SaveComplete.emit(true);
    });
  }

  onChange(){
    this.AcademicTermsOptionsForAcademicYear = this.courseEditYearAndTermOptions.filter(yearAndTerm => yearAndTerm.academicYear === +this.academicYearSelected).at(0).academicTerms;
  }

  ngOnDestroy(): void {
    this.courseEditOptionsSubscription.unsubscribe();
  }
}
