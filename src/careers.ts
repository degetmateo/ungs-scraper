import axios from 'axios';
import { load } from 'cheerio';
import Career from './career';

export default class Careers {
    public static readonly URL_CAREERS: string = 'https://www.ungs.edu.ar/category/estudiar-en-la-ungs/carreras';

    public static async getCareers (): Promise<Array<Career>> {
        const career = new Array<Career>();
        
        try {
            const res = await axios.get(this.URL_CAREERS);
            const $ = load(res.data);

            $('td a').each((i, e) => {
                const cheerioElement = $(e);
                const name = cheerioElement.text().trim();
                const url = cheerioElement.attr('href');
                if (name && url) career.push(new Career(name, url));
            });
        } catch (error) {
            console.error(error)
        }

        return career;
    }
}