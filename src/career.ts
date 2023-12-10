import { load } from "cheerio";
import Subject from "./subject";
import { CourseRegime } from "./types";

export default class Career {
    private name: string;
    private url: string;

    constructor (name: string, url: string) {
        this.name = name;
        this.url = url;
    }

    public async getStudyPlan () {
        const subjects = new Array<Subject>();

        try {
            const res = await fetch(this.url, { method: 'GET', mode: 'no-cors' })
            const html = await res.text();
            const $ = load(html);

            $('article').each((_, e) => {
                const article = $(e);

                if (article.attr('data-url')?.includes('plan-de-estudios')) {
                    const table = article.find('table:first tbody');

                    table.find('tr').each((_, row) => {
                        const rowData = new Array<string>()

                        $(row).find('td').each((_, cell) => {
                            rowData.push($(cell).text());
                        })

                        if (rowData.length === 5 && rowData[0].length > 1) {
                            const name: string = rowData[0]
                                .split('\n').join(' ');

                            const course_regime: CourseRegime = rowData[1] ? rowData[1].toUpperCase() as CourseRegime : 'INDEFINIDO';
                            const weekly_hours: number = isNaN(parseFloat(rowData[2])) ? 0 : parseFloat(rowData[2]);
                            const total_hours: number = isNaN(parseFloat(rowData[3])) ? 0 : parseFloat(rowData[3]);
                            const correlatives: Array<string> = 
                                rowData[4]
                                    .split(';').join('-')
                                    .split('–').join('-')
                                    .split('\n').join(' ')
                                    .split('-').map(s => s.trim());

                            const subject = new Subject(name, course_regime, weekly_hours, total_hours, correlatives);
                            subjects.push(subject);
                        };
                    })

                }
            });
        } catch (error) {
            console.error(error);
        }

        return subjects;
    }

    public getName () { return this.name };
    public getURL () { return this.url };
}