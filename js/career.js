"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
const subject_1 = __importDefault(require("./subject"));
const careers_1 = __importDefault(require("./careers"));
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
            const $ = (0, cheerio_1.load)(await careers_1.default.getPage(this.url));
            $('article').each((_, e) => {
                if (!this.isCorrectArticle(e))
                    return;
                const article = $(e);
                const table = article.find('table:first tbody');
                table.find('tr').each((_, row_element) => {
                    const rowData = new Array();
                    const row = $(row_element);
                    if (row.attr('class')?.includes('header'))
                        return;
                    row.find('td').each((_, cell_element) => {
                        const cell = $(cell_element);
                        rowData.push(cell.text());
                    });
                    if (rowData[0].length < 1 || rowData.length > 5)
                        return;
                    let subjectData;
                    if (rowData.length === 4) {
                        subjectData = {
                            name: rowData[0],
                            course_regime: 'INDEFINIDO',
                            weekly_hours: rowData[1],
                            total_hours: rowData[2],
                            correlatives: rowData[3]
                        };
                    }
                    else if (rowData.length === 5) {
                        subjectData = {
                            name: rowData[0],
                            course_regime: rowData[1],
                            weekly_hours: rowData[2],
                            total_hours: rowData[3],
                            correlatives: rowData[4]
                        };
                    }
                    else {
                        return;
                    }
                    subjects.push(this.createSubject(subjectData));
                });
            });
        }
        catch (error) {
            console.error(error);
        }
        return this.parseSubjects(subjects);
    }
    isCorrectArticle(e) {
        return (e.attribs['data-url'].includes('plan-de-estudios'));
    }
    createSubject(data) {
        try {
            const name = data.name
                .split('\n').join(' ')
                .split('*').join('').trim();
            const rd = data.course_regime.toUpperCase().trim();
            const course_regime = (rd === 'ANUAL' || rd === 'SEMESTRAL') ? rd : 'INDEFINIDO';
            const weekly_hours = isNaN(parseFloat(data.weekly_hours)) ? 0 : parseFloat(data.weekly_hours);
            const total_hours = isNaN(parseFloat(data.total_hours)) ? 0 : parseFloat(data.total_hours);
            const correlatives = data.correlatives.trim().length > 0 ? data.correlatives
                .split(';').join('-')
                .split('–').join('-')
                .split('\n').join('-')
                .split('\n').map(s => s.trim()) : [];
            return new subject_1.default(name, course_regime, weekly_hours, total_hours, correlatives);
        }
        catch (error) {
            throw error;
        }
    }
    // En la pagina hay muchas ocasiones en las que los nombres de las materias tienen faltas ortograficas, o el mismo nombre
    // fue escrito de formas diferentes en distintos lugares (con tildes y sin tildes, con mayusculas y sin mayusculas, a veces
    // falta una palabra en el nombre entero de la materia, o se comieron letras al escribir los nombres).
    // En tales casos por el momento es imposible utilizar esos nombres mal escritos con comparaciones y por ende
    // hay ciertos casos donde faltaran materias correlativas.
    parseSubjects(subjects) {
        for (const subject of subjects) {
            const normalizedName = this.normalize(subject.getName());
            for (const s2 of subjects) {
                if (normalizedName === this.normalize(s2.getName()))
                    continue;
                const correlatives = s2.getCorrelatives();
                if (correlatives.length < 1)
                    continue;
                const normalizedCorrelatives = this.normalize(correlatives[0]);
                if (normalizedCorrelatives.includes(normalizedName))
                    correlatives.push(subject.getName());
            }
        }
        for (const subject of subjects) {
            subject.getCorrelatives().shift();
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
