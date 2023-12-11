"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
const career_1 = __importDefault(require("./career"));
class Careers {
    static async getCareers() {
        const careers = new Array();
        try {
            const res = await fetch(this.URL_CAREERS, { method: 'GET', mode: 'no-cors' });
            const html = await res.text();
            const $ = (0, cheerio_1.load)(html);
            $('td a').each((i, e) => {
                const cheerioElement = $(e);
                const name = cheerioElement.text().trim();
                const url = cheerioElement.attr('href');
                if (name && url)
                    careers.push(new career_1.default(name, url));
            });
        }
        catch (error) {
            console.error(error);
        }
        return careers;
    }
}
exports.default = Careers;
Careers.URL_CAREERS = 'https://www.ungs.edu.ar/category/estudiar-en-la-ungs/carreras';
