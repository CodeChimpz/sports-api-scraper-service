import Redis from "ioredis";
import {config} from "dotenv";
import {appCache} from "../init/redis.js";

config()

export class Cache {
	redis: Redis

	constructor(redisClient: Redis) {
		this.redis = redisClient
	}

	async get(key: string) {
		return this.redis.get(key)
	}

	async set(key: any, data: any) {
		return this.redis.set(key, data)
	}
}

export const cache = new Cache(appCache)