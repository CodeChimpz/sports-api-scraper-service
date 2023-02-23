import express, {json, Request, Response} from 'express'
import {logger} from "./init/logger.js";
import {router} from "./router.js";

export const app = express()
app.use(json())
//todo: authentication mw
app.use(router)
