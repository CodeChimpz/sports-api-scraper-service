import {HydratedDocument, Document, Model} from "mongoose";
import _ from 'lodash';
import {IGame} from "../schema/Game.schema.js";
import {logger} from "../init/logger.js";
import {Game} from "../init/mongoose.js";
import {cache} from "./Cache.service.js";


//Saves bets to mongoDB and present data to the API, doesn't provide Bet placement
export class GameService {
	_model: Model<IGame>

	constructor(model: Model<IGame>) {
		this._model = model
	}

	//save new or update existing game
	async save(data: IGame) {
		const exists: HydratedDocument<IGame> | null = await this._model.findOne({gameId: data.gameId})
		let game: HydratedDocument<IGame>
		if (exists) {
			//todo: update logic
			console.log(await checkForUpdateR<IGame>(exists, data, ['lastUpdated']))
			game = _.merge(exists, data)
			// const game_upd = exists
			// game.lastUpdated = new Date()
		} else {
			game = await this._model.create(data)
		}
		// await game.save()
		//Kinda weird to put it here idk
		// await cache.set(game._id, JSON.stringify(game))
	}

	// { [key in keyof IGame]: IGame[key] }
	async getOneBy(obj: Partial<IGame & { _id: string }>) {
		const game: Document<IGame> = await this._model.findOne(obj).lean()
		return game
	}


}

export const games = new GameService(Game)

//util function to check if two mongoose model instances are different by a certain parameter , works recursively
async function checkForUpdateR<T extends { [key: string]: any }>(old: HydratedDocument<T>, compare: T, params: string[]): Promise<boolean> {
	return !!params.find((param): boolean => {
		const oldObj = old.toObject()
		const instantly: boolean = oldObj[param] && oldObj[param] !== compare[param]
		console.log('instance', oldObj[param] !== compare[param], '1', oldObj[param], '2', compare[param])
		return instantly || !!Object.entries(oldObj).find((entry: any) => {
			const [key, val] = entry
			if (typeof val === 'object' && compare[key]) {
				return checkForUpdateR<T>(val, compare[key], params)
			}
		})
	})
}
