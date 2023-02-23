import {JobService} from "./services/Job.service.js";
import {config} from "dotenv";
import {logger} from "./init/logger.js";
import {processer} from "./processor.js";
import {app} from "./app.js";

config()
//bull options
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
//repeating job data , the data field is superficial here
const job = {
	name: 'kick-api', data: {foo: 'bar'}, opts: {
		repeat: {
			every: 10000,
			// limit: 10
		}
	}
}

//set up queueing with Bull
const queue = new JobService(bullOps, {logger: logger})
await queue.init()
await queue.push(job)
queue.process(processer)
// processer(job)
//start Express server
app.listen(process.env.PORT, () => {
	logger.app.info('Server listening on', process.env.PORT)
})




