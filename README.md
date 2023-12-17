# ungs-scraper
Get information about the careers from the UNGS website.
## Documentation

`const { Careers } = require('./lib/index.js')`

`Careers.getCareers()` is a static async method which returns an array of all Careers.

Each `Career` has this properties: `name: string`, `url: string`, and an async method called `getStudyPlan()` which returns an array of `Subject`.

Each `Subject` has this properties: `name: string`, `course_regime: ANUAL | SEMESTRAL | INDEFINIDO`, `weekly_hours: number`, `total_hours: number`, `correlatives: string`. You can get the properties with their getters. 