import {LoggerService} from "mein-winston-logger";
import {Request, Response} from "express";
import {games, GameService} from "../services/Game.service.js";
import {logger} from "../init/logger.js";
import {GameDTO} from "../dtos/interfaces.js";
import {Document} from "mongoose";
import {IGame} from "../schema/Game.schema.js";
import {cache} from "../services/Cache.service.js";

export class GameController {
	service: GameService
	//util dependencies
	logger: LoggerService

	constructor(service: GameService, logger: LoggerService) {
		this.service = service
		this.logger = logger
	}

	//get List of all games in db
	async getAll() {
		return
	}

	//get full data on a game with teams, odds and misc data by Id
	get = async (req: Request, res: Response) => {
		try {
			const _id = req.params.id
			//try get from cache
			let result: Document<IGame> | null
			const from_cache = await cache.get(_id)
			if (!from_cache) {
				this.logger.app.debug('Cache miss for', _id)
				//get from db
				result = await this.service.getOneBy({'_id': _id})
				await cache.set(_id, result)
			} else {
				this.logger.app.debug('Cache hit for', _id)
				result = JSON.parse(from_cache)
			}
			if (!result) {
				return res.status(404).json({message: 'No game for such _id', data: null})
			}
			const data = new GameDTO(result)
			res.status(200).json({message: 'Success', data: data})
		} catch (e: any) {
			this.logger.app.error(e)
			res.status(500).json({message: 'Server error'})
		}
	}
}

export const gamesController = new GameController(games, logger)