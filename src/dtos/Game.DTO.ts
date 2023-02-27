import {IGame} from "../schema/Game.schema.js";

type Identifiable = { _id: string }

export type TGameDTO = Partial<Exclude<IGame, 'gameId' | 'lastUpdated'>> & Identifiable

export class GameDTO implements TGameDTO {
  _id: string

  constructor(obj: IGame) {
    const obj_ = obj as TGameDTO
    delete obj_.gameId
    delete obj_.lastUpdated
    Object.assign(this, obj_)
  }
}