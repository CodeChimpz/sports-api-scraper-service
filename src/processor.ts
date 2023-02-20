import {Job} from "bull";
import {logger} from "./init/logger.js";
//sum fake data i got from rapidapi to emulate an api call
import fake from './fakeshit.json' assert {type: "json"};
import {bets} from "./services/Bet.service.js";

export async function processer(job: Job) {
    logger.app.debug('Job ran', job.data)
    //I ain't testing this rn, this shit has 20 free requests per day on a freemium plan, literally 1984
    //const results = await api.getEvents('/games',0,100, {})
    const results = fake.results
    await Promise.all(results.map((game: any) => {
        console.log(game.summary)
        return bets.save(game)
    }))
    return Promise.resolve()
}