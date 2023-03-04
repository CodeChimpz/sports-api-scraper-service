import e, {Request, Response, NextFunction} from "express";
import {gamesController} from "./controllers/Game.controller.js";
import {registerEndpoint, registerMiddleware} from "mein-endpoint-registrator";
import {logger} from "./init/logger.js";
import {sidecar} from "./init/registry.js";

export const router = e.Router()
const endpoints = {
  '/games/get': gamesController.getAll,
  '/game/get': gamesController.get
}
const middlewares = {
  '/games/get': [{mw: sidecar.registerEndpoint, ctx: sidecar as any}],
  '/game/get': [{mw: sidecar.registerEndpoint, ctx: sidecar as any}]
}
registerMiddleware<(req: Request, res: Response, next: NextFunction) => Promise<void>>(router, middlewares)
registerEndpoint<(req: Request, res: Response) => Promise<void>>(router, endpoints, {...gamesController, ...sidecar}, {
  cache: true,
  logger: logger
})


