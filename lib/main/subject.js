"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Subject {
    constructor(name, course_regime, weekly_hours, total_hours, correlatives, parsed_correlatives) {
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
    getName() {
        return this.name;
    }
    /**
     * Returns the course regime of the subject.
     * @returns {'SEMESTRAL' | 'ANUAL' | 'INDEFINIDO'}
     */
    getCourseRegime() {
        return this.course_regime;
    }
    /**
     * Returns the weekly hours of the subject.
     * @returns {number}
     */
    getWeeklyHours() {
        return this.weekly_hours;
    }
    /**
     * Returns the total hours of the subject.
     * @returns {number}
     */
    getTotalHours() {
        return this.total_hours;
    }
    /**
     * Returns the correlatives of the subject.
     * @returns {string}
     */
    getCorrelatives() {
        return this.correlatives;
    }
    /**
     * Returns the correlatives of the subject but parsed into an array.
     * CAUTION: This method doesnt work properly yet.
     * @returns {Array<string>}
     */
    getParsedCorrelatives() {
        return this.parsed_correlatives;
    }
}
exports.default = Subject;
