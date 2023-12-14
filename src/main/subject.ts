import { CourseRegime } from "./types";

export default class Subject {
    private name: string;
    private course_regime: CourseRegime;
    private weekly_hours: number;
    private total_hours: number;
    private correlatives: Array<string>;

    constructor (name:string, course_regime:CourseRegime, weekly_hours:number, total_hours:number, correlatives:Array<string>) {
        this.name = name;
        this.course_regime = course_regime;
        this.weekly_hours = weekly_hours;
        this.total_hours = total_hours;
        this.correlatives = correlatives;
    }

    public getName () {
        return this.name;
    }

    public getCourseRegime () {
        return this.course_regime;
    }

    public getWeeklyHours () {
        return this.weekly_hours;
    }

    public getTotalHours () {
        return this.total_hours;
    }

    public getCorrelatives () {
        return this.correlatives;
    }
}