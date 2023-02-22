import {Expression, HydratedDocument, Model} from "mongoose";
import {IGame} from "../schema/Game.schema.js";
import {logger} from "../init/logger.js";
import {Game} from "../init/mongoose.js";

//Saves bets to mongoDB and present data to the API, doesn't provide Bet placement
export class GameService {
	_model: Model<IGame>

	constructor(model: Model<IGame>) {
		this._model = model
	}

	async save(data: IGame) {
		//todo: update logic
		const exists: HydratedDocument<IGame> | null = await this._model.findOne({gameId: data.gameId})
		if (exists) {
			Object.assign(exists, data)
			exists.lastUpdated = new Date()
			return await exists.save()
		}
		const game: HydratedDocument<IGame> = await this._model.create(data)
		await game.save()
	}
}

export const bets = new GameService(Game)
