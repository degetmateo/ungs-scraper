import { CourseRegime } from "./types";

export default class Subject {
    private name: string;
    private course_regime: CourseRegime;
    private weekly_hours: number;
    private total_hours: number;
    private correlatives: string;
    private parsed_correlatives: Array<string>;

    constructor (name:string, course_regime:CourseRegime, weekly_hours:number, total_hours:number, correlatives:string,parsed_correlatives:Array<string>) {
        this.name = name;
        this.course_regime = course_regime;
        this.weekly_hours = weekly_hours;
        this.total_hours = total_hours;
        this.correlatives = correlatives;
        this.parsed_correlatives = parsed_correlatives;
    }

    /**
     * Returns the name of the subject.
     * @returns {string}
     */

    public getName () {
        return this.name;
    }

    /**
     * Returns the course regime of the subject.
     * @returns {'SEMESTRAL' | 'ANUAL' | 'INDEFINIDO'}
     */

    public getCourseRegime () {
        return this.course_regime;
    }

    /**
     * Returns the weekly hours of the subject.
     * @returns {number}
     */

    public getWeeklyHours () {
        return this.weekly_hours;
    }

    /**
     * Returns the total hours of the subject.
     * @returns {number}
     */

    public getTotalHours () {
        return this.total_hours;
    }

    /**
     * Returns the correlatives of the subject.
     * @returns {string}
     */

    public getCorrelatives () {
        return this.correlatives;
    }

    /**
     * Returns the correlatives of the subject but parsed into an array. 
     * CAUTION: This method doesnt work properly yet.
     * @returns {Array<string>}
     */

    public getParsedCorrelatives () {
        return this.parsed_correlatives;
    }
}