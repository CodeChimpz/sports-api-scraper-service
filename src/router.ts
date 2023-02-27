import e from "express";
import {Request, Response} from "express";
import {gamesController} from "./controllers/Game.controller.js";
import {register} from "mein-endpoint-registrator";
import {logger} from "./init/logger.js";

export const router = e.Router()
const endpoints = {
  '/games/get': gamesController.getAll,
  '/game/get': gamesController.get
}
register<(req: Request, res: Response) => Promise<void>>(router, endpoints, gamesController, {
  cache: true,
  logger: logger
})

