import {HydratedDocument, Model} from "mongoose";
import _ from 'lodash';
import {IGame} from "../schema/Game.schema.js";
import {logger} from "../init/logger.js";
import {Game} from "../init/mongoose.js";
import {cache} from "./Cache.service.js";
import {compareR} from "../util/index.js";
import {TGameFilter, TSchemaPartial} from "../ts/types.js";


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
    if (!exists) {
      game = await this._model.create(data)
    } else {
      //check if API signified any updates on the data - if not : still check if odds were updated
      const updated = compareR<IGame>(exists.toObject(), data, ['lastUpdated', 'moneyline', 'spread', 'total'])
      // ugly and bad вложенность ong but idk another way:^(((
      if (updated) {
        logger.app.debug('Api data updated ', {_id: exists._id, apiId: exists.gameId})
        game = _.merge(exists, data)
      } else {
        game = exists
      }
    }

    await game.save()
    //Kinda weird to put it here and not in controller idk
    await cache.set(game._id, JSON.stringify(game))
  }


  async getOneBy(obj: Partial<IGame & { _id: string }>): Promise<IGame> {
    return this._model.findOne(obj).lean()
  }

  async getManyBy(opts: TGameFilter): Promise<IGame[]> {
    const filters: { [key: string]: any } = {}
    //hierarchy is conference -> division -> name,so if name is specified we omit division and so on
    const searchTeamBy = opts.teams ? 'team' : opts.division ? 'division' : opts.conference ? 'conference' : undefined
    switch (searchTeamBy) {
    case 'team':
      filters['$or'] = [{
        "teams.home.team": {
          $in: opts.teams
        }
      },
      {
        "teams.away.team": {
          $in: opts.teams
        }
      }]
      break
    case 'division':
      filters['$or'] = [{
        "teams.home.division": {
          $in: opts.division
        }
      },
      {
        "teams.away.division": {
          $in: opts.division
        }
      }]
      break
    case 'conference':
      filters['$or'] = [{
        "teams.home.conference": opts.conference
      },
      {
        "teams.away.conference": opts.conference
      }]
      break
    default:
      break
    }
    //
    if (opts.date) {
      filters["schedule.date"] = opts.date
    }
    if (opts.status) {
      filters.status = opts.status
    }
    if (opts.league) {
      filters["details.league"] = opts.league
    }
    //if I use realtions this will be a pain in the ass , so I'm better off with embeds ig
    return this._model.find(filters, null, {
      skip: opts.skip || 0,
      limit: opts.limit || 100
    }).lean()
  }

}

export const games = new GameService(Game)
