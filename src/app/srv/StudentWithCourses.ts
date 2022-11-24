import { EnrolledCourse } from "./StudentEnrolledCourses";

export interface IStudentWithCourses{
    studentId: number,
    firstName: string,
    lastName: string,
    coursesEnrolled: EnrolledCourse[]
}

export class StudentWithCourses implements IStudentWithCourses {
    public studentId: number;
    public firstName: string;
    public lastName: string;
    public coursesEnrolled: EnrolledCourse[];
}
    