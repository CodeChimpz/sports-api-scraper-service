import {Expression, HydratedDocument, Model} from "mongoose";
import {Game} from "../init/mongoose.js";

//todo: proper typings
export class BetService<T> {
    model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async save(data: any) {
        //
        const exists: HydratedDocument<any> = await this.model.findOne({gameId: data.gameId}).lean()
        if (exists) {
            Object.assign(exists, data)
            const date = new Date()
            exists.lastUpdated = date.getUTCDate()
            return await exists.save()
        }
        const game: HydratedDocument<T> = await this.model.create(data)
        console.log(game)
        await game.save()
    }
}

export const bets = new BetService<any>(Game)