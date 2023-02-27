import {LoggerService} from "mein-winston-logger";
import {Request, Response} from "express";
import {games, GameService} from "../services/Game.service.js";
import {logger} from "../init/logger.js";
import {GameDTO} from "../dtos/Game.DTO.js";
import {IGame} from "../schema/Game.schema.js";
import {cache} from "../services/Cache.service.js";
import {isGameFilter} from "../ts/guards.js";

export class GameController {
  service: GameService
  //util dependencies
  logger: LoggerService

  constructor(service: GameService, logger: LoggerService) {
    this.service = service
    this.logger = logger
  }

  //get List of all games in db
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const passed = req.body.filters
      //check if filters passed are valid
      if (!isGameFilter(passed)) {
        res.status(422).json({message: 'Incorrect filters supplied'})
        return
      }
      //get filters as serialized key for cache
      const key: string = JSON.stringify(passed)
      //try get from cache
      const from_cache = !(this as any).REQ_CACHE ? undefined : await cache.get<string[]>(key)
      //if cahce miss - find from db , else - populate cached ids from db
      const games_: IGame[] = from_cache ? await Promise.all(from_cache.map((_id: string) => this.service.getOneBy({_id: _id}))) : await this.service.getManyBy(passed)
      //wrap with dto
      const results = games_.filter((game: any) => game !== null).map((game: IGame) => new GameDTO(game))
      if (!results) {
        res.status(400).json({message: 'Nothing found with the filters'})
        return
      }
      //todo : mb a method to lrange/push in cache instance and cache arrays , test which is faster
      //set ids to cache
      await cache.set(key, JSON.stringify(results.map((result: GameDTO) => result._id)))
      res.status(200).json({message: 'Success', data: results})
      //can't really write-through this stuff so we'll go with cache aside
    } catch (e: any) {
      this.logger.app.error(e)
      res.status(500).json({message: 'Server error'})
    }
  }

  //get full data on a game with teams, odds and misc data by Id
  get = async (req: Request, res: Response): Promise<void> => {
    try {
      const _id = req.params.id
      //try get from cache
      const from_cache = !(this as any).REQ_CACHE ? undefined : await cache.get<IGame>(_id)
      // get from db if CACHE MISS
      const result: IGame = from_cache ? from_cache : await this.service.getOneBy({'_id': _id})
      if (!result) {
        res.status(404).json({message: 'No game for such _id', data: null})
        return
      }
      const data = new GameDTO(result)
      res.status(200).json({message: 'Success', data: data})
    } catch (e: any) {
      this.logger.app.error(e)
      res.status(500).json({message: 'Server error'})
    }
  }
}

export const
  gamesController = new GameController(games, logger)