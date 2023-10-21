import { YearAndTerm } from "./YearTermModel";

export class CourseDto
{
    public courseId: number;
    public name: string;
    public code: string;
    public level: number
    public yearAndTerms: YearAndTerm[];
}