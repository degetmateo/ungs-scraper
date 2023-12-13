import { Element, load } from "cheerio";
import Subject from "./subject";
import { CourseRegime } from "./types";
import Careers from "./careers";

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

                    row.find('td').each((_, cell) => {
                        rowData.push($(cell).text());
                    })

                    if (rowData.length != 5 || rowData[0].length < 1) return;

                    subjects.push(this.createSubject(rowData));
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

    private createSubject(row: Array<string>): Subject {
        try {
            const name: string = row[0]
                .split('\n').join(' ')
                .split('*').join('').trim();
    
            const rd: string = row[1].toUpperCase().trim();
            const course_regime: CourseRegime =  (rd === 'ANUAL' || rd === 'SEMESTRAL') ? rd as CourseRegime : 'INDEFINIDO';
    
            const weekly_hours: number = isNaN(parseFloat(row[2])) ? 0 : parseFloat(row[2]);
            const total_hours: number = isNaN(parseFloat(row[3])) ? 0 : parseFloat(row[3]);
            
            const correlatives: Array<string> = 
                row[4].trim().length > 0 ? row[4]
                    .split(';').join('-')
                    .split('–').join('-')
                    .split('\n').join('-')
                    .split('\n').map(s => s.trim()) : [];
    
            return new Subject(name, course_regime, weekly_hours, total_hours, correlatives);
        } catch (error) {
            throw error;
        }
    }

    // En la pagina hay muchas ocasiones en las que los nombres de las materias tienen faltas ortograficas, o el mismo nombre
    // fue escrito de formas diferentes en distintos lugares (con tildes y sin tildes, con mayusculas y sin mayusculas, a veces
    // falta una palabra en el nombre entero de la materia, o se comieron letras al escribir los nombres).
    // En tales casos por el momento es imposible utilizar esos nombres mal escritos con comparaciones y por ende
    // hay ciertos casos donde faltaran materias correlativas.

    private parseSubjects (subjects: Array<Subject>): Array<Subject> {
        for (const subject of subjects) {
            const normalizedName = this.deleteTildes(subject.getName().toLowerCase().trim());

            for (const s2 of subjects) {
                if (subject.getName() === s2.getName()) continue;

                const correlatives = s2.getCorrelatives();
                if (correlatives.length < 1) continue;

                const normalizedCorrelatives = this.deleteTildes(correlatives[0].toLowerCase().trim());
                if (normalizedCorrelatives.includes(normalizedName)) correlatives.push(subject.getName());
            }
        }

        for (const subject of subjects) {
            subject.getCorrelatives().shift();
        }

        return subjects;
    }

    private deleteTildes (text: string): string {
        const mapaTildes: any = {
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
    
        return text.replace(/[áéíóúüñÁÉÍÓÚÜÑ]/g, letter => mapaTildes[letter]);
    }

    public getName () {
        return this.name
    };
    
    public getURL () {
        return this.url
    };
}