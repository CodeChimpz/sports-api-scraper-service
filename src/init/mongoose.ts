import * as Mongoose from "mongoose";
import {config} from "dotenv";
import {model} from "mongoose";
import {gameSchema} from "../schema/Game.schema.js";
config()
export const mongoose = await Mongoose.connect(String(process.env.MONGO_URL))

export const Game = model('Game', gameSchema)