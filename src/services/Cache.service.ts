import Redis from "ioredis";
import {config} from "dotenv";

config()

export class CacheService {
    redis: Redis

    constructor(redisClient: Redis) {
        this.redis = redisClient
    }

    async get(key: string, data: any) {
        return this.redis.get(key)
    }

    async set(key: any, data: any) {
        return this.redis.set(key, data)
    }
}

export const cache = new CacheService(new Redis(String(process.env.REDIS_CACHE_URL)))