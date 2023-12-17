import { Element, load } from "cheerio";
import Subject from "./subject";
import { CourseRegime, SubjectData } from "./types";
import { Careers } from "./careers";

export default class Career {
    private name: string;
    private url: string;

    constructor (name: string, url: string) {
        this.name = name;
        this.url = url;
    }

    /**
     * Returns an array of subjects.
     * @returns {Array<Subject>}
     */

    public async getStudyPlan (): Promise<Array<Subject>> {
        const subjects = new Array<Subject>();

        try {
            const $ = load(await Careers.getPage(this.url));

            $('article').each((_, e) => {
                if (!this.isCorrectArticle(e)) return;

                const article = $(e);
                const table = article.find('table:first tbody');

                table.find('tr').each((_, row_element) => {
                    const rowData = new Array<string>()
                    const row = $(row_element);
                    if (row.attr('class')?.includes('header')) return;
                    
                    row.find('td').each((_, cell_element) => {
                        const cell = $(cell_element);
                        rowData.push(cell.text());
                    })

                    if (rowData[0].length < 1 || rowData.length > 5) return;

                    let subjectData: SubjectData;

                    if (rowData.length === 4) {
                        subjectData = {
                            name: rowData[0],
                            course_regime: 'INDEFINIDO',
                            weekly_hours: rowData[1],
                            total_hours: rowData[2],
                            correlatives: rowData[3]
                        }
                    } else if (rowData.length === 5) {
                        subjectData = {
                            name: rowData[0],
                            course_regime: rowData[1],
                            weekly_hours: rowData[2],
                            total_hours: rowData[3],
                            correlatives: rowData[4]
                        }
                    } else {
                        return;
                    }

                    subjects.push(this.createSubject(subjectData));
                })
            });
        } catch (error) {
            console.error(error);
        }

        return this.parseSubjects(subjects);
    }

    private isCorrectArticle (e: Element): boolean {
        return (e.attribs['data-url'].includes('plan-de-estudios'));
    }

    private createSubject(data: SubjectData): Subject {
        try {
            const name: string = data.name
                .split('\n').join(' ')
                .split('*').join('').trim();
    
            const rd: string = data.course_regime.toUpperCase().trim();
            const course_regime: CourseRegime =  (rd === 'ANUAL' || rd === 'SEMESTRAL') ? rd as CourseRegime : 'INDEFINIDO';
    
            const weekly_hours: number = isNaN(parseFloat(data.weekly_hours)) ? 0 : parseFloat(data.weekly_hours);
            const total_hours: number = isNaN(parseFloat(data.total_hours)) ? 0 : parseFloat(data.total_hours);
            
            const correlatives = data.correlatives.trim();
            const parsed_correlatives: Array<string> = 
                data.correlatives.trim().length > 0 ? data.correlatives
                        .split(';').join('-')
                        .split('–').join('-')
                        .split('\n').join('-')
                        .split('\n').map(s => s.trim()) : [];
    
            return new Subject(name, course_regime, weekly_hours, total_hours, correlatives, parsed_correlatives);
        } catch (error) {
            throw error;
        }
    }

    private parseSubjects (subjects: Array<Subject>): Array<Subject> {
        for (const subject of subjects) {
            const normalizedName = this.normalize(subject.getName());

            for (const s2 of subjects) {
                if (normalizedName === this.normalize(s2.getName())) continue;

                const parsedCorrelatives = s2.getParsedCorrelatives();
                if (parsedCorrelatives.length < 1) continue;

                const normalizedCorrelatives = this.normalize(parsedCorrelatives[0]);
                if (normalizedCorrelatives.includes(normalizedName)) parsedCorrelatives.push(subject.getName());
            }
        }

        for (const subject of subjects) {
            subject.getParsedCorrelatives().shift();
        }

        return subjects;
    }

    private normalize (text: string): string {
        return ((this.deleteAccentMark(text)).toLowerCase()).replace(/\s/g, '');
    }

    private deleteAccentMark (text: string): string {
        const map: any = {
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

    public getName (): string {
        return this.name
    };
    
    public getURL (): string {
        return this.url
    };
}