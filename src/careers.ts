import { load } from 'cheerio';
import Career from './career';

export default class Careers {
    public static readonly URL_CAREERS: string = 'https://www.ungs.edu.ar/category/estudiar-en-la-ungs/carreras';

    public static async getCareers (): Promise<Array<Career>> {
        const careers = new Array<Career>();
        
        try {
            const res = await fetch(this.URL_CAREERS, { method: 'GET', mode: 'no-cors' })
            const html = await res.text();
            const $ = load(html);

            $('td a').each((i, e) => {
                const cheerioElement = $(e);
                const name = cheerioElement.text().trim();
                const url = cheerioElement.attr('href');
                if (name && url) careers.push(new Career(name, url));
            });
        } catch (error) {
            console.error(error)
        }

        return careers;
    }
}