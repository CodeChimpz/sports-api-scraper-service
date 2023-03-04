import Redis from "ioredis";
import {config} from "dotenv";

config()
export const appCache = new Redis(String(process.env.REDIS_CACHE_URL))