import {Job} from "bull";
import {logger} from "./init/logger.js";
//sum fake data i got from rapidapi to emulate an api call
import fake from './mock.json' assert {type: "json"};
import {games} from "./services/Game.service.js";

export async function processer(job: any) {
	logger.app.debug('Job running', job.data)
	//I ain't testing this rn, this shit has 20 free requests per day on a freemium plan, literally 1984
	//const results = await api.getEvents('/games',0,100, {})0
	const results = fake
	//
	await Promise.all(results.results.map((game: any) => {
		return games.save(game)
	}))
}