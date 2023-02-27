import Redis from "ioredis";
import {config} from "dotenv";
import {appCache} from "../init/redis.js";
import {LoggerService} from "mein-winston-logger";
import {logger} from "../init/logger.js";

config()

export class Cache {
  redis: Redis
  logger: LoggerService

  constructor(redisClient: Redis, logger: LoggerService) {
    this.redis = redisClient
    this.logger = logger
  }

  //get data from redis cache
  async get<T>(key: string): Promise<T | null> {
    const result = await this.redis.get(key)
    if (!result) {
      this.logger.app.debug('Cache miss for', key)
      return null
    }
    this.logger.app.debug('Cache hit for', key)
    return <T>JSON.parse(result)
  }

  async set(key: any, data: any) {
    return this.redis.set(key, data)
  }
}

export const cache = new Cache(appCache, logger)