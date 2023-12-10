# ungs-scraper
Get information about the careers from the UNGS website.

Careers.default.getCareers() is a static async method which returns an array of all Careers.

Each Career follows this estructure:
Career {
    name: string,
    url: string,
    async getStudyPlan(): Array<Subject>
}

Each Subject follows this estructure:
Subject {
    name: string,
    course_regime: ANUAL | SEMESTRAL | INDEFINIDO,
    weekly_hours: number, 
    total_hours: number,
    correlatives: Array<string>
}