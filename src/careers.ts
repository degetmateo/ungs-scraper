import { load } from 'cheerio';
import Career from './career';

export class Careers {
    public static readonly URL_CAREERS: string = 'https://www.ungs.edu.ar/category/estudiar-en-la-ungs/carreras';

    /**
     * Returns an array of careers.
     * @returns {Array<Career>}
     */
    
    public static async getCareers (): Promise<Array<Career>> {
        const careers = new Array<Career>();
        
        try {
            const $ = load(await this.getPage(this.URL_CAREERS));

            $('td a').each((i, e) => {
                const a = $(e);
                const name = a.text().trim();
                const url = a.attr('href');
                if (name && url) careers.push(new Career(name, url));
            });
        } catch (error) {
            console.error(error)
        }

        return careers;
    }

    public static async getPage (url: string): Promise<string> {
        try {
            const res = await fetch(url, { method: 'GET' });
            return await res.text();
        } catch (error) {
            throw error;
        }
    }
}