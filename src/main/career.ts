import { load } from "cheerio";
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
            const rows = $('article table:first tbody tr');
    
            rows.each((_, row) => {
                if ($(row).attr('class')?.includes('header')) return;
    
                const data = new Array<string>();
                
                $(row).find('td').each((_, cell) => {
                    data.push($(cell).text());
                })
    
                if (data.length < 1 || data.length > 5) return;
    
                const parsedData = this.parseData(data);
                if (!parsedData) return;
    
                subjects.push(this.createSubject(parsedData));
            })
        } catch (error) {
            console.error(error);
        }

        return this.parseSubjects(subjects);
    }

    private parseData (data: Array<string>) {
        let sd: SubjectData;

        if (data.length === 4) {
            sd = {
                name: data[0],
                course_regime: 'INDEFINIDO',
                weekly_hours: data[1],
                total_hours: data[2],
                correlatives: data[3]
            }
        } else if (data.length === 5) {
            sd = {
                name: data[0],
                course_regime: data[1],
                weekly_hours: data[2],
                total_hours: data[3],
                correlatives: data[4]
            }
        } else {
            return null;
        }

        return sd;
    }

    private createSubject(sd: SubjectData): Subject {
        try {
            const name: string = sd.name
                .split('\n').join(' ')
                .split('*').join('').trim();
    
            const rd: string = sd.course_regime.toUpperCase().trim();
            const course_regime: CourseRegime =  (rd === 'ANUAL' || rd === 'SEMESTRAL') ? rd as CourseRegime : 'INDEFINIDO';
    
            const weekly_hours: number = isNaN(parseFloat(sd.weekly_hours)) ? 0 : parseFloat(sd.weekly_hours);
            const total_hours: number = isNaN(parseFloat(sd.total_hours)) ? 0 : parseFloat(sd.total_hours);
            
            const correlatives = sd.correlatives.trim();
            const parsed_correlatives: Array<string> = 
                sd.correlatives.trim().length > 0 ? sd.correlatives
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