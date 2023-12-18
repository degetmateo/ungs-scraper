"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
const subject_1 = __importDefault(require("./subject"));
const careers_1 = require("./careers");
class Career {
    constructor(name, url) {
        this.name = name;
        this.url = url;
    }
    /**
     * Returns an array of subjects.
     * @returns {Array<Subject>}
     */
    async getStudyPlan() {
        const subjects = new Array();
        try {
            const $ = (0, cheerio_1.load)(await careers_1.Careers.getPage(this.url));
            const rows = $('article table:first tbody tr');
            rows.each((_, row) => {
                if ($(row).attr('class')?.includes('header'))
                    return;
                const data = new Array();
                $(row).find('td').each((_, cell) => {
                    data.push($(cell).text());
                });
                if (data.length < 1 || data.length > 5)
                    return;
                const parsedData = this.parseData(data);
                if (!parsedData)
                    return;
                subjects.push(this.createSubject(parsedData));
            });
        }
        catch (error) {
            console.error(error);
        }
        return this.parseSubjects(subjects);
    }
    parseData(data) {
        let sd;
        if (data.length === 4) {
            sd = {
                name: data[0],
                course_regime: 'INDEFINIDO',
                weekly_hours: data[1],
                total_hours: data[2],
                correlatives: data[3]
            };
        }
        else if (data.length === 5) {
            sd = {
                name: data[0],
                course_regime: data[1],
                weekly_hours: data[2],
                total_hours: data[3],
                correlatives: data[4]
            };
        }
        else {
            return null;
        }
        return sd;
    }
    createSubject(sd) {
        try {
            const name = sd.name
                .split('\n').join(' ')
                .split('*').join('').trim();
            const rd = sd.course_regime.toUpperCase().trim();
            const course_regime = (rd === 'ANUAL' || rd === 'SEMESTRAL') ? rd : 'INDEFINIDO';
            const weekly_hours = isNaN(parseFloat(sd.weekly_hours)) ? 0 : parseFloat(sd.weekly_hours);
            const total_hours = isNaN(parseFloat(sd.total_hours)) ? 0 : parseFloat(sd.total_hours);
            const correlatives = sd.correlatives.trim();
            const parsed_correlatives = sd.correlatives.trim().length > 0 ? sd.correlatives
                .split(';').join('-')
                .split('–').join('-')
                .split('\n').join('-')
                .split('\n').map(s => s.trim()) : [];
            return new subject_1.default(name, course_regime, weekly_hours, total_hours, correlatives, parsed_correlatives);
        }
        catch (error) {
            throw error;
        }
    }
    parseSubjects(subjects) {
        for (const subject of subjects) {
            const normalizedName = this.normalize(subject.getName());
            for (const s2 of subjects) {
                if (normalizedName === this.normalize(s2.getName()))
                    continue;
                const parsedCorrelatives = s2.getParsedCorrelatives();
                if (parsedCorrelatives.length < 1)
                    continue;
                const normalizedCorrelatives = this.normalize(parsedCorrelatives[0]);
                if (normalizedCorrelatives.includes(normalizedName))
                    parsedCorrelatives.push(subject.getName());
            }
        }
        for (const subject of subjects) {
            subject.getParsedCorrelatives().shift();
        }
        return subjects;
    }
    normalize(text) {
        return ((this.deleteAccentMark(text)).toLowerCase()).replace(/\s/g, '');
    }
    deleteAccentMark(text) {
        const map = {
            'á': 'a',
            'é': 'e',
            'í': 'i',
            'ó': 'o',
            'ú': 'u',
            'ü': 'u',
            'ñ': 'n',
            'Á': 'A',
            'É': 'E',
            'Í': 'I',
            'Ó': 'O',
            'Ú': 'U',
            'Ü': 'U',
            'Ñ': 'N'
        };
        return text.replace(/[áéíóúüñÁÉÍÓÚÜÑ]/g, letter => map[letter]);
    }
    getName() {
        return this.name;
    }
    ;
    getURL() {
        return this.url;
    }
    ;
}
exports.default = Career;
