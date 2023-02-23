import {IGame} from "../schema/Game.schema.js";
import {Document, HydratedDocument} from "mongoose";

type Identifiable = { _id: string }

export interface IGameDTO extends Partial<Exclude<IGame, 'gameId' | 'lastUpdated'>>, Identifiable {

}

export class GameDTO implements IGameDTO {
	_id: string

	constructor(obj: Document<IGame>) {
		const obj_: any = {...obj}
		delete obj_.gameId
		delete obj_.lastUpdated
		Object.assign(this, obj_)
	}
}