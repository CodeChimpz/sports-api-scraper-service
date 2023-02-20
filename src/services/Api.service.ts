import axios from "axios";
import {logger} from "../init/logger.js";
import {LoggerService} from "mein-winston-logger";
import {config} from "dotenv";

interface IGameSearchParams {
    league?: string,
    odds?: false | 'spread' | 'moneyline' | 'total' | true
    status?: string,
    date?: string
}

enum THeaders {key = 'X-RapidAPI-Key', host = 'X-RapidAPI-Host'}

type IRapidApiOptions = {
    [key in THeaders]: string
}

interface IScraperOptions {
    name?: string,
    url: string,
    headerOptions: IRapidApiOptions,
    logger: LoggerService
}

export class RapidApiScraper {
    url: string
    name: string | undefined
    headers: any
    //
    logger: LoggerService

    constructor(options: IScraperOptions) {
        const {url, name, headerOptions, logger} = options
        this.url = url
        this.headers = {}
        Object.assign(this.headers, headerOptions)
        this.name = name
        //dependencies
        this.logger = logger
    }

    async getEvents(path: string, skip: number, limit: number, params: IGameSearchParams) {
        try {
            const options = {
                method: 'GET',
                url: this.url + path,
                headers: this.headers
            };
            console.log(options)
            const response = await axios.request(options)
            return response.data
        } catch (error: any) {
            logger.http.error(error)
            return
        }
    }
}

config()
const {X_RAPIDAPI_KEY, X_RAPIDAPI_HOST, RAPIDAPI_URL, RAPIDAPI_NAME} = process.env
export const api = new RapidApiScraper({
    url: String(RAPIDAPI_URL),
    name: String(RAPIDAPI_NAME),
    headerOptions: {
        [THeaders.key]: String(X_RAPIDAPI_KEY),
        [THeaders.host]: String(X_RAPIDAPI_HOST)
    },
    logger: logger
})