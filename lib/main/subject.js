"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Subject {
    constructor(name, course_regime, weekly_hours, total_hours, correlatives) {
        this.name = name;
        this.course_regime = course_regime;
        this.weekly_hours = weekly_hours;
        this.total_hours = total_hours;
        this.correlatives = correlatives;
    }
    getName() {
        return this.name;
    }
    getCourseRegime() {
        return this.course_regime;
    }
    getWeeklyHours() {
        return this.weekly_hours;
    }
    getTotalHours() {
        return this.total_hours;
    }
    getCorrelatives() {
        return this.correlatives;
    }
}
exports.default = Subject;
