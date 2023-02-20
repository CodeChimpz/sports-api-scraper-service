import {JobService} from "./services/Job.service.js";
import {config} from "dotenv";
import {logger} from "./init/logger.js";
import {processer} from "./processor.js";

config()
//
const bullOps = {
    name: 'kick-the-api',
    queueConfig: {
        redis: {
            password: String(process.env.REDIS_QUEUE_PASS),
            host: String(process.env.REDIS_QUEUE_HOST),
            port: Number(process.env.REDIS_QUEUE_PORT)
        }
    }
}
//job init , the data is superficial here
const job = {
    name: 'kick-api', data: {foo: 'bar'}, opts: {
        repeat:{
            every: 10000,
            limit:100
        }
    }
}

//
const queue = new JobService(bullOps, {logger: logger})
await queue.init(job)
await queue.push()
await queue.process(processer)




