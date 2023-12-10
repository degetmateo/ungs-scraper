# ungs-scraper
Get information about the careers from the UNGS website.
## Documentation

`Careers.default.getCareers()` is a static async method which returns an array of all Careers.

Each `Career` has this properties: `name: string`, `url: string`, and an async method called `getStudyPlan()` which returns an array of `Subject`.

Each `Subject` has this properties: `name: string`, `course_regime`: `ANUAL` | `SEMESTRAL` | `INDEFINIDO`, `weekly_hours: number`, `total_hours: number` and `correlatives: Array<string>`.