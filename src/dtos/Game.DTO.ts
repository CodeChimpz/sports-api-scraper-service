import {IGame} from "../schema/Game.schema.js";

type Identifiable = { _id: string }

export interface IGameDTO extends Partial<Exclude<IGame, 'gameId' | 'lastUpdated'>>, Identifiable {

}

export class GameDTO implements IGameDTO {
  _id: string

  constructor(obj: IGame) {
    const obj_ = obj as IGameDTO
    delete obj_.gameId
    delete obj_.lastUpdated
    Object.assign(this, obj_)
  }
}