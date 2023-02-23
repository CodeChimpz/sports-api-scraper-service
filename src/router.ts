import e from "express";
import {gamesController} from "./controllers/Game.controller.js";

export const router = e.Router()

router.get('/games/:id', gamesController.get)