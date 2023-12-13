export type CourseRegime = 'ANUAL' | 'SEMESTRAL' | 'INDEFINIDO';
export type SubjectData = {
    name:string,
    course_regime:string,
    weekly_hours:string,
    total_hours:string,
    correlatives:string
}