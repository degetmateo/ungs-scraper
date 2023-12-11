"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
const subject_1 = __importDefault(require("./subject"));
class Career {
    constructor(name, url) {
        this.name = name;
        this.url = url;
    }
    async getStudyPlan() {
        const subjects = new Array();
        try {
            const res = await fetch(this.url, { method: 'GET', mode: 'no-cors' });
            const html = await res.text();
            const $ = (0, cheerio_1.load)(html);
            $('article').each((_, e) => {
                const article = $(e);
                if (article.attr('data-url')?.includes('plan-de-estudios')) {
                    const table = article.find('table:first tbody');
                    table.find('tr').each((_, row) => {
                        const rowData = new Array();
                        $(row).find('td').each((_, cell) => {
                            rowData.push($(cell).text());
                        });
                        if (rowData.length === 5 && rowData[0].length > 1) {
                            const name = rowData[0]
                                .split('\n').join(' ');
                            const course_regime = rowData[1] ? rowData[1].toUpperCase() : 'INDEFINIDO';
                            const weekly_hours = isNaN(parseFloat(rowData[2])) ? 0 : parseFloat(rowData[2]);
                            const total_hours = isNaN(parseFloat(rowData[3])) ? 0 : parseFloat(rowData[3]);
                            const correlatives = rowData[4]
                                .split(';').join('-')
                                .split('–').join('-')
                                .split('\n').join(' ')
                                .split('-').map(s => s.trim());
                            const subject = new subject_1.default(name, course_regime, weekly_hours, total_hours, correlatives);
                            subjects.push(subject);
                        }
                        ;
                    });
                }
            });
        }
        catch (error) {
            console.error(error);
        }
        return subjects;
    }
    getName() { return this.name; }
    ;
    getURL() { return this.url; }
    ;
}
exports.default = Career;
