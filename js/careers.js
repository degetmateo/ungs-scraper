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
            const $ = (0, cheerio_1.load)(await this.getPage(this.URL_CAREERS));
            $('td a').each((i, e) => {
                const a = $(e);
                const name = a.text().trim();
                const url = a.attr('href');
                if (name && url)
                    careers.push(new career_1.default(name, url));
            });
        }
        catch (error) {
            console.error(error);
        }
        return careers;
    }
    static async getPage(url) {
        try {
            const res = await fetch(url, { method: 'GET' });
            return await res.text();
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = Careers;
Careers.URL_CAREERS = 'https://www.ungs.edu.ar/category/estudiar-en-la-ungs/carreras';
